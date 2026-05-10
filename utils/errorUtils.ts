// utils/errorUtils.ts
import axios from "axios";

export function getErrorMessage(e: unknown): string {
    if (axios.isAxiosError(e)) {
        return e.response?.data?.message ?? e.message;
    }
    if (e instanceof Error) return e.message;
    return "Unknown error";
}