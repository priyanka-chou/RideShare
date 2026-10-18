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
        { show: isEnabled(ride.stopovers_allowed), icon: FaRoute, label: "Stopovers Allowed" },
    ].filter((item) => item.show);

    return (
        <article className="w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            {/* Top row: Driver and price */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-4">
                    {/* avatar ? ( */}
                        <img
                            src={avatar || profile}
                            alt={driverName}
                            onClick={openRiderProfile}
                            className="h-12 w-12 shrink-0 cursor-pointer rounded-full border border-gray-200 object-cover sm:h-15 sm:w-15"
                        />
                    {/* // ) : (
                    //     // <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                    //     //     <FaCar className="text-xl" />
                    //     // </div>
                    // )} */}

                    <div className="min-w-0">
                        <h3
                            onClick={openRiderProfile}
                            className="cursor-pointer truncate text-lg font-bold text-gray-900 hover:text-orange-600 sm:text-xl"
                        >
                            {driverName}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-500">
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
                    <p className="text-lg font-bold text-gray-900 sm:text-xl">
                        ₹{price}
                        <span className="ml-1 text-xs font-normal text-gray-500">
                            per seat
                        </span>
                    </p>

                    <p
                        className={`mt-1 text-sm font-medium sm:text-lg ${
                            seats > 0
                                ? "text-emerald-600"
                                : "text-red-500"
                        }`}
                    >
                        {seats > 0 ? `${seats} seats left` : "Ride full"}
                    </p>
                </div>
            </div>

            {/* Date and time */}
            <div className="mt-4 flex items-center gap-3 text-base font-medium text-gray-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    <FaCalendarAlt />
                </span>

                <span>
                    {formattedDate}, {formattedTime}
                </span>
            </div>

            {/* Route */}
            <div className="mt-2 flex items-center gap-3 text-base font-medium text-gray-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    <FaMapMarkerAlt />
                </span>

                <div className="flex min-w-0 flex-wrap items-center gap-2 text-base font-semibold sm:text-lg">
                    <span>{ride.from_location || "Pickup"}</span>
                    <span className="text-orange-500 ">→</span>
                    <span>{ride.to_location || "Destination"}</span>
                </div>
            </div>

            {/* Preferences and button */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-8">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-gray-600 sm:gap-x-8 sm:text-base">
                    {preferences.map(({ icon: Icon, label }) => (
                        <span key={label} className="flex items-center gap-2">
                            {Icon && <Icon className="text-orange-500" />}
                            {label}
                        </span>
                    ))}
                </div>

                <button
                    type="button"
                    disabled={seats <= 0}
                    onClick={() => onViewDetails(ride.id)}
                    className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
                >
                    {seats > 0 ? "View & Book" : "Ride Full"}
                </button>
            </div>
        </article>
    );
};

export default RideCard;