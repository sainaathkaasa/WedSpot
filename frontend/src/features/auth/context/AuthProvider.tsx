import React, { useState, useCallback, useEffect } from "react";
import { authStore } from "@/features/auth/utils/authSingleton";
import { AUTH_SERVICE } from "@/features/auth/api/auth.api";
import { AuthContext } from "./AuthContext";
import { useUser } from "@/features/user";
import { HEALTH_SERVICE } from "@/api/health.api";
import type { AuthResponse, User } from "../types/auth.types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { setUser, clearUser } = useUser();
    const [accessToken, setAccessTokenState] = useState<string | null>(localStorage.getItem("accessToken"));

    const isAuthenticated = !!accessToken;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isAuthenticated) {
            HEALTH_SERVICE.check().catch(() => { });
            interval = setInterval(() => {
                HEALTH_SERVICE.check().catch(() => { });
            }, 300000);
        }
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const setAccessToken = useCallback((t: string | null) => {
        setAccessTokenState(t);
        authStore.setAccessToken(t);
        if (t) {
            localStorage.setItem("accessToken", t);
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("authToken");
        }
    }, []);

    const setRefreshToken = useCallback((t: string | null) => {
        authStore.setRefreshToken(t);
        if (t) {
            localStorage.setItem("refreshToken", t);
        } else {
            localStorage.removeItem("refreshToken");
        }
    }, []);

    useEffect(() => {
        authStore.setAccessToken(accessToken);
    }, [accessToken]);

    const login = useCallback(
        async (email: string, password: string) => {
            const response: AuthResponse = await AUTH_SERVICE.login({ email, password });
            if (response.ok) {
                const authData = response.data;
                const token = authData?.accessToken ?? null;
                const refresh = authData?.refreshToken ?? null;
                const user: User | undefined = authData?.user;
                setAccessToken(token);
                setRefreshToken(refresh);
                if (user) setUser(user);
            }
            return response;
        },
        [setAccessToken, setRefreshToken, setUser]
    );

    const logout = useCallback(async (id: number) => {
        try {
            await AUTH_SERVICE.logout(id);
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setAccessToken(null);
        setRefreshToken(null);
        authStore.clearAll();
        clearUser();
    }, [setAccessToken, setRefreshToken, clearUser]);

    const register = useCallback(
        async (user: User) => {
            const response: AuthResponse = await AUTH_SERVICE.register(user);
            if (response.ok) {
                const authData = response.data;
                const token = authData?.accessToken ?? null;
                const refresh = authData?.refreshToken ?? null;

                setAccessToken(token);
                setRefreshToken(refresh);
                if (authData?.user) {
                    setUser(authData.user);
                }
            }
            return response;
        },
        [setAccessToken, setRefreshToken, setUser]
    );

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                login,
                logout,
                register,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
