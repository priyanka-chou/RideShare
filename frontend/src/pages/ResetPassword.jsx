import { MdOutlineLock } from "react-icons/md";
import { FaCar, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import { resetPassword } from "../services/api/authApi";


const ResetPassword = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // Verify Reset OTP page se token aayega
    const resetToken = location.state?.resetToken;


    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    // =====================================
    // RESET PASSWORD
    // =====================================

    const handleResetPassword = async () => {

        // Check reset token
        if (!resetToken) {

            toast.error(
                "Reset session expired. Please verify OTP again."
            );

            navigate("/login");

            return;
        }


        // Password validation

        if (!password.trim()) {

            toast.error(
                "Please enter your password"
            );

            return;
        }


        if (password.length < 8) {

            toast.error(
                "Password must be at least 8 characters"
            );

            return;
        }


        if (password.length > 64) {

            toast.error(
                "Password must not exceed 64 characters"
            );

            return;
        }


        // Confirm password

        if (!confirmedPassword.trim()) {

            toast.error(
                "Please confirm your password"
            );

            return;
        }


        if (password !== confirmedPassword) {

            toast.error(
                "Passwords do not match"
            );

            return;
        }


        try {

            setIsLoading(true);


            // Backend expects:
            // resetToken + password

            await resetPassword({
                resetToken,
                password
            });


            toast.success(
                "Password reset successfully!"
            );


            navigate("/login");


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            if (error.response) {

                toast.error(
                    error.response.data?.message ||
                    "Failed to reset password"
                );


            } else if (error.request) {

                toast.error(
                    "Server is not working"
                );


            } else {

                toast.error(
                    "Something went wrong"
                );

            }


        } finally {

            setIsLoading(false);

        }
    };


    return (

        <main className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center items-center">

            <div className="bg-white rounded-xl p-8 w-full max-w-md">


                {/* Header */}

                <div className="flex flex-col items-center">

                    <div className="flex items-center gap-3">

                        <FaCar className="text-orange-500 text-3xl" />

                        <h2 className="text-orange-500 text-xl font-bold">
                            RideShare
                        </h2>

                    </div>


                    <div className="h-12 w-12 text-orange-500 font-bold shrink-0 flex justify-center items-center mt-3 rounded-full bg-orange-200">

                        <MdOutlineLock />

                    </div>

                </div>


                <p className="text-xs text-gray-500 mt-8 text-center">
                    Create a new password for your account.
                </p>


                {/* Password */}

                <div className="mt-6">

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                        Password
                    </label>

                    <div className="relative">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />


                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >

                            {showPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                            }

                        </button>

                    </div>

                </div>


                {/* Confirm Password */}

                <div className="mt-4">

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                        Confirm Password
                    </label>

                    <div className="relative">

                        <input
                            type={
                                showConfirmedPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm your password"
                            value={confirmedPassword}
                            onChange={(e) =>
                                setConfirmedPassword(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />


                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() =>
                                setShowConfirmedPassword(
                                    !showConfirmedPassword
                                )
                            }
                        >

                            {showConfirmedPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                            }

                        </button>

                    </div>

                </div>


                {/* Reset Button */}

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleResetPassword}
                    className="w-full bg-orange-500 text-white mt-6 rounded-md py-2 hover:bg-orange-600 transition-colors active:scale-95 disabled:opacity-60"
                >

                    {isLoading
                        ? "Resetting..."
                        : "Reset Password"
                    }

                </button>


                {/* Back to Login */}

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-orange-500 transition-colors mt-8 flex justify-center w-full"
                >

                    ←&nbsp; Back to Login

                </button>


            </div>

        </main>
    );
};


export default ResetPassword;