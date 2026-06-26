import { SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function ChatInput({
    value,
    onChange,
    onSubmit,
    disabled,
    placeholder = "Digite sua mensagem",
    autoFocus = false,
}: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
}) {
    return (
        <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                disabled={disabled}
                className="h-11 rounded-xl bg-background"
                aria-label="Mensagem do chat"
            />
            <Button
                type="submit"
                size="icon"
                className="h-11 w-11 rounded-xl shrink-0"
                disabled={disabled || value.trim().length === 0}
                aria-label="Enviar mensagem"
            >
                <SendHorizonal size={16} />
            </Button>
        </form>
    );
}
