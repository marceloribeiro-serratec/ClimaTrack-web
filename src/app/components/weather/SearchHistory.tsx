import { Clock, Trash2, X } from "lucide-react";
import type { GeocodingCity } from "../../types/geocoding";
import { EmptyState } from "./EmptyState";
import { getCityLabel } from "../../utils/city";

export function SearchHistory({
    history,
    onSearch,
    onRemove,
    onClear,
}: {
    history: GeocodingCity[];
    onSearch: (city: GeocodingCity) => void;
    onRemove: (city: GeocodingCity) => void;
    onClear: () => void;
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Histórico
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {history.length > 0
                            ? `${history.length} busca${history.length > 1 ? "s" : ""} recente${history.length > 1 ? "s" : ""}`
                            : "Nenhuma busca realizada"}
                    </p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors duration-150 border border-destructive/20"
                    >
                        <Trash2 size={13} />
                        Limpar tudo
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <EmptyState
                    icon="🕐"
                    title="Sem histórico"
                    subtitle="As cidades que você buscar aparecerão aqui."
                />
            ) : (
                <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                    {history.map((city) => (
                        <div
                            key={`${city.name}-${city.country}-${city.latitude}-${city.longitude}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors duration-100 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Clock size={14} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-foreground">
                                        {getCityLabel(city)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {city.country}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                                    <span>Toque para buscar novamente</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                                <button
                                    onClick={() => onSearch(city)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-150"
                                >
                                    Buscar
                                </button>
                                <button
                                    onClick={() => onRemove(city)}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
                                    aria-label="Remover do histórico"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

