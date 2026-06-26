export interface GeocodingCity {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    timezone?: string;
}

export interface GeocodingSearchResponse {
    results?: GeocodingCity[];
}
