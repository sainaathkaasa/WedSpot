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
