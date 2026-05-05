import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";
import type { APIResponse } from "@/api/types";
import type { User } from "@/features/auth";

export const USER_SERVICE = {
    getProfile: async (id: number): Promise<APIResponse<User>> => {
        const response = await api.get(`${endpoints.User}/${id}`);
        return response.data;
    },

    updateProfile: async (id: number, payload: User): Promise<APIResponse<User>> => {
        const response = await api.put(`${endpoints.User}/profile/${id}`, payload);
        return response.data;
    },

    changePassword: async (id: number, currentPassword: string, newPassword: string): Promise<APIResponse<void>> => {
        const response = await api.put(`${endpoints.User}/password/${id}`, {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    getAllUsers: async (): Promise<APIResponse<User[]>> => {
        const response = await api.get(`${endpoints.Users}`);
        return response.data;
    },

    getUserById: async (id: number): Promise<APIResponse<User>> => {
        const response = await api.get(`${endpoints.User}/${id}`);
        return response.data;
    },

    deleteUserById: async (id: number): Promise<APIResponse<void>> => {
        const response = await api.delete(`${endpoints.User}/${id}`);
        return response.data;
    },
};

