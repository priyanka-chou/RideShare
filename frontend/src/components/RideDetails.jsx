// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaCar,
//   FaClock,
//   FaMapMarkerAlt,
//   FaRupeeSign,
//   FaUser,
//   FaStar,
//   FaShieldAlt,
//   FaCheckCircle,
//   FaMusic,
//   FaPaw,
//   FaRoute,
// } from "react-icons/fa";
// import { toast } from "react-toastify";

// import profile from "../assets/avtar.avif";
// import { getRideById } from "../services/api/rideApi";
// import { createBooking } from "../services/api/bookingApi";
// import { cancelRide } from "../services/api/rideApi";

// const RideDetails = ({ user }) => {


//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState(false);
//   const [error, setError] = useState("");






//   useEffect(() => {
//     let active = true;

//     const fetchRideDetails = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getRideById(id);

//         if (active) {
//           setRide(response?.data || null);
//         }
//       } catch (err) {
//         console.error("Ride Details Error:", err);

//         if (active) {
//           setError(
//             err.response?.data?.message ||
//             "Failed to load ride details"
//           );
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     if (id) fetchRideDetails();

//     return () => {
//       active = false;
//     };
//   }, [id]);






//   const handleRequestToJoin = async () => {
//     if (!ride?.id || booking) return;

//     if (Number(ride.available_seats) <= 0) {
//       toast.error("No seats available");
//       return;
//     }

//     try {
//       setBooking(true);

//       const response = await createBooking(ride.id);

//       toast.success(
//         response?.message || "Ride booked successfully"
//       );

//       setRide((prev) => ({
//         ...prev,
//         available_seats: Math.max(
//           0,
//           Number(prev.available_seats) - 1
//         ),
//       }));
//     } catch (err) {
//       console.error("Booking Error:", err);

//       toast.error(
//         err.response?.data?.message ||
//         "Failed to book ride"
//       );
//     } finally {
//       setBooking(false);
//     }
//   };



//   const formattedDate = ride?.ride_date
//     ? new Date(ride.ride_date).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     })
//     : "Date unavailable";

//   const formattedTime = ride?.ride_time
//     ? String(ride.ride_time).slice(0, 5)
//     : "Time unavailable";

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-orange-50/40 p-6">
//         <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
//           <p className="text-gray-500">Loading ride details...</p>
//         </div>
//       </main>
//     );
//   }

//   if (error || !ride) {
//     return (
//       <main className="min-h-screen bg-orange-50/40 p-6">
//         <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
//           <p className="text-red-500">
//             {error || "Ride not found"}
//           </p>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="mt-5 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </main>
//     );
//   }





//   const hasSeats = Number(ride.available_seats) > 0;
//   const canBook = ride.status === "upcoming" && hasSeats;

//   const isRider = user?.role === "rider";

//   const isMyRide =
//     isRider &&
//     Number(user?.id ?? user?.user_id) === Number(ride.rider_id);

//   const canCancelRide =
//     isMyRide && ride.status === "upcoming";



//   const mapUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(
//     ride.from_location
//   )}&daddr=${encodeURIComponent(
//     ride.to_location
//   )}&output=embed`;

//   const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
//     ride.from_location
//   )}&destination=${encodeURIComponent(ride.to_location)}`;



//   const handleCancelRide = async () => {
//     if (!canCancelRide) return;

//     const confirmed = window.confirm(
//       "Are you sure you want to cancel this ride?"
//     );

//     if (!confirmed) return;

//     try {
//       await cancelRide(ride.id);

//       setRide((prev) => ({
//         ...prev,
//         status: "cancelled",
//       }));

//       toast.success("Ride cancelled successfully.");
//     } catch (err) {
//       console.error("Cancel ride error:", err);

//       toast.error(
//         err.response?.data?.message ||
//         "Unable to cancel ride."
//       );
//     }
//   };


//   return (
//     <main className="min-h-screen bg-orange-50/40 px-4 py-5 sm:px-6">
//       <div className="mx-auto max-w-6xl">

