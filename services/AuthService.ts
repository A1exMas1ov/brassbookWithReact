import { AxiosResponse } from "axios";
import { TokenResponse } from "../models/response/TokenResponse";
import $api from "../http";
import { RegistrationData } from "../models/RegistrationData";

export interface RegistrationResponse {
    id: number;
}

export default class AuthService {

    // POST /api/v1/auth/login
    static async login(email: string, password: string): Promise<AxiosResponse<TokenResponse>> {
        return $api.post<TokenResponse>('/auth/login', { email, password });
    }

    // POST /api/v1/auth/init — создать анонимного пользователя
    static async initUser(): Promise<AxiosResponse<TokenResponse>> {
        return $api.post<TokenResponse>('/auth/init');
    }

    // POST /api/v1/registration — создать пользователя с кодом
    static async registration(data: RegistrationData): Promise<AxiosResponse<RegistrationResponse>> {
        return $api.post<RegistrationResponse>('/registration', data);
    }

    // POST /api/v1/sendCode — отправить код на email (isConfirmed: false = отправить, true = подтвердить)
    static async sendCode(email: string, isConfirmed: boolean): Promise<AxiosResponse<void>> {
        return $api.post<void>('/sendCode', { email, isConfirmed });
    }

    // POST /api/v1/refreshCode — повторно отправить код (кнопка "Отправить повторно")
    static async refreshCode(email: string, isConfirmed: boolean): Promise<AxiosResponse<void>> {
        return $api.post<void>('/refreshCode', { email, isConfirmed });
    }

    // PUT /api/v1/registration — сменить пароль { email, code, password }
    static async updatePassword(email: string, code: string, password: string): Promise<AxiosResponse<void>> {
        return $api.put<void>('/registration', { email, code, password });
    }

    static async verifyRestoreCode(email: string, code: string) {
    return $api.post('/verifyCode', { email, code });
    }

    // GET /api/v1/token/refresh — обновляется автоматически через интерцептор в index.ts
}