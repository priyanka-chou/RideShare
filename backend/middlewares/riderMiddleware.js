import AppError from "../error/AppError.js";

const riderMiddleware = (req, res, next) => {
    if (req.user.role !== "rider") {
        throw new AppError("Rider access required", 403);
    }

    next();
};

export default riderMiddleware;