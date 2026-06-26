import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(value: string) {
    return format(parseISO(value), "dd/MM 'às' HH:mm", { locale: ptBR });
}

export function formatHourLabel(value: string) {
    return format(parseISO(value), "HH:mm", { locale: ptBR });
}

export function formatDayLabel(value: string, index?: number) {
    if (index === 0) {
        return "Hoje";
    }

    return format(parseISO(value), "EEE", { locale: ptBR });
}

export function formatDayAndMonth(value: string) {
    return format(parseISO(value), "dd/MM", { locale: ptBR });
}

