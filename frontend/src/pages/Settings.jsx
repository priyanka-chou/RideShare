
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Settings as SettingsIcon,
    UserRound,
    ShieldCheck,
    LogOut,
    ChevronRight,
    Bell,
    CircleHelp,
    RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../services/api/api";

const Settings = ({ user, setIsLoggedIn, setUser }) => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState(true);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [savingNotifications, setSavingNotifications] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Load notification preference from backend
    const loadNotifications = useCallback(async () => {
        try {
            const response = await api.get("/settings/notifications");
            const body = response.data;

            const settings =
                body?.data?.data ??
                body?.data ??
                body;

            if (typeof settings?.notificationsEnabled === "boolean") {
                setNotifications(settings.notificationsEnabled);
            }
        } catch (error) {
            console.error("Load notifications error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load notification settings."
            );
        } finally {
            setLoadingNotifications(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Save notification preference to database
    const handleNotificationToggle = async () => {
        if (savingNotifications || loadingNotifications) return;

        const previousValue = notifications;
        const nextValue = !previousValue;

        setNotifications(nextValue);
        setSavingNotifications(true);

        try {
            await api.put("/settings/notifications", {
                enabled: nextValue,
            });

            toast.success("Notification preference saved.");
        } catch (error) {
            console.error("Save notifications error:", error);

            setNotifications(previousValue);

            toast.error(
                error.response?.data?.message ||
                "Unable to save notification settings."
            );
        } finally {
            setSavingNotifications(false);
        }
    };

    // Logout through existing authentication API
    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await api.post("/auth/logout");

            localStorage.removeItem("selectedChatId");

            // Remove token only if your application stores it here
            localStorage.removeItem("token");

            setIsLoggedIn?.(false);
            setUser?.(null);

            toast.success("Logged out successfully!");
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to log out. Please try again."
            );
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                        <SettingsIcon size={27} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                            Settings
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage your RideShare account and preferences.
                        </p>
                    </div>
                </div>

                {/* Account Details */}
                <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <UserRound size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold text-slate-900">
                                Account Details
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Your personal account information.
                            </p>

                            <div className="mt-5 space-y-3 text-sm">
                                <div>
                                    <p className="text-slate-500">Full Name</p>
                                    <p className="mt-1 wrap-break-word font-medium text-slate-800">
                                        {user?.name ||
                                            user?.fullname ||
                                            "Not available"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Email Address</p>
                                    <p className="mt-1 wrap-break-word font-medium text-slate-800">
                                        {user?.email || "Not available"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Account Role</p>
                                    <p className="mt-1 font-medium capitalize text-slate-800">
                                        {user?.role || "User"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/edit-profile")}
                                className="mt-5 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                            <Bell size={23} />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-semibold text-slate-900">
                                Notifications
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Control your notification preferences.
                            </p>

                            {savingNotifications && (
                                <p className="mt-1 text-xs text-orange-600">
                                    Saving preference...
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-label="Enable notifications"
                            aria-checked={notifications}
                            disabled={
                                loadingNotifications ||
                                savingNotifications
                            }
                            onClick={handleNotificationToggle}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-wait disabled:opacity-60 ${
                                notifications
                                    ? "bg-orange-500"
                                    : "bg-slate-300"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                                    notifications ? "left-5" : "left-0.5"
                                }`}
                            />
                        </button>

                        {loadingNotifications && (
                            <RefreshCw
                                size={16}
                                className="animate-spin text-slate-400"
                            />
                        )}
                    </div>
                </section>

                {/* Security */}
                <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-green-100 p-3 text-green-700">
                            <ShieldCheck size={23} />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-semibold text-slate-900">
                                Security
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Keep your account secure. Use the password
                                recovery option if you need to reset your password.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="mt-4 flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Reset Password
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Help & Support */}
                <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                            <CircleHelp size={23} />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-semibold text-slate-900">
                                Help &amp; Support
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Need help using RideShare? Contact your
                                project support team.
                            </p>
                            
<button
    type="button"
    onClick={() => navigate("/help-support")}
    className="mt-4 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
>
    Open Help & Support
</button>

                        </div>
                    </div>
                </section>

                {/* Logout */}
                <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="rounded-xl bg-red-100 p-3 text-red-600">
                            <LogOut size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold text-slate-900">
                                Log Out
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Sign out of your current account.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loggingOut && (
                                <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                />
                            )}

                            {loggingOut ? "Logging out..." : "Logout"}
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
};

export default Settings;
