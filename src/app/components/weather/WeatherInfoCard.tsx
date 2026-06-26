import type { ReactNode } from "react";

export function WeatherInfoCard({
    icon,
    label,
    value,
    sub,
    bg,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    sub: string;
    bg: string;
}) {
    return (
        <div className={`${bg} border border-border rounded-xl px-4 py-3.5`}>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs font-medium text-muted-foreground">
                    {label}
                </span>
            </div>
            <div
                className="text-xl font-semibold text-foreground"
                style={{ fontFamily: "'DM Mono', monospace" }}
            >
                {value}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        </div>
    );
}
