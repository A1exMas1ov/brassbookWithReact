// models/response/IAlbum.ts
// Соответствует AlbumResponse.java на бэке

export interface IAlbum {
    id: number;
    name: string;
    avatarUrl: string | null;
    createdAt: string;       // LocalDateTime → строка ISO 8601
    recordCount: number;
}
