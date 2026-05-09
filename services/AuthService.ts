import { AxiosResponse } from "axios";
import { TokenResponse } from "../models/response/TokenResponse.ts";
import $api from "../http";
import { RegistrationData } from "../models/RegistrationData";

export interface RegistrationResponse {
    id: number; // бэк возвращает только id созданного пользователя
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

    // POST /api/v1/registration — создать пользователя (шаг 2 после sendCode)
    static async registration(data: RegistrationData): Promise<AxiosResponse<RegistrationResponse>> {
        return $api.post<RegistrationResponse>('/registration', data);
    }

    // POST /api/v1/sendCode — отправить/проверить код на email
    // isConfirmed: false = просто отправить код, true = подтвердить
    static async sendCode(email: string, isConfirmed: boolean): Promise<AxiosResponse<void>> {
        return $api.post<void>('/sendCode', { email, isConfirmed });
    }

    // PUT /api/v1/registration — обновить пароль по id пользователя
    static async updatePassword(password: string, id: number): Promise<AxiosResponse<void>> {
        return $api.put<void>('/registration', { password, id });
    }

    // GET /api/v1/token/refresh — обновить токены (вызывается автоматически в интерцепторе)
    // Вручную использовать не нужно — интерцептор в index.ts делает это сам
}