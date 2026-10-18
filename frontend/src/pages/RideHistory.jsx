import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  IndianRupee,
  UserRound,
  History,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../services/api/api";

const RideHistory = ({ user }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Page ko screen par fix karne ke liye (sirf cards ka area scroll hoga)
  const pageRef = useRef(null);
  const [pageInsets, setPageInsets] = useState(null);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    const TOP_FALLBACK = 90;
    const BOTTOM_FALLBACK = 74;

    // Screen ke kisi point par jo fixed/sticky bar hai usko dhundo
    const findBar = (x, y) => {
      const el = pageRef.current;
      if (el) el.style.pointerEvents = "none";

      let node = document.elementFromPoint(x, y);

      if (el) el.style.pointerEvents = "";

      while (node && node !== document.body && node !== html) {
        const position = getComputedStyle(node).position;
        if (position === "fixed" || position === "sticky") {
          return node.getBoundingClientRect();
        }
        node = node.parentElement;
      }

      return null;
    };

    const measure = () => {
      // Desktop: normal CSS height (lg:h-[calc(100dvh-72px)])
      if (window.innerWidth >= 1024) {
        setPageInsets(null);
        return;
      }

      window.scrollTo(0, 0);

      const topRect = findBar(window.innerWidth / 2, 2);
      const bottomRect = findBar(
        window.innerWidth / 2,
        window.innerHeight - 2
      );

      setPageInsets({
        top: topRect ? Math.max(topRect.bottom, 0) : TOP_FALLBACK,
        bottom: bottomRect
          ? Math.max(window.innerHeight - bottomRect.top, 0)
          : BOTTOM_FALLBACK,
      });
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const pageStyle = pageInsets
    ? {
        position: "fixed",
        top: `${pageInsets.top}px`,
        bottom: `${pageInsets.bottom}px`,
        left: 0,
        right: 0,
      }
    : undefined;

  const isRider = user?.role === "rider";

  // Fetch booking history for users and created rides for riders
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const response = isRider
        ? await api.get("/rides/my-rides")
        : await api.get("/bookings");

      const body = response?.data;

      let data =
        body?.data?.data ??
        body?.data?.bookings ??
        body?.data ??
        body?.bookings ??
        [];

      // Handle APIs that return { success, data: { rows: [...] } }
      if (!Array.isArray(data)) {
        data = data?.rows ?? data?.rides ?? data?.bookings ?? [];
      }

      setRides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch ride history error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to load ride history."
      );
      setRides([]);
    } finally {
      setLoading(false);
    }
  }, [isRider]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Cancel a user's booking
  const handleCancelBooking = async (booking) => {
    const bookingId = booking.booking_id ?? booking.id;

    const status = String(
      booking.booking_status ?? booking.status ?? ""
    ).toLowerCase();

    if (!bookingId) {
      toast.error("Booking ID not found.");
      return;
    }

    if (status !== "confirmed") {
      toast.info("Only confirmed bookings can be cancelled.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);

      await api.delete(`/bookings/${bookingId}`);

      toast.success("Booking cancelled successfully.");
      await fetchBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Display status:
  //   Rider: upcoming / completed / cancelled   (ongoing ko upcoming maana hai)
  //   User : confirmed / completed / cancelled  (booking confirmed + ride completed = completed)
  const getStatus = (item) => {
    if (isRider) {
      const rideStatus = String(
        item.status ?? item.ride_status ?? "unknown"
      ).toLowerCase();

      return rideStatus === "ongoing" ? "upcoming" : rideStatus;
    }

    const bookingStatus = String(
      item.booking_status ?? item.status ?? "unknown"
    ).toLowerCase();
    const rideStatus = String(item.ride_status ?? "").toLowerCase();

    if (bookingStatus === "cancelled" || rideStatus === "cancelled") {
      return "cancelled";
    }

    if (rideStatus === "completed") return "completed";

    return bookingStatus;
  };

  // "Active" status = rider ke liye upcoming, user ke liye confirmed
  const activeStatus = isRider ? "upcoming" : "confirmed";

  const filterOptions = [
    { label: isRider ? "All rides" : "All bookings", value: "all" },
    {
      label: isRider ? "Upcoming" : "Confirmed",
      value: activeStatus,
    },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filteredRides = rides.filter(
    (item) => filter === "all" || getStatus(item) === filter
  );

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Time not available";

    const match = String(time).match(/^(\d{1,2}):(\d{2})/);

    if (match) {
      const hours = Number(match[1]);
      const minutes = match[2];
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;

      return `${displayHours}:${minutes} ${period}`;
    }

    const parsedDate = new Date(time);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return String(time);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 py-24 text-gray-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <p>Loading your ride history...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      style={pageStyle}
      className="flex flex-col overflow-hidden bg-gray-50 px-4 pt-8 sm:px-6 lg:h-[calc(100dvh-72px)]"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
        {/* FIXED PART: heading, filters, count (scroll nahi hoga) */}
        <div className="shrink-0">
          {/* Page heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-orange-500">
                <History className="h-6 w-6" />
                <span className="font-semibold">RideShare</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                Ride History
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {isRider
                  ? "View your created rides."
                  : "View and manage your ride bookings."}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchBookings}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {filterOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === item.value
                    ? "bg-orange-500 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="mb-4 text-sm text-gray-500">
            {filteredRides.length} {isRider ? "ride" : "booking"}
            {filteredRides.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* SCROLL PART: sirf cards scroll honge */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
          {/* Empty state */}
          {filteredRides.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <History className="mx-auto mb-4 h-12 w-12 text-gray-300" />

              <h2 className="text-xl font-semibold text-gray-800">
                {rides.length === 0
                  ? isRider
                    ? "No rides created yet"
                    : "No bookings yet"
                  : "No results found"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {rides.length === 0
                  ? isRider
                    ? "Your created rides will appear here."
                    : "Your booked rides will appear here."
                  : "Try selecting a different filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredRides.map((booking, index) => {
                const itemId = isRider
                  ? booking.id ?? booking.ride_id
                  : booking.booking_id ?? booking.id;

                const status = getStatus(booking);
                const isActive = status === activeStatus;
                const isCompleted = status === "completed";
                const isCancelled = status === "cancelled";

                // Backend ka can_cancel flag (date nikal chuki ho to cancel nahi)
                const canCancel =
                  booking.can_cancel === undefined
                    ? isActive
                    : Number(booking.can_cancel) === 1;

                return (
                  <article
                    key={itemId ?? index}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Card header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
                      <div>
                        <p className="text-xs text-gray-400">
                          {isRider ? "Ride ID" : "Booking ID"}
                        </p>
                        <p className="font-semibold text-gray-800">
                          #{itemId ?? "N/A"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isActive
                            ? "bg-green-50 text-green-700"
                            : isCompleted
                            ? "bg-blue-50 text-blue-700"
                            : isCancelled
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isActive || isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isCancelled ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}

                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="px-5 py-5 sm:px-6">
                      {/* Route */}
                      <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                        <div className="flex gap-3">
                          <MapPin className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                          <div>
                            <p className="mb-1 text-xs text-gray-400">FROM</p>
                            <p className="font-semibold text-gray-800">
                              {booking.from_location || "Not available"}
                            </p>
                          </div>
                        </div>

                        <div className="hidden text-gray-300 sm:block">
                          ─────────
                        </div>

                        <div className="flex gap-3">
                          <MapPin className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
                          <div>
                            <p className="mb-1 text-xs text-gray-400">TO</p>
                            <p className="font-semibold text-gray-800">
                              {booking.to_location || "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ride details */}
                      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-400">Ride date</p>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {formatDate(booking.ride_date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-400">Departure time</p>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {formatTime(booking.ride_time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <IndianRupee className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-400">Price</p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              ₹
                              {Number(booking.price ?? 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <UserRound className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-400">
                              {isRider ? "Seats available" : "Driver"}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {isRider
                                ? booking.available_seats ?? "Not available"
                                : booking.rider_name || "Not available"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <History className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-400">
                              {isRider ? "Seats total" : "Booked on"}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {isRider
                                ? booking.total_seats ?? "Not available"
                                : formatDate(booking.booked_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cancel booking: users only, sirf confirmed + upcoming ride par */}
                      {!isRider && isActive && canCancel && (
                        <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking)}
                            disabled={cancellingId === itemId}
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === itemId ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}

                            {cancellingId === itemId
                              ? "Cancelling..."
                              : "Cancel booking"}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;