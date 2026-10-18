import { useEffect, useState, useRef, useCallback } from "react";

import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

import RideCard from "./RideCard";

import { getAllRides } from "../services/api/rideApi";

// Backend ke RIDES_PAGE_SIZE ke barabar hona chahiye
const PAGE_SIZE = 10;

const FindRides = () => {

    const navigate = useNavigate();
    const location = useLocation();

const searchParams = location.state || {};

const initialFilters = {
    from: searchParams.from || "",
    to: searchParams.to || "",
    date: searchParams.date || "",
};



    const [filters, setFilters] = useState(initialFilters);

    const [priceRange, setPriceRange] = useState(1000);

    const [departure, setDeparture] = useState("any");

    const [seatsOnly, setSeatsOnly] = useState(false);

    const [preferences, setPreferences] = useState({

        ac: false,

        music: false,

        nonAc: false,

        quiet: false,

        pets: false,

    });

    const [sortBy, setSortBy] = useState("time");

    // Mobile/tablet par filters drawer me khulte hain
    const [showFilters, setShowFilters] = useState(false);

    const [rides, setRides] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);

    const isFetchingMore = useRef(false);
    const ridesContainerRef = useRef(null);

    const fetchRides = useCallback(async (

        currentFilters = filters,

        currentPage = 1,

        append = false

    ) => {

        if (append && isFetchingMore.current) return;

        if (append) {

            isFetchingMore.current = true;

            setLoadingMore(true);

        } else {

            setLoading(true);

            setError("");

            setPage(1);

            setHasMore(true);

        }

        try {

            const response = await getAllRides({

                ...currentFilters,

                page: currentPage,

            });

            const newRides = Array.isArray(response?.data)

                ? response.data

                : Array.isArray(response)

                    ? response

                    : [];

            setRides((previous) =>

                append ? [...previous, ...newRides] : newRides

            );

            setPage(currentPage);

            setHasMore(newRides.length === PAGE_SIZE);

        } catch (err) {

            console.error("Fetch rides error:", err);

            setError(

                err.response?.data?.message || "Failed to load rides"

            );

            if (!append) setRides([]);

        } finally {

            setLoading(false);

            setLoadingMore(false);

            if (append) {

                isFetchingMore.current = false;

            }

        }

    }, [filters]);

    useEffect(() => {
    fetchRides(initialFilters, 1, false);
}, []);

    useEffect(() => {
        const container = ridesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const nearBottom =
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 200;

            if (
                nearBottom &&
                hasMore &&
                !loading &&
                !loadingMore &&
                !isFetchingMore.current
            ) {
                fetchRides(filters, page + 1, true);
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [filters, page, hasMore, loading, loadingMore, fetchRides]);

    // If the first page does not fill the scroll area, load another page.
    // This prevents infinite scrolling from getting stuck when 2 cards are too short to scroll.
    useEffect(() => {
        const container = ridesContainerRef.current;
        if (!container || loading || loadingMore || !hasMore || error) return;

        const contentDoesNotFillContainer =
            container.scrollHeight <= container.clientHeight + 1;

        if (contentDoesNotFillContainer && rides.length > 0 && !isFetchingMore.current) {
            fetchRides(filters, page + 1, true);
        }
    }, [rides, filters, page, hasMore, loading, loadingMore, error, fetchRides]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFilters((previous) => ({ ...previous, [name]: value }));

    };

    const handleSearch = async (event) => {

        event.preventDefault();

        const cleanedFilters = {

            from: filters.from.trim(),

            to: filters.to.trim(),

            date: filters.date,

        };

        setFilters(cleanedFilters);

        setShowFilters(false);

        await fetchRides(cleanedFilters, 1, false);

    };

    const handleClear = async () => {

        const emptyFilters = { from: "", to: "", date: "" };

        setFilters(emptyFilters);

        setPriceRange(1000);

        setDeparture("any");

        setSeatsOnly(false);

        setPreferences({

            ac: false,

            music: false,

            nonAc: false,

            quiet: false,

            pets: false,

        });

        await fetchRides(emptyFilters, 1, false);

    };

    const togglePreference = (name) => {

        setPreferences((previous) => ({

            ...previous,

            [name]: !previous[name],

        }));

    };

    const filteredRides = rides

        .filter((ride) => Number(ride.price || 0) <= priceRange)

        .filter((ride) => !seatsOnly || Number(ride.available_seats || 0) > 0)

        .filter((ride) => {

            if (departure === "any") return true;

            const hour = Number(String(ride.ride_time || "00:00").slice(0, 2));

            if (departure === "morning") return hour >= 5 && hour < 12;

            if (departure === "afternoon") return hour >= 12 && hour < 17;

            return hour >= 17 && hour < 24;

        })

        .filter((ride) => {

            if (preferences.ac && !ride.ac_available) return false;

            if (preferences.music && !ride.music) return false;

            if (preferences.nonAc && ride.ac_available) return false;

            if (preferences.quiet && ride.music) return false;

            if (preferences.pets && !ride.pets_allowed) return false;

            return true;

        })

        .sort((a, b) => {

            if (sortBy === "price") {

                return Number(a.price || 0) - Number(b.price || 0);

            }

            if (sortBy === "seats") {

                return Number(b.available_seats || 0) -

                    Number(a.available_seats || 0);

            }

            return `${a.ride_date || ""} ${a.ride_time || ""}`.localeCompare(

                `${b.ride_date || ""} ${b.ride_time || ""}`

            );

        });

    const filterPanel = (
        <>

                        <div className="mb-4 flex items-center gap-2">

                            <FaSlidersH className="text-orange-500" />

                            <h2 className="font-bold text-xl text-slate-800">Filter Rides</h2>

                        </div>

                        <form onSubmit={handleSearch} className="space-y-3">

                            <div>

                                <label className="mb-1 block text-xs font-semibold text-slate-600">

                                    From

                                </label>

                                <input

                                    name="from"

                                    value={filters.from}

                                    onChange={handleChange}

                                    placeholder="Pickup location"

                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"

                                />

                            </div>

                            <div>

                                <label className="mb-1 block text-xs font-semibold text-slate-600">

                                    To

                                </label>

                                <input

                                    name="to"

                                    value={filters.to}

                                    onChange={handleChange}

                                    placeholder="Destination"

                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"

                                />

                            </div>

                            <div>

                                <label className="mb-1 block text-xs font-semibold text-slate-600">

                                    Date

                                </label>

                                <input

                                    type="date"

                                    name="date"

                                    min={new Date().toLocaleDateString("en-CA")}

                                    value={filters.date}

                                    onChange={handleChange}

                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"

                                />

                            </div>

                            <button

                                type="submit"

                                disabled={loading}

                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"

                            >

                                <FaSearch />

                                Search

                            </button>

                            <button

                                type="button"

                                onClick={handleClear}

                                disabled={loading}

                                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"

                            >

                                Clear filters

                            </button>

                        </form>

                        <div className="my-5 border-t border-slate-100" />

                        <h3 className="mb-3 text-sm font-bold text-slate-800">

                            Price Range

                        </h3>

                        <input

                            type="range"

                            min="0"

                            max="1000"

                            step="50"

                            value={priceRange}

                            onChange={(event) =>

                                setPriceRange(Number(event.target.value))

                            }

                            className="w-full accent-orange-500 "

                        />

                        <div className="flex justify-between text-xs text-slate-500">

                            <span>₹0</span>

                            <span>Up to ₹{priceRange}</span>

                        </div>

                        <div className="my-5 border-t border-slate-100" />

                        <h3 className="mb-3 text-sm font-bold text-slate-800">

                            Departure Time

                        </h3>

                        {[

                            ["any", "Any time"],

                            ["morning", "Morning (5 AM–12 PM)"],

                            ["afternoon", "Afternoon (12–5 PM)"],

                            ["evening", "Evening (5 PM–12 AM)"],

                        ].map(([value, label]) => (

                            <label key={value} className="mb-2 flex items-center gap-2 text-xs text-slate-600">

                                <input

                                    type="radio"

                                    name="departure"

                                    checked={departure === value}

                                    onChange={() => setDeparture(value)}

                                    className="accent-orange-500"

                                />

                                {label}

                            </label>

                        ))}

                        <div className="my-5 border-t border-slate-100" />

                        <h3 className="mb-3 text-sm font-bold text-slate-800">

                            Preferences

                        </h3>

                        {[

                            ["ac", "AC"],

                            ["music", "Music allowed"],

                            ["nonAc", "Non-AC"],

                            ["quiet", "Quiet ride"],

                            ["pets", "Pets friendly"],

                        ].map(([key, label]) => (

                            <label key={key} className="mb-2 flex items-center gap-2 text-xs text-slate-600">

                                <input

                                    type="checkbox"

                                    checked={preferences[key]}

                                    onChange={() => togglePreference(key)}

                                    className="accent-orange-600"

                                />

                                {label}

                            </label>

                        ))}

                        <label className="mt-4 flex items-center gap-2 text-xs text-slate-600">

                            <input

                                type="checkbox"

                                checked={seatsOnly}

                                onChange={(event) => setSeatsOnly(event.target.checked)}

                                className="accent-blue-600"

                            />

                            Seats available only

                        </label>

                    </>
    );

    return (

        <main className="h-[calc(100dvh-164px)] overflow-hidden bg-slate-50 px-3 py-2 md:px-6 md:py-3 lg:h-[calc(100dvh-72px)]">

            <div className="mx-auto flex h-full max-w-7xl flex-col">

                <div className="mb-2 shrink-0">

                    <h1 className="text-xl font-bold text-slate-900 md:mt-1 md:text-3xl">

                        Find Rides

                    </h1>

                    <p className="mt-1 hidden text-sm text-slate-500 md:block">

                        Find a comfortable and affordable ride for your journey.

                    </p>

                </div>

               <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">

                   <aside className="hidden h-full min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:block">

                        {filterPanel}

                    </aside>

                    <section className="flex h-full min-h-0 min-w-0 flex-col">

                        <button
                            type="button"
                            onClick={() => setShowFilters(true)}
                            className="mb-2 flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm lg:hidden"
                        >
                            <FaSlidersH className="text-orange-500" />
                            Search &amp; Filters
                        </button>

                        {showFilters && (
                            <div
                                className="fixed inset-0 z-200 lg:hidden"
                                role="dialog"
                                aria-modal="true"
                                aria-label="Search and filters"
                            >
                                <div
                                    className="absolute inset-0 bg-black/40"
                                    onClick={() => setShowFilters(false)}
                                />
                                <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
                                    <button
                                        type="button"
                                        aria-label="Close filters"
                                        onClick={() => setShowFilters(false)}
                                        className="mb-3 ml-auto flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
                                    >
                                        <FaTimes />
                                    </button>
                                    {filterPanel}
                                </div>
                            </div>
                        )}

                        <div className="mb-3 flex shrink-0 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:mb-4 lg:flex-wrap lg:gap-3 lg:p-4">

                            <div>

                                <h2 className="text-sm font-bold text-slate-900 lg:text-base">

                                    Available Rides

                                </h2>

                                <p className="mt-1 text-xs text-slate-500">

                                    {filteredRides.length} rides shown

                                </p>

                            </div>

                            <label className="flex items-center gap-2 text-xs text-slate-500">

                                Sort by

                                <select

                                    value={sortBy}

                                    onChange={(event) => setSortBy(event.target.value)}

                                    className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus:border-orange-500"

                                >

                                    <option value="time">Departure Time</option>

                                    <option value="price">Lowest Price</option>

                                    <option value="seats">Seats Available</option>

                                </select>

                            </label>

                        </div>

                        <div
                            ref={ridesContainerRef}
                            className="h-full min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pr-1"
                        >
                            {error && (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                    {error}
                                    <button
                                        type="button"
                                        onClick={() => fetchRides(filters, 1, false)}
                                        className="ml-2 font-semibold underline"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {loading && (
                                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                                    Loading available rides...
                                </div>
                            )}

                            {!loading && !error && filteredRides.length === 0 && (
                                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                                    <h3 className="font-semibold text-slate-800">
                                        No rides found
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or filters.
                                    </p>
                                </div>
                            )}

                            {!loading && !error && filteredRides.length > 0 && (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredRides.map((ride) => (
                                        <RideCard
                                            key={ride.id}
                                            ride={ride}
                                            onViewDetails={(rideId) =>
                                                navigate(`/ride-details/${rideId}`)
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {loadingMore && (
                                <p className="py-6 text-center text-sm text-slate-500">
                                    Loading more rides...
                                </p>
                            )}

                            {!loading && !loadingMore && !hasMore && rides.length > 0 && (
                                <p className="py-6 text-center text-xs text-slate-400">
                                    You have seen all available rides.
                                </p>
                            )}
                        </div>

</section>

                </div>

            </div>

        </main>

    );

};

export default FindRides;