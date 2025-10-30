"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    memberType: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const storedUserId = localStorage.getItem("userId");
            const loginStatus = localStorage.getItem("isLoggedIn");

            if (storedToken && storedUser && loginStatus === "true") {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                setIsLoggedIn(true);
                setIsAdmin(userData.memberType === "admin");

                // Ensure userId is stored if not present
                if (!storedUserId && userData.id) {
                    localStorage.setItem("userId", userData.id);
                }
            }
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        setIsLoggedIn(true);
        setIsAdmin(newUser.memberType === "admin");

        if (typeof window !== "undefined") {
            localStorage.setItem("token", newToken);
            localStorage.setItem("user", JSON.stringify(newUser));
            localStorage.setItem("isLoggedIn", "true");
            // Store userId separately for easy access in cart and other features
            localStorage.setItem("userId", newUser.id);

            window.dispatchEvent(new Event("loginStateChanged"));
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);

        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userId");

            window.dispatchEvent(new Event("loginStateChanged"));
        }
    };

    const value = {
        user,
        token,
        isLoggedIn,
        isAdmin,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
