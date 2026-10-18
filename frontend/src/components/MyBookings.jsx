import { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaClock,
    FaSnowflake,
    FaMusic,
    FaSmokingBan,
    FaPaw,
    FaRoute,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
    getUserBookings,
    cancelBooking,
} from "../services/api/bookingApi";
import { createRating } from "../services/api/ratingApi";
import profile from "../assets/avtar.avif";

// Backend me booking ka status sirf "confirmed" / "cancelled" hota hai.
// "Completed" tab maana jaata hai jab booking confirmed ho aur ride completed ho.
const getDisplayStatus = (booking) => {
    if (booking.booking_status === "cancelled") return "cancelled";
    if (booking.ride_status === "cancelled") return "cancelled";
    if (booking.ride_status === "completed") return "completed";
    return "confirmed";
};

// Handle boolean, 0/1 and string values
const isEnabled = (value) =>
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true";

const statusStyles = {
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
};

const MyBookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState("");

    // Rating popup
    const [reviewing, setReviewing] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchBookings = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            setError("");

            const response = await getUserBookings();

            setBookings(response?.data || []);
        } catch (error) {
            console.error("Fetch Bookings Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load bookings"
            );
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(bookingId);

            await cancelBooking(bookingId);

            toast.success("Booking cancelled successfully");

            await fetchBookings(false);
        } catch (error) {
            console.error("Cancel Booking Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel booking"
            );
        } finally {
            setCancellingId(null);
        }
    };

    // Messages page par driver ki chat khol do
    const handleMessageDriver = (riderId) => {
        localStorage.setItem("selectedChatId", String(riderId));
        navigate("/messages");
    };

    const openReview = (booking) => {
        setReviewing(booking);
        setRating(5);
        setReview("");
    };

    const closeReview = () => {
        if (submittingReview) return;
        setReviewing(null);
    };

    const handleSubmitReview = async () => {
        if (!reviewing) return;

        try {
            setSubmittingReview(true);

            await createRating(
                reviewing.ride_id,
                rating,
                review.trim() || undefined
            );

            toast.success("Thanks for your rating!");

            setReviewing(null);

            await fetchBookings(false);
        } catch (error) {
            console.error("Create Rating Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to submit rating"
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (time) => {
        if (!time) return "Time unavailable";

        return String(time).slice(0, 5);
    };

    if (loading) {
        return (
            <main className="min-h-full bg-gray-100 p-4 md:p-6">
                <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-500">
                        Loading your bookings...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-full bg-gray-100 p-4 md:p-6">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <h1 className="text-2xl font-bold text-gray-800">
                        My Bookings
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage the rides you have booked.
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!error && bookings.length === 0 && (
                    <div className="mt-4 rounded-xl bg-white p-8 text-center shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-700">
                            No bookings yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            You haven't booked any rides yet.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/find-rides")}
                            className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                            Find Rides
                        </button>

                    </div>
                )}

                {/* Booking List */}
                {!error && bookings.length > 0 && (
                    <div className="mt-4 space-y-4">

                        {bookings.map((booking) => {

                            const status = getDisplayStatus(booking);

                            // Ye flags backend (SQL) se aate hain, date ka hisaab frontend me nahi
                            const canCancel = Number(booking.can_cancel) === 1;
                            const canRate = Number(booking.can_rate) === 1;
                            const hasRated = Number(booking.has_rated) === 1;

                            // Sirf wahi preferences jo rider ne select ki hain
                            const preferences = [
                                { show: isEnabled(booking.ac_available), icon: FaSnowflake, label: "AC" },
                                { show: isEnabled(booking.music), icon: FaMusic, label: "Music" },
                                { show: isEnabled(booking.no_smoking), icon: FaSmokingBan, label: "No Smoking" },
                                { show: isEnabled(booking.pets_allowed), icon: FaPaw, label: "Pets Friendly" },
                                { show: isEnabled(booking.stopovers_allowed), icon: FaRoute, label: "Stopovers Allowed" },
                            ].filter((item) => item.show);

                            return (
                                <article
                                    key={booking.booking_id}
                                    className="rounded-xl bg-white p-4 shadow-sm sm:p-5"
                                >

                                    {/* Top */}
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                        <div className="flex min-w-0 items-start gap-3">
                                            <img
                                                src={booking.rider_profile_pic || profile}
                                                alt={booking.rider_name || "Driver"}
                                                onClick={() => navigate(`/profile/${booking.rider_id}`)}
                                                className="h-12 w-12 shrink-0 cursor-pointer rounded-full border border-gray-200 object-cover"
                                            />

                                            <div className="min-w-0">
                                                <p className="wrap-break-word text-base font-bold text-gray-800 sm:text-lg">
                                                    {booking.from_location}
                                                    <span className="mx-2 text-orange-500">
                                                        →
                                                    </span>
                                                    {booking.to_location}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Driver:{" "}
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/profile/${booking.rider_id}`)}
                                                        className="font-medium text-orange-600 hover:underline"
                                                    >
                                                        {booking.rider_name ||
                                                            "Unknown"}
                                                    </button>
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`w-fit shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                                                statusStyles[status]
                                            }`}
                                        >
                                            {status}
                                        </span>

                                    </div>

                                    {/* Details */}
                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                            <FaCalendarAlt className="text-orange-500" />

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Date
                                                </p>

                                                <p className="text-sm font-medium text-gray-700">
                                                    {formatDate(
                                                        booking.ride_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                            <FaClock className="text-orange-500" />

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Time
                                                </p>

                                                <p className="text-sm font-medium text-gray-700">
                                                    {formatTime(
                                                        booking.ride_time
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                            <span className="text-lg font-bold text-orange-500">
                                                ₹
                                            </span>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Price
                                                </p>

                                                <p className="text-sm font-medium text-gray-700">
                                                    ₹{booking.price} / seat
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Ride preferences */}
                                    {preferences.length > 0 && (
                                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3">
                                            {preferences.map(({ icon: Icon, label }) => (
                                                <span
                                                    key={label}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm"
                                                >
                                                    <Icon className="text-orange-500" />
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {(booking.rider_id || canCancel || canRate || hasRated) && (
                                        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">

                                            {hasRated && (
                                                <span className="mr-auto text-sm font-medium text-yellow-600">
                                                    You rated: ★ {booking.my_rating}
                                                </span>
                                            )}

                                            {booking.rider_id && status !== "cancelled" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMessageDriver(
                                                            booking.rider_id
                                                        )
                                                    }
                                                    className="rounded-lg border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                                                >
                                                    Message Driver
                                                </button>
                                            )}

                                            {canRate && (
                                                <button
                                                    type="button"
                                                    onClick={() => openReview(booking)}
                                                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                                                >
                                                    Rate Driver
                                                </button>
                                            )}

                                            {canCancel && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking.booking_id
                                                        )
                                                    }
                                                    disabled={
                                                        cancellingId ===
                                                        booking.booking_id
                                                    }
                                                    className="rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {cancellingId ===
                                                    booking.booking_id
                                                        ? "Cancelling..."
                                                        : "Cancel Booking"}
                                                </button>
                                            )}

                                        </div>
                                    )}

                                </article>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* Rating popup */}
            {reviewing && (
                <div
                    className="fixed inset-0 z-200 flex items-end justify-center bg-black/40 p-4 sm:items-center"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Rate driver"
                    onClick={closeReview}
                >
                    <div
                        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-bold text-gray-800">
                            Rate {reviewing.rider_name || "Driver"}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {reviewing.from_location} → {reviewing.to_location}
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
                                onClick={closeReview}
                                disabled={submittingReview}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {submittingReview ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MyBookings;