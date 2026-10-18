import pool from "../config/db.js";

// Ek page me kitni rides aayengi (frontend ka PAGE_SIZE bhi yehi hona chahiye)
export const RIDES_PAGE_SIZE = 10;

// Rider ki average rating + total ratings (ride card / ride details ke liye)
const RIDER_RATING_COLUMNS = `
    (
        SELECT ROUND(AVG(rt.rating), 1)
        FROM ratings rt
        WHERE rt.rated_user_id = r.rider_id
    ) AS rating,
    (
        SELECT COUNT(*)
        FROM ratings rt
        WHERE rt.rated_user_id = r.rider_id
    ) AS review_count
`;


// ===============================
// CREATE RIDE
// ===============================
export const createRide = async (
    riderId,
    fromLocation,
    toLocation,
    rideDate,
    rideTime,
    totalSeats,
    price,
    preferences = {}
) => {
    const {
        acAvailable = false,
        music = false,
        noSmoking = false,
        petsAllowed = false,
        stopoversAllowed = false,
        additionalNotes = "",
    } = preferences;

    const [result] = await pool.query(
        `INSERT INTO rides (
            rider_id,
            from_location,
            to_location,
            ride_date,
            ride_time,
            total_seats,
            available_seats,
            price,
            ac_available,
            music,
            no_smoking,
            pets_allowed,
            stopovers_allowed,
            additional_notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            riderId,
            fromLocation,
            toLocation,
            rideDate,
            rideTime,
            totalSeats,
            totalSeats,
            price,
            acAvailable,
            music,
            noSmoking,
            petsAllowed,
            stopoversAllowed,
            additionalNotes || null,
        ]
    );

    return result.insertId;
};


// "Napier Town, Jabalpur, Madhya Pradesh, India" -> "Napier Town"
// Hero (OpenStreetMap) aur OfferRide (Google) ka poora address text alag hota hai,
// isliye sirf pehla hissa LIKE se match karte hain.
const locationKeyword = (value) =>
    String(value || "").split(",")[0].trim();


// ===============================
// GET ALL RIDES (pagination)
// ===============================
export const getAllRides = async (
    filters = {},
    currentUserId = 0
) => {

    const page = Math.max(1, Number(filters.page) || 1);
    const limit = RIDES_PAGE_SIZE;
    const offset = (page - 1) * limit;

    let query = `
        SELECT
            r.id,
            r.from_location,
            r.to_location,
            r.ride_date,
            r.ride_time,
            r.total_seats,
            r.available_seats,
            r.price,
            r.status,
            r.ac_available,
            r.music,
            r.no_smoking,
            r.pets_allowed,
            r.stopovers_allowed,
            r.additional_notes,
            r.created_at,

            u.id AS rider_id,
            u.name AS rider_name,
            u.profilePic AS rider_profile_pic,

            ${RIDER_RATING_COLUMNS}

        FROM rides r

        JOIN users u
            ON r.rider_id = u.id

        WHERE r.status = 'upcoming'
          AND r.ride_date >= CURDATE()
          AND r.rider_id <> ?
    `;

    const values = [currentUserId];

    const from = locationKeyword(filters.from);
    const to = locationKeyword(filters.to);

    if (from) {
        query += ` AND r.from_location LIKE ?`;
        values.push(`%${from}%`);
    }

    if (to) {
        query += ` AND r.to_location LIKE ?`;
        values.push(`%${to}%`);
    }

    if (filters.date) {
        query += ` AND r.ride_date = ?`;
        values.push(filters.date);
    }

    query += `
        ORDER BY
            r.ride_date ASC,
            r.ride_time ASC,
            r.id ASC
        LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [rows] = await pool.query(query, values);

    return rows;
};


// ===============================
// GET MY RIDES
// ===============================
export const getMyRides = async (riderId) => {
    const [rows] = await pool.query(
        `
        SELECT
            r.id,
            r.from_location,
            r.to_location,
            r.ride_date,
            r.ride_time,
            r.total_seats,
            r.available_seats,
            r.price,
            r.status,
            r.ac_available,
            r.music,
            r.no_smoking,
            r.pets_allowed,
            r.stopovers_allowed,
            r.additional_notes,
            r.created_at,

            (
                SELECT COUNT(*)
                FROM bookings b
                WHERE b.ride_id = r.id
                  AND b.status = 'confirmed'
            ) AS booked_count,

            -- Is ride ke confirmed passengers (rider "Message Passenger" ke liye)
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', pu.id,
                        'name', pu.name,
                        'profilePic', pu.profilePic
                    )
                )
                FROM bookings b2
                JOIN users pu ON pu.id = b2.user_id
                WHERE b2.ride_id = r.id
                  AND b2.status = 'confirmed'
            ) AS passengers,

            -- Ride complete karne ka button sirf ride ki date aane par dikhana hai
            (r.status IN ('upcoming', 'ongoing') AND r.ride_date <= CURDATE()) AS can_complete,

            u.id AS rider_id,
            u.name AS rider_name,
            u.profilePic AS rider_profile_pic

        FROM rides r

        JOIN users u
            ON r.rider_id = u.id

        WHERE r.rider_id = ?

        ORDER BY
            r.ride_date DESC,
            r.ride_time DESC
        `,
        [riderId]
    );

    return rows;
};


// ===============================
// GET RIDE BY ID
// currentUserId default 0 rakha hai taaki updateRide / cancelRide
// (jo sirf rideId se call karte hain) toot na jaye.
// ===============================
export const getRideById = async (
    rideId,
    currentUserId = 0
) => {

    const [rows] = await pool.query(
        `SELECT
            r.id,
            r.from_location,
            r.to_location,
            r.ride_date,
            r.ride_time,
            r.total_seats,
            r.available_seats,
            r.price,
            r.status,
            r.ac_available,
            r.music,
            r.no_smoking,
            r.pets_allowed,
            r.stopovers_allowed,
            r.additional_notes,
            r.created_at,

            u.id AS rider_id,
            u.name AS rider_name,
            u.email AS rider_email,
            u.profilePic AS rider_profile_pic,

            ${RIDER_RATING_COLUMNS},

            -- Kya ye logged-in user already is ride ko book kar chuka hai?
            EXISTS (
                SELECT 1
                FROM bookings b
                WHERE b.ride_id = r.id
                  AND b.user_id = ?
                  AND b.status = 'confirmed'
            ) AS already_booked,

            -- Date nikal chuki hai?
            (r.ride_date < CURDATE()) AS is_past

        FROM rides r

        JOIN users u
            ON r.rider_id = u.id

        WHERE r.id = ?`,
        [currentUserId, rideId]
    );

    return rows[0];
};


// ===============================
// UPDATE RIDE
// ===============================
export const updateRide = async (
    rideId,
    fromLocation,
    toLocation,
    rideDate,
    rideTime,
    totalSeats,
    price
) => {

    const [result] = await pool.query(

        `UPDATE rides

         SET
            from_location = ?,
            to_location = ?,
            ride_date = ?,
            ride_time = ?,
            total_seats = ?,

            available_seats = available_seats + (? - total_seats),

            price = ?

         WHERE id = ?`,

        [
            fromLocation,
            toLocation,
            rideDate,
            rideTime,
            totalSeats,
            totalSeats,
            price,
            rideId
        ]
    );

    return result.affectedRows;
};


// ===============================
// CANCEL RIDE (transaction ke andar chalega)
// ===============================
export const cancelRide = async (
    rideId,
    connection
) => {

    const [result] = await connection.query(

        `UPDATE rides
         SET status = 'cancelled'
         WHERE id = ?
         AND status IN ('upcoming', 'ongoing')`,

        [rideId]
    );

    return result.affectedRows;
};


// Ride cancel hone par uski saari confirmed bookings bhi cancel
export const cancelBookingsOfRide = async (
    rideId,
    connection
) => {

    const [result] = await connection.query(

        `UPDATE bookings
         SET status = 'cancelled'
         WHERE ride_id = ?
         AND status = 'confirmed'`,

        [rideId]
    );

    return result.affectedRows;
};


// ===============================
// COMPLETE RIDE
// Sirf upcoming/ongoing ride, aur sirf ride ki date aane ya nikal jaane ke baad
// ===============================
export const completeRide = async (
    rideId
) => {

    const [result] = await pool.query(

        `UPDATE rides
         SET status = 'completed'
         WHERE id = ?
         AND status IN ('upcoming', 'ongoing')
         AND ride_date <= CURDATE()`,

        [rideId]
    );

    return result.affectedRows;
};