//         {/* Back navigation */}
//         <button
//           type="button"
//           onClick={() => navigate(-1)}
//           className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
//         >
//           <FaArrowLeft />
//           Back to Search
//         </button>

//         <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">

//           {/* LEFT: Driver and ride details */}
//           <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-3">

//             {/* Driver profile */}
//             <div className="flex items-center gap-5 border-b border-gray-100 p-4 sm:p-5">
//               <img
//                 src={profile}
//                 alt="Driver profile"
//                 className="h-14 w-14 shrink-0 rounded-full border border-orange-100 object-cover"
//               />

//               <div className="min-w-0">
//                 <h1 className="truncate text-base font-bold text-gray-900">
//                   {ride.rider_name || "Driver"}
//                 </h1>

//                 <p className="mt-1 text-xs text-gray-500">
//                   <FaCar className="mr-1 inline text-orange-500" />
//                   Ride provider
//                 </p>

//                 <p className="mt-1 break-all text-xs text-gray-500">
//                   {ride.rider_email || "Contact details unavailable"}
//                 </p>
//               </div>

//               <span className="ml-auto shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
//                 {ride.status}
//               </span>
//             </div>

//             {/* Ride summary */}
//             <div className="space-y-7 p-4 sm:p-5">
//               <div className="flex items-start gap-3">
//                 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
//                   <FaClock />
//                 </span>

//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">
//                     {formattedDate}, {formattedTime}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Departure date and time
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
//                   <FaMapMarkerAlt />
//                 </span>

//                 <div className="min-w-0">
//                   <p className="wrap-break-word text-sm font-semibold text-gray-800">
//                     {ride.from_location}
//                   </p>
//                   <p className="my-1 text-xs text-gray-400">to</p>
//                   <p className="wrap-break-word text-sm font-semibold text-gray-800">
//                     {ride.to_location}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
//                   <FaRupeeSign />
//                 </span>

//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">
//                     ₹{ride.price} per seat
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Price per passenger
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
//                   <FaUser />
//                 </span>

//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">
//                     {ride.available_seats} seats left
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Out of {ride.total_seats} total seats
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Route information */}
//             {/* <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
//               <h2 className="mb-3 text-sm font-bold text-gray-800">
//                 <FaRoute className="mr-2 inline text-orange-500" />
//                 Route Information
//               </h2> */}

//             {/* <div className="space-y-3">
//                 <div>
//                   <p className="text-xs font-semibold text-orange-600">
//                     Pickup Point
//                   </p>
//                   <p className="mt-1 text-sm text-gray-700">
//                     {ride.from_location}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold text-orange-600">
//                     Drop Point
//                   </p>
//                   <p className="mt-1 text-sm text-gray-700">
//                     {ride.to_location}
//                   </p>
//                 </div>
//               </div> */}
//             {/* </div> */}

//             {/* Ride features: shown only if backend provides them */}
//             {(ride.car_type ||
//               ride.ac_available != null ||
//               ride.music != null ||
//               ride.pets_allowed != null ||
//               ride.stopovers_allowed != null) && (
//                 <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
//                   <h2 className="mb-3 text-sm font-bold text-gray-800">
//                     Ride Preferences
//                   </h2>

//                   <div className="flex flex-wrap gap-2">
//                     {ride.car_type && (
//                       <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs text-orange-700">
//                         <FaCar className="mr-1 inline" />
//                         {ride.car_type}
//                       </span>
//                     )}

//                     {ride.ac_available === 1 ||
//                       ride.ac_available === true ? (
//                       <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
//                         <FaCheckCircle className="mr-1 inline text-orange-500" />
//                         AC Available
//                       </span>
//                     ) : null}

//                     {ride.music === 1 || ride.music === true ? (
//                       <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
//                         <FaMusic className="mr-1 inline" />
//                         Music
//                       </span>
//                     ) : null}

//                     {ride.pets_allowed === 1 ||
//                       ride.pets_allowed === true ? (
//                       <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
//                         <FaPaw className="mr-1 inline" />
//                         Pets Allowed
//                       </span>
//                     ) : null}

