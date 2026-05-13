// models/response/IUser.ts
export interface IUser {
    id: number;
    email: string;
    isActivated: boolean;
    displayName?: string;
    displaySurname?: string;
    photoUrl?: string;
    role?: string; // "ROLE_PERSONAL" | "ROLE_COMPANY" | "ROLE_ANONYMOUS"
    createdAt?: string;
    // корпоративные — когда напарник добавит в ProfileResponse
    companyName?: string;
    profession?: string;
    inn?: number;
}