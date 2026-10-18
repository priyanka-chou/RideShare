import jwt from "jsonwebtoken";
import AppError from "../error/AppError.js";

const resetTokenMiddleware = (req, res, next) => {
    const { resetToken } = req.body;

    if (!resetToken) {
        throw new AppError("Reset token is required", 401);
    }

    try {
        const decoded = jwt.verify(
            resetToken,
            process.env.JWT_SECRET
        );

        if (decoded.purpose !== "password-reset") {
            throw new AppError(
                "Invalid reset token",
                401
            );
        }

        req.resetUser = decoded;

        next();

    } catch (error) {

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            "Invalid or expired reset token",
            401
        );
    }
};

export default resetTokenMiddleware;
