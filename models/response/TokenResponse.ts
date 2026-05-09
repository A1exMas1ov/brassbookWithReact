export interface TokenResponse {
    accessToken: string;   // camelCase — именно так возвращает бэк
    refreshToken: string;
}