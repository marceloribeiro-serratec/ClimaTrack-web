import { AlertCircle } from "lucide-react";

export function ErrorMessage({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <div>
                <div className="font-medium">{title}</div>
                <div className="text-destructive/80">{description}</div>
            </div>
        </div>
    );
}

