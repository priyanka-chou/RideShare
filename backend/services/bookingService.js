import * as bookingRepository from "../repositories/bookingRepository.js";
import * as authRepository from "../repositories/authRepository.js";
import AppError from "../error/AppError.js";

export const createBooking = async (rideId, userId) => {

    const ride = await bookingRepository.findRideForBooking(rideId);

    if (!ride) {
        throw new AppError("Ride not found", 404);
    }

    if (ride.status !== "upcoming") {
        throw new AppError(
            `Cannot book a ${ride.status} ride`,
            400
        );
    }

    if (Number(ride.is_past) === 1) {
        throw new AppError(
            "This ride date has already passed",
            400
        );
    }

    if (Number(ride.rider_id) === Number(userId)) {
        throw new AppError(
            "You cannot book your own ride",
            400
        );
    }
    

    const existingBooking =
        await bookingRepository.findBooking(
            rideId,
            userId
        );

    // Already confirmed
    if (
        existingBooking &&
        existingBooking.status === "confirmed"
    ) {
        throw new AppError(
            "You have already booked this ride",
            400
        );
    }

    if (ride.available_seats <= 0) {
        throw new AppError(
            "No seats available",
            400
        );
    }

    const connection =
        await authRepository.getConnection();

    try {

        await connection.beginTransaction();

        let bookingId;

        if (
            existingBooking &&
            existingBooking.status === "cancelled"
        ) {

            // Reuse cancelled booking
            const affectedRows =
                await bookingRepository.reactivateBooking(
                    existingBooking.id,
                    connection
                );

            if (affectedRows === 0) {
                throw new AppError(
                    "Booking could not be reactivated",
                    400
                );
            }

            bookingId = existingBooking.id;

        } else {

            // First-time booking
            bookingId =
                await bookingRepository.createBooking(
                    rideId,
                    userId,
                    connection
                );
        }

        // Decrease available seat
        const seatUpdated =
            await bookingRepository.decreaseAvailableSeats(
                rideId,
                connection
            );

        if (seatUpdated === 0) {
            throw new AppError(
                "No seats available",
                400
            );
        }

        await connection.commit();

        return {
            bookingId
        };

    } catch (error) {

        await connection.rollback();

        // Double click / do tabs: unique key (ride_id, user_id) duplicate roke to
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                "You have already booked this ride",
                400
            );
        }

        throw error;

    } finally {

        connection.release();
    }
};






// User
//  ↓
// createBooking(rideId, userId)
//  ↓
// Ride exist?
//  ↓ YES
// Own ride?
//  ↓ NO
// Already booked?
//  ↓ NO
// Seat available?
//  ↓ YES
// Get DB Connection
//  ↓
// BEGIN TRANSACTION
//  ↓
// Create Booking
//  ↓
// Seat - 1
//  ↓
// COMMIT
//  ↓
// Booking successful ✅





export const cancelBooking = async (bookingId, userId) => {

    const booking = await bookingRepository.findBookingById(
        bookingId
    );

    if (!booking) {
        throw new AppError(
            "Booking not found",
            404
        );
    }

    if (Number(booking.user_id) !== Number(userId)) {
        throw new AppError(
            "You are not allowed to cancel this booking",
            403
        );
    }

    // next rule...

    if (booking.status === "cancelled") {
    throw new AppError(
        "Booking is already cancelled",
        400
    );
}

// Sirf upcoming ride ki booking cancel ho sakti hai.
// Warna completed ride cancel karke seat wapas badh jaati.
const ride = await bookingRepository.findRideForBooking(
    booking.ride_id
);

if (!ride || ride.status !== "upcoming") {
    throw new AppError(
        "Only bookings of upcoming rides can be cancelled",
        400
    );
}

if (Number(ride.is_past) === 1) {
    throw new AppError(
        "The ride date has passed, booking cannot be cancelled",
        400
    );
}

const connection = await authRepository.getConnection();

try {
    await connection.beginTransaction();

    const affectedRows = await bookingRepository.cancelBooking(
        bookingId,
        connection
    );

    if (affectedRows === 0) {
        throw new AppError(
            "Booking could not be cancelled",
            400
        );
    }

    await bookingRepository.increaseAvailableSeats(
        booking.ride_id,
        connection
    );

    await connection.commit();

    return { bookingId };

} catch (error) {

    await connection.rollback();
    throw error;

} finally {

    connection.release();
}
};


export const getUserBookings = async (userId) => {

    const bookings = await bookingRepository.getUserBookings(
        userId
    );

    return bookings;
};




export const getBookingById = async (bookingId, userId) => {

    const booking = await bookingRepository.getBookingById(
        bookingId,
        userId
    );

    if (!booking) {
        throw new AppError(
            "Booking not found",
            404
        );
    }

    return booking;
};