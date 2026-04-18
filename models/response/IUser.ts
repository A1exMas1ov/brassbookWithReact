export interface IUser{
    email: string;
    isActivated: boolean; // Подтвержден ли email
    id: string;
}

// TypeScript интерфейс, который описывает, как выглядит объект пользователя. 
// Бэкенд должен возвращать пользователя именно в таком формате.