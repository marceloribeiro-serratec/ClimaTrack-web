import { useState, useEffect, type ReactNode } from "react";
import { Clock, LayoutDashboard, Settings2, Star, Trash2, Moon, Sun, Bell } from "lucide-react";
import {
    APP_FONT_FAMILY,
    APP_MONO_FONT_FAMILY,
    APP_NAME,
    DEFAULT_SCREEN,
    TEMPERATURE_UNIT_OPTIONS,
    APP_VERSION,
} from "./constants/app.constants";
import { APP_SCREEN_LABELS, APP_SCREEN_ORDER } from "./constants/navigation.constants";
import type { AppScreen } from "./constants/navigation.constants";
import { WeatherDashboard } from "./components/weather/WeatherDashboard";
import { FavoriteCities } from "./components/weather/FavoriteCities";
import { SearchHistory } from "./components/weather/SearchHistory";
import { ThemeToggle } from "./components/weather/ThemeToggle";
import { useWeather } from "./hooks/useWeather";
import { useTheme } from "./hooks/useTheme";
import { useTemperatureUnit } from "./hooks/useTemperatureUnit";
import { useFavorites } from "./hooks/useFavorites";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useAlerts } from "./hooks/useAlerts";
import { sendWeatherAlert } from "./services/alert-service";
import { Switch } from "./components/ui/switch";
import { Input } from "./components/ui/input";
import type { GeocodingCity } from "./types/geocoding";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { ChatWidget } from "./components/chat/ChatWidget";

const NAV_ICON_BY_SCREEN: Record<AppScreen, ReactNode> = {
    dashboard: <LayoutDashboard size={18} />,
    favorites: <Star size={18} />,
    history: <Clock size={18} />,
    settings: <Settings2 size={18} />,
};

