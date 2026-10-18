import * as ratingRepository from "../repositories/ratingRepository.js";
import AppError from "../error/AppError.js";

export const createRating = async (
    rideId,
    userId,
    rating,
    review
) => {

    // 1. Already rated check

    const existingRating = await ratingRepository.findRating(
    rideId,
    userId
);

if (existingRating) {
    throw new AppError(
        "You have already rated this ride",
        400
    );
}

    // 2. Completed ride check

    const ride = await ratingRepository.findCompletedRide(
    rideId
);

if (!ride) {
    throw new AppError(
        "Rating can only be given after ride completion",
        400
    );
}

    // 3. User booking check

    const booking = await ratingRepository.findUserBooking(
    rideId,
    userId
);

if (!booking) {
    throw new AppError(
        "You can only rate a ride you booked",
        403
    );
}

    // 4. Self-rating check

    if (ride.rider_id === userId) {
    throw new AppError(
        "You cannot rate yourself",
        400
    );
}

    // 5. Create rating

    const ratingId = await ratingRepository.createRating(
    rideId,
    userId,
    ride.rider_id,
    rating,
    review
);

return { ratingId };

};



export const getRatingsByUser = async (userId) => {

    const ratings = await ratingRepository.getRatingsByUser(
        userId
    );

    return ratings;
};