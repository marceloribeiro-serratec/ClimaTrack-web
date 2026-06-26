export type ChatMessageRole = "user" | "bot" | "error";

export interface ChatMessage {
    id: string;
    role: ChatMessageRole;
    content: string;
    timestamp: string;
    isLoading?: boolean;
}

export interface ChatbotRequestPayload {
    message: string;
    userId?: string;
    city?: string;
}

export interface ChatbotResponsePayload {
    reply: string;
    intent?: string;
    city?: string;
    country?: string;
}

export type ChatbotErrorCode =
    | "missing_webhook_url"
    | "invalid_response"
    | "request_timeout"
    | "http_error"
    | "network_error";
