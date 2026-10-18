import { useState } from "react";
import { FaCar } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { sendOtp } from "../services/api/authApi";

const SendOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [loading, setLoading] = useState(false);

    // ===============================
    // SEND OTP
    // ===============================

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Email not found. Please sign up again.");
            navigate("/sign-up");
            return;
        }

        try {
            setLoading(true);

            await sendOtp(email);

            toast.success("OTP sent successfully!");

            // OTP verification page
            navigate("/verify-otp", {
                state: {
                    email
                }
            });

        } catch (error) {
            console.error("Send OTP Error:", error);

            if (error.response) {
                toast.error(
                    error.response.data?.message ||
                    "Failed to send OTP"
                );
            } else if (error.request) {
                toast.error("Server is not working");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center items-center">

            <div className="bg-white rounded-xl p-8 w-full max-w-md flex flex-col items-center shadow-md">

                {/* Logo */}

                <div className="flex items-center gap-3">

                    <FaCar className="text-orange-500 text-3xl" />

                    <h2 className="text-orange-500 text-xl font-bold">
                        RideShare
                    </h2>

                </div>

                {/* Mail Icon */}

                <div className="h-12 w-12 text-orange-500 font-bold shrink-0 flex justify-center items-center mt-3 rounded-full bg-orange-200">

                    <FiMail />

                </div>

                {/* Description */}

                <p className="text-sm text-gray-600 mt-4 text-center">
                    We'll send a verification code to your email address.
                </p>

                {/* Email */}

                <p className="mt-2 text-xs font-semibold text-gray-500 text-center break-all">

                    Email:{" "}

                    <span className="text-gray-700">
                        {email || "Not available"}
                    </span>

                </p>

                {/* Send OTP */}

                <button
                    type="button"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white mt-6 rounded-md py-2 hover:bg-orange-600 transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSendOtp}
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>

                {/* Login */}

                <p className="text-xs text-gray-600 mt-2">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-orange-500 text-xs font-semibold hover:text-orange-600"
                    >
                        Login
                    </Link>

                </p>

                {/* Back to Signup */}

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => navigate("/sign-up")}
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors mt-8 font-medium disabled:opacity-50"
                >
                    ← Back to Signup
                </button>

            </div>

        </main>
    );
};

export default SendOtpPage;