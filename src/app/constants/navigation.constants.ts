export const APP_SCREEN_ORDER = [
    "dashboard",
    "favorites",
    "history",
    "settings",
] as const;

export type AppScreen = (typeof APP_SCREEN_ORDER)[number];

export const APP_SCREEN_LABELS = {
    dashboard: "Início",
    favorites: "Favoritos",
    history: "Histórico",
    settings: "Configurações",
} as const satisfies Record<AppScreen, string>;

