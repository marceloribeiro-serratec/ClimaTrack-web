interface TelegramAlertPayload {
    chatId: string;
    latitude: string;
    longitude: string;
    cidade: string;
}

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/cadastrar-alerta";

export async function cadastrarAlertaTelegram(payload: TelegramAlertPayload): Promise<boolean> {
    const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chatId: payload.chatId.trim(),
            latitude: payload.latitude,
            longitude: payload.longitude,
            cidade: payload.cidade,
        }),
    });

    if (!response.ok) {
        throw new Error("Falha ao salvar no servidor de alertas.");
    }

    return true;
}