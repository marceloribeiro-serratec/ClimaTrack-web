import type { GeocodingCity } from "./geocoding";

export interface WeatherCurrentData {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
}

export interface WeatherHourlyData {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
}

export interface WeatherDailyData {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
}

export interface WeatherForecastResponse {
    current: WeatherCurrentData;
    hourly: WeatherHourlyData;
    daily: WeatherDailyData;
}

export interface WeatherViewModel {
    location: GeocodingCity;
    forecast: WeatherForecastResponse;
}

export interface WeatherError {
    type: "not_found" | "api";
    message: string;
}
