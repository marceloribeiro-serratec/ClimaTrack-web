import { api } from "./api";
import { WEATHER_FORECAST_PARAMS } from "../constants/weather.constants";
import type { WeatherForecastResponse } from "../types/weather";

export async function fetchWeatherForecast(
    latitude: number,
    longitude: number,
): Promise<WeatherForecastResponse> {
    const { data } = await api.get<WeatherForecastResponse>(
        "https://api.open-meteo.com/v1/forecast",
        {
            params: {
                latitude,
                longitude,
                ...WEATHER_FORECAST_PARAMS,
            },
        },
    );

    return data;
}
