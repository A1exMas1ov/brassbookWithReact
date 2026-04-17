import { makeAutoObservable } from "mobx";
import { IUser } from "../models/response/IUser";
import AuthService from "../services/AuthService";
import { AuthResponse } from "../models/response/AuthResponse";
import axios from "axios";
import { RegistrationData } from "../models/RegistrationData.ts";
import { API_URL } from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

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

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);  // ВОТ ТУТ происходит сам "звонок" на бэк
            localStorage.setItem('token', response.data.access_token);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.error("Login error:", e.response?.data?.message);
            throw e; // Пробрасываем ошибку в компонент
        }
    }

    async registration(values: RegistrationData) {
        try {
            // Имитируем успешный ответ (добавляем все обязательные поля из IUser)
            this.setUser({ 
                email: values.email, 
                id: 'mock-id', 
                isActivated: false 
            } as IUser); 

            this.setAuth(true); 
            return true;
            // const response = await AuthService.registration(data);
            // localStorage.setItem('token', response.data.access_token);
            // this.setAuth(true);
            // this.setUser(response.data.user);
            // return response;
        } catch (e: any) {
            console.error("Registration error:", e.response?.data?.message);
            throw e; // Чтобы форма могла показать ошибку пользователю
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { 
                withCredentials: true 
            });
            localStorage.setItem('token', response.data.access_token);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log("User is not authorized (refresh failed)");
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any) {
            console.error(e.response?.data?.message);
        }
    }
}