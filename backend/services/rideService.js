import * as rideRepository from "../repositories/rideRepository.js";
import * as authRepository from "../repositories/authRepository.js";
import AppError from "../error/AppError.js";


// ===============================
// CREATE RIDE
// ===============================

export const createRide = async (data, riderId) => {
    const {
        fromLocation,
        toLocation,
        rideDate,
        rideTime,
        totalSeats,
        price,
        acAvailable = false,
        music = false,
        noSmoking = false,
        petsAllowed = false,
        stopoversAllowed = false,
        additionalNotes = "",
    } = data;

    if (totalSeats <= 0) {
        throw new AppError("Seats must be greater than 0", 400);
    }

    if (price < 0) {
        throw new AppError("Price cannot be negative", 400);
    }

    const rideId = await rideRepository.createRide(
        riderId,
        fromLocation,
        toLocation,
        rideDate,
        rideTime,
        totalSeats,
        price,
        {
            acAvailable,
            music,
            noSmoking,
            petsAllowed,
            stopoversAllowed,
            additionalNotes,
        }
    );

    return { rideId };
};


// ===============================
// GET ALL RIDES
// ===============================
export const getAllRides = async (filters, userId) => {

    return await rideRepository.getAllRides(filters, userId);
};


// ===============================
// GET RIDE BY ID
// ===============================
export const getRideById = async (rideId, userId) => {

    const ride = await rideRepository.getRideById(
        rideId,
        userId
    );


    if (!ride) {
        throw new AppError(
            "Ride not found",
            404
        );
    }


    return ride;
};


// ===============================
// OWNERSHIP CHECK
// ===============================
const checkRideOwnership = (ride, riderId) => {

    if (Number(ride.rider_id) !== Number(riderId)) {

        throw new AppError(
            "You are not allowed to modify this ride",
            403
        );
    }
};


// ===============================
// UPDATE RIDE
// ===============================
export const updateRide = async (
    rideId,
    data,
    riderId
) => {

    const ride = await rideRepository.getRideById(
        rideId
    );


    if (!ride) {
        throw new AppError(
            "Ride not found",
            404
        );
    }


    checkRideOwnership(
        ride,
        riderId
    );


    if (ride.status === "cancelled") {

        throw new AppError(
            "Cancelled ride cannot be updated",
            400
        );
    }


    if (ride.status === "completed") {

        throw new AppError(
            "Completed ride cannot be updated",
            400
        );
    }


    const {
        fromLocation,
        toLocation,
        rideDate,
        rideTime,
        totalSeats,
        price
    } = data;


    if (totalSeats <= 0) {

        throw new AppError(
            "Seats must be greater than 0",
            400
        );
    }


    if (price < 0) {

        throw new AppError(
            "Price cannot be negative",
            400
        );
    }


    // Already booked seats
    const bookedSeats =
        ride.total_seats -
        ride.available_seats;


    if (totalSeats < bookedSeats) {

        throw new AppError(
            `Total seats cannot be less than booked seats (${bookedSeats})`,
            400
        );
    }


    await rideRepository.updateRide(
        rideId,
        fromLocation,
        toLocation,
        rideDate,
        rideTime,
        totalSeats,
        price
    );


    return {
        rideId,
        totalSeats
    };
};


// ===============================
// CANCEL RIDE
// ===============================
export const cancelRide = async (
    rideId,
    riderId
) => {

    const ride = await rideRepository.getRideById(
        rideId
    );


    if (!ride) {

        throw new AppError(
            "Ride not found",
            404
        );
    }


    checkRideOwnership(
        ride,
        riderId
    );


    if (ride.status === "cancelled") {

        throw new AppError(
            "Ride is already cancelled",
            400
        );
    }


    if (ride.status === "completed") {

        throw new AppError(
            "Completed ride cannot be cancelled",
            400
        );
    }


    // Ride cancel + uski saari confirmed bookings cancel, ek hi transaction me
    const connection = await authRepository.getConnection();

    try {
        await connection.beginTransaction();

        const cancelled = await rideRepository.cancelRide(
            rideId,
            connection
        );

        if (cancelled === 0) {
            throw new AppError(
                "Ride could not be cancelled",
                400
            );
        }

        await rideRepository.cancelBookingsOfRide(
            rideId,
            connection
        );

        await connection.commit();

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();
    }


    return {
        rideId
    };
};


// ===============================
// COMPLETE RIDE
// ===============================
export const completeRide = async (
    rideId,
    riderId
) => {

    const ride = await rideRepository.getRideById(
        rideId
    );

    if (!ride) {
        throw new AppError("Ride not found", 404);
    }

    checkRideOwnership(ride, riderId);

    if (ride.status === "completed") {
        throw new AppError("Ride is already completed", 400);
    }

    if (ride.status === "cancelled") {
        throw new AppError("Cancelled ride cannot be completed", 400);
    }

    const updated = await rideRepository.completeRide(rideId);

    // Status upcoming tha, to sirf date wali shart fail hui hogi
    if (updated === 0) {
        throw new AppError(
            "Ride can be completed only on or after the ride date",
            400
        );
    }

    return { rideId };
};

// ===============================
// GET MY RIDES
// ===============================
export const getMyRides = async (riderId) => {
    return await rideRepository.getMyRides(riderId);
};