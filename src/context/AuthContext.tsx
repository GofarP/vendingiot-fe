"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/authServices";
import { LoginResponse } from "../types/auth";

interface AuthContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = sessionStorage.getItem("vending_user");
        if (savedUser) {
          setUserState(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const hasPermission = (permissionName: string): boolean => {
    if (!user || !user.permissions) return false;

    return user.permissions.includes(permissionName);
  };

  const setUser = (data: LoginResponse | null) => {
    setUserState(data);
    if (data) {
      sessionStorage.setItem("vending_user", JSON.stringify(data));
    } else {
      sessionStorage.removeItem("vending_user");
    }
  };

  const logout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    try {
      await authService.logout(refreshToken);
    } catch (error) {
      console.error("Gagal logout:", error);
    } finally {
      sessionStorage.clear();
      setUserState(null);
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
};