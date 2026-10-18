
import { NavLink } from "react-router-dom";
import {
    
    FiPlusCircle,
    FiCalendar,
    FiClock,
    FiMessageSquare,
    FiSettings,
    FiSearch,
} from "react-icons/fi";
import { CarFront } from "lucide-react";

const DashboardNav = ({ user }) => {
    const navItems = [
        // { label: "My Profile", path: "/profile", icon: FiUser },

        ...(user?.role === "rider"
            ? [
                  { label: "Offer Ride", path: "/offer-ride", icon: FiPlusCircle },
                  { label: "My Rides", path: "/my-rides", icon: CarFront },
              ]
            : [
                  { label: "Find Rides", path: "/find-rides", icon: FiSearch },
                  { label: "My Bookings", path: "/my-bookings", icon: FiCalendar },
              ]),

        { label: "Ride History", path: "/ride-history", icon: FiClock },
        { label: "Messages", path: "/messages", icon: FiMessageSquare },
        { label: "Settings", path: "/settings", icon: FiSettings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white px-1 py-2 shadow-sm md:bottom-0 md:left-0 md:top-18 md:h-[calc(100dvh-72px)] md:w-56 md:border-r md:border-t-0 md:px-3 md:py-5 md:shadow-none">
            <div className="flex items-center justify-around gap-1 md:flex-col md:items-stretch md:justify-start md:gap-2">
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        aria-label={label}
                        className={({ isActive }) =>
                            `flex min-w-0 shrink-0 items-center justify-center gap-3 rounded-xl px-2 py-3 transition-colors md:justify-start md:px-4 ${
                                isActive
                                    ? "bg-orange-50 font-semibold text-orange-500"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            }`
                        }
                    >
                        <Icon className="size-5 shrink-0" />

                        <span className="hidden whitespace-nowrap text-sm md:inline">
                            {label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default DashboardNav;
