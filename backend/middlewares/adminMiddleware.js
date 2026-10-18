import AppError from "../error/AppError.js";

const adminMiddleware = (req, res, next) => {

    if (req.user.role !== "admin") {
        throw new AppError(
            "Admin access required",
            403
        );
    }

    next();
};

export default adminMiddleware;