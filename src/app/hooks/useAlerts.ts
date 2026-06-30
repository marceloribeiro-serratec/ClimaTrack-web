import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface AlertsConfig {
    email: string;
    enabled: boolean;
    cities: string[];
    lastAlertDateByCity: Record<string, string>;
}

const DEFAULT_ALERTS_CONFIG: AlertsConfig = {
    email: "",
    enabled: false,
    cities: [],
    lastAlertDateByCity: {},
};

export function useAlerts() {
    const [config, setConfig] = useLocalStorage<AlertsConfig>(
        "climatrack-alerts-config",
        DEFAULT_ALERTS_CONFIG,
    );

    const setEmail = useCallback(
        (email: string) => {
            setConfig((prev) => ({ ...prev, email }));
        },
        [setConfig],
    );

    const setEnabled = useCallback(
        (enabled: boolean) => {
            setConfig((prev) => ({ ...prev, enabled }));
        },
        [setConfig],
    );

    const addCity = useCallback(
        (city: string) => {
            setConfig((prev) => {
                if (prev.cities.includes(city) || prev.cities.length >= 3) return prev;
                return { ...prev, cities: [...prev.cities, city] };
            });
        },
        [setConfig],
    );

    const removeCity = useCallback(
        (city: string) => {
            setConfig((prev) => ({
                ...prev,
                cities: prev.cities.filter((c) => c !== city),
            }));
        },
        [setConfig],
    );

    const updateLastAlertDate = useCallback((city: string) => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        setConfig((prev) => ({ 
            ...prev, 
            lastAlertDateByCity: { ...prev.lastAlertDateByCity, [city]: today }
        }));
    }, [setConfig]);

    return {
        email: config.email,
        alertsEnabled: config.enabled,
        cities: config.cities,
        lastAlertDateByCity: config.lastAlertDateByCity,
        setEmail,
        setEnabled,
        addCity,
        removeCity,
        updateLastAlertDate,
    };
}
