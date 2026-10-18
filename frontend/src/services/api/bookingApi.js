import { api } from "./api";

export const createBooking = async (rideId) => {
    const response = await api.post("/bookings", {
        rideId,
    });

    return response.data;
};

export const getUserBookings = async () => {
    const response = await api.get("/bookings");
    return response.data;
};

export const getBookingById = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
};