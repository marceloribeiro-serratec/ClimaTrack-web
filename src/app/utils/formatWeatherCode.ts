export interface WeatherDisplay {
    label: string;
    icon: string;
    key: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "windy" | "snowy";
}

const map: Array<{ codes: number[]; display: WeatherDisplay }> = [
    { codes: [0], display: { label: "Céu limpo", icon: "☀️", key: "sunny" } },
    { codes: [1], display: { label: "Predominantemente limpo", icon: "🌤️", key: "partly-cloudy" } },
    { codes: [2], display: { label: "Parcialmente nublado", icon: "⛅", key: "partly-cloudy" } },
    { codes: [3], display: { label: "Nublado", icon: "☁️", key: "cloudy" } },
    { codes: [45, 48], display: { label: "Nevoeiro", icon: "🌫️", key: "cloudy" } },
    { codes: [51, 53, 55], display: { label: "Garoa", icon: "🌦️", key: "rainy" } },
    { codes: [56, 57], display: { label: "Garoa congelante", icon: "🌧️", key: "rainy" } },
    { codes: [61, 63, 65], display: { label: "Chuva", icon: "🌧️", key: "rainy" } },
    { codes: [66, 67], display: { label: "Chuva congelante", icon: "🌧️", key: "rainy" } },
    { codes: [71, 73, 75, 77], display: { label: "Neve", icon: "🌨️", key: "snowy" } },
    { codes: [80, 81, 82], display: { label: "Pancadas de chuva", icon: "🌧️", key: "rainy" } },
    { codes: [85, 86], display: { label: "Pancadas de neve", icon: "🌨️", key: "snowy" } },
    { codes: [95, 96, 99], display: { label: "Tempestade", icon: "⛈️", key: "rainy" } },
];

export function formatWeatherCode(code: number): WeatherDisplay {
    return map.find((entry) => entry.codes.includes(code))?.display ?? {
        label: "Condição variável",
        icon: "☁️",
        key: "cloudy",
    };
}

export function getWeatherGradient(key: WeatherDisplay["key"]) {
    const gradients: Record<WeatherDisplay["key"], string> = {
        sunny: "from-amber-400 via-orange-400 to-sky-500",
        "partly-cloudy": "from-sky-400 via-sky-500 to-blue-600",
        cloudy: "from-slate-400 via-slate-500 to-blue-700",
        rainy: "from-blue-500 via-blue-600 to-indigo-700",
        windy: "from-teal-400 via-cyan-500 to-sky-600",
        snowy: "from-blue-200 via-sky-300 to-slate-400",
    };

    return gradients[key];
}

