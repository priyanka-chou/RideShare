// import Navbar from "../components/Navbar";
// import coverImage from "../assets/coverImage.jpeg";
// import profile from "../assets/avtar.avif";

// import { useEffect, useState } from "react";
// import { getProfile } from "../services/api/profileApi";
// import { toast } from "react-toastify";

// import {
//     FaUserGraduate,
//     FaUniversity,
//     FaLaptopCode,
//     FaRegCalendarAlt,
//     FaPhone
// } from "react-icons/fa";

// import { useNavigate } from "react-router-dom";


// const Profile = ({ isLoggedIn, setIsLoggedIn }) => {


    

//     const navigate = useNavigate();

//     const [profileData, setProfileData] = useState(null);
//     const [loading, setLoading] = useState(true);


//     // ===============================
//     // FETCH PROFILE
//     // ===============================

//     useEffect(() => {

//         const fetchProfile = async () => {

//             try {

//                 const data = await getProfile();

//                 setProfileData(data);

//                 console.log("Profile Data:", data);

//             } catch (error) {

//                 console.log("Profile fetch error:", error);

//                 toast.error(
//                     error.response?.data?.message ||
//                     "Failed to fetch profile"
//                 );

//             } finally {

//                 setLoading(false);

//             }

//         };

//         fetchProfile();

//     }, []);


//     // ===============================
//     // EDIT PROFILE
//     // ===============================

//     const handleEditButton = () => {
//         navigate("/edit-profile");
//     };


//     // ===============================
//     // LOADING
//     // ===============================

//     if (loading) {

//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 Loading profile...
//             </div>
//         );

//     }


//     // ===============================
//     // PROFILE NOT FOUND
//     // ===============================

//     if (!profileData) {

//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 Profile not found
//             </div>
//         );

//     }


//     return (
//         <>

            


//             <main className="min-h-screen p-4 md:p-6 bg-gray-100">

//                 <div className="rounded-xl overflow-hidden mx-auto max-w-6xl shadow-sm bg-white">


//                     {/* ===============================
//                         COVER IMAGE
//                     =============================== */}

                    
// <div
//   className="h-48 bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${profileData.coverImage || coverImage})`,
//   }}
// />



//                     {/* ===============================
//                         PROFILE HEADER
//                     =============================== */}

//                     <div className="px-6 flex flex-col gap-4 sm:flex-row sm:justify-between">


//                         {/* Profile Image + Name */}

//                         <div className="flex">

                            
// <img
//   src={profileData.profilePic || profile}
//   alt="Profile"
//   className="size-32 rounded-full border-4 border-white object-cover -mt-14 relative"
// />



//                             <div className="p-4">

//                                 <h2 className="text-2xl font-bold text-gray-800">
//                                     {profileData.name}
//                                 </h2>


//                                 <p className="text-sm text-gray-500">

//                                     <span className="text-yellow-500">
//                                         ★{" "}
//                                         {Number(
//                                             profileData.average_rating
//                                         ).toFixed(1)}
//                                     </span>

//                                     <span className="text-gray-400 ml-1">
//                                         ({profileData.total_ratings} ratings)
//                                     </span>

//                                 </p>

//                             </div>

//                         </div>


//                         {/* Edit Button */}

//                         <div className="p-6">

//                             <button
//                                 type="button"
//                                 className="border rounded-md px-4 py-2 text-sm bg-orange-500 text-white active:scale-90 hover:bg-orange-600 transition"
//                                 onClick={handleEditButton}
//                             >
//                                 Edit Profile
//                             </button>

//                         </div>

//                     </div>


//                     {/* ===============================
//                         PROFILE DETAILS
//                     =============================== */}

//                     <div className="grid grid-cols-1 md:grid-cols-[400px_minmax(0,1fr)]">


//                         {/* LEFT SIDE */}

//                         <div className="px-12 py-4">


//                             {/* Role */}

//                             <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

//                                 <FaUserGraduate className="text-gray-500" />

//                                 <span>
//                                     {profileData.role === "user"
//                                         ? "Student"
//                                         : profileData.role}
//                                 </span>

//                             </div>


//                             {/* University */}

//                             <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

//                                 <FaUniversity className="text-gray-500" />

//                                 <span>
//                                     {profileData.university ||
//                                         "University not added"}
//                                 </span>

//                             </div>


//                             {/* Course */}

//                             <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

//                                 <FaLaptopCode className="text-gray-500" />

//                                 <span>
//                                     {profileData.course ||
//                                         "Course not added"}
//                                 </span>

//                             </div>


//                             {/* Member Since */}

//                             <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

//                                 <FaRegCalendarAlt className="text-gray-500" />

//                                 <span>
//                                     Member since{" "}
//                                     {profileData.created_at
//                                         ? new Date(
//                                             profileData.created_at
//                                         ).toLocaleDateString()
//                                         : "Not available"}
//                                 </span>

//                             </div>


//                             {/* Year */}

//                             <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

//                                 <FaRegCalendarAlt className="text-gray-500" />