//                     {ride.stopovers_allowed === 1 ||
//                       ride.stopovers_allowed === true ? (
//                       <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
//                         Stopovers Allowed
//                       </span>
//                     ) : null}
//                   </div>
//                 </div>
//               )}

//             {ride.additional_notes && (
//               <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
//                 <h2 className="text-sm font-bold text-gray-800">
//                   Additional Notes
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-600">
//                   {ride.additional_notes}
//                 </p>
//               </div>
//             )}
//           </section>

//           {/* RIGHT: Map and actions */}
//           <aside className="space-y-4 lg:col-span-2">

//             {/* Route map */}
//             <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
//               <iframe
//                 title="Ride route map"
//                 src={mapUrl}
//                 className="h-64 w-full border-0 sm:h-72"
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               />

//               <a
//                 href={directionsUrl}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
//               >
//                 <FaMapMarkerAlt className="mr-1 inline" />
//                 Open route in Google Maps
//               </a>
//             </div>

//             {/* Booking card */}
//             <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">
//                   Price per seat
//                 </span>
//                 <span className="text-xl font-bold text-orange-600">
//                   ₹{ride.price}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between border-b border-gray-100 pb-3">
//                 <span className="text-sm text-gray-500">
//                   Seats available
//                 </span>
//                 <span className="text-sm font-semibold text-gray-800">
//                   {ride.available_seats}
//                 </span>
//               </div>


//               {isRider ? (
//                 isMyRide ? (
//                   canCancelRide ? (
//                     <button
//                       type="button"
//                       onClick={handleCancelRide}
//                       className="w-full rounded-md bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
//                     >
//                       Cancel Ride
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       disabled
//                       className="w-full cursor-not-allowed rounded-md bg-gray-400 px-4 py-3 text-sm font-semibold text-white"
//                     >
//                       Ride Unavailable
//                     </button>
//                   )
//                 ) : null
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={handleRequestToJoin}
//                     disabled={booking || !canBook}
//                     className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
//                   >
//                     {booking
//                       ? "Requesting..."
//                       : !hasSeats
//                         ? "No Seats Available"
//                         : ride.status !== "upcoming"
//                           ? "Ride Unavailable"
//                           : "Request to Join"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//   localStorage.setItem("selectedChatId", String(ride.rider_id));
//   navigate("/messages");
// }}
//                     className="w-full rounded-md border border-orange-300 px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
//                   >
//                     {/* Message Driver */}
//                   </button>
//                 </>
//               )}

//               <p className="text-center text-xs text-gray-400">
//                 Confirm ride details before requesting to join.
//               </p>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default RideDetails;




import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCar,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUser,
  FaStar,
  FaShieldAlt,
  FaCheckCircle,
  FaMusic,
  FaPaw,
  FaRoute,
} from "react-icons/fa";
import { toast } from "react-toastify";

import profile from "../assets/avtar.avif";
import { getRideById } from "../services/api/rideApi";
import { createBooking } from "../services/api/bookingApi";
import { cancelRide } from "../services/api/rideApi";

