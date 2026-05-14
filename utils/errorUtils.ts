import axios from "axios";

export function getErrorMessage(e: unknown): string {
    if (axios.isAxiosError(e)) {
        // ErrorResponse { message, detailedMessage, errorTime }
        return e.response?.data?.detailedMessage
            ?? e.response?.data?.message
            ?? e.message;
    }
    if (e instanceof Error) return e.message;
    return "Неизвестная ошибка";
}