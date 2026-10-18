import * as adminRepository from "../repositories/adminRepository.js";
import * as authRepository from "../repositories/authRepository.js";
import AppError from "../error/AppError.js";


export const getAllUsers = async () => {

    const users = await adminRepository.getAllUsers();

    return users;
};


export const getAllRides = async () => {
    const rides = await adminRepository.getAllRides();

    return rides;
};

export const getAllBookings = async () => {
    const bookings = await adminRepository.getAllBookings();

    return bookings;
};

export const getDashboardStats = async () => {
    const stats = await adminRepository.getDashboardStats();

    return stats;
};


export const deleteUser = async (userId, adminId) => {
    // Admin apne aap ko delete nahi kar sakta
    if (Number(userId) === Number(adminId)) {
        throw new AppError(
            "Admin cannot delete their own account",
            400
        );
    }

    const user = await authRepository.findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const affectedRows = await adminRepository.deleteUser(userId);

    if (affectedRows === 0) {
        throw new AppError("User could not be deleted", 400);
    }

    return { userId };
};


export const updateRideStatus = async (rideId, status) => {
    const allowedStatuses = [
        "upcoming",
        "ongoing",
        "completed",
        "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new AppError("Invalid ride status", 400);
    }

    const ride = await adminRepository.getRideById(rideId);

    if (!ride) {
        throw new AppError("Ride not found", 404);
    }

    const affectedRows = await adminRepository.updateRideStatus(
        rideId,
        status
    );

    if (affectedRows === 0) {
        throw new AppError("Ride status could not be updated", 400);
    }

    return {
        rideId,
        status
    };
};