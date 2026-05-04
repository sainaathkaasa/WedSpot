import type { AxiosError } from 'axios';

interface ApiErrorDetail {
    field?: string;
    message: string;
}

export function getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;

    const axiosError = error as AxiosError<{ message?: string; errors?: ApiErrorDetail[]; error?: string }>;

    if (axiosError.response?.data) {
        const data = axiosError.response.data;
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (data.errors?.length) {
            return data.errors.map((e) => e.message).join('. ');
        }
    }

    if (axiosError.message) return axiosError.message;

    return 'An unexpected error occurred';
}

export function getFieldErrors(error: unknown): Record<string, string> {
    const axiosError = error as AxiosError<{ errors?: ApiErrorDetail[]; fieldErrors?: Record<string, string[]> }>;

    if (axiosError.response?.data) {
        const data = axiosError.response.data;
        if (data.fieldErrors) {
            const flatMap: Record<string, string> = {};
            Object.entries(data.fieldErrors).forEach(([k, v]) => {
                flatMap[k] = Array.isArray(v) ? v[0] : v;
            });
            return flatMap;
        }
        if (data.errors?.length) {
            const fieldMap: Record<string, string> = {};
            data.errors.forEach((e) => {
                if (e.field) fieldMap[e.field] = e.message;
            });
            return fieldMap;
        }
    }

    return {};
}

export function isUnauthorizedError(error: unknown): boolean {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401;
}

export function isForbiddenError(error: unknown): boolean {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 403;
}

export function isNetworkError(error: unknown): boolean {
    const axiosError = error as AxiosError;
    return !axiosError.response && !!axiosError.code;
}
