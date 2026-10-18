
import { useEffect, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let placesPromise;

const loadPlaces = async () => {
    if (!placesPromise) {
        setOptions({
            key: API_KEY,
            v: "weekly",
        });

        placesPromise = importLibrary("places");
    }

    return placesPromise;
};

const usePlacesAutocomplete = (query) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchPlaces = async () => {
            if (!query.trim() || query.trim().length < 3) {
                setSuggestions([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const { AutocompleteSuggestion } = await loadPlaces();

                const { suggestions: results = [] } =
                    await AutocompleteSuggestion
                        .fetchAutocompleteSuggestions({
                            input: query,
                            includedRegionCodes: ["in"],
                        });

                setSuggestions(
                    results
                        .filter((item) => item.placePrediction)
                        .map((item) => ({
                            id: item.placePrediction.placeId,
                            description:
                                item.placePrediction.text.toString(),
                        }))
                );
            } catch (error) {
                console.error("Places autocomplete error:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchPlaces, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return { suggestions, loading };
};

export default usePlacesAutocomplete;