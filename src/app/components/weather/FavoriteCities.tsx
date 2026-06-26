import { CheckCircle2, Droplets, Search, Trash2, Wind } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { GeocodingCity } from "../../types/geocoding";
import { getCityLabel } from "../../utils/city";

type FavoriteNotice = {
    city: string;
    action: "added" | "removed";
} | null;

export function FavoriteCities({
    favorites,
    onSearch,
    onRemove,
    onClear,
    notice,
}: {
    favorites: GeocodingCity[];
    onSearch: (city: GeocodingCity) => void;
    onRemove: (city: GeocodingCity) => void;
    onClear: () => void;
    notice: FavoriteNotice;
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Favoritos
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {favorites.length > 0
                            ? `${favorites.length} cidade${favorites.length > 1 ? "s" : ""} salva${favorites.length > 1 ? "s" : ""}`
                            : "Nenhuma cidade salva ainda"}
                    </p>
                </div>
                {favorites.length > 0 && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors duration-150 border border-destructive/20"
                    >
                        <Trash2 size={13} />
                        Limpar tudo
                    </button>
                )}
            </div>

            {notice && (
                <div
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        notice.action === "added"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                            : "bg-muted border-border text-muted-foreground"
                    }`}
                >
                    <CheckCircle2 size={16} className="shrink-0" />
                    <div>
                        <div className="font-medium">
                            {notice.action === "added"
                                ? `${notice.city} foi adicionada aos favoritos`
                                : `${notice.city} foi removida dos favoritos`}
                        </div>
                        <div className="text-xs opacity-80">
                            A lista abaixo reflete a mesma informação salva no card principal.
                        </div>
                    </div>
                </div>
            )}

            {favorites.length === 0 ? (
                <EmptyState
                    icon="⭐"
                    title="Sem cidades favoritas"
                    subtitle="Busque uma cidade e toque na estrela para adicioná-la aos favoritos."
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favorites.map((city) => (
                        <div
                            key={`${city.name}-${city.country}-${city.latitude}-${city.longitude}`}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 px-5 py-4 flex items-start justify-between text-white">
                                <div>
                                    <div className="font-semibold text-base leading-none">
                                        {getCityLabel(city)}
                                    </div>
                                    <div className="text-white/70 text-xs mt-0.5">
                                        {city.country}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium uppercase tracking-wide">
                                        <CheckCircle2 size={10} />
                                        Salvo
                                    </div>
                                    <div className="text-2xl">📍</div>
                                </div>
                            </div>
                            <div className="px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Droplets size={11} className="text-blue-500" />
                                        Salva
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Wind size={11} className="text-cyan-500" />
                                        Buscar novamente
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => onSearch(city)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-150 flex items-center gap-1"
                                    >
                                        <Search size={12} />
                                        Ver detalhes
                                    </button>
                                    <button
                                        onClick={() => onRemove(city)}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
                                        title="Remover dos favoritos"
                                        aria-label="Remover dos favoritos"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

