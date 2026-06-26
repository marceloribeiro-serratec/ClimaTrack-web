import axios from "axios";
import type {
    ChatbotErrorCode,
    ChatbotRequestPayload,
    ChatbotResponsePayload,
} from "../types/chatbot";

const CHATBOT_REQUEST_TIMEOUT_MS = 15000;
const LOCAL_N8N_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DEFAULT_NETWORK_ERROR_MESSAGE =
    "Nao foi possivel conectar ao chatbot no momento.";

type ChatbotWebhookResponse =
    | string
    | {
          reply?: unknown;
          message?: unknown;
          response?: unknown;
          output?: unknown;
          data?: {
              reply?: unknown;
              message?: unknown;
              response?: unknown;
              output?: unknown;
          };
          intent?: unknown;
          city?: unknown;
          country?: unknown;
      };

export class ChatbotServiceError extends Error {
    code: ChatbotErrorCode;

    constructor(code: ChatbotErrorCode, message: string) {
        super(message);
        this.name = "ChatbotServiceError";
        this.code = code;
    }
}

function getWebhookUrl() {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new ChatbotServiceError(
            "missing_webhook_url",
            "Chat nao configurado. Defina VITE_N8N_WEBHOOK_URL para enviar mensagens.",
        );
    }

    if (import.meta.env.DEV) {
        try {
            const parsedUrl = new URL(webhookUrl);

            if (LOCAL_N8N_HOSTS.has(parsedUrl.hostname) && parsedUrl.port === "5678") {
                return `${parsedUrl.pathname}${parsedUrl.search}`;
            }
        } catch {
            // Keep the original URL when it is already relative or malformed.
        }
    }

    return webhookUrl;
}

function readText(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function getHttpErrorMessage(status?: number) {
    switch (status) {
        case 400:
            return "O webhook rejeitou a mensagem enviada.";
        case 401:
            return "O webhook do n8n exige autenticacao ou credencial valida.";
        case 403:
            return "Acesso negado pelo webhook do n8n.";
        case 404:
            return "Webhook nao encontrado. Verifique se a URL do n8n esta ativa e correta.";
        case 408:
        case 504:
            return "O webhook demorou para responder. Tente novamente.";
        default:
            return DEFAULT_NETWORK_ERROR_MESSAGE;
    }
}

function normalizeChatbotResponse(data: ChatbotWebhookResponse): ChatbotResponsePayload {
    if (typeof data === "string") {
        return {
            reply: data.trim(),
        };
    }

    const reply =
        readText(data.reply) ??
        readText(data.message) ??
        readText(data.response) ??
        readText(data.output) ??
        readText(data.data?.reply) ??
        readText(data.data?.message) ??
        readText(data.data?.response) ??
        readText(data.data?.output);

    const intent = readText(data.intent);
    const city = readText(data.city);
    const country = readText((data as { country?: unknown }).country);

    return {
        reply: reply ?? "",
        ...(intent ? { intent } : {}),
        ...(city ? { city } : {}),
        ...(country ? { country } : {}),
    };
}

export async function sendChatbotMessage(
    payload: ChatbotRequestPayload,
): Promise<ChatbotResponsePayload> {
    const webhookUrl = getWebhookUrl();

    try {
        const response = await axios.post<ChatbotWebhookResponse>(webhookUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: CHATBOT_REQUEST_TIMEOUT_MS,
        });

        const normalizedResponse = normalizeChatbotResponse(response.data);
        const reply = normalizedResponse.reply?.trim();

        if (!reply) {
            throw new ChatbotServiceError(
                "invalid_response",
                "O webhook respondeu sem uma mensagem valida. Verifique se ele retorna reply, message, response, output ou texto puro.",
            );
        }

        return {
            reply,
            ...(normalizedResponse.intent ? { intent: normalizedResponse.intent } : {}),
            ...(normalizedResponse.city ? { city: normalizedResponse.city } : {}),
            ...(normalizedResponse.country ? { country: normalizedResponse.country } : {}),
        };
    } catch (error) {
        if (error instanceof ChatbotServiceError) {
            throw error;
        }

        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                throw new ChatbotServiceError(
                    "request_timeout",
                    "O webhook do n8n demorou para responder.",
                );
            }

            const status = error.response?.status;
            const messageFromResponse =
                typeof error.response?.data === "object" &&
                error.response?.data !== null &&
                "message" in error.response.data &&
                typeof (error.response.data as { message?: unknown }).message === "string"
                    ? ((error.response.data as { message: string }).message || "").trim()
                    : undefined;

            throw new ChatbotServiceError(
                status ? "http_error" : "network_error",
                messageFromResponse || getHttpErrorMessage(status),
            );
        }

        throw new ChatbotServiceError(
            "network_error",
            DEFAULT_NETWORK_ERROR_MESSAGE,
        );
    }
}
