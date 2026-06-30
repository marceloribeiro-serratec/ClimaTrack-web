import { useState } from "react";
import { toast } from "sonner";
import { cadastrarAlertaTelegram } from "../services/n8n-telegram-service";

interface UseTelegramAlertsProps {
    weather: any;
}

export function useTelegramAlerts({ weather }: UseTelegramAlertsProps) {
    const [chatId, setChatId] = useState("");
    const [loadingAlerta, setLoadingAlerta] = useState(false);

    async function ativarAlertaDiario(e: React.FormEvent) {
        e.preventDefault();

        if (!chatId.trim()) {
            toast.error("Por favor, digite um Chat ID válido.");
            return;
        }

        const lat = weather?.location?.latitude?.toString() || "-22.4167";
        const lon = weather?.location?.longitude?.toString() || "-42.9782";
        const cidadeNome = weather?.location?.name || "Sua Cidade";

        setLoadingAlerta(true);

        try {
            await cadastrarAlertaTelegram({
                chatId: chatId.trim(),
                latitude: lat,
                longitude: lon,
                cidade: cidadeNome,
            });

            toast.success(`🚀 Alerta ativado para ${cidadeNome}! Mensagem diária às 8h.`);
            setChatId("");
        } catch (erro) {
            console.error("Erro ao enviar dados para o n8n:", erro);
            toast.error("Erro de conexão ou falha no servidor do Alerta.");
        } finally {
            setLoadingAlerta(false);
        }
    }

    return {
        chatId,
        setChatId,
        loadingAlerta,
        ativarAlertaDiario,
    };
}