type StorageKeyName = "favorites" | "history" | "theme" | "temperatureUnit";

export const STORAGE_KEYS = {
    favorites: "climatrack:favorites",
    history: "climatrack:history",
    theme: "climatrack:theme",
    temperatureUnit: "climatrack:temperature-unit",
} as const satisfies Record<StorageKeyName, string>;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
