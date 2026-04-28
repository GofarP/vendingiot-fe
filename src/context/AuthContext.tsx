"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Tambahkan usePathname di sini
import { useRouter, usePathname } from "next/navigation"; 
import { authService } from "../services/authServices";
import { LoginResponse } from "../types/auth";

interface AuthContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const savedUser = sessionStorage.getItem("vending_user");
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublicPage = pathname === "/login" || pathname === "/register";

      if (!user && !isPublicPage) {
        router.replace("/login");
      } else if (user && isPublicPage) {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    try {
      await authService.logout(refreshToken);
    } catch (error) {
      console.error("Gagal logout di server:", error);
    } finally {
      sessionStorage.clear();
      setUserState(null);
      router.replace("/login");
    }
  };

  const setUser = (data: LoginResponse | null) => {
    setUserState(data);
    if (data) {
      sessionStorage.setItem("vending_user", JSON.stringify(data));
    } else {
      sessionStorage.removeItem("vending_user");
    }
  };

  const isPublicPage = pathname === "/login" || pathname === "/register";
  
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {isLoading && !isPublicPage ? (
        <div className="h-screen w-screen flex items-center justify-center bg-white">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
};