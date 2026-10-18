import { FaCar } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotPassword } from "../services/api/authApi";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // ===============================
    // FORGOT PASSWORD
    // ===============================

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        // Email validation
        if (!trimmedEmail) {
            toast.error("Please enter your email");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            toast.error("Please enter a valid email");
            return;
        }

        try {
            setLoading(true);

            await forgotPassword(trimmedEmail);

            toast.success("Password reset OTP sent successfully!");

            // Go to reset OTP page
            navigate("/verify-reset-otp", {
                state: {
                    email: trimmedEmail
                }
            });

        } catch (error) {
            console.error("Forgot Password Error:", error);

            if (error.response) {
                toast.error(
                    error.response.data?.message ||
                    "Failed to send reset OTP"
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
                <div className="h-12 w-12 text-orange-500 font-bold flex justify-center items-center mt-4 rounded-full bg-orange-200">

                    <FiMail />

                </div>

                {/* Heading */}
                <h1 className="text-xl font-bold text-gray-800 mt-5">
                    Forgot Password?
                </h1>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Enter your email address and we'll send you
                    a password reset OTP.
                </p>

                {/* Form */}
                <form
                    className="w-full mt-6"
                    onSubmit={handleForgotPassword}
                >

                    {/* Email */}
                    <label
                        htmlFor="email"
                        className="mb-1 block text-xs font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                    />

                    {/* Send OTP */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white mt-5 rounded-md py-2 hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Reset OTP"}
                    </button>

                </form>

                {/* Back to Login */}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                    className="text-sm text-orange-500 hover:text-orange-600 mt-6 font-medium"
                >
                    ← Back to Login
                </button>

            </div>

        </main>
    );
};

export default ForgotPassword;