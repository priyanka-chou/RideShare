import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SendOtpPage from "./pages/SendOtpPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import EditProfile from "./pages/EditProfile";
import FindRides from "./components/FindRides";
import RideDetails from "./components/RideDetails";
import OfferRide from "./components/OfferRide";
import MyRides from "./components/MyRides";
import MyBookings from "./components/MyBookings";
import RideHistory from "./pages/RideHistory";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import Messages from "./components/Messages";
import RatingPrompt from "./components/RatingPrompt";

import { getCurrentUser } from "./services/api/authApi";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getCurrentUser();

                const currentUser =
                    response?.user ??
                    response?.data?.user ??
                    response?.data ??
                    response;

                if (currentUser && currentUser.role) {
                    setUser(currentUser);
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, []);

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="light"
            />

            {/* Ride complete hone par passenger ko rating popup (kisi bhi page par) */}
            {isLoggedIn && user?.role === "user" && <RatingPrompt />}

            <Routes>
                {/* Main layout */}
                <Route
                    element={
                        <Layout
                            isLoggedIn={isLoggedIn}
                            setIsLoggedIn={setIsLoggedIn}
                            user={user}
                            setUser={setUser}
                        />
                    }
                >
                    {/* Home: everyone */}
                    <Route path="/" element={<HomePage />} />

                    {/* Profile: Passenger and Rider */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user", "rider"]}
                            />
                        }
                    >
                        <Route path="/messages" element={<Messages />} />
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />
                        <Route
                            path="/edit-profile"
                            element={<EditProfile />}
                        />
                        {/* Kisi doosre user/rider ki public profile */}
                        <Route
                            path="/profile/:id"
                            element={<PublicProfile user={user} />}
                        />
                    </Route>

                    {/* Find Rides: Passenger and Rider */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user", "rider"]}
                            />
                        }
                    >
                        <Route
                            path="/find-rides"
                            element={<FindRides user={user} />}
                        />
                    </Route>

                    {/* My Bookings: Passenger only */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user"]}
                            />
                        }
                    >
                        <Route
                            path="/my-bookings"
                            element={<MyBookings />}
                        />


                    </Route>


                    {/* Ride History: Passenger and Rider */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user", "rider"]}
                            />
                        }
                    >
                        <Route
                            path="/ride-history"
                            element={<RideHistory user={user} />}
                        />
                    </Route>


                    {/* Rider-only pages */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["rider"]}
                            />
                        }
                    >
                        <Route
                            path="/offer-ride"
                            element={<OfferRide />}
                        />
                        <Route
                            path="/my-rides"
                            element={<MyRides />}
                        />
                    </Route>

                    {/* Ride details: Passenger and Rider */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user", "rider"]}
                            />
                        }
                    >
                        <Route
  path="/ride-details/:id"
  element={<RideDetails user={user} />}
/>
                    </Route>


                    {/* Settings: Passenger and Rider */}
                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user", "rider"]}
                            />
                        }
                    >
                        <Route
                            path="/settings"
                            element={
                                <Settings
                                    user={user}
                                    setUser={setUser}
                                    setIsLoggedIn={setIsLoggedIn}
                                />
                            }
                        />
                    </Route>


                    <Route
                        element={
                            <ProtectedRoute
                                isLoggedIn={isLoggedIn}
                                user={user}
                                allowedRoles={["user", "rider"]}
                            />
                        }
                    >
                        <Route
                            path="/help-support"
                            element={<HelpSupport />}
                        />
                    </Route>


                </Route>

                {/* Authentication pages */}
                <Route
                    path="/sign-up"
                    element={<SignupPage />}
                />

                <Route
                    path="/login"
                    element={
                        <LoginPage
                            setIsLoggedIn={setIsLoggedIn}
                            setUser={setUser}
                        />
                    }
                />

                <Route
                    path="/send-otp"
                    element={<SendOtpPage />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtpPage />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/verify-reset-otp"
                    element={<VerifyOtpPage resetMode={true} />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
            </Routes>
        </>
    );
};

export default App;