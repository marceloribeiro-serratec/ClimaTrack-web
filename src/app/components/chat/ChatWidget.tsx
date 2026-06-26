import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircleMore, X } from "lucide-react";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { sendChatbotMessage, ChatbotServiceError } from "../../services/chatbot-service";
import type { ChatMessage } from "../../types/chatbot";

const STORAGE_KEY = "climatrack-chat-user-id";
const WELCOME_MESSAGE =
    "Oi! Posso ajudar com duvidas sobre o clima. Digite o nome de uma cidade";

function createMessage(role: ChatMessage["role"], content: string, isLoading = false): ChatMessage {
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role,
        content,
        timestamp: new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date()),
        isLoading,
    };
}

function getOrCreateUserId() {
    if (typeof window === "undefined") {
        return undefined;
    }

    const existingUserId = window.localStorage.getItem(STORAGE_KEY);

    if (existingUserId) {
        return existingUserId;
    }

    const newUserId = window.crypto?.randomUUID?.() ?? `user-${Date.now()}`;
    window.localStorage.setItem(STORAGE_KEY, newUserId);
    return newUserId;
}

function resolveErrorMessage(error: unknown) {
    if (error instanceof ChatbotServiceError) {
        return error.message;
    }

    return "Desculpe, nao consegui responder agora. Tente novamente em instantes.";
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        createMessage("bot", WELCOME_MESSAGE),
    ]);
    const [draft, setDraft] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [lastKnownCity, setLastKnownCity] = useState<string | undefined>();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const userId = useMemo(() => getOrCreateUserId(), []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isOpen, isSending]);

    async function handleSend() {
        const message = draft.trim();

        if (!message || isSending) {
            return;
        }

        const userMessage = createMessage("user", message);
        const loadingMessage = createMessage("bot", "", true);

        setDraft("");
        setIsSending(true);
        setMessages((currentMessages) => [...currentMessages, userMessage, loadingMessage]);

        try {
            const response = await sendChatbotMessage({
                message,
                userId,
                city: lastKnownCity,
            });

            if (response.city) {
                setLastKnownCity(response.city);
            }

            const botMessage = createMessage("bot", response.reply);

            setMessages((currentMessages) =>
                currentMessages
                    .filter((entry) => !entry.isLoading)
                    .concat(botMessage),
            );
        } catch (error) {
            const errorMessage = createMessage("error", resolveErrorMessage(error));

            setMessages((currentMessages) =>
                currentMessages
                    .filter((entry) => !entry.isLoading)
                    .concat(errorMessage),
            );
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="fixed bottom-20 right-4 z-50 md:bottom-4 md:right-4">
            {isOpen ? (
                <Card className="w-[calc(100vw-1rem)] sm:w-[380px] md:w-[400px] shadow-xl border-border/70 backdrop-blur-xl bg-card/95">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                                <Bot size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="text-base">Chat Assistant</CardTitle>
                                <CardDescription className="mt-1 text-xs">
                                    Conectado ao workflow do n8n via webhook.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0 rounded-xl"
                                onClick={() => setIsOpen(false)}
                                aria-label="Fechar chat"
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <ScrollArea className="h-[min(60vh,32rem)] px-4 py-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <ChatMessageBubble key={message.id} message={message} />
                                ))}
                                {isSending && messages.every((message) => !message.isLoading) && (
                                    <ChatMessageBubble
                                        message={createMessage("bot", "", true)}
                                    />
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <div className="border-t border-border/60 p-3">
                        <ChatInput
                            value={draft}
                            onChange={setDraft}
                            onSubmit={handleSend}
                            disabled={isSending}
                            autoFocus={isOpen}
                        />
                    </div>
                </Card>
            ) : (
                <Button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="h-14 rounded-full px-5 shadow-lg shadow-primary/20"
                    aria-label="Abrir chat"
                >
                    <MessageCircleMore size={18} />
                    <span className="hidden sm:inline">Chat</span>
                </Button>
            )}
        </div>
    );
}
