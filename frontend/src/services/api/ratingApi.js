// services/api/ratingApi.js  (NAYI FILE)
import { api } from "./api";

// Ride complete hone ke baad driver ko rating do.
// Backend: POST /api/ratings  { rideId, rating (1-5), review (optional) }
export const createRating = async (rideId, rating, review) => {
    const response = await api.post("/ratings", {
        rideId,
        rating,
        review,
    });

    return response.data; // { success, message, data: { ratingId } }
};

// Kisi user ko mile hue saare ratings/reviews.
// Backend: GET /api/ratings/user/:id
export const getRatingsByUser = async (userId) => {
    const response = await api.get(`/ratings/user/${userId}`);

    return response.data; // { success, message, data: [ ... ] }
};
