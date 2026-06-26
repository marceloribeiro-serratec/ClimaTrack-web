export type TemperatureUnit = "C" | "F";

export function formatTemperature(value: number, unit: TemperatureUnit) {
    const nextValue = unit === "F" ? (value * 9) / 5 + 32 : value;
    return Math.round(nextValue);
}

export function formatTemperatureLabel(unit: TemperatureUnit) {
    return unit === "F" ? "°F" : "°C";
}

