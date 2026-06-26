import { Moon, Sun } from "lucide-react";

export function ThemeToggle({
    checked,
    onToggle,
}: {
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            title={checked ? "Tema claro" : "Tema escuro"}
            aria-label="Alternar tema"
        >
            {checked ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}

