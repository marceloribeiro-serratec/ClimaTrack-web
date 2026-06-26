export const GEOSEARCH_PARAMS = {
    count: 5,
    language: "pt",
    format: "json",
} as const;

export const WEATHER_FORECAST_PARAMS = {
    current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
    hourly:
        "temperature_2m,precipitation_probability,weather_code,wind_speed_10m",
    daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
} as const;

export const WEATHER_API_TIMEOUT_MS = 12_000 as const;

