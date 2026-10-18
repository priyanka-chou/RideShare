
import { useState } from "react";
import { FaCar, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerUser } from "../services/api/authApi";

const SignupPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [role, setRole] = useState("user");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        const cleanName = name.trim();
        const cleanEmail = email.trim();

        // Name validation
        if (!cleanName) {
            toast.error("Please enter your name");
            return;
        }

        // Email validation
        if (!cleanEmail) {
            toast.error("Please enter your email");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
            toast.error("Please enter a valid email");
            return;
        }

        // Password validation
        if (!password) {
            toast.error("Please enter your password");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password.length > 64) {
            toast.error("Password must not exceed 64 characters");
            return;
        }

        // Confirm password validation
        if (!confirmedPassword) {
            toast.error("Please confirm your password");
            return;
        }

        if (password !== confirmedPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Role validation
        if (!["user", "rider"].includes(role)) {
            toast.error("Please select a valid role");
            return;
        }

        try {
            setLoading(true);

            const data = await registerUser({
                name: cleanName,
                email: cleanEmail,
                password,
                role
            });

            console.log("Register response:", data);

            toast.success("Signup successful!");

            // Existing OTP verification flow
            navigate("/send-otp", {
                state: {
                    email: cleanEmail
                }
            });
        } catch (error) {
            console.error("Sign Up Error:", error);

            if (error.response) {
                const message =
                    error.response.data?.message || "";

                // Registration is already pending OTP verification
                if (
                    error.response.status === 409 &&
                    message.toLowerCase().includes("pending")
                ) {
                    toast.info(
                        "Registration already pending. Please verify your OTP."
                    );

                    navigate("/send-otp", {
                        state: {
                            email: cleanEmail
                        }
                    });

                    return;
                }

                // Email already registered
                if (error.response.status === 409) {
                    toast.error(
                        message ||
                        "Email is already registered. Please login."
                    );

                    navigate("/login");
                    return;
                }

                toast.error(message || "Sign Up Failed");
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">

                {/* Header */}
                <div className="mb-5 text-center">
                    <FaCar className="mx-auto mb-2 text-5xl font-bold text-orange-500" />

                    <h1 className="text-xl font-bold text-gray-900">
                        Create Account
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Join RideShare today
                    </p>
                </div>

                {/* Signup Form */}
                <form className="space-y-5" onSubmit={handleSignup}>

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-xs font-medium text-gray-700"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
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
                            autoComplete="email"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

                    {/* Role Selection */}
                    <fieldset>
                        <legend className="mb-2 block text-sm font-medium text-gray-700">
                            I want to join as
                        </legend>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                aria-pressed={role === "user"}
                                onClick={() => setRole("user")}
                                className={`rounded-lg border p-3 text-sm transition ${
                                    role === "user"
                                        ? "border-orange-500 bg-orange-50 text-orange-600 ring-1 ring-orange-500"
                                        : "border-gray-300 text-gray-700 hover:border-orange-300"
                                }`}
                            >
                                <span className="block font-semibold">
                                    Passenger
                                </span>
                                <span className="mt-1 block text-xs">
                                    Search & book rides
                                </span>
                            </button>

                            <button
                                type="button"
                                aria-pressed={role === "rider"}
                                onClick={() => setRole("rider")}
                                className={`rounded-lg border p-3 text-sm transition ${
                                    role === "rider"
                                        ? "border-orange-500 bg-orange-50 text-orange-600 ring-1 ring-orange-500"
                                        : "border-gray-300 text-gray-700 hover:border-orange-300"
                                }`}
                            >
                                <span className="block font-semibold">
                                    Rider
                                </span>
                                <span className="mt-1 block text-xs">
                                    Offer rides
                                </span>
                            </button>
                        </div>
                    </fieldset>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-xs font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmedPassword"
                            className="mb-1 block text-xs font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                id="confirmedPassword"
                                type={
                                    showConfirmedPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={confirmedPassword}
                                onChange={(e) =>
                                    setConfirmedPassword(e.target.value)
                                }
                                autoComplete="new-password"
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <button
                                type="button"
                                aria-label={
                                    showConfirmedPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() =>
                                    setShowConfirmedPassword((prev) => !prev)
                                }
                            >
                                {showConfirmedPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-4 text-center text-xs text-gray-500">
                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;

