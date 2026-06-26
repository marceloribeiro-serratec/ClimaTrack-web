import { Clock, Droplets, Gauge, Wind, Thermometer, CloudRain } from "lucide-react";
import { WeatherSearchForm } from "./WeatherSearchForm";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { WeatherInfoCard } from "./WeatherInfoCard";
import { HourlyForecast } from "./HourlyForecast";
import { DailyForecast } from "./DailyForecast";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { ErrorMessage } from "./ErrorMessage";
import type { GeocodingCity } from "../../types/geocoding";
import type { WeatherError, WeatherViewModel } from "../../types/weather";
import { type TemperatureUnit, formatTemperature, formatTemperatureLabel } from "../../utils/formatTemperature";
import { formatWeatherCode } from "../../utils/formatWeatherCode";

export function WeatherDashboard({
    weather,
    loading,
    error,
    unit,
    onSearch,
    isFavorite,
    onToggleFavorite,
}: {
    weather: WeatherViewModel | null;
    loading: boolean;
    error: WeatherError | null;
    unit: TemperatureUnit;
    onSearch: (city: string) => Promise<void>;
    isFavorite: (city: GeocodingCity) => boolean;
    onToggleFavorite: (city: GeocodingCity) => void;
}) {
    const current = weather?.forecast.current;

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Monitoramento do Clima
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Consulte o clima atual e a previsão dos próximos dias para qualquer cidade.
                </p>
            </div>

            <WeatherSearchForm onSearch={onSearch} loading={loading} />

            {error && (
                <ErrorMessage
                    title={error.type === "not_found" ? "Cidade não encontrada" : "Falha ao carregar a previsão"}
                    description={error.message}
                />
            )}

            {loading && !weather ? (
                <LoadingState />
            ) : weather && current ? (
                <>
                    <CurrentWeatherCard
                        location={weather.location}
                        forecast={weather.forecast}
                        unit={unit}
                        isFavorite={isFavorite(weather.location)}
                        onToggleFavorite={() => onToggleFavorite(weather.location)}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <WeatherInfoCard
                            icon={<Droplets size={18} className="text-blue-500" />}
                            label="Umidade"
                            value={`${current.relative_humidity_2m}%`}
                            sub="Relativa do ar"
                            bg="bg-blue-50 dark:bg-blue-950/30"
                        />
                        <WeatherInfoCard
                            icon={<Wind size={18} className="text-cyan-500" />}
                            label="Vento"
                            value={`${current.wind_speed_10m} km/h`}
                            sub="Velocidade atual"
                            bg="bg-cyan-50 dark:bg-cyan-950/30"
                        />
                        <WeatherInfoCard
                            icon={<CloudRain size={18} className="text-indigo-500" />}
                            label="Precipitação"
                            value={`${current.precipitation} mm`}
                            sub="Chuva registrada"
                            bg="bg-indigo-50 dark:bg-indigo-950/30"
                        />
                        <WeatherInfoCard
                            icon={<Thermometer size={18} className="text-orange-500" />}
                            label="Sensação"
                            value={`${formatTemperature(current.apparent_temperature, unit)}${formatTemperatureLabel(unit)}`}
                            sub="Térmica real"
                            bg="bg-orange-50 dark:bg-orange-950/30"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <WeatherInfoCard
                            icon={<Gauge size={16} className="text-muted-foreground" />}
                            label="Condição"
                            value={formatWeatherCode(current.weather_code).label}
                            sub="Código meteorológico"
                            bg="bg-card"
                        />
                        <WeatherInfoCard
                            icon={<Clock size={16} className="text-muted-foreground" />}
                            label="Última atualização"
                            value={new Intl.DateTimeFormat("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }).format(new Date(current.time))}
                            sub="Horário local"
                            bg="bg-card"
                        />
                    </div>

                    <HourlyForecast
                        times={weather.forecast.hourly.time}
                        temperature={weather.forecast.hourly.temperature_2m}
                        precipitationProbability={weather.forecast.hourly.precipitation_probability}
                        weatherCode={weather.forecast.hourly.weather_code}
                        windSpeed={weather.forecast.hourly.wind_speed_10m}
                        unit={unit}
                    />

                    <DailyForecast
                        times={weather.forecast.daily.time}
                        weatherCode={weather.forecast.daily.weather_code}
                        temperatureMax={weather.forecast.daily.temperature_2m_max}
                        temperatureMin={weather.forecast.daily.temperature_2m_min}
                        precipitationProbabilityMax={weather.forecast.daily.precipitation_probability_max}
                        unit={unit}
                    />
                </>
            ) : (
                <EmptyState
                    icon="🔍"
                    title="Nenhuma cidade selecionada"
                    subtitle="Busque uma cidade para ver o clima atual e a previsão."
                />
            )}
        </div>
    );
}
