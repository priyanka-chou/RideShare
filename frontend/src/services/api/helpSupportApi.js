
import { api } from "./api";

// Submit a new support request
export const createSupportRequest = async (requestData) => {
    const response = await api.post("/support", requestData);
    return response.data;
};

// Fetch all support requests of the logged-in user
export const getMySupportRequests = async () => {
    const response = await api.get("/support");
    return response.data;
};

// Fetch one support request by ID
export const getSupportRequestById = async (requestId) => {
    const response = await api.get(`/support/${requestId}`);
    return response.data;
};
