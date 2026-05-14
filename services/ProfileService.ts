// services/ProfileService.ts
import { AxiosResponse } from "axios";
import $api from "../http";

export interface ProfileResponse {
    id: number;
    email: string;
    displayName?: string;
    displaySurname?: string;
    photoUrl?: string;
    role: string;
    createdAt: string;
    companyName?: string;
    profession?: string;
    inn?: number;
}

export interface UpdateProfileRequest {
    displayName?: string;
    displaySurname?: string;
    email?: string;
    companyName?: string;
    profession?: string;
    inn?: number;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export default class ProfileService {
    // GET /api/v1/profile
    static async getProfile(): Promise<AxiosResponse<ProfileResponse>> {
        return $api.get<ProfileResponse>('/profile');
    }

    // PUT /api/v1/profile
    static async updateProfile(data: UpdateProfileRequest): Promise<AxiosResponse<ProfileResponse>> {
        return $api.put<ProfileResponse>('/profile', data);
    }

    // PUT /api/v1/profile/password — эндпоинт ещё не готов, скажи напарнику
    static async changePassword(data: ChangePasswordRequest): Promise<AxiosResponse<void>> {
        return $api.put<void>('/profile/password', data);
    }

    // DELETE /api/v1/profile
    static async deleteAccount(): Promise<AxiosResponse<void>> {
        return $api.delete<void>('/profile');
    }

    // PUT /api/v1/profile/photo — multipart/form-data
    // Эндпоинта пока нет на бэке — заглушка готова к подключению
    static uploadPhoto(file: File): Promise<AxiosResponse<ProfileResponse>> {
        const formData = new FormData();
        formData.append("photo", file);
        return $api.put<ProfileResponse>("/profile/photo", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}