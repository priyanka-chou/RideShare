import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FaArrowLeft,
    FaUserGraduate,
    FaUniversity,
    FaLaptopCode,
    FaRegCalendarAlt,
} from "react-icons/fa";

import coverImage from "../assets/coverImage.jpeg";
import profile from "../assets/avtar.avif";

import { api } from "../services/api/api";
import { getRatingsByUser } from "../services/api/ratingApi";

// Kisi bhi user/rider ki public profile (email aur phone yahan nahi aate)
const PublicProfile = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isMe = Number(user?.id ?? user?.user_id) === Number(id);

    useEffect(() => {
        // Apni hi profile ho to asli profile page par bhej do
        if (isMe) {
            navigate("/profile", { replace: true });
            return;
        }

        let active = true;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/profile/${id}`);
                const data = response?.data?.data;

                if (!active) return;

                setProfileData(data || null);

                try {
                    const res = await getRatingsByUser(id);
                    if (active) {
                        setReviews(Array.isArray(res?.data) ? res.data : []);
                    }
                } catch (reviewError) {
                    console.log("Reviews fetch error:", reviewError);
                    if (active) setReviews([]);
                }
            } catch (err) {
                console.error("Public profile error:", err);

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load profile"
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            active = false;
        };
    }, [id, isMe, navigate]);

    const handleMessage = () => {
        localStorage.setItem("selectedChatId", String(id));
        navigate("/messages");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <main className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
                    <p className="text-red-500">
                        {error || "Profile not found"}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-5 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600"
                    >
                        Go Back
                    </button>
                </div>
            </main>
        );
    }

    const isRider = profileData.role === "rider";
    const hasRatings = Number(profileData.total_ratings) > 0;

    return (
        <main className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div className="mx-auto max-w-6xl">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
                >
                    <FaArrowLeft />
                    Back
                </button>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                    {/* Cover */}
                    <div
                        className="h-48 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${profileData.coverImage || coverImage})`,
                        }}
                    />

                    {/* Header */}
                    <div className="flex flex-col gap-4 px-6 sm:flex-row sm:justify-between">
                        <div className="flex min-w-0">
                            <img
                                src={profileData.profilePic || profile}
                                alt={profileData.name}
                                className="relative -mt-12 size-24 shrink-0 rounded-full border-4 border-white object-cover sm:-mt-14 sm:size-32"
                            />

                            <div className="min-w-0 p-4">
                                <h1 className="truncate text-2xl font-bold text-gray-800">
                                    {profileData.name}
                                </h1>

                                {isRider && (
                                    <p className="text-sm text-gray-500">
                                        {hasRatings ? (
                                            <>
                                                <span className="text-yellow-500">
                                                    ★ {Number(profileData.average_rating).toFixed(1)}
                                                </span>
                                                <span className="ml-1 text-gray-400">
                                                    ({profileData.total_ratings} ratings)
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">No ratings yet</span>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            <button
                                type="button"
                                onClick={handleMessage}
                                className="rounded-md border border-orange-500 bg-orange-500 px-4 py-2 text-sm text-white transition hover:bg-orange-600 active:scale-95"
                            >
                                Message
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)]">

                        {/* Left */}
                        <div className="px-6 py-4 md:px-8 lg:px-12">
                            <div className="mt-3 flex items-center gap-3 text-gray-600">
                                <FaUserGraduate className="text-gray-500" />
                                <span>{isRider ? "Rider" : "Student"}</span>
                            </div>

                            <div className="mt-3 flex items-center gap-3 text-gray-600">
                                <FaUniversity className="text-gray-500" />
                                <span>{profileData.university || "University not added"}</span>
                            </div>

                            <div className="mt-3 flex items-center gap-3 text-gray-600">
                                <FaLaptopCode className="text-gray-500" />
                                <span>{profileData.course || "Course not added"}</span>
                            </div>

                            <div className="mt-3 flex items-center gap-3 text-gray-600">
                                <FaRegCalendarAlt className="text-gray-500" />
                                <span>{profileData.year || "Year not added"}</span>
                            </div>

                            <div className="mt-3 flex items-center gap-3 text-gray-600">
                                <FaRegCalendarAlt className="text-gray-500" />
                                <span>
                                    Member since{" "}
                                    {profileData.created_at
                                        ? new Date(profileData.created_at).toLocaleDateString()
                                        : "Not available"}
                                </span>
                            </div>
                        </div>

                        {/* Right */}
                        <div>
                            {/* Stats */}
                            <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-3">
                                {isRider ? (
                                    <>
                                        <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {profileData.total_rides}
                                            </h3>
                                            <p className="text-sm text-gray-500">Rides Offered</p>
                                        </div>

                                        <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {profileData.rides_completed ?? 0}
                                            </h3>
                                            <p className="text-sm text-gray-500">Rides Completed</p>
                                        </div>

                                        <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {hasRatings
                                                    ? Number(profileData.average_rating).toFixed(1)
                                                    : "–"}
                                            </h3>
                                            <p className="text-sm text-gray-500">Average Rating</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {profileData.rides_taken}
                                        </h3>
                                        <p className="text-sm text-gray-500">Rides Taken</p>
                                    </div>
                                )}
                            </div>

                            {/* About */}
                            <div className="px-6 py-4">
                                <h2 className="text-xl font-bold text-gray-800">About</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {profileData.bio || "No bio added yet"}
                                </p>
                            </div>

                            {/* Reviews: rider ke liye */}
                            {isRider && (
                                <div className="px-6 py-4">
                                    <h2 className="text-xl font-bold text-gray-800">Reviews</h2>

                                    {reviews.length === 0 ? (
                                        <p className="mt-3 text-sm text-gray-500">No reviews yet.</p>
                                    ) : (
                                        <div className="mt-4 space-y-3">
                                            {reviews.map((review) => (
                                                <div
                                                    key={review.rating_id}
                                                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <h3 className="min-w-0 truncate font-semibold text-gray-800">
                                                            {review.rater_name}
                                                        </h3>
                                                        <span className="shrink-0 text-yellow-500">
                                                            ★ {review.rating}
                                                        </span>
                                                    </div>

                                                    {review.review && (
                                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                                            {review.review}
                                                        </p>
                                                    )}

                                                    <p className="mt-2 text-xs text-gray-400">
                                                        {review.created_at
                                                            ? new Date(review.created_at).toLocaleDateString()
                                                            : ""}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PublicProfile;