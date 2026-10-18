import pool from "../config/db.js";

export const getAllUsers = async () => {
    const [rows] = await pool.query(
        `SELECT
            id,
            name,
            email,
            role,
            created_at
         FROM users
         ORDER BY created_at DESC`
    );

    return rows;
};

export const getAllRides = async () => {
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
            r.created_at,
            u.id AS rider_id,
            u.name AS rider_name,
            u.email AS rider_email
         FROM rides r
         JOIN users u 
         ON r.rider_id = u.id
         ORDER BY r.created_at DESC`
    );

    return rows;
};


export const getAllBookings = async () => {
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

            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,

            rider.id AS rider_id,
            rider.name AS rider_name,
            rider.email AS rider_email

         FROM bookings b

         JOIN rides r
             ON b.ride_id = r.id

         JOIN users u
             ON b.user_id = u.id

         JOIN users rider
             ON r.rider_id = rider.id

         ORDER BY b.booked_at DESC`
    );

    return rows;
};


export const getDashboardStats = async () => {
    const [rows] = await pool.query(
        `SELECT
            (SELECT COUNT(*) FROM users) AS total_users,

            (SELECT COUNT(*) FROM users
             WHERE role = 'rider') AS total_riders,

            (SELECT COUNT(*) FROM rides) AS total_rides,

            (SELECT COUNT(*) FROM rides
             WHERE status = 'upcoming') AS upcoming_rides,

            (SELECT COUNT(*) FROM rides
             WHERE status = 'completed') AS completed_rides,

            (SELECT COUNT(*) FROM rides
             WHERE status = 'cancelled') AS cancelled_rides,

            (SELECT COUNT(*) FROM bookings) AS total_bookings,

            (SELECT COUNT(*) FROM bookings
             WHERE status = 'confirmed') AS confirmed_bookings,

            (SELECT COUNT(*) FROM bookings
             WHERE status = 'cancelled') AS cancelled_bookings
        `
    );

    return rows[0];
};

export const deleteUser = async (userId) => {
    const [result] = await pool.query(
        `DELETE FROM users
         WHERE id = ?`,
        [userId]
    );

    return result.affectedRows;
};


export const updateRideStatus = async (rideId, status) => {
    const [result] = await pool.query(
        `UPDATE rides
         SET status = ?
         WHERE id = ?`,
        [status, rideId]
    );

    return result.affectedRows;
};


export const getRideById = async (rideId) => {
    const [rows] = await pool.query(
        `SELECT id, rider_id, status
         FROM rides
         WHERE id = ?`,
        [rideId]
    );

    return rows[0];
};