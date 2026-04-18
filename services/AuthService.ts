import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import $api from "../http";
import { RegistrationData } from "../models/RegistrationData";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', { email, password });
    }

    static async registration(data: RegistrationData): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', data);  // ВОТ ТУТ указывается путь (эндпоинт)
    }

    static async checkEmail(email: string) {
        return $api.post<AuthResponse>('/check-email', { email });
    }


    // Исправлено: используем void и просто дожидаемся выполнения запроса
    static async logout(): Promise<void> {
        await $api.post('/logout');
    }
}