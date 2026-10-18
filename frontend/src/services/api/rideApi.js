import { api } from "./api";

export const getMyRides = async () => {
    const response = await api.get("/rides/my-rides");
    return response.data;
};

export const cancelRide = async (rideId) => {
    const response = await api.put(`/rides/${rideId}/cancel`);
    return response.data;
};

export const getRideById = async (rideId) => {
    const response = await api.get(`/rides/${rideId}`);
    return response.data;
};

export const createRide = async (rideData) => {
    const response = await api.post("/rides", rideData);
    return response.data;
};


export const getAllRides = async (filters = {}) => {
    const params = {
        page: filters.page || 1,
    };

    if (filters.from?.trim()) {
        params.from = filters.from.trim();
    }

    if (filters.to?.trim()) {
        params.to = filters.to.trim();
    }

    if (filters.date) {
        params.date = filters.date;
    }

    const response = await api.get("/rides", { params });

    return response.data;
};


export const completeRide = async (rideId) => {
    const response = await api.put(`/rides/${rideId}/complete`);

    return response.data;
};