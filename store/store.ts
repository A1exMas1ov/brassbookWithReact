import { makeAutoObservable } from "mobx";
import { IUser } from "../models/response/IUser";
import AuthService from "../services/AuthService";
import { TokenResponse } from "../models/response/TokenResponse";
import { RegistrationData } from "../models/RegistrationData";
import axios from "axios";
import { API_URL } from "../http";
import { getErrorMessage } from "../utils/errorUtils";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    // Email для восстановления пароля (передаётся между страницами restore → restoreauth → restore?success)
    restoreEmail = '';
    restoreCode = '';

    // Данные формы регистрации (хранятся между signup → signupauth)
    pendingRegistration: (RegistrationData & { code: string }) | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) { this.isAuth = bool; }
    setUser(user: IUser) { this.user = user; }
    setLoading(bool: boolean) { this.isLoading = bool; }

    // ── ВХОД ────────────────────────────────────────────────────────────
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            this.setUser({ email, id: 0, isActivated: true } as IUser);
        } catch (e: unknown) {
            console.error("Login error:", getErrorMessage(e));
            throw new Error(getErrorMessage(e));
        }
    }

    // ── РЕГИСТРАЦИЯ ──────────────────────────────────────────────────────
    // Шаг 1: отправить код на email
    async sendCode(email: string, isConfirmed: boolean) {
        try {
            await AuthService.sendCode(email, isConfirmed);
            return true;
        } catch (e: unknown) {
            console.error("Send code error:", getErrorMessage(e));
            throw new Error(getErrorMessage(e));
        }
    }

    // Повторная отправка кода (кнопка "Отправить повторно")
    async refreshCode(email: string) {
        try {
            await AuthService.refreshCode(email, true);
            return true;
        } catch (e: unknown) {
            console.error("Refresh code error:", getErrorMessage(e));
            throw new Error(getErrorMessage(e));
        }
    }

    // Шаг 2: создать пользователя с кодом
    async registration(data: RegistrationData) {
        try {
            const response = await AuthService.registration(data);
            this.setUser({
                email: data.email,
                id: response.data.id,
                isActivated: false
            } as IUser);
            return response.data;
        } catch (e: unknown) {
            console.error("Registration error:", getErrorMessage(e));
            throw new Error(getErrorMessage(e));
        }
    }

    // ── ВОССТАНОВЛЕНИЕ ПАРОЛЯ ────────────────────────────────────────────
    // Отправить код на email для восстановления
    async checkEmailAndSendCode(email: string, isConfirmed: boolean) {
        this.setLoading(true);
        try {
            await AuthService.refreshCode(email, isConfirmed);
            this.restoreEmail = email;
            return true;
        } catch (e: unknown) {
            console.error("Check email error:", getErrorMessage(e));
            throw new Error(getErrorMessage(e));
        } finally {
            this.setLoading(false);
        }
    }

    // Сменить пароль — бэк: PUT /registration { email, code, password }
    async resetPassword(email: string, code: string, newPassword: string) {
        this.setLoading(true);
        try {
            await AuthService.updatePassword(email, code, newPassword);
            this.restoreEmail = '';
            this.restoreCode = '';
            return true;
        } catch (e: unknown) {
            console.error("Reset password error:", getErrorMessage(e));
            throw new Error(getErrorMessage(e));
        } finally {
            this.setLoading(false);
        }
    }

    // ── ПРОВЕРКА СЕССИИ ──────────────────────────────────────────────────
    async checkAuth() {
        this.setLoading(true);
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.get<TokenResponse>(`${API_URL}/token/refresh`, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
        } catch (e: unknown) {
            console.log("User is not authorized (refresh failed)");
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        } finally {
            this.setLoading(false);
        }
    }

    async verifyRestoreCode(email: string, code: string) {
    try {
        await AuthService.verifyRestoreCode(email, code);
        return true;
    } catch (e: unknown) {
        console.error("Verify code error:", getErrorMessage(e));
        throw new Error(getErrorMessage(e));
    }
    }

    // ── ВЫХОД ────────────────────────────────────────────────────────────
    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.setAuth(false);
        this.setUser({} as IUser);
    }
}