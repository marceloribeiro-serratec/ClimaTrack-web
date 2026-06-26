import type { GeocodingCity } from "../types/geocoding";

export function getCityKey(city: Pick<GeocodingCity, "name" | "country" | "latitude" | "longitude">) {
    return `${city.name}-${city.country}-${city.latitude}-${city.longitude}`;
}

export function getCityLabel(city: GeocodingCity) {
    return [city.name, city.admin1].filter(Boolean).join(", ");
}

