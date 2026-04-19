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
     restoreEmail = '';

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
            // ===== ЗАГЛУШКА (пока нет бэка) =====
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Простая проверка для теста
            // Можно войти с любыми данными, или только с конкретными
            if (email && password) {
                const mockToken = 'mock_token_' + Date.now();
                localStorage.setItem('token', mockToken);
                this.setAuth(true);
                this.setUser({ 
                    email: email, 
                    id: 'mock_id_' + Date.now(), 
                    isActivated: true 
                } as IUser);
                return;
            }
            
            // const response = await AuthService.login(email, password);  // ВОТ ТУТ происходит сам "звонок" на бэк
            // localStorage.setItem('token', response.data.access_token);
            // this.setAuth(true);
            // this.setUser(response.data.user);
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

    async checkEmailAndSendCode(email: string) {
        
        // ===== ЗАГЛУШКА =====
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.restoreEmail = email;
            console.log(`Mock: Код для ${email} - 123456`);
            alert(`Демо-режим: Ваш код подтверждения - 123456`);
            return true;
        // ========== когда появится бэк) ==========
        // const response = await AuthService.checkEmail(email);
        // 
        // if (!response.data.exists) {
        //     throw new Error('Пользователь с таким email не найден');
        // }
        // 
        // await AuthService.sendRestoreCode(email);
        // this.restoreEmail = email;
        // return true;
        
    }   

    async resetPassword(newPassword: string, confirmPassword: string) {     
        this.setLoading(true);
        try {
            // ===== ЗАГЛУШКА =====
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log(`Mock: Пароль изменен для ${this.restoreEmail}`);
            alert(`Демо-режим: Пароль успешно изменен!`);
            
            const savedEmail = this.restoreEmail;
            this.restoreEmail = '';
            return true;
            
            // ===== РЕАЛЬНЫЙ КОД =====
            // await AuthService.resetPassword(this.restoreEmail, newPassword);
            // this.restoreEmail = '';
            // return true;
        } catch (e: any) {
            console.error("Reset password error:", e.message);
            throw e;
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