export interface IUser {
    email: string;
    isActivated: boolean;
    id: number; // бэк возвращает Long — это number во фронте, не string
}