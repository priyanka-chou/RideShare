import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { getUserBookings } from "../services/api/bookingApi";
import { createRating } from "../services/api/ratingApi";

// Kitni der baad (ms) backend se check kare ki koi ride complete hui ya nahi
const POLL_INTERVAL = 30000;

const SKIPPED_KEY = "skippedRatingRideIds";

const readSkipped = () => {
    try {
        const parsed = JSON.parse(sessionStorage.getItem(SKIPPED_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeSkipped = (ids) => {
    try {
        sessionStorage.setItem(SKIPPED_KEY, JSON.stringify(ids));
    } catch {
        // storage band ho to bhi app chalna chahiye
    }
};

// Passenger (user) ke liye: jab rider ride "Completed" mark kar de,
// to kisi bhi page par rating popup khul jata hai.
const RatingPrompt = () => {
    const [booking, setBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Popup khula ho ya submit ho raha ho to naya check nahi karna
    const busyRef = useRef(false);
    busyRef.current = Boolean(booking) || submitting;

    const checkForPendingRating = useCallback(async () => {
        if (busyRef.current) return;

        try {
            const response = await getUserBookings();
            const list = Array.isArray(response?.data) ? response.data : [];

            const skipped = readSkipped();

            // Backend ka can_rate flag: confirmed booking + ride completed + rating abhi nahi di
            const pending = list.find(
                (item) =>
                    Number(item.can_rate) === 1 &&
                    !skipped.includes(item.ride_id)
            );

            if (pending && !busyRef.current) {
                setBooking(pending);
                setRating(5);
                setReview("");
            }
        } catch (error) {
            // Silent: ye background check hai, user ko error dikhane ki zaroorat nahi
            console.error("Rating check failed:", error);
        }
    }, []);

    useEffect(() => {
        checkForPendingRating();

        const interval = setInterval(checkForPendingRating, POLL_INTERVAL);

        const handleVisible = () => {
            if (document.visibilityState === "visible") {
                checkForPendingRating();
            }
        };

        document.addEventListener("visibilitychange", handleVisible);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisible);
        };
    }, [checkForPendingRating]);

    const handleSkip = () => {
        if (submitting || !booking) return;

        // Is session me dobara nahi poochenge. My Bookings me "Rate Driver" button rahega.
        writeSkipped([...readSkipped(), booking.ride_id]);
        setBooking(null);
    };

    const handleSubmit = async () => {
        if (!booking) return;

        try {
            setSubmitting(true);

            await createRating(
                booking.ride_id,
                rating,
                review.trim() || undefined
            );

            toast.success("Thanks for your rating!");

            setBooking(null);
        } catch (error) {
            console.error("Create Rating Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to submit rating"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!booking) return null;

    return (
        <div
            className="fixed inset-0 z-300 flex items-end justify-center bg-black/40 p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Rate your ride"
            onClick={handleSkip}
        >
            <div
                className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                    Ride completed
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-800">
                    How was your ride with {booking.rider_name || "your driver"}?
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    {booking.from_location} → {booking.to_location}
                </p>

                <div className="my-3 flex gap-1 text-4xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            aria-label={`${star} star`}
                            onClick={() => setRating(star)}
                            className={
                                star <= rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                            }
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Write your experience (optional)"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-orange-500"
                />

                <div className="mt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleSkip}
                        disabled={submitting}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-60"
                    >
                        Maybe later
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingPrompt;