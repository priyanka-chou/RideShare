
import pool from "../config/db.js";

export const createMessage = async (senderId, receiverId, message) => {
  const [result] = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, message)
     VALUES (?, ?, ?)`,
    [senderId, receiverId, message]
  );

  return {
    id: result.insertId,
    sender_id: senderId,
    receiver_id: receiverId,
    message,
  };
};

export const getConversation = async (userId, otherUserId) => {
  const [rows] = await pool.query(
    `SELECT
       id,
       sender_id,
       receiver_id,
       message,
       created_at
     FROM messages
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC, id ASC`,
    [userId, otherUserId, otherUserId, userId]
  );

  return rows;
};


// export const getAllUsersExceptMe = async (currentUserId) => {
//     const [rows] = await pool.query(
//         `SELECT id, name, email
//          FROM users
//          WHERE id != ?
//          ORDER BY name ASC`,
//         [currentUserId]
//     );

//     return rows;
// };



export const getAllUsersExceptMe = async (currentUserId) => {
    const [rows] = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            (
                SELECT m.message
                FROM messages m
                WHERE
                    (m.sender_id = ? AND m.receiver_id = u.id)
                    OR
                    (m.sender_id = u.id AND m.receiver_id = ?)
                ORDER BY m.created_at DESC, m.id DESC
                LIMIT 1
            ) AS lastMessage,
            (
                SELECT m.created_at
                FROM messages m
                WHERE
                    (m.sender_id = ? AND m.receiver_id = u.id)
                    OR
                    (m.sender_id = u.id AND m.receiver_id = ?)
                ORDER BY m.created_at DESC, m.id DESC
                LIMIT 1
            ) AS lastMessageTime
         FROM users u
         WHERE u.id != ?
         ORDER BY u.name ASC`,
        [
            currentUserId,
            currentUserId,
            currentUserId,
            currentUserId,
            currentUserId
        ]
    );

    return rows;
};
