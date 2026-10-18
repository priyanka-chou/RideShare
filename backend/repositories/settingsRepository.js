
import pool from "../config/db.js";

export const getNotificationPreference = async (userId) => {
    const [rows] = await pool.query(
        `SELECT notifications_enabled
         FROM users
         WHERE id = ?`,
        [userId]
    );

    return rows[0] ?? null;
};

export const updateNotificationPreference = async (userId, enabled) => {
    const [result] = await pool.query(
        `UPDATE users
         SET notifications_enabled = ?
         WHERE id = ?`,
        [enabled ? 1 : 0, userId]
    );

    return result.affectedRows;
};
