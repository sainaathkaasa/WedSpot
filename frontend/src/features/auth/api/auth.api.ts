import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";
import type { AuthResponse, User, ResetPasswordPayload, TokenVerificationResponse } from "@/features/auth/types/auth.types";
import type { APIResponse } from "@/api/types";


// ─── Auth Service ───────────────────────────────────────────────
export const AUTH_SERVICE = {
    login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
        try {
            const response = await api.post(endpoints.SignIn, payload);
            const apiResponse = response.data as AuthResponse;
            return apiResponse;
        } catch (error) {
            throw error;
        }
    },

    register: async (payload: User): Promise<AuthResponse> => {
        try {
            const response = await api.post(endpoints.SignUp, payload);
            const apiResponse = response.data as AuthResponse;
            return apiResponse;
        } catch (error) {
            throw error;
        }
    },


    logout: async (id: number) => {
        try {
            const response = await api.get(endpoints.SignOut + `/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (email: string): Promise<APIResponse<void>> => {
        const response = await api.post(endpoints.ForgotPassword, { email });
        return response.data;
    },

    verifyOtp: async (email: string, otp: string): Promise<APIResponse<void>> => {
        const response = await api.post(endpoints.VerifyOtp, { email, otp });
        return response.data;
    },

    resetPassword: async (payload: ResetPasswordPayload): Promise<APIResponse<void>> => {
        const response = await api.post(endpoints.ResetPassword, payload);
        return response.data;
    },

    verifyToken: async (token: string): Promise<APIResponse<TokenVerificationResponse>> => {
        const response = await api.post(endpoints.VerifyToken, null, {
            params: { token }
        });
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post("/auth/refresh-token", { refreshToken });
        return response.data;
    },
};
