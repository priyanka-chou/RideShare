// import profile from "../assets/avtar.avif";
// import { useNavigate } from "react-router-dom";
// import {
//     FaSnowflake,
//     FaMusic,
//     FaSmokingBan,
//     FaPaw,
// } from "react-icons/fa";

// const MyRideCard = ({
//     ride,
//     onCancel,
//     cancelling,
//     onComplete,
//     completing,
// }) => {
//     const navigate = useNavigate();


//     const riderProfile =
//   ride.rider_profile_pic ||
//   ride.profile_pic ||
//   ride.profilePic ||
//   ride.profile_image ||
//   ride.avatar ||
//   profile;

  

//     const {
//         id,
//         from_location,
//         to_location,
//         ride_date,
//         ride_time,
//         available_seats,
//         price,
//         status,
//         rider_name,
//         booked_count,
//     } = ride;

//     const canComplete = Number(ride.can_complete) === 1;
//     const isCompleted = status === "completed";

//     // Support both database and frontend field names
//     const acAvailable = ride.ac_available ?? ride.acAvailable;
//     const musicAvailable = ride.music;
//     const noSmoking = ride.no_smoking ?? ride.noSmoking;
//     const petsAllowed = ride.pets_allowed ?? ride.petsAllowed;

//     // Handle boolean, 0/1 and string values
//     const isEnabled = (value) =>
//         value === true ||
//         value === 1 ||
//         value === "1" ||
//         value === "true";

//     const formattedDate = ride_date
//         ? new Date(ride_date).toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//           })
//         : "Date not available";

//     const formattedTime = ride_time
//         ? String(ride_time).slice(0, 5)
//         : "Time not available";

//     const statusStyles = {
//         upcoming: "bg-green-100 text-green-700",
//         completed: "bg-blue-100 text-blue-700",
//         cancelled: "bg-red-100 text-red-700",
//         confirmed: "bg-green-100 text-green-700",
//     };

//     return (
//         <article className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
//             {/* Ride details */}
//             <div className="flex items-start gap-3 sm:gap-4">
//                 <img
//                     src={profile}
//                     alt={`${rider_name || "Driver"} profile`}
//                     className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-15 sm:w-15"
//                 />

//                 <div className="min-w-0 flex-1">
//                     <p className="text-sm font-bold text-gray-800 sm:text-xl">
//                         {rider_name || "Driver"}
//                     </p>

//                     <p className="mt-1 text-xs text-gray-600">
//                         {formattedDate}, {formattedTime}
//                     </p>

//                     <p className="mt-4 text-sm font-medium text-gray-700 sm:mt-6 sm:text-base">
//                         {from_location}
//                         <span className="mx-2 font-semibold text-orange-500">
//                             →
//                         </span>
//                         {to_location}
//                     </p>

//                     <p className="mt-3 text-base font-bold text-gray-900 sm:text-lg">
//                         ₹{price}
//                         <span className="ml-1 text-xs font-normal text-gray-500 sm:text-sm">
//                             per seat
//                         </span>
//                     </p>

//                     <p className="mt-1 text-xs text-gray-600 sm:text-sm">
//                         {Number(booked_count) || 0}{" "}
//                         {Number(booked_count) === 1 ? "passenger" : "passengers"}{" "}
//                         booked
//                     </p>

//                     <p className="mt-1 text-xs text-green-700 sm:text-sm">
//                         {available_seats}{" "}
//                         {Number(available_seats) === 1 ? "seat" : "seats"}{" "}
//                         available
//                     </p>
//                 </div>

//                 <span
//                     className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold capitalize sm:px-4 sm:py-2 sm:text-sm ${
//                         statusStyles[status] ||
//                         "bg-gray-100 text-gray-700"
//                     }`}
//                 >
//                     {status || "Unknown"}
//                 </span>
//             </div>

        
// {/* Selected ride preferences */}
//   {(isEnabled(acAvailable) ||
//     isEnabled(musicAvailable) ||
//     isEnabled(noSmoking) ||
//     isEnabled(petsAllowed) ||
//     isEnabled(ride.stopovers_allowed)) && (
//     <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-orange-100 pt-3">
//         {isEnabled(acAvailable) && (
//             <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
//                 <FaSnowflake className="text-orange-500" />
//                 AC
//             </span>
//         )}

//         {isEnabled(musicAvailable) && (
//             <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
//                 <FaMusic className="text-orange-500" />
//                 Music
//             </span>
//         )}

