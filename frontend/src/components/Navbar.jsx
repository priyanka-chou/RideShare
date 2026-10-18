// import { FiMenu, FiX } from "react-icons/fi";
// import { useState } from "react";
// import { FaCar } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutUser } from "../services/api/authApi";
// import { toast } from "react-toastify";
// import profile from "../assets/avtar.avif";



// const Navbar = ({ isLoggedIn, setIsLoggedIn, user, setUser }) => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     const closeMenu = () => {
//         setIsMenuOpen(false);
//     };

//     const handleLogout = async () => {
//         try {
//             await logoutUser();

//             setUser(null);
//             setIsLoggedIn(false);
//             setIsMenuOpen(false);

//             toast.success("Logged out successfully");

//             navigate("/");
//         } catch (error) {
//             console.error("Logout error:", error);

//             toast.error(
//                 error.response?.data?.message ||
//                 "Logout failed"
//             );
//         }
//     };

//     return (
//         <nav className="sticky top-0 z-100 border-b border-gray-100 bg-white py-4 shadow-sm">

//             <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 lg:flex-row">

//                 {/* Logo + Mobile Button */}
//                 <div className="flex w-full items-center justify-between">

//                     <Link
//                         to="/"
//                         onClick={closeMenu}
//                         className="flex items-center gap-2"
//                     >
//                         <FaCar className="text-4xl text-orange-500" />

//                         <h1 className="text-2xl font-bold text-orange-500 transition-opacity hover:opacity-80">
//                             RideShare
//                         </h1>
//                     </Link>

//                     <button
//                         type="button"
//                         className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
//                         aria-label={
//                             isMenuOpen
//                                 ? "Close menu"
//                                 : "Open menu"
//                         }
//                         onClick={() =>
//                             setIsMenuOpen((prev) => !prev)
//                         }
//                     >
//                         {isMenuOpen ? (
//                             <FiX size={24} />
//                         ) : (
//                             <FiMenu size={24} />
//                         )}
//                     </button>

//                 </div>

//                 {/* Navigation */}
//                 <div
//                     className={`
//                         ${isMenuOpen ? "flex" : "hidden"}
//                         w-full
//                         flex-col
//                         items-center
//                         gap-4
//                         border-t
//                         border-gray-100
//                         py-4
//                         lg:flex
//                         lg:flex-row
//                         lg:gap-6
//                         lg:border-t-0
//                         lg:py-0
//                     `}
//                 >

//                     <Link
//                         to="/"
//                         onClick={closeMenu}
//                         className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
//                     >
//                         Home
//                     </Link>


                    
// {isLoggedIn &&
//     (user?.role === "user" || user?.role === "rider") && (
//         <Link
//             to="/find-rides"
//             onClick={closeMenu}
//             className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
//         >
//             Find Rides
//         </Link>
//     )}



//                     {isLoggedIn && user?.role === "rider" && (
//                         <Link
//                             to="/offer-ride"
//                             onClick={closeMenu}
//                             className="whitespace-nowrap font-medium text-gray-700 hover:text-orange-500"
//                         >
//                             Create Ride
//                         </Link>
//                     )}


//                     {isLoggedIn && user?.role === "rider" && (
//                         <Link
//                             to="/my-rides"
//                             onClick={closeMenu}
//                             className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
//                         >
//                             My Rides
//                         </Link>
//                     )}



//                     {isLoggedIn && user?.role === "user" && (
//                         <Link
//                             to="/my-bookings"
//                             onClick={closeMenu}
//                             className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
//                         >
//                             My Bookings
//                         </Link>
//                     )}

//                     {/* Auth */}
//                     <div className="flex flex-col items-center gap-4 lg:ml-auto lg:flex-row">

//                         {!isLoggedIn ? (
//                             <>
//                                 <Link
//                                     to="/login"
//                                     onClick={closeMenu}
//                                     className="whitespace-nowrap font-medium text-orange-500 transition-colors hover:text-orange-600"
//                                 >
//                                     Login
//                                 </Link>

//                                 <Link
//                                     to="/sign-up"
//                                     onClick={closeMenu}
//                                     className="whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 active:scale-95"
//                                 >
//                                     Sign Up
//                                 </Link>
//                             </>
//                         ) : (
//                             <>
//                                 <Link
//                                     to="/profile"
//                                     onClick={closeMenu}
//                                     className="flex items-center justify-center"
//                                     title="Profile"
//                                 >
//                                     <img
//                                         src={profile}
//                                         alt="Profile"
//                                         className="h-10 w-10 rounded-full shrink-0 border-2 border-orange-500 object-cover transition hover:scale-105"
//                                     />
//                                 </Link>

