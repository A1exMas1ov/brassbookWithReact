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

    // userId пользователя, которому меняем пароль (заполняется после подтверждения кода)
    restoreUserId: number | null = null;

    // Данные формы регистрации (хранятся между signup → signupauth)
    pendingRegistration: (RegistrationData & { code: string }) | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    // ── ВХОД ────────────────────────────────────────────────────────────
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            // Бэк не возвращает user при логине — устанавливаем email вручную
            this.setUser({ email, id: 0, isActivated: true } as IUser);
        } catch (e: unknown) {
            console.error("Login error:", getErrorMessage(e));
            throw e;
        }
    }

    // ── РЕГИСТРАЦИЯ ──────────────────────────────────────────────────────
    // Шаг 1: отправить код на email (isConfirmed: false)
    async sendCode(email: string) {
        try {
            await AuthService.sendCode(email, false);
            return true;
        } catch (e: unknown) {
            console.error("Send code error:", getErrorMessage(e));
            throw e;
        }
    }

    // Шаг 2: подтвердить код (isConfirmed: true)
    async confirmCode(email: string) {
        try {
            await AuthService.sendCode(email, true);
            return true;
        } catch (e: unknown) {
            console.error("Confirm code error:", getErrorMessage(e));
            throw e;
        }
    }

    // Шаг 3: создать пользователя с кодом
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
            throw e;
        }
    }

    // ── ВОССТАНОВЛЕНИЕ ПАРОЛЯ ────────────────────────────────────────────
    // Проверить email и отправить код
    async checkEmailAndSendCode(email: string) {
        this.setLoading(true);
        try {
            await AuthService.sendCode(email, false);
            this.restoreEmail = email;
            return true;
        } catch (e: unknown) {
            console.error("Check email error:", getErrorMessage(e));
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    // Сменить пароль (бэк: PUT /registration с { password, id })
    async resetPassword(newPassword: string, userId: number) {
        this.setLoading(true);
        try {
            await AuthService.updatePassword(newPassword, userId);
            this.restoreEmail = '';
            this.restoreUserId = null;
            return true;
        } catch (e: unknown) {
            console.error("Reset password error:", getErrorMessage(e));
            throw e;
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

    // ── ВЫХОД ────────────────────────────────────────────────────────────
    async logout() {
        // На бэке нет эндпоинта logout — просто чистим локальное состояние
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.setAuth(false);
        this.setUser({} as IUser);
    }
}