//         {isEnabled(noSmoking) && (
//             <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
//                 <FaSmokingBan className="text-orange-500" />
//                 No Smoking
//             </span>
//         )}

//         {isEnabled(petsAllowed) && (
//             <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
//                 <FaPaw className="text-orange-500" />
//                 Pets Friendly
//             </span>
//         )}

//         {isEnabled(ride.stopovers_allowed) && (
//             <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
//                 Stopovers Allowed
//             </span>
//         )}
//     </div>
// )}


//             {/* Action buttons */}
//             <div className="mt-4 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-3">
//                 <button
//                     type="button"
//                     onClick={() => navigate(`/ride-details/${id}`)}
//                     className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 sm:px-5 sm:text-sm"
//                 >
//                     View Details
//                 </button>

//                 {/* Ride complete hone ke baad: green background, white text, "Completed" */}
//                 {isCompleted && (
//                     <button
//                         type="button"
//                         disabled
//                         className="cursor-default rounded-lg bg-green-600 px-4 py-3 text-xs font-semibold text-white sm:px-5 sm:text-sm"
//                     >
//                         Completed
//                     </button>
//                 )}

//                 {!isCompleted && canComplete && (
//                     <button
//                         type="button"
//                         onClick={() => onComplete(id)}
//                         disabled={completing || cancelling}
//                         className="rounded-lg border border-green-500 px-4 py-3 text-xs font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
//                     >
//                         {completing ? "Completing..." : "Mark Completed"}
//                     </button>
//                 )}

//                 {(status === "upcoming" || status === "ongoing") && (
//                     <button
//                         type="button"
//                         onClick={() => onCancel(id)}
//                         disabled={cancelling || completing}
//                         className="rounded-lg bg-orange-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
//                     >
//                         {cancelling ? "Cancelling..." : "Cancel Ride"}
//                     </button>
//                 )}
//             </div>
//         </article>
//     );
// };

// export default MyRideCard;


import profile from "../assets/avtar.avif";
import { useNavigate } from "react-router-dom";
import {
    FaSnowflake,
    FaMusic,
    FaSmokingBan,
    FaPaw,
    FaRoute,
} from "react-icons/fa";

