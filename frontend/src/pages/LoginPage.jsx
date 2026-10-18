
import { FaCar, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginUser, getCurrentUser } from "../services/api/authApi";

const LoginPage = ({ setIsLoggedIn, setUser }) => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter the email");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            toast.error("Please enter a valid email");
            return;
        }

        if (!password.trim()) {
            toast.error("Please enter the password");
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

        try {
            setLoading(true);

            await loginUser({
                email: email.trim(),
                password
            });

            // Login ke baad authenticated user fetch karo
            const response = await getCurrentUser();

            const currentUser =
                response?.user ??
                response?.data?.user ??
                response?.data ??
                response;

            setUser(currentUser);
            setIsLoggedIn(true);

            toast.success("Login Successful");
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);

            // Agar login successful hua lekin /me fail hua,
            // to dobara login karne ke bajaye error dikhayenge.
            toast.error(
                error.response?.data?.message ||
                "Unable to complete login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
                <div className="mb-5 text-center">
                    <FaCar className="mx-auto mb-2 text-5xl font-bold text-orange-500" />

                    <h1 className="text-xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Login to your Account
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
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
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

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
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />

                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="size-4 accent-orange-600"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />

                            <label htmlFor="remember" className="text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        to="/sign-up"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
