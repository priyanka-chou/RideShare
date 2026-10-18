import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected");

        connection.release();
    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
    }
};

export default pool;