import React, { useState, useCallback } from "react";
import { UserContext } from "./UserContext";
import type { User } from "@/features/auth";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    const setUser = useCallback((userData: User | null) => {
        setUserState(userData);
        if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
    }, []);

    const clearUser = useCallback(() => {
        setUser(null as unknown as User);
    }, [setUser]);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