export default function App() {
    const [screen, setScreen] = useState<AppScreen>(DEFAULT_SCREEN);
    const [favoriteNotice, setFavoriteNotice] = useState<{
        city: string;
        action: "added" | "removed";
    } | null>(null);
    const { isDark, toggleTheme } = useTheme();
    const { unit, setUnit } = useTemperatureUnit();
    const { favorites, toggleFavorite, clearFavorites, removeFavorite, isFavorite } =
        useFavorites();
    const { history, addSearch, clearHistory, removeSearch } = useSearchHistory();
    const { weather, loading, error, searchByName, searchByCity } = useWeather();
    const { email, alertsEnabled, lastAlertDateByCity, cities, setEmail, setEnabled, updateLastAlertDate, addCity, removeCity } = useAlerts();

    async function handleSearch(city: string) {
        try {
            const result = await searchByName(city);
            addSearch(result);
            setScreen(DEFAULT_SCREEN);
        } catch {
            // O estado de erro já é tratado pelo hook.
        }
    }

    async function handleSearchCity(city: GeocodingCity) {
        try {
            const result = await searchByCity(city);
            addSearch(result);
            setScreen(DEFAULT_SCREEN);
        } catch {
            // O estado de erro já é tratado pelo hook.
        }
    }

    useEffect(() => {
        if (!weather || !alertsEnabled || !email) return;

        const currentHumidity = weather.forecast.current.relative_humidity_2m;
        const currentTemp = weather.forecast.current.temperature_2m;
        const today = new Date().toISOString().split("T")[0];
        const currentCityName = weather.location.name;

        // Verifica se a cidade atual esta na lista de cidades para alerta (se houver alguma cadastrada)
        if (cities.length > 0 && !cities.includes(currentCityName)) return;

        // Se ja mandou alerta hoje para esta cidade, ignora
        if (lastAlertDateByCity[currentCityName] === today) return;

        let reason: "high_temperature" | "low_temperature" | "high_humidity" | "rain" | null = null;

        const currentCode = weather.forecast.current.weather_code;
        const isRainingNow = currentCode >= 51 && currentCode <= 99;

        if (currentTemp >= 35) {
            reason = "high_temperature";
        } else if (currentTemp <= 10) {
            reason = "low_temperature";
        } else if (isRainingNow) {
            reason = "rain";
        } else if (currentHumidity >= 90) {
            reason = "high_humidity";
        }

        if (reason) {
            import('./utils/formatWeatherCode').then(({ formatWeatherCode }) => {
                sendWeatherAlert({
                    event: "weather_alert",
                    email,
                    city: weather.location.name,
                    reason,
                    weather: {
                        temperature: currentTemp,
                        humidity: currentHumidity,
                        description: formatWeatherCode(weather.forecast.current.weather_code).label,
                    }
                });
            });
            updateLastAlertDate(currentCityName);
            toast.info(`Alerta de clima crítico enviado para ${email}`);
        }
    }, [weather, alertsEnabled, email, cities, lastAlertDateByCity, updateLastAlertDate]);

    function handleToggleFavorite(city: GeocodingCity) {
        const alreadyFavorite = isFavorite(city);
        toggleFavorite(city);
        setFavoriteNotice({
            city: city.name,
            action: alreadyFavorite ? "removed" : "added",
        });

        toast.success(
            alreadyFavorite
                ? `${city.name} removida dos favoritos.`
                : `${city.name} adicionada aos favoritos.`,
        );
    }

    const navItems = APP_SCREEN_ORDER.map((id) => ({
        id,
        label: APP_SCREEN_LABELS[id],
        icon: NAV_ICON_BY_SCREEN[id],
    }));

    return (
        <div
            className={isDark ? "dark" : ""}
            style={{ fontFamily: APP_FONT_FAMILY }}
        >
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
                        <button
                            onClick={() => setScreen(DEFAULT_SCREEN)}
                            className="flex items-center gap-2 shrink-0 group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                                <span className="text-sm">🌤️</span>
                            </div>
                            <span className="font-semibold text-base tracking-tight text-foreground">
                                {APP_NAME}
                            </span>
                        </button>

                        <nav className="hidden md:flex items-center gap-1 ml-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setScreen(item.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        screen === item.id
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="ml-auto flex items-center gap-2">
                            <ThemeToggle checked={isDark} onToggle={toggleTheme} />
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">
                    {screen === "dashboard" && (
                        <WeatherDashboard
                            weather={weather}
                            loading={loading}
                            error={error}
                            unit={unit}
                            onSearch={handleSearch}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}

                    {screen === "favorites" && (
                        <FavoriteCities
                            favorites={favorites}
                            onSearch={handleSearchCity}
                            onRemove={removeFavorite}
                            onClear={clearFavorites}
                            notice={favoriteNotice}
                        />
                    )}

                    {screen === "history" && (
                        <SearchHistory
                            history={history}
                            onSearch={handleSearchCity}
                            onRemove={removeSearch}
                            onClear={clearHistory}
                        />
                    )}

                    {screen === "settings" && (
                        <div className="space-y-5 max-w-xl">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Configurações
                                </h1>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Personalize sua experiência no ClimaTrack.
                                </p>
                            </div>

                            <SettingsSection title="Aparência">
                                <SettingsRow
                                    label="Tema escuro"
                                    description="Alterne entre tema claro e escuro"
                                    icon={
                                        isDark ? (
                                            <Moon size={16} className="text-primary" />
                                        ) : (
                                            <Sun size={16} className="text-amber-500" />
                                        )
                                    }
                                >
                                    <ThemeToggle checked={isDark} onToggle={toggleTheme} />
                                </SettingsRow>
                            </SettingsSection>

                            <SettingsSection title="Unidade de temperatura">
                                <div className="p-4">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Escolha a unidade para exibição das temperaturas
                                    </p>
                                    <div className="flex gap-2">
                                        {TEMPERATURE_UNIT_OPTIONS.map((value) => (
                                            <button
                                                key={value}
                                                onClick={() => setUnit(value)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                                                    unit === value
                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                        : "bg-card text-foreground border-border hover:border-primary/40"
                                                }`}
                                                style={{ fontFamily: APP_MONO_FONT_FAMILY }}
                                            >
                                                {value === "C" ? "°C — Celsius" : "°F — Fahrenheit"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </SettingsSection>

                            <SettingsSection title="Alertas Climáticos">
                                <SettingsRow
                                    label="Ativar Alertas"
                                    description="Receba avisos por e-mail sobre clima extremo"
                                    icon={<Bell size={16} className="text-blue-500" />}
                                >
                                    <Switch checked={alertsEnabled} onCheckedChange={setEnabled} />
                                </SettingsRow>
                                {alertsEnabled && (
                                    <div className="px-4 pb-4 pt-2">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-medium text-foreground">
                                                E-mail para alertas
                                            </label>
                                            <Input 
                                                type="email" 
                                                placeholder="seu@email.com" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5 mt-4">
                                            <label className="text-xs font-medium text-foreground">
                                                Cidades para Alerta (máx 3)
                                            </label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    id="new-city-alert"
                                                    placeholder="Digite o nome da cidade" 
                                                    className="h-9 text-sm flex-1"
                                                    disabled={cities.length >= 3}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = e.currentTarget.value.trim();
                                                            if (val) {
                                                                addCity(val);
                                                                e.currentTarget.value = "";
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const input = document.getElementById('new-city-alert') as HTMLInputElement;
                                                        if (input && input.value.trim()) {
                                                            addCity(input.value.trim());
                                                            input.value = "";
                                                        }
                                                    }}
                                                    disabled={cities.length >= 3}
                                                    className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {cities.length === 0 && (
                                                    <span className="text-xs text-muted-foreground">Se vazio, alertas valem para qualquer cidade consultada.</span>
                                                )}
                                                {cities.map((city) => (
                                                    <div key={city} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-lg">
                                                        <span className="text-sm">{city}</span>
                                                        <button onClick={() => removeCity(city)} className="text-destructive hover:text-destructive/80 p-1">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SettingsSection>

                            <SettingsSection title="Dados e armazenamento">
                                <SettingsRow
                                    label="Limpar favoritos"
                                    description={`${favorites.length} cidade${favorites.length !== 1 ? "s" : ""} salva${favorites.length !== 1 ? "s" : ""}`}
                                    icon={<Star size={16} className="text-amber-500" />}
                                >
                                    <button
                                        onClick={clearFavorites}
                                        disabled={favorites.length === 0}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={12} />
                                        Limpar
                                    </button>
                                </SettingsRow>

                                <SettingsRow
                                    label="Limpar histórico"
                                    description={`${history.length} busca${history.length !== 1 ? "s" : ""} registrada${history.length !== 1 ? "s" : ""}`}
                                    icon={<Clock size={16} className="text-muted-foreground" />}
                                >
                                    <button
                                        onClick={clearHistory}
                                        disabled={history.length === 0}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={12} />
                                        Limpar
                                    </button>
                                </SettingsRow>
                            </SettingsSection>

                            <SettingsSection title="Sobre">
                                <div className="p-4 space-y-2">
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl shadow-sm">
                                            🌤️
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground text-sm">
                                                {APP_NAME}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Versão {APP_VERSION} — Monitoramento de clima
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground leading-relaxed">
                                        Dados reais fornecidos pela Open-Meteo. Favoritos e histórico ficam salvos no navegador.
                                    </div>
                                </div>
                            </SettingsSection>
                        </div>
                    )}
                </main>

                <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-40">
                    <div className="flex items-center justify-around px-2 py-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setScreen(item.id)}
                                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-0 ${
                                    screen === item.id
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {item.icon}
                                <span className="text-[10px] font-medium truncate">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </nav>
                <ChatWidget/>
                <Toaster position="top-right" richColors />
            </div>
        </div>
    );
}

function SettingsSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {title}
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                {children}
            </div>
        </div>
    );
}

function SettingsRow({
    icon,
    label,
    description,
    children,
}: {
    icon: ReactNode;
    label: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">
                    {label}
                </div>
                <div className="text-xs text-muted-foreground">
                    {description}
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}
