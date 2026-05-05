import React, { useState, useCallback, useEffect } from "react";
import { authStore } from "@/features/auth/utils/authSingleton";
import { AUTH_SERVICE } from "@/features/auth/api/auth.api";
import { AuthContext } from "./AuthContext";
import { useUser } from "@/features/user";
import { HEALTH_SERVICE } from "@/api/health.api";
import { SessionExpiredModal } from "@/components/UI/SessionExpiredModal";
import { isTokenExpired } from "@/utils/jwt";
import type { AuthResponse, User } from "../types/auth.types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { setUser, clearUser } = useUser();
    const [accessToken, setAccessTokenState] = useState<string | null>(localStorage.getItem("accessToken"));
    const [isValidating, setIsValidating] = useState(true);
    const [showSessionExpired, setShowSessionExpired] = useState(false);

    const isAuthenticated = !!accessToken && !isTokenExpired(accessToken);

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

    const attemptTokenRefresh = useCallback(async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return false;

        try {
            const response = await AUTH_SERVICE.refreshToken(refreshToken);
            if (response.data?.accessToken) {
                setAccessToken(response.data.accessToken);
                return true;
            }
        } catch {
            return false;
        }
        return false;
    }, [setAccessToken]);

    const performLogout = useCallback(async (showPopup = false) => {
        if (showPopup) {
            setShowSessionExpired(true);
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user?.id) {
                await AUTH_SERVICE.logout(user.id);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setAccessToken(null);
        setRefreshToken(null);
        authStore.clearAll();
        clearUser();
        localStorage.removeItem("user");
    }, [setAccessToken, setRefreshToken, clearUser]);

    const handleSessionExpiredLogin = useCallback(() => {
        setShowSessionExpired(false);
        performLogout();
        window.location.href = '/login?session=expired';
    }, [performLogout]);

    // Listen for token refresh events from axios interceptor
    useEffect(() => {
        const handleTokenRefreshed = (e: CustomEvent) => {
            const { accessToken: newToken } = e.detail;
            if (newToken) {
                setAccessTokenState(newToken);
            }
        };

        const handleSessionExpired = () => {
            performLogout(true);
        };

        window.addEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
        window.addEventListener('sessionExpired', handleSessionExpired as EventListener);

        return () => {
            window.removeEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
            window.removeEventListener('sessionExpired', handleSessionExpired as EventListener);
        };
    }, [performLogout]);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsValidating(false);
                return;
            }

            if (isTokenExpired(token)) {
                const refreshed = await attemptTokenRefresh();
                if (!refreshed) {
                    performLogout(true);
                    setIsValidating(false);
                    return;
                }
            } else {
                try {
                    const verification = await AUTH_SERVICE.verifyToken(token);
                    if (!verification.data?.valid) {
                        const refreshed = await attemptTokenRefresh();
                        if (!refreshed) {
                            performLogout(true);
                            setIsValidating(false);
                            return;
                        }
                    }
                } catch {
                    // Server unreachable, trust client-side check
                }
            }
            setIsValidating(false);
        };

        validateToken();
    }, [attemptTokenRefresh, performLogout]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isAuthenticated) {
            HEALTH_SERVICE.check().catch(() => { });
            interval = setInterval(async () => {
                const token = localStorage.getItem("accessToken");
                if (token && isTokenExpired(token, 300)) {
                    const refreshed = await attemptTokenRefresh();
                    if (!refreshed) {
                        performLogout(true);
                    }
                }
            }, 300000);
        }
        return () => clearInterval(interval);
    }, [isAuthenticated, attemptTokenRefresh, performLogout]);

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

    // Wrapper for context that doesn't require ID (uses stored user)
    const logoutUser = useCallback(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.id) {
            logout(user.id);
        } else {
            performLogout(false);
        }
    }, [logout, performLogout]);

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

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <AuthContext.Provider
                value={{
                    accessToken,
                    login,
                    logout: logoutUser,
                    register,
                    isAuthenticated,
                }}
            >
                {children}
            </AuthContext.Provider>
            <SessionExpiredModal
                isOpen={showSessionExpired}
                onLogin={handleSessionExpiredLogin}
            />
        </>
    );
};

