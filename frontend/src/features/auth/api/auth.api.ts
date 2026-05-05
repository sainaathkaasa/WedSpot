import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";
import type { UserRole, AuthResponse, User, ResetPasswordPayload } from "@/features/auth/types/auth.types";
import type { APIResponse } from "@/api/types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

// ─── Mock Helpers ───────────────────────────────────────────────
const mockLogin = (payload: { email: string; password: string }): AuthResponse => {
    const email = payload.email.toLowerCase();

    let role: UserRole = "Client";
    if (email.includes("admin")) role = "Admin";
    else if (email.includes("manager")) role = "Manager";
    else if (email.includes("staff")) role = "Staff";
    else if (email.includes("vendor")) role = "Vendor";

    return {
        ok: true,
        message: `Mock Login Success as ${role}`,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: {
            accessToken: `mock-token-${role.toLowerCase()}`,
            refreshToken: `mock-token-${role.toLowerCase()}`,
            user: {
                id: 1,
                role: role,
                name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
                email: email,
                address: "Banglore",
                phoneNumber: "1234567890",
            }
        },
    };
};

const mockRegister = (payload: { email: string; role: UserRole }): AuthResponse => ({
    ok: true,
    message: "Mock Registration Success",
    timestamp: new Date().toISOString(),
    statusCode: 200,
    data: {
        accessToken: `mock-token-${payload.role.toLowerCase()}`,
        refreshToken: `mock-token-${payload.role.toLowerCase()}`,
        user: {
            id: 1,
            role: payload.role,
            name: payload.email.split("@")[0].charAt(0).toUpperCase() + payload.email.split("@")[0].slice(1),
            email: payload.email,
            address: "Banglore",
            phoneNumber: "1234567890",
        }
    },
});

// ─── Auth Service ───────────────────────────────────────────────
export const AUTH_SERVICE = {
    login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
        try {
            const response = await api.post(endpoints.SignIn, payload);
            const apiResponse = response.data as AuthResponse;
            if (apiResponse.data?.accessToken) {
                localStorage.setItem("accessToken", apiResponse.data.accessToken);
            }
            return apiResponse;
        } catch (error) {
            if (USE_MOCK) {
                console.warn("Login API failed, using mock fallback:", error);
                return mockLogin(payload);
            }
            throw error;
        }
    },

    register: async (payload: User): Promise<AuthResponse> => {
        try {
            const response = await api.post(endpoints.SignUp, payload);
            const apiResponse = response.data as AuthResponse;
            if (apiResponse.data?.accessToken) {
                localStorage.setItem("accessToken", apiResponse.data.accessToken);
            }
            return apiResponse;
        } catch (error) {
            if (USE_MOCK) {
                console.warn("Register API failed, using mock fallback:", error);
                return mockRegister(payload);
            }
            throw error;
        }
    },


    logout: async (id: number) => {
        try {
            const response = await api.get(endpoints.SignOut + `/${id}`);
            return response.data;
        } catch (error) {
            if (USE_MOCK) return { ok: true, message: "Mock Logout Success" };
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

    refreshToken: async (refreshToken: string): Promise<{ data: { accessToken: string } }> => {
        const response = await api.post("/auth/refresh-token", { refreshToken });
        return response;
    },
};
