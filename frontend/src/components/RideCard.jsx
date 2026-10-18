import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaStar,
    FaSnowflake,
    FaMusic,
    FaSmokingBan,
    FaPaw,
    FaRoute,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import profile from "../assets/avtar.avif";

// Lamba address chhota karo: state/country hatao aur beech ke hisse ghatao.
// Poora address Ride Details page par dikhta hai (yahan hover par tooltip me bhi).
const shortAddress = (address) => {
    if (!address) return "";

    let parts = String(address)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    // "..., Madhya Pradesh, India" jaise aakhri do hisse hatao
    if (parts.length >= 4) parts = parts.slice(0, -2);

    // Phir bhi lamba ho to pehle 2 + sheher (aakhri) rakho
    if (parts.length > 3) parts = [parts[0], parts[1], parts[parts.length - 1]];

    return parts.join(", ");
};

const RideCard = ({ ride, onViewDetails }) => {
    const navigate = useNavigate();

    // Rider ki public profile kholo
    const openRiderProfile = () => {
        if (ride.rider_id) navigate(`/profile/${ride.rider_id}`);
    };

    const formattedDate = ride.ride_date
        ? new Date(ride.ride_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Date unavailable";

    const formattedTime = ride.ride_time
        ? String(ride.ride_time).slice(0, 5)
        : "Time unavailable";

    const seats = Number(ride.available_seats ?? 0);
    const price = Number(ride.price ?? 0);

    const driverName = ride.rider_name || "Ride Driver";

    const avatar =
        ride.profile_pic ||
        ride.profilePic ||
        ride.rider_profile_pic ||
        ride.profile_image;

    // Handle boolean, 0/1 and string values
    const isEnabled = (value) =>
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true";

    // Sirf wahi preferences dikhao jo rider ne select ki hain
    const preferences = [
        { show: isEnabled(ride.ac_available), icon: FaSnowflake, label: "AC" },
        { show: isEnabled(ride.music), icon: FaMusic, label: "Music" },
        { show: isEnabled(ride.no_smoking), icon: FaSmokingBan, label: "No Smoking" },
        { show: isEnabled(ride.pets_allowed), icon: FaPaw, label: "Pets Friendly" },
        { show: isEnabled(ride.stopovers_allowed), icon: FaRoute, label: "Stopovers" },
    ].filter((item) => item.show);

    const fromText = ride.from_location || "Pickup";
    const toText = ride.to_location || "Destination";

    return (
        <article className="w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4">
            {/* Top row: Driver and price */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <img
                        src={avatar || profile}
                        alt={driverName}
                        onClick={openRiderProfile}
                        className="size-11 shrink-0 cursor-pointer rounded-full border border-gray-200 object-cover sm:size-12"
                    />

                    <div className="min-w-0">
                        <h3
                            onClick={openRiderProfile}
                            className="cursor-pointer truncate text-base font-bold text-gray-900 hover:text-orange-600 sm:text-lg"
                        >
                            {driverName}
                        </h3>

                        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-500">
                            <FaStar className="text-amber-400" />
                            <span className="font-semibold text-amber-500">
                                {ride.rating ?? "New"}
                            </span>
                            {Number(ride.review_count) > 0 && (
                                <span>({ride.review_count} reviews)</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-gray-900 sm:text-lg">
                        ₹{price}
                        <span className="ml-1 text-xs font-normal text-gray-500">
                            per seat
                        </span>
                    </p>

                    <p
                        className={`mt-0.5 text-xs font-medium sm:text-sm ${
                            seats > 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                    >
                        {seats > 0 ? `${seats} seats left` : "Ride full"}
                    </p>
                </div>
            </div>

            {/* Date and time */}
            <div className="mt-3 flex items-center gap-2.5 text-sm font-medium text-gray-700">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gray-50 text-xs text-gray-500">
                    <FaCalendarAlt />
                </span>

                <span>
                    {formattedDate}, {formattedTime}
                </span>
            </div>

            {/* Route: phone par upar-neeche, bade screen par ek line me */}
            <div className="mt-2 flex items-start gap-2.5 text-sm font-semibold text-gray-800">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-gray-50 text-xs text-gray-500">
                    <FaMapMarkerAlt />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                    <span
                        title={fromText}
                        className="line-clamp-2 min-w-0 break-words sm:max-w-[46%]"
                    >
                        {shortAddress(fromText)}
                    </span>

                    <span className="text-orange-500 sm:hidden">↓</span>
                    <span className="hidden shrink-0 text-orange-500 sm:inline">→</span>

                    <span
                        title={toText}
                        className="line-clamp-2 min-w-0 break-words sm:max-w-[46%]"
                    >
                        {shortAddress(toText)}
                    </span>
                </div>
            </div>

            {/* Preferences and button */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-gray-600 sm:text-sm">
                    {preferences.map(({ icon: Icon, label }) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <Icon className="text-orange-500" />
                            {label}
                        </span>
                    ))}
                </div>

                <button
                    type="button"
                    disabled={seats <= 0}
                    onClick={() => onViewDetails(ride.id)}
                    className="w-full rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
                >
                    {seats > 0 ? "View & Book" : "Ride Full"}
                </button>
            </div>
        </article>
    );
};

export default RideCard;