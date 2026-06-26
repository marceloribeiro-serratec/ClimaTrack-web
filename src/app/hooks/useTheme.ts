import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../constants/storage.constants";

export function useTheme() {
    const [isDark, setIsDark] = useLocalStorage<boolean>(STORAGE_KEYS.theme, false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return {
        isDark,
        setIsDark,
        toggleTheme: () => setIsDark((current) => !current),
    };
}
