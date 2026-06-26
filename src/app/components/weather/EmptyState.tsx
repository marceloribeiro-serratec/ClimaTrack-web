export function EmptyState({
    icon,
    title,
    subtitle,
}: {
    icon: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <div className="font-semibold text-foreground text-base mb-1">
                {title}
            </div>
            <div className="text-sm text-muted-foreground max-w-xs">
                {subtitle}
            </div>
        </div>
    );
}

