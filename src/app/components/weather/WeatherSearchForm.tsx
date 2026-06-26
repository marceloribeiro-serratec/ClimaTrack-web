import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, RefreshCw, X } from "lucide-react";
import { weatherSearchSchema, type WeatherSearchFormData } from "../../schemas/weather-search-schema";

export function WeatherSearchForm({
    onSearch,
    loading,
}: {
    onSearch: (city: string) => Promise<void>;
    loading: boolean;
}) {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<WeatherSearchFormData>({
        resolver: zodResolver(weatherSearchSchema),
        defaultValues: { city: "" },
    });

    useEffect(() => {
        setFocus("city");
    }, [setFocus]);

    async function submit(values: WeatherSearchFormData) {
        await onSearch(values.city);
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <input
                        {...register("city")}
                        placeholder="Digite uma cidade..."
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
                    />
                    <button
                        type="button"
                        onClick={() => reset({ city: "" })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Limpar campo"
                    >
                        <X size={14} />
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 flex items-center gap-2 shrink-0"
                >
                    {loading ? (
                        <RefreshCw size={14} className="animate-spin" />
                    ) : (
                        <Search size={14} />
                    )}
                    Buscar
                </button>
            </div>

            {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
            )}
        </form>
    );
}

