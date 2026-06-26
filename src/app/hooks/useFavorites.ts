import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../constants/storage.constants";
import { getCityKey } from "../utils/city";
import type { GeocodingCity } from "../types/geocoding";

function readFavorites(): GeocodingCity[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEYS.favorites);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? (parsed as GeocodingCity[]) : [];
    } catch {
        return [];
    }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<GeocodingCity[]>(readFavorites);

    useEffect(() => {
        window.localStorage.setItem(
            STORAGE_KEYS.favorites,
            JSON.stringify(favorites),
        );
    }, [favorites]);

    const favoriteKeys = useMemo(
        () => new Set(favorites.map((city) => getCityKey(city))),
        [favorites],
    );

    function isFavorite(city: GeocodingCity) {
        return favoriteKeys.has(getCityKey(city));
    }

    function toggleFavorite(city: GeocodingCity) {
        const key = getCityKey(city);

        setFavorites((current) => {
            const exists = current.some((item) => getCityKey(item) === key);

            if (exists) {
                return current.filter((item) => getCityKey(item) !== key);
            }

            return [city, ...current];
        });
    }

    function clearFavorites() {
        setFavorites([]);
    }

    function removeFavorite(city: GeocodingCity) {
        const key = getCityKey(city);
        setFavorites((current) => current.filter((item) => getCityKey(item) !== key));
    }

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        removeFavorite,
    };
}
