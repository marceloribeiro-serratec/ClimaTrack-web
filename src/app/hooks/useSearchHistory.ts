import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../constants/storage.constants";
import { getCityKey } from "../utils/city";
import type { GeocodingCity } from "../types/geocoding";
import { HISTORY_LIMIT } from "../constants/app.constants";

export function useSearchHistory() {
    const [history, setHistory] = useLocalStorage<GeocodingCity[]>(
        STORAGE_KEYS.history,
        [],
    );

    function addSearch(city: GeocodingCity) {
        const key = getCityKey(city);
        setHistory((current) => [
            city,
            ...current.filter((item) => getCityKey(item) !== key),
        ].slice(0, HISTORY_LIMIT));
    }

    function removeSearch(city: GeocodingCity) {
        const key = getCityKey(city);
        setHistory((current) => current.filter((item) => getCityKey(item) !== key));
    }

    function clearHistory() {
        setHistory([]);
    }

    return {
        history,
        addSearch,
        removeSearch,
        clearHistory,
    };
}
