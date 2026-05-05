export interface APIResponse<T = unknown> {
    data: T;
    timestamp: string;
    message: string;
    statusCode: number;
    totalElements?: number;
    totalPages?: number;
    pageNumber?: number;
    pageSize?: number;
    ok: boolean;
}
