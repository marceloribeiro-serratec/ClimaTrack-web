import { useState, useEffect } from "react";
import { Clock, Droplets, Gauge, Wind, Thermometer, CloudRain, TriangleAlert, X, Sparkles } from "lucide-react";
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

const N8N_WEBHOOK_URL = "https://nicolasscarvalhoo.app.n8n.cloud/webhook/alerta-clima";

async function verificarAlertaClima(
    cidade: string,
    temperatura: number,
    condicao: string,
    vento: number,
    umidade: number,
    precipitacao: number
) {
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cidade, temperatura, condicao, vento, umidade, precipitacao }),
        });
        const text = await response.text();
        if (!text || text.trim() === "") return { alerta: false, mensagem: "" };
        const alertaMatch = text.match(/"alerta"\s*:\s*(true|false)/);
        const mensagemMatch = text.match(/"mensagem"\s*:\s*"([\s\S]*?)(?:"\s*[,}]|"$)/);
        const alerta = alertaMatch?.[1] === "true";
        const mensagem = mensagemMatch?.[1]?.replace(/\\n/g, "\n") ?? "";
        return { alerta, mensagem };
    } catch {
        return { alerta: false, mensagem: "" };
    }
}

const N8N_TIP_WEBHOOK_URL = import.meta.env.VITE_N8N_TIP_WEBHOOK_URL || "http://localhost:5678/webhook/dica-ia";

async function buscarDicaDaIA(
    cidade: string,
    temperatura: number,
    condicao: string,
    umidade: number
) {
    try {
        const response = await fetch(N8N_TIP_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "daily_tip", city: cidade, temperature: temperatura, condition: condicao, humidity: umidade }),
        });
        const text = await response.text();
        if (!text || text.trim() === "") return "";
        // Tentamos extrair da resposta, ou usamos o texto puro retornado.
        try {
            const json = JSON.parse(text);
            return json.dica || text;
        } catch {
            return text;
        }
    } catch {
        return "";
    }
}

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
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertCheckedFor, setAlertCheckedFor] = useState<string | null>(null);

    useEffect(() => {
        if (!weather || !current) return;

        const cidade = weather.location.name;
        const temperatura = current.temperature_2m;
        const condicao = current.weather_code.toString();
        const vento = current.wind_speed_10m;
        const umidade = current.relative_humidity_2m;
        const precipitacao = current.precipitation;

        const chave = `${cidade}-${temperatura}-${vento}-${umidade}-${precipitacao}`;

        if (alertCheckedFor === chave) return;
        setAlertCheckedFor(chave);
        setAlertMessage(null);
        setAlertVisible(false);

        verificarAlertaClima(cidade, temperatura, condicao, vento, umidade, precipitacao).then((resultado) => {
            if (resultado.alerta && resultado.mensagem) {
                setAlertMessage(resultado.mensagem);
                setAlertVisible(true);
            }
        });
    }, [weather]);

    const [tipMessage, setTipMessage] = useState<string | null>(null);
    const [tipVisible, setTipVisible] = useState(false);
    const [tipCheckedFor, setTipCheckedFor] = useState<string | null>(null);

    useEffect(() => {
        if (!weather || !current) return;

        const cidade = weather.location.name;
        const temperatura = current.temperature_2m;
        const condicao = current.weather_code.toString();
        const umidade = current.relative_humidity_2m;

        const chave = `${cidade}-${temperatura}-${umidade}`;

        if (tipCheckedFor === chave) return;
        setTipCheckedFor(chave);
        setTipMessage(null);
        setTipVisible(false);

        // Fetching the AI Tip
        buscarDicaDaIA(cidade, temperatura, condicao, umidade).then((dica) => {
            if (dica && dica.trim() !== "") {
                setTipMessage(dica.trim());
                setTipVisible(true);
            }
        });
    }, [weather, current, tipCheckedFor]);

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

                    {alertVisible && alertMessage && (
                        <div className="relative rounded-2xl border border-orange-200 bg-orange-50 dark:border-orange-900/60 dark:bg-orange-950/30 p-4 flex gap-3 items-start">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/50">
                                <TriangleAlert size={16} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-0.5">
                                    Alerta de condição extrema
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed">
                                    {alertMessage}
                                </p>
                                <p className="text-xs text-orange-500 dark:text-orange-500 mt-1.5">
                                    Gerado por IA via n8n
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAlertVisible(false)}
                                className="shrink-0 text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
                                aria-label="Fechar alerta"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {tipVisible && tipMessage && (
                        <div className="relative rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/30 p-4 flex gap-3 items-start mt-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
                                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-0.5">
                                    Dica da IA
                                </p>
                                <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed">
                                    {tipMessage}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTipVisible(false)}
                                className="shrink-0 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                                aria-label="Fechar dica"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
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
