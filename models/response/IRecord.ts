// models/response/IRecord.ts
// Соответствует RecordResponse.java на бэке

export interface IRecord {
    id: number;
    title: string;
    duration: number;        // в секундах
    fileUrl: string | null;
    averageRating: number | null;
    createdAt: string;
    isFavorite: boolean;
}
