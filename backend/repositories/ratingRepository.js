

import pool from "../config/db.js";

export const findRating = async (rideId, raterId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            ride_id,
            rater_id,
            rated_user_id,
            rating,
            review
         FROM ratings
         WHERE ride_id = ?
         AND rater_id = ?`,
        [rideId, raterId]
    );

    return rows[0];
};


export const findCompletedRide = async (rideId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            rider_id,
            status
         FROM rides
         WHERE id = ?
         AND status = 'completed'`,
        [rideId]
    );

    return rows[0];
};


export const findUserBooking = async (rideId, userId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            ride_id,
            user_id,
            status
         FROM bookings
         WHERE ride_id = ?
         AND user_id = ?
         AND status = 'confirmed'`,
        [rideId, userId]
    );

    return rows[0];
};




export const createRating = async (
    rideId,
    raterId,
    ratedUserId,
    rating,
    review
) => {
    const [result] = await pool.query(
        `INSERT INTO ratings
        (ride_id, rater_id, rated_user_id, rating, review)
        VALUES (?, ?, ?, ?, ?)`,
        [
            rideId,
            raterId,
            ratedUserId,
            rating,
            review
        ]
    );

    return result.insertId;
};

export const getRatingsByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            rt.id AS rating_id,
            rt.ride_id,
            rt.rater_id,
            u.name AS rater_name,
            rt.rating,
            rt.review,
            rt.created_at
         FROM ratings rt
         JOIN users u
            ON rt.rater_id = u.id
         WHERE rt.rated_user_id = ?
         ORDER BY rt.created_at DESC`,
        [userId]
    );

    return rows;
};