import { Skeleton } from "../ui/skeleton";

export function LoadingState() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-52 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
        </div>
    );
}

