
// // import { useEffect, useState } from "react";
// // import { FiClipboard } from "react-icons/fi";

// // import MyRideCard from "./MyRideCard";
// // import {
// //   getMyRides,
// //   cancelRide,
// // } from "../services/api/rideApi";

// // const MyRides = () => {
// //   const [rides, setRides] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [cancellingId, setCancellingId] = useState(null);

// //   const fetchMyRides = async (showLoader = true) => {
// //     try {
// //       if (showLoader) {
// //         setLoading(true);
// //       }

// //       setError("");

// //       const response = await getMyRides();

// //       console.log("MY RIDES API DATA:", response?.data);

// //       setRides(
// //         Array.isArray(response?.data)
// //           ? response.data
// //           : []
// //       );
// //     } catch (error) {
// //       console.error("Fetch My Rides Error:", error);

// //       setError(
// //         error.response?.data?.message ||
// //           "Failed to load your rides"
// //       );
// //     } finally {
// //       if (showLoader) {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMyRides();
// //   }, []);

// //   const handleCancelRide = async (rideId) => {
// //     const confirmed = window.confirm(
// //       "Are you sure you want to cancel this ride?"
// //     );

// //     if (!confirmed) return;

// //     try {
// //       setCancellingId(rideId);
// //       setError("");

// //       await cancelRide(rideId);
// //       await fetchMyRides(false);
// //     } catch (error) {
// //       console.error("Cancel Ride Error:", error);

// //       setError(
// //         error.response?.data?.message ||
// //           "Failed to cancel ride"
// //       );
// //     } finally {
// //       setCancellingId(null);
// //     }
// //   };

// //   return (
// //     <main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-100 p-4 md:p-6">
// //       <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">

// //         {/* Fixed Header */}
// //         <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

// //           <header className="flex shrink-0 flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
// //             <h1 className="text-2xl font-bold text-gray-800">
// //               My Rides
// //             </h1>

// //             <div className="flex flex-wrap gap-2">
// //               <button
// //                 type="button"
// //                 className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white"
// //               >
// //                 Upcoming Rides
// //               </button>

// //               <button
// //                 type="button"
// //                 className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
// //               >
// //                 Past Rides
// //               </button>
// //             </div>
// //           </header>

// //           {/* Error Message */}
// //           {error && (
// //             <div className="mt-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //               {error}
// //             </div>
// //           )}

// //           {/* Loading */}
// //           {loading && (
// //             <div className="mt-4 shrink-0 rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
// //               Loading your rides...
// //             </div>
// //           )}

// //           {/* Empty State */}
// //           {!loading && !error && rides.length === 0 && (
// //             <div className="mt-4 shrink-0 rounded-xl bg-white p-8 text-center shadow-sm">
// //               <FiClipboard className="mx-auto text-4xl text-gray-400" />

// //               <h2 className="mt-3 font-semibold text-gray-700">
// //                 No rides found
// //               </h2>

// //               <p className="mt-1 text-sm text-gray-500">
// //                 You haven't created any rides yet.
// //               </p>
// //             </div>
// //           )}

// //           {/* Scrollable Cards Area */}
// //           {!loading && !error && rides.length > 0 && (
// //             <div
// //               className="mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pr-1"
// //               style={{ scrollbarGutter: "stable" }}
// //             >
// //               <div className="flex flex-col gap-4 pb-4">
// //                 {rides.map((ride) => (
// //                   <MyRideCard
// //                     key={ride.id}
// //                     ride={ride}
// //                     onCancel={handleCancelRide}
// //                     cancelling={cancellingId === ride.id}
// //                   />
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //         </section>
// //       </div>
// //     </main>
// //   );
// // };

// // export default MyRides;
// import { useEffect, useMemo, useState } from "react";
// import { FiClipboard } from "react-icons/fi";
// import { toast } from "react-toastify";

// import MyRideCard from "./MyRideCard";
// import {
//   getMyRides,
//   cancelRide,
//   completeRide,
// } from "../services/api/rideApi";

// const isUpcomingStatus = (status) =>
//   status === "upcoming" || status === "ongoing";

// const toTimestamp = (ride) =>
//   new Date(ride.ride_date).getTime() +
//   (Number(String(ride.ride_time || "00:00").slice(0, 2)) * 60 +
//     Number(String(ride.ride_time || "00:00").slice(3, 5))) *
//     60000;