//                                 <span>
//                                     {profileData.year ||
//                                         "Year not added"}
//                                 </span>

//                             </div>


//                             {/* Phone */}

//                             <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

//                                 <FaPhone className="text-gray-500" />

//                                 <span>
//                                     {profileData.phone ||
//                                         "Phone not added"}
//                                 </span>

//                             </div>

//                         </div>


//                         {/* RIGHT SIDE */}

//                         <div>


//                             {/* ===============================
//                                 RIDE STATS
//                             =============================== */}

//                             <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">


//                                 {/* Rides Taken */}

//                                 <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

//                                     <h3 className="text-2xl font-bold text-gray-800">
//                                         {profileData.rides_taken}
//                                     </h3>

//                                     <p className="text-sm text-gray-500">
//                                         Rides Taken
//                                     </p>

//                                 </div>


//                                 {/* Rides Offered */}

//                                 <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

//                                     <h3 className="text-2xl font-bold text-gray-800">
//                                         {profileData.total_rides}
//                                     </h3>

//                                     <p className="text-sm text-gray-500">
//                                         Rides Offered
//                                     </p>

//                                 </div>


//                                 {/* Average Rating */}

//                                 <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

//                                     <h3 className="text-2xl font-bold text-gray-800">
//                                         {Number(
//                                             profileData.average_rating
//                                         ).toFixed(1)}
//                                     </h3>

//                                     <p className="text-sm text-gray-500">
//                                         Average Rating
//                                     </p>

//                                 </div>

//                             </div>


//                             {/* ===============================
//                                 ABOUT
//                             =============================== */}

//                             <div className="px-6 py-4">

//                                 <h2 className="text-xl font-bold text-gray-800">
//                                     About
//                                 </h2>

//                                 <p className="mt-2 text-sm text-gray-600 leading-6">
//                                     {profileData.bio ||
//                                         "No bio added yet"}
//                                 </p>

//                             </div>


//                             {/* ===============================
//                                 REVIEWS
//                             =============================== */}

//                             <div className="px-6 py-4">

//                                 <h2 className="text-xl font-bold text-gray-800">
//                                     Reviews
//                                 </h2>


//                                 <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

//                                     <div className="flex items-center justify-between">

//                                         <h3 className="font-semibold text-gray-800">
//                                             {profileData.name}
//                                         </h3>

//                                         <span className="text-yellow-500">
//                                             ★{" "}
//                                             {Number(
//                                                 profileData.average_rating
//                                             ).toFixed(1)}
//                                         </span>

//                                     </div>


//                                     <p className="mt-2 text-sm text-gray-600 leading-6">
//                                         Great ride experience. Very friendly
//                                         and punctual.
//                                     </p>

//                                 </div>

//                             </div>

//                         </div>

//                     </div>

//                 </div>

//             </main>

//         </>
//     );
// };


// export default Profile;

import Navbar from "../components/Navbar";
import coverImage from "../assets/coverImage.jpeg";
import profile from "../assets/avtar.avif";

import { useEffect, useState } from "react";
import { getProfile } from "../services/api/profileApi";
import { getRatingsByUser } from "../services/api/ratingApi";
import { toast } from "react-toastify";

