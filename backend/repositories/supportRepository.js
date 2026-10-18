
import pool from "../config/db.js";

export const createSupportRequest = async ({
    userId,
    category,
    subject,
    message,
}) => {
    const [result] = await pool.query(
        `INSERT INTO support_requests
            (user_id, category, subject, message)
         VALUES (?, ?, ?, ?)`,
        [userId, category, subject, message]
    );

    return result.insertId;
};

export const getSupportRequestsByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            category,
            subject,
            message,
            status,
            created_at,
            updated_at
         FROM support_requests
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};

export const getSupportRequestById = async (requestId, userId) => {
    const [rows] = await pool.query(
        `SELECT
            id,
            category,
            subject,
            message,
            status,
            created_at,
            updated_at
         FROM support_requests
         WHERE id = ? AND user_id = ?
         LIMIT 1`,
        [requestId, userId]
    );

    return rows[0] ?? null;
};
