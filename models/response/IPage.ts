// models/response/IPage.ts
// Spring Page<T> всегда возвращает эту обёртку

export interface IPage<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;          // текущая страница (0-based)
    size: number;
    last: boolean;
    first: boolean;
}
