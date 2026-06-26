import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../constants/storage.constants";
import type { TemperatureUnit } from "../utils/formatTemperature";

export function useTemperatureUnit() {
    const [unit, setUnit] = useLocalStorage<TemperatureUnit>(
        STORAGE_KEYS.temperatureUnit,
        "C",
    );

    return {
        unit,
        setUnit,
    };
}
