import { FaCar } from "react-icons/fa";
import { PiShieldCheckBold } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import {
    verifyOtp,
    verifyResetOtp,
    sendOtp,
    forgotPassword
} from "../services/api/authApi";

const VerifyOtpPage = ({ resetMode = false }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        ""
    ]);

    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const otpRef = useRef([]);

    // =====================================
    // VERIFY OTP
    // =====================================

    const handleOtpVerify = async () => {

        if (!email) {

            toast.error(
                resetMode
                    ? "Email not found. Please try again."
                    : "Email not found. Please sign up again."
            );

            navigate(
                resetMode
                    ? "/forgot-password"
                    : "/sign-up"
            );

            return;
        }

        const otpValue = otp.join("");

        // OTP validation
        if (!/^\d{6}$/.test(otpValue)) {

            toast.error(
                "Please enter a valid 6-digit OTP"
            );

            return;
        }

        try {

            setLoading(true);

            // =====================================
            // PASSWORD RESET OTP
            // =====================================

            if (resetMode) {

                const response = await verifyResetOtp({
                    email,
                    otp: otpValue
                });

                console.log(
                    "Reset OTP response:",
                    response
                );

                const resetToken =
                    response?.data?.resetToken;

                if (!resetToken) {

                    toast.error(
                        "Reset token was not received"
                    );

                    return;
                }

                toast.success(
                    "OTP verified successfully!"
                );

                // Go to Reset Password
                navigate("/reset-password", {
                    state: {
                        resetToken
                    }
                });

                return;
            }

            // =====================================
            // REGISTRATION OTP
            // =====================================

            await verifyOtp({
                email,
                otp: otpValue
            });

            toast.success(
                "OTP verified successfully!"
            );

            // Go to Login
            navigate("/login");

        } catch (error) {

            console.error(
                "OTP Verification Error:",
                error
            );

            if (error.response) {

                toast.error(
                    error.response.data?.message ||
                    "OTP verification failed"
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

            setLoading(false);

        }
    };


    // =====================================
    // RESEND OTP
    // =====================================

    const handleResendOtp = async () => {

        if (!email) {

            toast.error(
                resetMode
                    ? "Email not found. Please try again."
                    : "Email not found. Please sign up again."
            );

            navigate(
                resetMode
                    ? "/forgot-password"
                    : "/sign-up"
            );

            return;
        }

        try {

            setResending(true);

            // =====================================
            // RESET PASSWORD OTP
            // =====================================

            if (resetMode) {

                await forgotPassword(email);

            } else {

                // =====================================
                // REGISTRATION OTP
                // =====================================

                await sendOtp(email);
            }

            toast.success(
                "OTP sent successfully!"
            );

            // Clear old OTP
            setOtp([
                "",
                "",
                "",
                "",
                "",
                ""
            ]);

            // Focus first input
            otpRef.current[0]?.focus();

        } catch (error) {

            console.error(
                "Resend OTP Error:",
                error
            );

            if (error.response) {

                toast.error(
                    error.response.data?.message ||
                    "Failed to resend OTP"
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

            setResending(false);

        }
    };


    // =====================================
    // OTP INPUT CHANGE
    // =====================================

    const handleOtpChange = (e, index) => {

        const value = e.target.value;

        // Only numbers
        const digit = value
            .replace(/\D/g, "")
            .slice(-1);

        const updatedOtp = [...otp];

        updatedOtp[index] = digit;

        setOtp(updatedOtp);

        // Move to next input
        if (digit && index < 5) {

            otpRef.current[index + 1]?.focus();

        }
    };


    // =====================================
    // KEYBOARD HANDLING
    // =====================================

    const handleKeyDown = (e, index) => {

        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {

            otpRef.current[index - 1]?.focus();

        }
    };


    // =====================================
    // PASTE OTP
    // =====================================

    const handlePaste = (e) => {

        e.preventDefault();

        const pastedOtp = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedOtp) return;

        const updatedOtp = [
            "",
            "",
            "",
            "",
            "",
            ""
        ];

        pastedOtp
            .split("")
            .forEach((digit, index) => {

                updatedOtp[index] = digit;

            });

        setOtp(updatedOtp);

        const nextIndex = Math.min(
            pastedOtp.length,
            5
        );

        otpRef.current[nextIndex]?.focus( );
    };


    return (

        <main className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">

            <div className="bg-white rounded-xl p-8 w-full max-w-md flex flex-col items-center shadow-md">

                {/* Logo */}

                <div className="flex items-center gap-3">

                    <FaCar className="text-3xl text-orange-500" />

                    <h2 className="text-orange-500 text-xl font-bold">
                        RideShare
                    </h2>

                </div>


                {/* Shield Icon */}

                <div className="h-12 w-12 text-orange-500 font-bold shrink-0 flex justify-center items-center mt-3 rounded-full bg-orange-200">

                    <PiShieldCheckBold />

                </div>


                {/* Description */}

                <p className="text-sm text-gray-600 mt-4 text-center">

                    {resetMode
                        ? "Enter the 6-digit code sent to your email to reset your password"
                        : "Enter the 6-digit code sent to your email"
                    }

                </p>


                {/* Email */}

                <p className="mt-3 text-xs font-semibold text-gray-500 text-center break-all">

                    Email:{" "}

                    <span className="text-gray-700">
                        {email || "Email not available"}
                    </span>

                </p>


                {/* OTP Inputs */}

                <div
                    className="flex gap-2 justify-center w-full mt-8"
                    onPaste={handlePaste}
                >

                    {otp.map((digit, index) => (

                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            disabled={loading}
                            ref={(el) => {
                                otpRef.current[index] = el;
                            }}
                            onChange={(e) =>
                                handleOtpChange(
                                    e,
                                    index
                                )
                            }
                            onKeyDown={(e) =>
                                handleKeyDown(
                                    e,
                                    index
                                )
                            }
                            className="flex-1 min-w-0 max-w-12 h-12 border border-gray-300 rounded-lg text-center outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
                        />

                    ))}

                </div>


                {/* Verify Button */}

                <button
                    type="button"
                    disabled={loading}
                    onClick={handleOtpVerify}
                    className="w-full bg-orange-500 text-white mt-6 rounded-md py-2 hover:bg-orange-600 transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                    {loading
                        ? "Verifying..."
                        : "Verify OTP"
                    }

                </button>


                {/* Resend */}

                <p className="text-xs text-gray-600 mt-6">

                    Didn't receive the code?

                </p>


                <button
                    type="button"
                    disabled={resending || loading}
                    onClick={handleResendOtp}
                    className="text-orange-500 mt-2 text-xs font-bold hover:text-orange-600 disabled:opacity-50"
                >

                    {resending
                        ? "Sending..."
                        : "Resend OTP"
                    }

                </button>


                {/* Back */}

                <button
                    type="button"
                    disabled={loading || resending}
                    onClick={() =>
                        navigate(
                            resetMode
                                ? "/forgot-password"
                                : "/sign-up"
                        )
                    }
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors mt-6 font-medium disabled:opacity-50"
                >

                    ← Back to{" "}
                    {resetMode
                        ? "Forgot Password"
                        : "Signup"
                    }

                </button>

            </div>

        </main>
    );
};

export default VerifyOtpPage;