const RideDetails = ({ user }) => {


  const { id } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");






  useEffect(() => {
    let active = true;

    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRideById(id);

        if (active) {
          setRide(response?.data || null);
        }
      } catch (err) {
        console.error("Ride Details Error:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
            "Failed to load ride details"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) fetchRideDetails();

    return () => {
      active = false;
    };
  }, [id]);






  const handleRequestToJoin = async () => {
    if (!ride?.id || booking) return;

    if (Number(ride.available_seats) <= 0) {
      toast.error("No seats available");
      return;
    }

    try {
      setBooking(true);

      const response = await createBooking(ride.id);

      toast.success(
        response?.message || "Ride booked successfully"
      );

      setRide((prev) => ({
        ...prev,
        already_booked: 1,
        available_seats: Math.max(
          0,
          Number(prev.available_seats) - 1
        ),
      }));
    } catch (err) {
      console.error("Booking Error:", err);

      toast.error(
        err.response?.data?.message ||
        "Failed to book ride"
      );
    } finally {
      setBooking(false);
    }
  };



  const formattedDate = ride?.ride_date
    ? new Date(ride.ride_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "Date unavailable";

  const formattedTime = ride?.ride_time
    ? String(ride.ride_time).slice(0, 5)
    : "Time unavailable";

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50/40 p-6">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Loading ride details...</p>
        </div>
      </main>
    );
  }

  if (error || !ride) {
    return (
      <main className="min-h-screen bg-orange-50/40 p-6">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-500">
            {error || "Ride not found"}
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





  const hasSeats = Number(ride.available_seats) > 0;
  const alreadyBooked = Number(ride.already_booked) === 1;
  const isPast = Number(ride.is_past) === 1;

  const canBook =
    ride.status === "upcoming" &&
    !isPast &&
    hasSeats &&
    !alreadyBooked;

  const isRider = user?.role === "rider";

  const isMyRide =
    isRider &&
    Number(user?.id ?? user?.user_id) === Number(ride.rider_id);

  const canCancelRide =
    isMyRide && ride.status === "upcoming";



  const mapUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(
    ride.from_location
  )}&daddr=${encodeURIComponent(
    ride.to_location
  )}&output=embed`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    ride.from_location
  )}&destination=${encodeURIComponent(ride.to_location)}`;



  const handleCancelRide = async () => {
    if (!canCancelRide) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this ride?"
    );

    if (!confirmed) return;

    try {
      await cancelRide(ride.id);

      setRide((prev) => ({
        ...prev,
        status: "cancelled",
      }));

      toast.success("Ride cancelled successfully.");
    } catch (err) {
      console.error("Cancel ride error:", err);

      toast.error(
        err.response?.data?.message ||
        "Unable to cancel ride."
      );
    }
  };


  return (
    <main className="min-h-screen bg-orange-50/40 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
        >
          <FaArrowLeft />
          Back to Search
        </button>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">

          {/* LEFT: Driver and ride details */}
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-3">

            {/* Driver profile */}
            <div className="flex items-center gap-5 border-b border-gray-100 p-4 sm:p-5">
              <img
                src={ride.rider_profile_pic || profile}
                alt="Driver profile"
                onClick={() => navigate(`/profile/${ride.rider_id}`)}
                className="h-14 w-14 shrink-0 cursor-pointer rounded-full border border-orange-100 object-cover"
              />

              <div className="min-w-0">
                <h1
                  onClick={() => navigate(`/profile/${ride.rider_id}`)}
                  className="cursor-pointer truncate text-base font-bold text-gray-900 hover:text-orange-600"
                >
                  {ride.rider_name || "Driver"}
                </h1>

                <p className="mt-1 text-xs text-gray-500">
                  <FaCar className="mr-1 inline text-orange-500" />
                  Ride provider
                  {" · "}
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${ride.rider_id}`)}
                    className="font-semibold text-orange-600 hover:underline"
                  >
                    View profile
                  </button>
                </p>

                {Number(ride.review_count) > 0 ? (
                  <p className="mt-1 text-xs font-semibold text-amber-500">
                    <FaStar className="mr-1 inline" />
                    {ride.rating}
                    <span className="ml-1 font-normal text-gray-500">
                      ({ride.review_count} reviews)
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">No ratings yet</p>
                )}

                <p className="mt-1 break-all text-xs text-gray-500">
                  {ride.rider_email || "Contact details unavailable"}
                </p>
              </div>

              <span className="ml-auto shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                {ride.status}
              </span>
            </div>

            {/* Ride summary */}
            <div className="space-y-7 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FaClock />
                </span>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {formattedDate}, {formattedTime}
                  </p>
                  <p className="text-xs text-gray-500">
                    Departure date and time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FaMapMarkerAlt />
                </span>

                <div className="min-w-0">
                  <p className="wrap-break-word text-sm font-semibold text-gray-800">
                    {ride.from_location}
                  </p>
                  <p className="my-1 text-xs text-gray-400">to</p>
                  <p className="wrap-break-word text-sm font-semibold text-gray-800">
                    {ride.to_location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FaRupeeSign />
                </span>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{ride.price} per seat
                  </p>
                  <p className="text-xs text-gray-500">
                    Price per passenger
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FaUser />
                </span>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {ride.available_seats} seats left
                  </p>
                  <p className="text-xs text-gray-500">
                    Out of {ride.total_seats} total seats
                  </p>
                </div>
              </div>
            </div>

            {/* Route information */}
            {/* <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
              <h2 className="mb-3 text-sm font-bold text-gray-800">
                <FaRoute className="mr-2 inline text-orange-500" />
                Route Information
              </h2> */}

            {/* <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-orange-600">
                    Pickup Point
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {ride.from_location}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-orange-600">
                    Drop Point
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {ride.to_location}
                  </p>
                </div>
              </div> */}
            {/* </div> */}

            {/* Ride features: shown only if backend provides them */}
            {(ride.car_type ||
              ride.ac_available != null ||
              ride.music != null ||
              ride.pets_allowed != null ||
              ride.stopovers_allowed != null) && (
                <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
                  <h2 className="mb-3 text-sm font-bold text-gray-800">
                    Ride Preferences
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {ride.car_type && (
                      <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs text-orange-700">
                        <FaCar className="mr-1 inline" />
                        {ride.car_type}
                      </span>
                    )}

                    {ride.ac_available === 1 ||
                      ride.ac_available === true ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                        <FaCheckCircle className="mr-1 inline text-orange-500" />
                        AC Available
                      </span>
                    ) : null}

                    {ride.music === 1 || ride.music === true ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                        <FaMusic className="mr-1 inline" />
                        Music
                      </span>
                    ) : null}

                    {ride.pets_allowed === 1 ||
                      ride.pets_allowed === true ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                        <FaPaw className="mr-1 inline" />
                        Pets Allowed
                      </span>
                    ) : null}

                    {ride.stopovers_allowed === 1 ||
                      ride.stopovers_allowed === true ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                        Stopovers Allowed
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

            {ride.additional_notes && (
              <div className="border-t border-gray-100 px-4 py-4 sm:px-5">
                <h2 className="text-sm font-bold text-gray-800">
                  Additional Notes
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {ride.additional_notes}
                </p>
              </div>
            )}
          </section>

          {/* RIGHT: Map and actions */}
          <aside className="flex flex-col gap-4 lg:col-span-2">

            {/* Route map */}
            <div className="order-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:order-1">
              <iframe
                title="Ride route map"
                src={mapUrl}
                className="h-64 w-full border-0 sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                <FaMapMarkerAlt className="mr-1 inline" />
                Open route in Google Maps
              </a>
            </div>

            {/* Booking card */}
            <div className="order-1 space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:order-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Price per seat
                </span>
                <span className="text-xl font-bold text-orange-600">
                  ₹{ride.price}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">
                  Seats available
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {ride.available_seats}
                </span>
              </div>


              {isRider ? (
                isMyRide ? (
                  canCancelRide ? (
                    <button
                      type="button"
                      onClick={handleCancelRide}
                      className="w-full rounded-md bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Cancel Ride
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-md bg-gray-400 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Ride Unavailable
                    </button>
                  )
                ) : null
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRequestToJoin}
                    disabled={booking || !canBook}
                    className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {booking
                      ? "Booking..."
                      : alreadyBooked
                        ? "Already Booked ✓"
                        : ride.status !== "upcoming" || isPast
                          ? "Ride Unavailable"
                          : !hasSeats
                            ? "No Seats Available"
                            : "Book Seat"}
                  </button>

                  {alreadyBooked && (
                    <button
                      type="button"
                      onClick={() => navigate("/my-bookings")}
                      className="w-full rounded-md border border-green-500 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                      View My Booking
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
  localStorage.setItem("selectedChatId", String(ride.rider_id));
  navigate("/messages");
}}
                    className="w-full rounded-md border border-orange-300 px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                  >
                    Message Driver
                  </button>
                </>
              )}

              <p className="text-center text-xs text-gray-400">
                Please confirm the ride details before booking.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default RideDetails;