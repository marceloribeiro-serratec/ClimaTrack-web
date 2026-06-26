import type { AppScreen } from "./navigation.constants";

export const APP_NAME = "ClimaTrack" as const;
export const APP_VERSION = "1.0.0" as const;
export const DEFAULT_CITY = "Rio de Janeiro" as const;
export const HISTORY_LIMIT = 10 as const;
export const DEFAULT_SCREEN: AppScreen = "dashboard";
export const TEMPERATURE_UNIT_OPTIONS = ["C", "F"] as const;

export const APP_FONT_FAMILY = "'Inter', system-ui, sans-serif" as const;
export const APP_MONO_FONT_FAMILY = "'DM Mono', monospace" as const;
