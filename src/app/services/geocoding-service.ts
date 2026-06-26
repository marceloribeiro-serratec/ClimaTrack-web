import { api } from "./api";
import { GEOSEARCH_PARAMS } from "../constants/weather.constants";
import type { GeocodingCity, GeocodingSearchResponse } from "../types/geocoding";

export async function searchCities(query: string): Promise<GeocodingCity[]> {
    const { data } = await api.get<GeocodingSearchResponse>(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
            params: {
                name: query,
                ...GEOSEARCH_PARAMS,
            },
        },
    );

    return data.results ?? [];
}
