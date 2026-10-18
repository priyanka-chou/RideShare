import pool from "../config/db.js"; //Database connection pool le aaye.


export const getConnection = async () => {
    return await pool.getConnection();
};


// Email se user find karna

export const findUserByEmail = async (email)=>{
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

//  user nhi mila to create user krenge 

export const createUser = async (name,email,password,role)=>{
    const [result] =await pool.query(
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
        [name,email,password,role]
    );

    return result.insertId;
}

// find user by id 

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
};

//  user password update 

export const updateUserPassword = async (userId, password) => {
    const [result] = await pool.query(
        `UPDATE users
         SET password = ?
         WHERE id = ?`,
        [password, userId]
    );

    return result.affectedRows;
};


// find  email from pending users table 

export const findPendingUserByEmail = async (email)=>{
    const [rows] = await pool.query(
        "SELECT * FROM pending_users WHERE email = ?",
        [email]
    );

    return rows[0];
};



// create pending user

export const createPendingUser = async (name,email,password,role) => {
    const [result] = await pool.query(
        `INSERT INTO pending_users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
    );

    return result.insertId;
};


export const findRecentOtp = async (email, type = "registration") => {
    const [rows] = await pool.query(
        `SELECT *
         FROM otp_verifications
         WHERE email = ?
         AND type = ?
         AND created_at >= NOW() - INTERVAL 30 SECOND
         LIMIT 1`,
        [email, type]
    );

    return rows[0];
};

export const deleteOtp = async (email, type = "registration") => {
    await pool.query(
        `DELETE FROM otp_verifications
         WHERE email = ?
         AND type = ?`,
        [email, type]
    );
};

export const saveOtp = async (email, otp, type = "registration") => {
    const [result] = await pool.query(
        `INSERT INTO otp_verifications
        (email, otp, type)
        VALUES (?, ?, ?)`,
        [email, otp, type]
    );

    return result.insertId;
};


export const findOtp = async (
    email,
    otp,
    type = "registration"
) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM otp_verifications
         WHERE email = ?
         AND otp = ?
         AND type = ?`,
        [email, otp, type]
    );

    return rows[0];
};

export const findValidOtp = async (
    email,
    otp,
    type = "registration"
) => {
    const [rows] = await pool.query(
        `SELECT *
         FROM otp_verifications
         WHERE email = ?
         AND otp = ?
         AND type = ?
         AND created_at >= NOW() - INTERVAL 5 MINUTE`,
        [email, otp, type]
    );

    return rows[0];
};


export const createUserFromPending = async (
    connection,
    pendingUser
) => {
    const [result] = await connection.query(
        `INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)`,
        [
            pendingUser.name,
            pendingUser.email,
            pendingUser.password,
            pendingUser.role
        ]
    );

    return result.insertId;
};


export const deletePendingUser = async (connection, email) => {
    await connection.query(
        `DELETE FROM pending_users
         WHERE email = ?`,
        [email]
    );
};

export const deleteOtpByEmail = async (
    connection,
    email,
    type = "registration"
) => {
    await connection.query(
        `DELETE FROM otp_verifications
         WHERE email = ?
         AND type = ?`,
        [email, type]
    );
};



export const updatePendingUserRole = async (email, role) => {
    const [result] = await pool.query(
        `UPDATE pending_users
         SET role = ?
         WHERE email = ?`,
        [role, email]
    );

    return result.affectedRows;
};
