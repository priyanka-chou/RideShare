import pool from "../config/db.js";

// ===============================
// GET USER PROFILE
// ===============================
export const getUserProfile = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.role,
            u.bio,
            u.course,
            u.university,
            u.phone,
            u.year,
            u.profilePic,
u.coverImage,
            u.created_at,

            COALESCE(AVG(r.rating), 0) AS average_rating,
            COUNT(r.id) AS total_ratings,

            -- Rides offered: cancelled rides ginti me nahi
            (
                SELECT COUNT(*)
                FROM rides rd
                WHERE rd.rider_id = u.id
                AND rd.status <> 'cancelled'
            ) AS total_rides,

            -- Rides completed: rider ki offer ki hui rides jo complete ho chuki hain
            (
                SELECT COUNT(*)
                FROM rides rc
                WHERE rc.rider_id = u.id
                AND rc.status = 'completed'
            ) AS rides_completed,

            -- Rides taken: sirf wo jo complete ho chuki hain
            (
                SELECT COUNT(*)
                FROM bookings b2
                JOIN rides r2
                    ON r2.id = b2.ride_id
                WHERE b2.user_id = u.id
                AND b2.status = 'confirmed'
                AND r2.status = 'completed'
            ) AS rides_taken,

            -- Total spent: completed rides ka price (1 booking = 1 seat)
            (
                SELECT COALESCE(SUM(r3.price), 0)
                FROM bookings b3
                JOIN rides r3
                    ON r3.id = b3.ride_id
                WHERE b3.user_id = u.id
                AND b3.status = 'confirmed'
                AND r3.status = 'completed'
            ) AS total_spent,

            -- Upcoming rides: confirmed booking, ride abhi baaki hai
            (
                SELECT COUNT(*)
                FROM bookings b4
                JOIN rides r4
                    ON r4.id = b4.ride_id
                WHERE b4.user_id = u.id
                AND b4.status = 'confirmed'
                AND r4.status IN ('upcoming', 'ongoing')
                AND r4.ride_date >= CURDATE()
            ) AS upcoming_rides

         FROM users u

         LEFT JOIN ratings r
            ON u.id = r.rated_user_id

         WHERE u.id = ?

         GROUP BY
            u.id,
            u.name,
            u.email,
            u.role,
            u.bio,
            u.course,
            u.university,
            u.phone,
            u.year,
            u.profilePic,
u.coverImage,
            u.created_at`,
        [userId]
    );

    return rows[0];
};


// ===============================
// UPDATE USER PROFILE
// ===============================
export const updateUserProfile = async (
    userId,
    name,
    email,
    bio,
    course,
    university,
    phone,
    year
) => {

    const [result] = await pool.query(
        `UPDATE users
         SET
            name = ?,
            email = ?,
            bio = ?,
            course = ?,
            university = ?,
            phone = ?,
            year = ?
         WHERE id = ?`,
        [
            name,
            email,
            bio,
            course,
            university,
            phone,
            year,
            userId
        ]
    );

    return result.affectedRows;
};


// ===============================
// UPDATE PROFILE OR COVER IMAGE
// ===============================
export const updateUserImage = async (userId, type, imageUrl) => {
    const column = type === "profile" ? "profilePic" : "coverImage";

    const [result] = await pool.query(
        `UPDATE users SET ${column} = ? WHERE id = ?`,
        [imageUrl, userId]
    );

    return result.affectedRows;
};








// ===============================
// GET PUBLIC PROFILE
// Dusre users ko dikhane ke liye: email aur phone JAANBUJH kar nahi diye
// ===============================
export const getPublicProfile = async (userId) => {

    const [rows] = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.role,
            u.bio,
            u.course,
            u.university,
            u.year,
            u.profilePic,
            u.coverImage,
            u.created_at,

            (
                SELECT COALESCE(AVG(rt.rating), 0)
                FROM ratings rt
                WHERE rt.rated_user_id = u.id
            ) AS average_rating,

            (
                SELECT COUNT(*)
                FROM ratings rt
                WHERE rt.rated_user_id = u.id
            ) AS total_ratings,

            -- Rides offered: cancelled ginti me nahi
            (
                SELECT COUNT(*)
                FROM rides rd
                WHERE rd.rider_id = u.id
                AND rd.status <> 'cancelled'
            ) AS total_rides,

            (
                SELECT COUNT(*)
                FROM rides rc
                WHERE rc.rider_id = u.id
                AND rc.status = 'completed'
            ) AS rides_completed,

            (
                SELECT COUNT(*)
                FROM bookings b2
                JOIN rides r2
                    ON r2.id = b2.ride_id
                WHERE b2.user_id = u.id
                AND b2.status = 'confirmed'
                AND r2.status = 'completed'
            ) AS rides_taken

         FROM users u

         WHERE u.id = ?
         AND u.role IN ('user', 'rider')`,
        [userId]
    );

    return rows[0];
};