// const MyRides = () => {
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [cancellingId, setCancellingId] = useState(null);
//   const [completingId, setCompletingId] = useState(null);
//   const [tab, setTab] = useState("upcoming");

//   const fetchMyRides = async (showLoader = true) => {
//     try {
//       if (showLoader) {
//         setLoading(true);
//       }

//       setError("");

//       const response = await getMyRides();

//       setRides(
//         Array.isArray(response?.data)
//           ? response.data
//           : []
//       );
//     } catch (error) {
//       console.error("Fetch My Rides Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to load your rides"
//       );
//     } finally {
//       if (showLoader) {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchMyRides();
//   }, []);

//   const handleCancelRide = async (rideId) => {
//     const confirmed = window.confirm(
//       "Cancel this ride? All confirmed passenger bookings will also be cancelled."
//     );

//     if (!confirmed) return;

//     try {
//       setCancellingId(rideId);
//       setError("");

//       await cancelRide(rideId);
//       toast.success("Ride cancelled");
//       await fetchMyRides(false);
//     } catch (error) {
//       console.error("Cancel Ride Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to cancel ride"
//       );
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   const handleCompleteRide = async (rideId) => {
//     const confirmed = window.confirm(
//       "Mark this ride as completed? Passengers will then be able to rate you."
//     );

//     if (!confirmed) return;

//     try {
//       setCompletingId(rideId);
//       setError("");

//       await completeRide(rideId);
//       toast.success("Ride marked as completed");
//       await fetchMyRides(false);
//     } catch (error) {
//       console.error("Complete Ride Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to complete ride"
//       );
//     } finally {
//       setCompletingId(null);
//     }
//   };

//   // Upcoming: sabse nazdeek ride pehle. Past: sabse nayi pehle.
//   const visibleRides = useMemo(() => {
//     const list = rides.filter((ride) =>
//       tab === "upcoming"
//         ? isUpcomingStatus(ride.status)
//         : !isUpcomingStatus(ride.status)
//     );

//     return [...list].sort((a, b) =>
//       tab === "upcoming"
//         ? toTimestamp(a) - toTimestamp(b)
//         : toTimestamp(b) - toTimestamp(a)
//     );
//   }, [rides, tab]);

//   const tabClass = (name) =>
//     `rounded-lg px-4 py-2 text-sm font-medium transition ${
//       tab === name
//         ? "bg-orange-500 text-white"
//         : "text-gray-600 hover:bg-gray-100"
//     }`;

//   return (
//     <main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-100 p-4 md:p-6">
//       <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">

//         <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

//           <header className="flex shrink-0 flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
//             <h1 className="text-2xl font-bold text-gray-800">
//               My Rides
//             </h1>

//             <div className="flex flex-wrap gap-2">
//               <button
//                 type="button"
//                 onClick={() => setTab("upcoming")}
//                 className={tabClass("upcoming")}
//               >
//                 Upcoming Rides
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setTab("past")}
//                 className={tabClass("past")}
//               >
//                 Past Rides
//               </button>
//             </div>
//           </header>

//           {error && (
//             <div className="mt-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {loading && (
//             <div className="mt-4 shrink-0 rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
//               Loading your rides...
//             </div>
//           )}

//           {!loading && visibleRides.length === 0 && (
//             <div className="mt-4 shrink-0 rounded-xl bg-white p-8 text-center shadow-sm">
//               <FiClipboard className="mx-auto text-4xl text-gray-400" />

//               <h2 className="mt-3 font-semibold text-gray-700">
//                 {tab === "upcoming"
//                   ? "No upcoming rides"
//                   : "No past rides"}
//               </h2>

//               <p className="mt-1 text-sm text-gray-500">
//                 {tab === "upcoming"
//                   ? "Rides you create will show up here."
//                   : "Completed and cancelled rides will show up here."}
//               </p>
//             </div>
//           )}

//           {!loading && visibleRides.length > 0 && (
//             <div
//               className="mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pr-1"
//               style={{ scrollbarGutter: "stable" }}
//             >
//               <div className="flex flex-col gap-4 pb-4">
//                 {visibleRides.map((ride) => (
//                   <MyRideCard
//                     key={ride.id}
//                     ride={ride}
//                     onCancel={handleCancelRide}
//                     cancelling={cancellingId === ride.id}
//                     onComplete={handleCompleteRide}
//                     completing={completingId === ride.id}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//         </section>
//       </div>
//     </main>
//   );
// };

// export default MyRides;



import { useEffect, useMemo, useState } from "react";
import { FiClipboard } from "react-icons/fi";
import { toast } from "react-toastify";

