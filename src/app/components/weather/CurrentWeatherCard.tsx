import { Clock, Droplets, Star, StarOff, Thermometer } from "lucide-react";
import type { GeocodingCity } from "../../types/geocoding";
import type { WeatherForecastResponse } from "../../types/weather";
import { formatDateTime } from "../../utils/formatDate";
import { formatTemperature, formatTemperatureLabel, type TemperatureUnit } from "../../utils/formatTemperature";
import { formatWeatherCode, getWeatherGradient } from "../../utils/formatWeatherCode";
import { getCityLabel } from "../../utils/city";

export function CurrentWeatherCard({
    location,
    forecast,
    unit,
    isFavorite,
    onToggleFavorite,
}: {
    location: GeocodingCity;
    forecast: WeatherForecastResponse;
    unit: TemperatureUnit;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}) {
    const display = formatWeatherCode(forecast.current.weather_code);
    const gradient = getWeatherGradient(display.key);

    return (
        <div
            className={`relative rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg overflow-hidden`}
        >
            <button
                type="button"
                onClick={onToggleFavorite}
                aria-pressed={isFavorite}
                className={`absolute top-4 right-4 z-20 p-2 rounded-xl transition-colors duration-150 backdrop-blur-sm ${
                    isFavorite
                        ? "bg-white text-amber-300 shadow-lg ring-2 ring-white/30"
                        : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
                {isFavorite ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
            </button>

            <div
                className={`absolute top-4 right-16 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm ${
                    isFavorite
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white/80"
                }`}
            >
                {isFavorite ? "Salvo" : "Favoritar"}
            </div>

            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-4 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-end gap-6 justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                            {display.icon}
                        </div>
                        <div>
                            <div className="font-semibold text-xl tracking-tight leading-none">
                                {getCityLabel(location)}
                            </div>
                            <div className="text-white/70 text-xs mt-0.5">
                                {location.country}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div
                            className="text-8xl font-light leading-none tracking-tighter"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            {formatTemperature(forecast.current.temperature_2m, unit)}
                            <span className="text-4xl font-light">
                                {formatTemperatureLabel(unit)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-2 text-white/80 font-medium text-sm">
                        {display.label}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                        <Thermometer size={13} className="text-white/60" />
                        <span>
                            Sensação{" "}
                            {formatTemperature(forecast.current.apparent_temperature, unit)}
                            {formatTemperatureLabel(unit)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Droplets size={13} className="text-white/60" />
                        <span>{forecast.current.relative_humidity_2m}% umidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={13} className="text-white/60" />
                        <span>Atualizado às {formatDateTime(forecast.current.time)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
