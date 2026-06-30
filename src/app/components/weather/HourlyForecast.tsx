import { Droplets, Wind } from "lucide-react";
import { formatHourLabel } from "../../utils/formatDate";
import { formatTemperature, formatTemperatureLabel, type TemperatureUnit } from "../../utils/formatTemperature";
import { formatWeatherCode } from "../../utils/formatWeatherCode";

export function HourlyForecast({
    times,
    temperature,
    precipitationProbability,
    weatherCode,
    windSpeed,
    unit,
}: {
    times: string[];
    temperature: number[];
    precipitationProbability: number[];
    weatherCode: number[];
    windSpeed: number[];
    unit: TemperatureUnit;
}) {
    const items = times.slice(0, 12).map((time, index) => ({
        time,
        temperature: temperature[index],
        precipitationProbability: precipitationProbability[index],
        weatherCode: weatherCode[index],
        windSpeed: windSpeed[index],
    }));

    return (
        <div className="w-full min-w-0">
            <h2 className="text-sm font-semibold text-foreground mb-3">
                Previsão por hora
            </h2>
            <div className="w-full min-w-0 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex w-max gap-2">
                    {items.map((item, index) => {
                        const display = formatWeatherCode(item.weatherCode);

                        return (
                            <div
                                key={`${item.time}-${index}`}
                                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border shrink-0 min-w-[88px] transition-colors ${
                                    index === 0
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-card border-border text-foreground"
                                }`}
                            >
                                <div className="text-xs font-medium opacity-80">
                                    {formatHourLabel(item.time)}
                                </div>
                                <div className="text-xl">{display.icon}</div>
                                <div
                                    className="text-sm font-semibold"
                                    style={{ fontFamily: "'DM Mono', monospace" }}
                                >
                                    {formatTemperature(item.temperature, unit)}
                                    {formatTemperatureLabel(unit)}
                                </div>
                                <div
                                    className={`text-[10px] flex items-center gap-0.5 ${
                                        index === 0 ? "opacity-80" : "text-blue-500"
                                    }`}
                                >
                                    <Droplets size={9} />
                                    {item.precipitationProbability}%
                                </div>
                                <div className="text-[10px] flex items-center gap-0.5 text-muted-foreground">
                                    <Wind size={9} />
                                    {item.windSpeed} km/h
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
