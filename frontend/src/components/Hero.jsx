import carImage from "../assets/carimage.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import usePlacesAutocomplete from "../hooks/usePlacesAutocomplete";

const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition-colors duration-200 focus:border-orange-500";

const Hero = () => {
    const navigate = useNavigate();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [activeField, setActiveField] = useState("");

    // OfferRide wala hi Google Places hook: debounce bhi hai aur
    // ride banate waqt jaisa address save hota hai, search me bhi wahi aayega.
    const { suggestions: fromSuggestions } = usePlacesAutocomplete(
        activeField === "from" ? from : ""
    );
    const { suggestions: toSuggestions } = usePlacesAutocomplete(
        activeField === "to" ? to : ""
    );

    const selectLocation = (description, field) => {
        if (field === "from") setFrom(description);
        else setTo(description);

        setActiveField("");
    };

    const handleFindRides = () => {
        if (!from.trim() || !to.trim()) {
            toast.error("Please enter both starting location and destination.");
            return;
        }

        navigate("/find-rides", {
            state: { from, to, date },
        });
    };

    const renderSuggestions = (suggestions, field) => {
        if (activeField !== field || suggestions.length === 0) return null;

        return (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {suggestions.map((place) => (
                    <li key={place.id}>
                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                selectLocation(place.description, field);
                            }}
                            className="block w-full cursor-pointer border-b border-gray-100 px-3 py-3 text-left text-sm text-gray-700 hover:bg-orange-50"
                        >
                            {place.description}
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <section
            className="relative min-h-155 bg-cover bg-center md:min-h-125"
            style={{ backgroundImage: `url(${carImage})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content: pb-10/pb-12 se search card hero ke neeche chipakta nahi, gap rehta hai */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-16 sm:pb-12">
                <div className="mb-6 w-full max-w-xl sm:mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                        Share Rides,
                        <br />
                        Save Money,
                        <br />
                        Travel Together
                    </h1>

                    <p className="mb-2 mt-2 max-w-md text-base leading-relaxed text-white md:text-lg">
                        Share your ride, save money, and travel comfortably with trusted people.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                        {/* `relative` yahan zaroori hai, tabhi suggestions input ke neeche khulte hain
                            (pehle poore white card ke neeche khul rahe the) */}
                        <div className="relative">
                            <label htmlFor="from" className="mb-1 block text-sm font-medium text-gray-700">
                                From
                            </label>
                            <input
                                id="from"
                                type="text"
                                placeholder="Enter starting location"
                                value={from}
                                onChange={(e) => {
                                    setFrom(e.target.value);
                                    setActiveField("from");
                                }}
                                onFocus={() => setActiveField("from")}
                                onBlur={() => setActiveField("")}
                                autoComplete="off"
                                className={inputClass}
                            />
                            {renderSuggestions(fromSuggestions, "from")}
                        </div>

                        <div className="relative">
                            <label htmlFor="to" className="mb-1 block text-sm font-medium text-gray-700">
                                To
                            </label>
                            <input
                                id="to"
                                type="text"
                                placeholder="Enter destination"
                                value={to}
                                onChange={(e) => {
                                    setTo(e.target.value);
                                    setActiveField("to");
                                }}
                                onFocus={() => setActiveField("to")}
                                onBlur={() => setActiveField("")}
                                autoComplete="off"
                                className={inputClass}
                            />
                            {renderSuggestions(toSuggestions, "to")}
                        </div>

                        <div>
                            <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                min={new Date().toLocaleDateString("en-CA")}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="md:self-end">
                            <button
                                type="button"
                                onClick={handleFindRides}
                                className="w-full rounded-lg bg-orange-500 px-6 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:bg-orange-600"
                            >
                                Find Rides
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;