import type { APIResponse } from "@/api/types";

export const UserRole = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    STAFF: "Staff",
    VENDOR: "Vendor",
    CLIENT: "Client",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id?: number;
    email: string;
    name: string;
    password?: string;
    role: UserRole;
    phoneNumber?: string;
    address?: string;
    createdAt?: string;
    enabled?: boolean;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export type AuthResponse = APIResponse<LoginResponse>;

export interface ResetPasswordPayload {
    email: string;
    password: string;
    confirmPassword?: string;
    otp?: string;
}

export type PaginatedAPIResponse<T = unknown> = APIResponse<T[]>;

export interface TokenVerificationResponse {
    valid: boolean;
    email: string;
    role: string;
    message: string;
}


