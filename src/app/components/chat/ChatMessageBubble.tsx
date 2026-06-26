import type { ReactNode } from "react";
import { Bot, UserRound, TriangleAlert } from "lucide-react";
import { cn } from "../ui/utils";
import type { ChatMessage, ChatMessageRole } from "../../types/chatbot";

const MESSAGE_STYLES: Record<
    ChatMessageRole,
    {
        wrapper: string;
        bubble: string;
        icon: ReactNode;
        label: string;
    }
> = {
    user: {
        wrapper: "justify-end",
        bubble: "bg-primary text-primary-foreground rounded-2xl rounded-br-md",
        icon: <UserRound size={14} />,
        label: "Voce",
    },
    bot: {
        wrapper: "justify-start",
        bubble: "bg-muted text-foreground rounded-2xl rounded-bl-md border border-border/60",
        icon: <Bot size={14} />,
        label: "Bot",
    },
    error: {
        wrapper: "justify-start",
        bubble: "bg-destructive/10 text-destructive rounded-2xl rounded-bl-md border border-destructive/20",
        icon: <TriangleAlert size={14} />,
        label: "Erro",
    },
};

export function ChatMessageBubble({
    message,
}: {
    message: ChatMessage;
}) {
    const styles = MESSAGE_STYLES[message.role];

    return (
        <div className={cn("flex w-full", styles.wrapper)}>
            <div className="max-w-[85%] sm:max-w-[80%]">
                <div className="mb-1 flex items-center gap-1.5 px-1 text-[11px] font-medium text-muted-foreground">
                    {styles.icon}
                    <span>{styles.label}</span>
                    <span aria-hidden="true">•</span>
                    <time>{message.timestamp}</time>
                </div>

                <div
                    className={cn(
                        "px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                        styles.bubble,
                        message.isLoading && "opacity-90",
                    )}
                >
                    {message.isLoading ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="size-3 rounded-full border-2 border-current border-r-transparent animate-spin" />
                            Processando...
                        </span>
                    ) : (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
