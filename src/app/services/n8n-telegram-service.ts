interface TelegramAlertPayload {
    chatId: string;
    latitude: string;
    longitude: string;
    cidade: string;
}

const N8N_WEBHOOK_URL = "https://n8n.srv1794183.hstgr.cloud/webhook/cadastrar-alerta";

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