const MyRideCard = ({
    ride,
    onCancel,
    cancelling,
    onComplete,
    completing,
}) => {
    const navigate = useNavigate();


    const riderProfile =
  ride.rider_profile_pic ||
  ride.profile_pic ||
  ride.profilePic ||
  ride.profile_image ||
  ride.avatar ||
  profile;

  

    const {
        id,
        from_location,
        to_location,
        ride_date,
        ride_time,
        available_seats,
        price,
        status,
        rider_name,
        booked_count,
    } = ride;

    const canComplete = Number(ride.can_complete) === 1;
    const isCompleted = status === "completed";

    // Confirmed passengers (backend JSON array; kuch DB string bhejte hain)
    let passengers = ride.passengers;
    if (typeof passengers === "string") {
        try {
            passengers = JSON.parse(passengers);
        } catch {
            passengers = [];
        }
    }
    if (!Array.isArray(passengers)) passengers = [];

    // Messages page par us passenger ki chat khol do
    const handleMessagePassenger = (passengerId) => {
        localStorage.setItem("selectedChatId", String(passengerId));
        navigate("/messages");
    };

    // Support both database and frontend field names
    const acAvailable = ride.ac_available ?? ride.acAvailable;
    const musicAvailable = ride.music;
    const noSmoking = ride.no_smoking ?? ride.noSmoking;
    const petsAllowed = ride.pets_allowed ?? ride.petsAllowed;

    // Handle boolean, 0/1 and string values
    const isEnabled = (value) =>
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true";

    const formattedDate = ride_date
        ? new Date(ride_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Date not available";

    const formattedTime = ride_time
        ? String(ride_time).slice(0, 5)
        : "Time not available";

    const statusStyles = {
        upcoming: "bg-green-100 text-green-700",
        completed: "bg-blue-100 text-blue-700",
        cancelled: "bg-red-100 text-red-700",
        confirmed: "bg-green-100 text-green-700",
    };

    return (
        <article className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            {/* Ride details */}
            <div className="flex items-start gap-3 sm:gap-4">
                <img
                    src={riderProfile}
                    alt={`${rider_name || "Driver"} profile`}
                    className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-15 sm:w-15"
                />

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 sm:text-xl">
                        {rider_name || "Driver"}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                        {formattedDate}, {formattedTime}
                    </p>

                    <p className="mt-4 text-sm font-medium text-gray-700 sm:mt-6 sm:text-base">
                        {from_location}
                        <span className="mx-2 font-semibold text-orange-500">
                            →
                        </span>
                        {to_location}
                    </p>

                    <p className="mt-3 text-base font-bold text-gray-900 sm:text-lg">
                        ₹{price}
                        <span className="ml-1 text-xs font-normal text-gray-500 sm:text-sm">
                            per seat
                        </span>
                    </p>

                    <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                        {Number(booked_count) || 0}{" "}
                        {Number(booked_count) === 1 ? "passenger" : "passengers"}{" "}
                        booked
                    </p>

                    <p className="mt-1 text-xs text-green-700 sm:text-sm">
                        {available_seats}{" "}
                        {Number(available_seats) === 1 ? "seat" : "seats"}{" "}
                        available
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold capitalize sm:px-4 sm:py-2 sm:text-sm ${
                        statusStyles[status] ||
                        "bg-gray-100 text-gray-700"
                    }`}
                >
                    {status || "Unknown"}
                </span>
            </div>

        
{/* Selected ride preferences */}
  {(isEnabled(acAvailable) ||
    isEnabled(musicAvailable) ||
    isEnabled(noSmoking) ||
    isEnabled(petsAllowed) ||
    isEnabled(ride.stopovers_allowed)) && (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-orange-100 pt-3">
        {isEnabled(acAvailable) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                <FaSnowflake className="text-orange-500" />
                AC
            </span>
        )}

        {isEnabled(musicAvailable) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                <FaMusic className="text-orange-500" />
                Music
            </span>
        )}

        {isEnabled(noSmoking) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                <FaSmokingBan className="text-orange-500" />
                No Smoking
            </span>
        )}

        {isEnabled(petsAllowed) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                <FaPaw className="text-orange-500" />
                Pets Friendly
            </span>
        )}

        {isEnabled(ride.stopovers_allowed) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                <FaRoute className="text-orange-500" />
                Stopovers Allowed
            </span>
        )}
    </div>
)}


            {/* Passengers: rider inhe message kar sakta hai */}
            {passengers.length > 0 && (
                <div className="mt-4 border-t border-orange-100 pt-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 sm:text-sm">
                        Passengers
                    </p>

                    <div className="space-y-2">
                        {passengers.map((passenger) => (
                            <div
                                key={passenger.id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => navigate(`/profile/${passenger.id}`)}
                                    className="flex min-w-0 items-center gap-2 text-left"
                                >
                                    <img
                                        src={passenger.profilePic || profile}
                                        alt={passenger.name || "Passenger"}
                                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                                    />
                                    <span className="truncate text-sm font-medium text-gray-700 hover:text-orange-600 hover:underline">
                                        {passenger.name || "Passenger"}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleMessagePassenger(passenger.id)
                                    }
                                    className="shrink-0 rounded-lg border border-orange-300 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-50"
                                >
                                    Message
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-3">
                <button
                    type="button"
                    onClick={() => navigate(`/ride-details/${id}`)}
                    className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 sm:px-5 sm:text-sm"
                >
                    View Details
                </button>

                {/* Ride complete hone ke baad: green background, white text, "Completed" */}
                {isCompleted && (
                    <button
                        type="button"
                        disabled
                        className="cursor-default rounded-lg bg-green-600 px-4 py-3 text-xs font-semibold text-white sm:px-5 sm:text-sm"
                    >
                        Completed
                    </button>
                )}

                {!isCompleted && canComplete && (
                    <button
                        type="button"
                        onClick={() => onComplete(id)}
                        disabled={completing || cancelling}
                        className="rounded-lg border border-green-500 px-4 py-3 text-xs font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
                    >
                        {completing ? "Completing..." : "Mark Completed"}
                    </button>
                )}

                {(status === "upcoming" || status === "ongoing") && (
                    <button
                        type="button"
                        onClick={() => onCancel(id)}
                        disabled={cancelling || completing}
                        className="rounded-lg bg-orange-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
                    >
                        {cancelling ? "Cancelling..." : "Cancel Ride"}
                    </button>
                )}
            </div>
        </article>
    );
};

export default MyRideCard;