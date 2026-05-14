// store/ProfileStore.ts
import { makeAutoObservable } from "mobx";
import ProfileService, { UpdateProfileRequest } from "../services/ProfileService";
import { IUser } from "../models/response/IUser";
import { getErrorMessage } from "../utils/errorUtils";

export default class ProfileStore {
    user = {} as IUser;
    isLoading = false;
    isPhotoUploading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: IUser) { this.user = user; }
    setLoading(bool: boolean) { this.isLoading = bool; }
    setPhotoUploading(bool: boolean) { this.isPhotoUploading = bool; }

    async fetchProfile() {
        this.setLoading(true);
        try {
            const response = await ProfileService.getProfile();
            const p = response.data;
            this.setUser({
                id: p.id,
                email: p.email,
                isActivated: true,
                displayName: p.displayName,
                displaySurname: p.displaySurname,
                photoUrl: p.photoUrl,
                role: p.role,
                companyName: p.companyName,
                profession: p.profession,
                inn: p.inn,
            } as IUser);
        } catch (e: unknown) {
            console.error("Fetch profile error:", getErrorMessage(e));
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    async updateProfile(data: UpdateProfileRequest) {
        this.setLoading(true);
        try {
            const response = await ProfileService.updateProfile(data);
            const p = response.data;
            this.setUser({
                ...this.user,
                displayName:    p.displayName,
                displaySurname: p.displaySurname,
                email:          p.email,
                companyName:    p.companyName,
                profession:     p.profession,
                inn:            p.inn,
            } as IUser);
        } catch (e: unknown) {
            console.error("Update profile error:", getErrorMessage(e));
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    async changePassword(currentPassword: string, newPassword: string) {
        this.setLoading(true);
        try {
            await ProfileService.changePassword({ currentPassword, newPassword });
        } catch (e: unknown) {
            console.error("Change password error:", getErrorMessage(e));
            throw e;
        } finally {
            this.setLoading(false);
        }
    }

    // Загрузка фото — добавить PUT /profile/photo на бэке
    async uploadPhoto(file: File) {
        this.setPhotoUploading(true);
        try {
            const response = await ProfileService.uploadPhoto(file);
            const p = response.data;
            this.setUser({ ...this.user, photoUrl: p.photoUrl });
        } catch (e: unknown) {
            console.error("Upload photo error:", getErrorMessage(e));
            throw e;
        } finally {
            this.setPhotoUploading(false);
        }
    }
}