//                                 <button
//                                     type="button"
//                                     onClick={handleLogout}
//                                     className="rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 active:scale-95"
//                                 >
//                                     Logout
//                                 </button>
//                             </>
//                         )}

//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api/authApi";
import { getProfile } from "../services/api/profileApi";
import { toast } from "react-toastify";
import profile from "../assets/avtar.avif";



const Navbar = ({ isLoggedIn, setIsLoggedIn, user, setUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [avatar, setAvatar] = useState("");
    const navigate = useNavigate();

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Logged-in user ki asli profile photo load karo.
    // EditProfile se photo badalne par "profile-updated" event aata hai,
    // tab dobara load hota hai, to Navbar me photo turant update ho jaati hai.
    useEffect(() => {
        if (!isLoggedIn) {
            setAvatar("");
            return;
        }

        let active = true;

        const loadAvatar = async () => {
            try {
                const data = await getProfile();

                if (active) {
                    setAvatar(data?.profilePic || "");
                }
            } catch (error) {
                console.error("Navbar avatar load error:", error);
            }
        };

        loadAvatar();

        window.addEventListener("profile-updated", loadAvatar);

        return () => {
            active = false;
            window.removeEventListener("profile-updated", loadAvatar);
        };
    }, [isLoggedIn]);

    const handleLogout = async () => {
        try {
            await logoutUser();

            setUser(null);
            setIsLoggedIn(false);
            setIsMenuOpen(false);

            toast.success("Logged out successfully");

            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);

            toast.error(
                error.response?.data?.message ||
                "Logout failed"
            );
        }
    };

    return (
        <nav className="sticky top-0 z-100 border-b border-gray-100 bg-white py-4 shadow-sm">

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 lg:flex-row">

                {/* Logo + Mobile Button */}
                <div className="flex w-full items-center justify-between">

                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="flex items-center gap-2"
                    >
                        <FaCar className="text-4xl text-orange-500" />

                        <h1 className="text-2xl font-bold text-orange-500 transition-opacity hover:opacity-80">
                            RideShare
                        </h1>
                    </Link>

                    <button
                        type="button"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
                        aria-label={
                            isMenuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        onClick={() =>
                            setIsMenuOpen((prev) => !prev)
                        }
                    >
                        {isMenuOpen ? (
                            <FiX size={24} />
                        ) : (
                            <FiMenu size={24} />
                        )}
                    </button>

                </div>

                {/* Navigation */}
                <div
                    className={`
                        ${isMenuOpen ? "flex" : "hidden"}
                        w-full
                        flex-col
                        items-center
                        gap-4
                        border-t
                        border-gray-100
                        py-4
                        lg:flex
                        lg:flex-row
                        lg:gap-6
                        lg:border-t-0
                        lg:py-0
                    `}
                >

                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
                    >
                        Home
                    </Link>


                    
{isLoggedIn &&
    (user?.role === "user" || user?.role === "rider") && (
        <Link
            to="/find-rides"
            onClick={closeMenu}
            className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
        >
            Find Rides
        </Link>
    )}



                    {isLoggedIn && user?.role === "rider" && (
                        <Link
                            to="/offer-ride"
                            onClick={closeMenu}
                            className="whitespace-nowrap font-medium text-gray-700 hover:text-orange-500"
                        >
                            Create Ride
                        </Link>
                    )}


                    {isLoggedIn && user?.role === "rider" && (
                        <Link
                            to="/my-rides"
                            onClick={closeMenu}
                            className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
                        >
                            My Rides
                        </Link>
                    )}



                    {isLoggedIn && user?.role === "user" && (
                        <Link
                            to="/my-bookings"
                            onClick={closeMenu}
                            className="whitespace-nowrap font-medium text-gray-700 transition-colors hover:text-orange-500"
                        >
                            My Bookings
                        </Link>
                    )}

                    {/* Auth */}
                    <div className="flex flex-col items-center gap-4 lg:ml-auto lg:flex-row">

                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="whitespace-nowrap font-medium text-orange-500 transition-colors hover:text-orange-600"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/sign-up"
                                    onClick={closeMenu}
                                    className="whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={closeMenu}
                                    className="flex items-center justify-center"
                                    title="Profile"
                                >
                                    <img
                                        src={avatar || user?.profilePic || profile}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full shrink-0 border-2 border-orange-500 object-cover transition hover:scale-105"
                                    />
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 active:scale-95"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;