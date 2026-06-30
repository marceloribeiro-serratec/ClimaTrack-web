import axios from "axios";

export interface WeatherAlertPayload {
    event: "weather_alert";
    email: string;
    city: string;
    reason: "high_temperature" | "low_temperature" | "high_humidity" | "rain";
    weather: {
        temperature: number;
        humidity: number;
        description: string;
    };
}

export async function sendWeatherAlert(payload: WeatherAlertPayload): Promise<void> {
    const webhookUrl = import.meta.env.VITE_N8N_ALERT_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn(
            "VITE_N8N_ALERT_WEBHOOK_URL nao esta configurado. O alerta nao sera enviado.",
        );
        return;
    }

    try {
        await axios.post(webhookUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 10000,
        });
    } catch (error) {
        console.error("Falha ao enviar alerta climatico para o n8n:", error);
    }
}
