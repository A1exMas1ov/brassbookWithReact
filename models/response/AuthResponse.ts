import {IUser} from "./IUser";

export interface AuthResponse{
    access_token: string; // Токен доступа (живет недолго)
    refresh_token: string; // Токен обновления (живет дольше)
    user: IUser;  // Данные пользователя
}

//Описывает, что бэкенд возвращает после успешного логина/регистрации.