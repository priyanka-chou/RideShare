// import pool from "../config/db.js";



// export const getAllUsers = async (currentUserId) => {
//     const [rows] = await pool.query(
//         `SELECT id, name, role, profilePic
//          FROM users
//          WHERE id != ?
//          ORDER BY name ASC`,
//         [currentUserId]
//     );

//     return rows;
// };




// export const findUserById = async (userId) => {
//     const [rows] = await pool.query(
//         "SELECT id, name, email, role FROM users WHERE id = ?",
//         [userId]
//     );

//     return rows[0] || null;
// };





// export const getAllUsersExceptMe = async (currentUserId) => {
//     const [rows] = await pool.query(
//         `SELECT
//             u.id,
//             u.name,
//             u.email,
//             u.profilePic,
//             (
//                 SELECT m.message
//                 FROM messages m
//                 WHERE
//                     (m.sender_id = ? AND m.receiver_id = u.id)
//                     OR
//                     (m.sender_id = u.id AND m.receiver_id = ?)
//                 ORDER BY m.created_at DESC, m.id DESC
//                 LIMIT 1
//             ) AS lastMessage,
//             (
//                 SELECT m.created_at
//                 FROM messages m
//                 WHERE
//                     (m.sender_id = ? AND m.receiver_id = u.id)
//                     OR
//                     (m.sender_id = u.id AND m.receiver_id = ?)
//                 ORDER BY m.created_at DESC, m.id DESC
//                 LIMIT 1
//             ) AS lastMessageTime
//          FROM users u
//          WHERE u.id != ?
//          ORDER BY u.name ASC`,
//         [
//             currentUserId,
//             currentUserId,
//             currentUserId,
//             currentUserId,
//             currentUserId
//         ]
//     );

//     return rows;
// };




// // GET USER PROFILE
// export const getUserProfile = async (userId) => {
//     const [rows] = await pool.query(
//         `SELECT id, name, email, role, profilePic, coverPic,
//                 bio, course, university, phone, year
//          FROM users
//          WHERE id = ?`,
//         [userId]
//     );

//     return rows[0] || null;
// };

// // UPDATE USER PROFILE
// export const updateUserProfile = async (
//     userId,
//     name,
//     email,
//     bio,
//     course,
//     university,
//     phone,
//     year
// ) => {
//     await pool.query(
//         `UPDATE users
//          SET name = ?, email = ?, bio = ?, course = ?,
//              university = ?, phone = ?, year = ?
//          WHERE id = ?`,
//         [name, email, bio, course, university, phone, year, userId]
//     );

//     return await getUserProfile(userId);
// };


import pool from "../config/db.js";



export const getAllUsers = async (currentUserId) => {
    const [rows] = await pool.query(
        `SELECT id, name, role, profilePic
         FROM users
         WHERE id != ?
         ORDER BY name ASC`,
        [currentUserId]
    );

    return rows;
};




export const findUserById = async (userId) => {
    const [rows] = await pool.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [userId]
    );

    return rows[0] || null;
};





// Saare users return karta hai (current user bhi), aur current user ko isMe = 1 se mark karta hai.
// Frontend isMe se "My Notes" (self-chat) entry banata hai, localStorage ki id par depend nahi karta.
export const getAllUsersExceptMe = async (currentUserId) => {
    const [rows] = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.profilePic,
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
            ) AS lastMessageTime,
            (u.id = ?) AS isMe
         FROM users u
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




// GET USER PROFILE
export const getUserProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT id, name, email, role, profilePic, coverImage,
                bio, course, university, phone, year
         FROM users
         WHERE id = ?`,
        [userId]
    );

    return rows[0] || null;
};

// UPDATE USER PROFILE
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
    await pool.query(
        `UPDATE users
         SET name = ?, email = ?, bio = ?, course = ?,
             university = ?, phone = ?, year = ?
         WHERE id = ?`,
        [name, email, bio, course, university, phone, year, userId]
    );

    return await getUserProfile(userId);
};