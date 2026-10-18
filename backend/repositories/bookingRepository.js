import pool from "../config/db.js";

// ===============================
// FIND EXISTING BOOKING
// ===============================
export const findBooking = async (rideId, userId) => {
    const [rows] = await pool.query(
        `SELECT id, ride_id, user_id, status
         FROM bookings
         WHERE ride_id = ? AND user_id = ?`,
        [rideId, userId]
    );

    return rows[0];
};


// ===============================
// FIND RIDE
// ===============================
export const findRideForBooking = async (rideId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            rider_id,
            from_location,
            to_location,
            ride_date,
            ride_time,
            total_seats,
            available_seats,
            price,
            status,
            (ride_date < CURDATE()) AS is_past
         FROM rides
         WHERE id = ?`,
        [rideId]
    );

    return rows[0];
};


// ===============================
// CREATE BOOKING
// ===============================
export const createBooking = async (
    rideId,
    userId,
    connection
) => {
    const [result] = await connection.query(
        `INSERT INTO bookings
        (ride_id, user_id, status)
        VALUES (?, ?, 'confirmed')`,
        [rideId, userId]
    );

    return result.insertId;
};


// ===============================
// DECREASE AVAILABLE SEATS
// ===============================
export const decreaseAvailableSeats = async (
    rideId,
    connection
) => {
    const [result] = await connection.query(
        `UPDATE rides
         SET available_seats = available_seats - 1
         WHERE id = ?
         AND available_seats > 0`,
        [rideId]
    );

    return result.affectedRows;
};


// ===============================
// FIND BOOKING BY ID
// ===============================
export const findBookingById = async (bookingId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            ride_id,
            user_id,
            status
         FROM bookings
         WHERE id = ?`,
        [bookingId]
    );

    return rows[0];
};


// ===============================
// CANCEL BOOKING
// ===============================
export const cancelBooking = async (
    bookingId,
    connection
) => {
    const [result] = await connection.query(
        `UPDATE bookings
         SET status = 'cancelled'
         WHERE id = ?
         AND status = 'confirmed'`,
        [bookingId]
    );

    return result.affectedRows;
};


// ===============================
// INCREASE AVAILABLE SEATS
// ===============================
export const increaseAvailableSeats = async (
    rideId,
    connection
) => {
    const [result] = await connection.query(
        `UPDATE rides
         SET available_seats = available_seats + 1
         WHERE id = ?
         AND available_seats < total_seats`,
        [rideId]
    );

    return result.affectedRows;
};


// ===============================
// GET USER BOOKINGS
// ===============================
export const getUserBookings = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            b.id AS booking_id,
            b.status AS booking_status,
            b.booked_at,

            r.id AS ride_id,
            r.from_location,
            r.to_location,
            r.ride_date,
            r.ride_time,
            r.price,
            r.status AS ride_status,

            r.ac_available,
            r.music,
            r.no_smoking,
            r.pets_allowed,
            r.stopovers_allowed,

            u.id AS rider_id,
            u.name AS rider_name,
            u.profilePic AS rider_profile_pic,

            -- Is booking par user ne rating di hai ya nahi
            rt.id IS NOT NULL AS has_rated,
            rt.rating AS my_rating,

            -- Cancel button: booking confirmed + ride upcoming + date nikli nahi
            (
                b.status = 'confirmed'
                AND r.status = 'upcoming'
                AND r.ride_date >= CURDATE()
            ) AS can_cancel,

            -- Rating button: ride complete ho chuki + confirmed booking + abhi rating nahi di
            (
                b.status = 'confirmed'
                AND r.status = 'completed'
                AND rt.id IS NULL
            ) AS can_rate

         FROM bookings b

         JOIN rides r
            ON b.ride_id = r.id

         JOIN users u
            ON r.rider_id = u.id

         LEFT JOIN ratings rt
            ON rt.ride_id = r.id
           AND rt.rater_id = b.user_id

         WHERE b.user_id = ?

         ORDER BY b.booked_at DESC`,
        [userId]
    );

    return rows;
};


// ===============================
// GET BOOKING BY ID
// ===============================
export const getBookingById = async (
    bookingId,
    userId
) => {
    const [rows] = await pool.query(
        `SELECT
            b.id AS booking_id,
            b.status AS booking_status,
            b.booked_at,

            r.id AS ride_id,
            r.from_location,
            r.to_location,
            r.ride_date,
            r.ride_time,
            r.price,
            r.status AS ride_status,

            u.id AS rider_id,
            u.name AS rider_name,
            u.email AS rider_email

         FROM bookings b

         JOIN rides r
            ON b.ride_id = r.id

         JOIN users u
            ON r.rider_id = u.id

         WHERE b.id = ?
         AND b.user_id = ?`,
        [bookingId, userId]
    );

    return rows[0];
};



export const reactivateBooking = async (
    bookingId,
    connection
) => {
    const [result] = await connection.query(
        `UPDATE bookings
         SET status = 'confirmed',
             booked_at = CURRENT_TIMESTAMP
         WHERE id = ?
         AND status = 'cancelled'`,
        [bookingId]
    );

    return result.affectedRows;
};