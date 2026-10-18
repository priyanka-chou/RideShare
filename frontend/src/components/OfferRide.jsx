


import { useState } from "react";
import { FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import usePlacesAutocomplete from "../hooks/usePlacesAutocomplete";
import { createRide } from "../services/api/rideApi";

const initialFormData = {
    fromLocation: "",
    toLocation: "",
    rideDate: "",
    rideTime: "",
    totalSeats: "",
    price: "",
    carType: "Sedan",
    acAvailable: false,
    music: false,
    noSmoking: false,
    petsAllowed: false,
    stopoversAllowed: false,
    additionalNotes: "",
};

const OfferRide = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ ...initialFormData });
    const [activeField, setActiveField] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        suggestions: fromSuggestions,
        loading: fromLoading,
    } = usePlacesAutocomplete(
        activeField === "from" ? formData.fromLocation : ""
    );

    const {
        suggestions: toSuggestions,
        loading: toLoading,
    } = usePlacesAutocomplete(
        activeField === "to" ? formData.toLocation : ""
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const selectLocation = (field, description) => {
        const inputName =
            field === "from" ? "fromLocation" : "toLocation";

        setFormData((prev) => ({
            ...prev,
            [inputName]: description,
        }));

        setActiveField(null);
    };

    const renderSuggestions = (suggestions, isLoading, field) => {
        if (activeField !== field) return null;

        if (isLoading) {
            return (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-white p-3 text-sm text-gray-500 shadow-lg">
                    Searching locations...
                </div>
            );
        }

        if (!suggestions?.length) return null;

        return (
            <ul className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                {suggestions.map((place) => (
                    <li key={place.id} className="list-none">
                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                selectLocation(field, place.description);
                            }}
                            className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-orange-50"
                        >
                            {place.description}
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    const inputClass =
        "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

    const labelClass =
        "mb-1 block text-xs font-semibold text-gray-700";

    const preferences = [
        ["acAvailable", "AC Available"],
        ["music", "Music"],
        ["noSmoking", "No Smoking"],
        ["petsAllowed", "Pets Allowed"],
        ["stopoversAllowed", "Stopovers Allowed"],
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            fromLocation,
            toLocation,
            rideDate,
            rideTime,
            totalSeats,
            price,
        } = formData;

        if (
            !fromLocation.trim() ||
            !toLocation.trim() ||
            !rideDate ||
            !rideTime ||
            !totalSeats ||
            price === ""
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (
            fromLocation.trim().toLowerCase() ===
            toLocation.trim().toLowerCase()
        ) {
            toast.error("Pickup and destination cannot be the same");
            return;
        }

        if (Number(totalSeats) < 1 || Number(totalSeats) > 8) {
            toast.error("Seats must be between 1 and 8");
            return;
        }

        if (Number(price) < 0) {
            toast.error("Price cannot be negative");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                fromLocation: fromLocation.trim(),
                toLocation: toLocation.trim(),
                rideDate,
                rideTime,
                totalSeats: Number(totalSeats),
                price: Number(price),

                // Preferences sent to backend
                acAvailable: Boolean(formData.acAvailable),
                music: Boolean(formData.music),
                noSmoking: Boolean(formData.noSmoking),
                petsAllowed: Boolean(formData.petsAllowed),
                stopoversAllowed: Boolean(formData.stopoversAllowed),
                additionalNotes: formData.additionalNotes.trim(),
            };

            await createRide(payload);

            toast.success("Ride created successfully!");

            setFormData({ ...initialFormData });
            setActiveField(null);

            navigate("/my-rides");
        } catch (error) {
            console.error(
                "Create Ride Error:",
                error.response?.data || error
            );

            toast.error(
                error?.response?.data?.message ||
                    "Failed to create ride"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/40 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                {/* Heading */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <FaCar size={23} />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Create a Ride
                        </h1>
                        <p className="text-xs text-gray-500">
                            Offer a ride and share your travel cost with fellow students
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 ">
                    {/* From and To */}
                    <div className="grid grid-cols-1 gap-4  sm:grid-cols-2">
                        <div className="relative">
                            <label
                                htmlFor="fromLocation"
                                className={labelClass}
                            >
                                From
                            </label>

                            <input
                                id="fromLocation"
                                name="fromLocation"
                                type="text"
                                value={formData.fromLocation}
                                onChange={(e) => {
                                    handleChange(e);
                                    setActiveField("from");
                                }}
                                onFocus={() => setActiveField("from")}
                                placeholder="Enter pickup location"
                                autoComplete="off"
                                required
                                className={inputClass}
                            />

                            {renderSuggestions(
                                fromSuggestions,
                                fromLoading,
                                "from"
                            )}
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="toLocation"
                                className={labelClass}
                            >
                                To
                            </label>

                            <input
                                id="toLocation"
                                name="toLocation"
                                type="text"
                                value={formData.toLocation}
                                onChange={(e) => {
                                    handleChange(e);
                                    setActiveField("to");
                                }}
                                onFocus={() => setActiveField("to")}
                                placeholder="Enter destination"
                                autoComplete="off"
                                required
                                className={inputClass}
                            />

                            {renderSuggestions(
                                toSuggestions,
                                toLoading,
                                "to"
                            )}
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="rideDate"
                                className={labelClass}
                            >
                                Date
                            </label>

                            <input
                                id="rideDate"
                                type="date"
                                name="rideDate"
                                value={formData.rideDate}
                                onChange={handleChange}
                                min={new Date().toLocaleDateString("en-CA")}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="rideTime"
                                className={labelClass}
                            >
                                Departure Time
                            </label>

                            <input
                                id="rideTime"
                                type="time"
                                name="rideTime"
                                value={formData.rideTime}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Seats and Price */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="totalSeats"
                                className={labelClass}
                            >
                                Available Seats
                            </label>

                            <select
                                id="totalSeats"
                                name="totalSeats"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Select seats</option>

                                {[1, 2, 3, 4, 5, 6, 7, 8].map((seat) => (
                                    <option key={seat} value={seat}>
                                        {seat} {seat === 1 ? "Seat" : "Seats"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="price"
                                className={labelClass}
                            >
                                Price per Seat (₹)
                            </label>

                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                min="0"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Car Type and Preferences */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="carType"
                                className={labelClass}
                            >
                                Car Type (Optional)
                            </label>

                            <select
                                id="carType"
                                name="carType"
                                value={formData.carType}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="Sedan">Sedan</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="SUV">SUV</option>
                                <option value="MUV">MUV</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid gap-y-3 pt-1 sm:pt-5">
                            {preferences.map(([name, label]) => (
                                <label
                                    key={name}
                                    className="flex cursor-pointer items-center gap-2 text-xs text-gray-700"
                                >
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={Boolean(formData[name])}
                                        onChange={handleChange}
                                        className="h-4 w-4 cursor-pointer accent-orange-500"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label
                            htmlFor="additionalNotes"
                            className={labelClass}
                        >
                            Additional Notes (Optional)
                        </label>

                        <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            placeholder="e.g. specific pickup point, luggage info etc."
                            rows={3}
                            className={`${inputClass} resize-y`}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating Ride..." : "Create Ride"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OfferRide;
