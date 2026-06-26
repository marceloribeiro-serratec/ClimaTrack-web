import { useEffect, useState } from "react";
import type { StorageKey } from "../constants/storage.constants";

export function useLocalStorage<T>(key: StorageKey, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        const storedValue = window.localStorage.getItem(key);
        if (storedValue === null) {
            return initialValue;
        }

        try {
            return JSON.parse(storedValue) as T;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}
