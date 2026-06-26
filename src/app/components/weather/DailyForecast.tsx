import { Droplets } from "lucide-react";
import { formatDayAndMonth, formatDayLabel } from "../../utils/formatDate";
import { formatTemperature, formatTemperatureLabel, type TemperatureUnit } from "../../utils/formatTemperature";
import { formatWeatherCode } from "../../utils/formatWeatherCode";

export function DailyForecast({
    times,
    weatherCode,
    temperatureMax,
    temperatureMin,
    precipitationProbabilityMax,
    unit,
}: {
    times: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitationProbabilityMax: number[];
    unit: TemperatureUnit;
}) {
    const items = times.slice(0, 7).map((time, index) => ({
        time,
        weatherCode: weatherCode[index],
        temperatureMax: temperatureMax[index],
        temperatureMin: temperatureMin[index],
        precipitationProbabilityMax: precipitationProbabilityMax[index],
    }));

    return (
        <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
                Previsão semanal
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                {items.map((item, index) => {
                    const display = formatWeatherCode(item.weatherCode);

                    return (
                        <div
                            key={`${item.time}-${index}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors duration-100"
                        >
                            <div className="w-16 shrink-0">
                                <div className="text-sm font-medium text-foreground">
                                    {formatDayLabel(item.time, index)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDayAndMonth(item.time)}
                                </div>
                            </div>
                            <div className="text-xl">{display.icon}</div>
                            <div className="flex-1 text-xs text-muted-foreground truncate hidden sm:block">
                                {display.label}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-500 w-10 justify-end">
                                <Droplets size={10} />
                                {item.precipitationProbabilityMax}%
                            </div>
                            <div
                                className="flex items-center gap-2 text-sm font-medium shrink-0"
                                style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                                <span className="text-foreground">
                                    {formatTemperature(item.temperatureMax, unit)}
                                    {formatTemperatureLabel(unit)}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {formatTemperature(item.temperatureMin, unit)}
                                    {formatTemperatureLabel(unit)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