import {
    FaUserGraduate,
    FaUniversity,
    FaLaptopCode,
    FaRegCalendarAlt,
    FaPhone
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


const Profile = ({ isLoggedIn, setIsLoggedIn }) => {


    

    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);


    // ===============================
    // FETCH PROFILE
    // ===============================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const data = await getProfile();

                setProfileData(data);

                // Is user ko jo ratings/reviews mile hain (rider ke roop me)
                try {
                    const res = await getRatingsByUser(data.id);
                    setReviews(Array.isArray(res?.data) ? res.data : []);
                } catch (reviewError) {
                    console.log("Reviews fetch error:", reviewError);
                    setReviews([]);
                }

                console.log("Profile Data:", data);

            } catch (error) {

                console.log("Profile fetch error:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to fetch profile"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    // Rating / Rides Offered / Reviews sirf rider ke liye (passenger ko koi rate nahi karta)
    const isRider = profileData?.role === "rider";

    // ===============================
    // EDIT PROFILE
    // ===============================

    const handleEditButton = () => {
        navigate("/edit-profile");
    };


    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );

    }


    // ===============================
    // PROFILE NOT FOUND
    // ===============================

    if (!profileData) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Profile not found
            </div>
        );

    }


    return (
        <>

            


            <main className="min-h-screen p-4 md:p-6 bg-gray-100">

                <div className="rounded-xl overflow-hidden mx-auto max-w-6xl shadow-sm bg-white">


                    {/* ===============================
                        COVER IMAGE
                    =============================== */}

                    
<div
  className="h-48 bg-cover bg-center"
  style={{
    backgroundImage: `url(${profileData.coverImage || coverImage})`,
  }}
/>



                    {/* ===============================
                        PROFILE HEADER
                    =============================== */}

                    <div className="px-6 flex flex-col gap-4 sm:flex-row sm:justify-between">


                        {/* Profile Image + Name */}

                        <div className="flex min-w-0">

                            
<img
  src={profileData.profilePic || profile}
  alt="Profile"
  className="size-24 shrink-0 rounded-full border-4 border-white object-cover -mt-12 relative sm:size-32 sm:-mt-14"
/>



                            <div className="min-w-0 p-4">

                                <h2 className="truncate text-2xl font-bold text-gray-800">
                                    {profileData.name}
                                </h2>


                                {isRider && (
                                <p className="text-sm text-gray-500">

                                    {Number(profileData.total_ratings) > 0 ? (
                                        <>
                                            <span className="text-yellow-500">
                                                ★ {Number(profileData.average_rating).toFixed(1)}
                                            </span>
                                            <span className="text-gray-400 ml-1">
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


                        {/* Edit Button */}

                        <div className="p-6">

                            <button
                                type="button"
                                className="border rounded-md px-4 py-2 text-sm bg-orange-500 text-white active:scale-90 hover:bg-orange-600 transition"
                                onClick={handleEditButton}
                            >
                                Edit Profile
                            </button>

                        </div>

                    </div>


                    {/* ===============================
                        PROFILE DETAILS
                    =============================== */}

                    <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)]">


                        {/* LEFT SIDE */}

                        <div className="px-6 py-4 md:px-8 lg:px-12">


                            {/* Role */}

                            <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

                                <FaUserGraduate className="text-gray-500" />

                                <span>
                                    {profileData.role === "user"
                                        ? "Student"
                                        : profileData.role}
                                </span>

                            </div>


                            {/* University */}

                            <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

                                <FaUniversity className="text-gray-500" />

                                <span>
                                    {profileData.university ||
                                        "University not added"}
                                </span>

                            </div>


                            {/* Course */}

                            <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

                                <FaLaptopCode className="text-gray-500" />

                                <span>
                                    {profileData.course ||
                                        "Course not added"}
                                </span>

                            </div>


                            {/* Member Since */}

                            <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

                                <FaRegCalendarAlt className="text-gray-500" />

                                <span>
                                    Member since{" "}
                                    {profileData.created_at
                                        ? new Date(
                                            profileData.created_at
                                        ).toLocaleDateString()
                                        : "Not available"}
                                </span>

                            </div>


                            {/* Year */}

                            <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

                                <FaRegCalendarAlt className="text-gray-500" />

                                <span>
                                    {profileData.year ||
                                        "Year not added"}
                                </span>

                            </div>


                            {/* Phone */}

                            <div className="mt-3 flex items-center gap-3 text-md text-gray-600">

                                <FaPhone className="text-gray-500" />

                                <span>
                                    {profileData.phone ||
                                        "Phone not added"}
                                </span>

                            </div>

                        </div>


                        {/* RIGHT SIDE */}

                        <div>


                            {/* ===============================
                                RIDE STATS
                            =============================== */}

                            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">


                                {/* Rides Taken (passenger only) */}

                                {!isRider && (
                                <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {profileData.rides_taken}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Rides Taken
                                    </p>

                                </div>
                                )}


                                {/* Total Spent (passenger only) */}

                                {!isRider && (
                                <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        ₹{Number(profileData.total_spent || 0).toLocaleString("en-IN")}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Total Spent
                                    </p>

                                </div>
                                )}


                                {/* Upcoming Rides (passenger only) */}

                                {!isRider && (
                                <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {profileData.upcoming_rides ?? 0}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Upcoming Rides
                                    </p>

                                </div>
                                )}


                                {/* Rides Offered (rider only) */}

                                {isRider && (
                                <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {profileData.total_rides}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Rides Offered
                                    </p>

                                </div>
                                )}


                                {/* Rides Completed (rider only) */}

                                {isRider && (
                                <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {profileData.rides_completed ?? 0}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Rides Completed
                                    </p>

                                </div>
                                )}


                                {/* Average Rating (rider only) */}

                                {isRider && (
                                <div className="rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {Number(profileData.total_ratings) > 0
                                            ? Number(profileData.average_rating).toFixed(1)
                                            : "–"}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Average Rating
                                    </p>

                                </div>
                                )}

                            </div>


                            {/* ===============================
                                ABOUT
                            =============================== */}

                            <div className="px-6 py-4">

                                <h2 className="text-xl font-bold text-gray-800">
                                    About
                                </h2>

                                <p className="mt-2 text-sm text-gray-600 leading-6">
                                    {profileData.bio ||
                                        "No bio added yet"}
                                </p>

                            </div>


                            {/* ===============================
                                REVIEWS
                            =============================== */}

                            {isRider && (
                            <div className="px-6 py-4">

                                <h2 className="text-xl font-bold text-gray-800">
                                    Reviews
                                </h2>


                                {reviews.length === 0 ? (
                                    <p className="mt-3 text-sm text-gray-500">
                                        No reviews yet.
                                    </p>
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
                                                    <p className="mt-2 text-sm text-gray-600 leading-6">
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

            </main>

        </>
    );
};


export default Profile;