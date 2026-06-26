import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CITY } from "../constants/app.constants";
import { searchCities } from "../services/geocoding-service";
import { fetchWeatherForecast } from "../services/weather-service";
import type { GeocodingCity } from "../types/geocoding";
import type { WeatherError, WeatherViewModel } from "../types/weather";

export function useWeather() {
    const [weather, setWeather] = useState<WeatherViewModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<WeatherError | null>(null);

    const loadForecast = useCallback(async (city: GeocodingCity) => {
        const forecast = await fetchWeatherForecast(city.latitude, city.longitude);
        setWeather({ location: city, forecast });
        return city;
    }, []);

    const searchByName = useCallback(
        async (query: string) => {
            const trimmed = query.trim();
            if (trimmed.length < 2) {
                const message = "Digite ao menos 2 caracteres para buscar.";
                setError({ type: "api", message });
                throw new Error(message);
            }

            setLoading(true);
            setError(null);

            try {
                const cities = await searchCities(trimmed);
                const city = cities[0];

                if (!city) {
                    const message = "Cidade não encontrada. Tente outro nome.";
                    setError({ type: "not_found", message });
                    throw new Error(message);
                }

                await loadForecast(city);
                return city;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Não foi possível carregar os dados climáticos.";
                setError({
                    type: message.includes("não encontrada")
                        ? "not_found"
                        : "api",
                    message,
                });
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loadForecast],
    );

    const searchByCity = useCallback(
        async (city: GeocodingCity) => {
            setLoading(true);
            setError(null);

            try {
                await loadForecast(city);
                return city;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Não foi possível carregar os dados climáticos.";
                setError({ type: "api", message });
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loadForecast],
    );

    useEffect(() => {
        void searchByName(DEFAULT_CITY).catch(() => undefined);
    }, [searchByName]);

    return {
        weather,
        loading,
        error,
        searchByName,
        searchByCity,
        clearError: () => setError(null),
    };
}