import MyRideCard from "./MyRideCard";
import {
  getMyRides,
  cancelRide,
  completeRide,
} from "../services/api/rideApi";

const isUpcomingStatus = (status) =>
  status === "upcoming" || status === "ongoing";

const toTimestamp = (ride) =>
  new Date(ride.ride_date).getTime() +
  (Number(String(ride.ride_time || "00:00").slice(0, 2)) * 60 +
    Number(String(ride.ride_time || "00:00").slice(3, 5))) *
    60000;

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [tab, setTab] = useState("upcoming");

  // Abhi-abhi complete hui rides: jab tak tab change na ho, ye card
  // Upcoming tab me hi rahega aur green "Completed" button dikhega
  const [justCompleted, setJustCompleted] = useState([]);

  const fetchMyRides = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const response = await getMyRides();

      setRides(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Fetch My Rides Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your rides"
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleCancelRide = async (rideId) => {
    const confirmed = window.confirm(
      "Cancel this ride? All confirmed passenger bookings will also be cancelled."
    );

    if (!confirmed) return;

    try {
      setCancellingId(rideId);
      setError("");

      await cancelRide(rideId);
      toast.success("Ride cancelled");
      await fetchMyRides(false);
    } catch (error) {
      console.error("Cancel Ride Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to cancel ride"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleCompleteRide = async (rideId) => {
    const confirmed = window.confirm(
      "Mark this ride as completed? Passengers will then be able to rate you."
    );

    if (!confirmed) return;

    try {
      setCompletingId(rideId);
      setError("");

      await completeRide(rideId);

      // Card abhi isi tab me green "Completed" button ke saath dikhega
      setJustCompleted((previous) => [...previous, rideId]);

      toast.success("Ride marked as completed");
      await fetchMyRides(false);
    } catch (error) {
      console.error("Complete Ride Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to complete ride"
      );
    } finally {
      setCompletingId(null);
    }
  };

  const changeTab = (name) => {
    setTab(name);
    setJustCompleted([]);
  };

  // Upcoming: sabse nazdeek ride pehle. Past: sabse nayi pehle.
  const visibleRides = useMemo(() => {
    const belongsToUpcoming = (ride) =>
      isUpcomingStatus(ride.status) || justCompleted.includes(ride.id);

    const list = rides.filter((ride) =>
      tab === "upcoming"
        ? belongsToUpcoming(ride)
        : !belongsToUpcoming(ride)
    );

    return [...list].sort((a, b) =>
      tab === "upcoming"
        ? toTimestamp(a) - toTimestamp(b)
        : toTimestamp(b) - toTimestamp(a)
    );
  }, [rides, tab, justCompleted]);

  const tabClass = (name) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      tab === name
        ? "bg-orange-500 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-100 p-4 md:p-6">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">

        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

          <header className="flex shrink-0 flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              My Rides
            </h1>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => changeTab("upcoming")}
                className={tabClass("upcoming")}
              >
                Upcoming Rides
              </button>

              <button
                type="button"
                onClick={() => changeTab("past")}
                className={tabClass("past")}
              >
                Past Rides
              </button>
            </div>
          </header>

          {error && (
            <div className="mt-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-4 shrink-0 rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
              Loading your rides...
            </div>
          )}

          {!loading && visibleRides.length === 0 && (
            <div className="mt-4 shrink-0 rounded-xl bg-white p-8 text-center shadow-sm">
              <FiClipboard className="mx-auto text-4xl text-gray-400" />

              <h2 className="mt-3 font-semibold text-gray-700">
                {tab === "upcoming"
                  ? "No upcoming rides"
                  : "No past rides"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {tab === "upcoming"
                  ? "Rides you create will show up here."
                  : "Completed and cancelled rides will show up here."}
              </p>
            </div>
          )}

          {!loading && visibleRides.length > 0 && (
            <div
              className="mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pr-1"
              style={{ scrollbarGutter: "stable" }}
            >
              <div className="flex flex-col gap-4 pb-4">
                {visibleRides.map((ride) => (
                  <MyRideCard
                    key={ride.id}
                    ride={ride}
                    onCancel={handleCancelRide}
                    cancelling={cancellingId === ride.id}
                    onComplete={handleCompleteRide}
                    completing={completingId === ride.id}
                  />
                ))}
              </div>
            </div>
          )}

        </section>
      </div>
    </main>
  );
};

export default MyRides;