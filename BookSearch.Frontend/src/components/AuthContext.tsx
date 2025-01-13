import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            const decodedToken = jwtDecode<JwtPayload>(token);
            if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        }

        const handleStorageChange = () => {
            const token = localStorage.getItem("authToken");
            setIsAuthenticated(!!token);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const login = (token: string) => {
        localStorage.setItem("authToken", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
