// // app.js Express application ko configure karta hai.
// Matlab yahan hum decide karte hain:
// Express app banegi
// middleware kaunse lagenge
// routes kaunse honge
// error handling kaise hogi

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";





const app = express();
app.set("trust proxy", 1);

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Login/OTP par brute-force rokne ke liye

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === "/me",
    message: { success: false, message: "Too many attempts, try again later" },
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);

app.use("/api/rides", rideRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/support", supportRoutes);

app.use(errorMiddleware);

export default app;
