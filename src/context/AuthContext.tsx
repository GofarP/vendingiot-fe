
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LoginResponse } from "@/src/types/auth";

interface AuthContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("vending_user");
    if (saved) {
      try {
        setUserState(JSON.parse(saved) as LoginResponse);
      } catch (e) {
        console.error("Session data corrupt");
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (data: LoginResponse | null) => {
    setUserState(data);
    if (data) {
      sessionStorage.setItem("vending_user", JSON.stringify(data));
    } else {
      sessionStorage.removeItem("vending_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Gunakan AuthProvider untuk membungkus Root Layout!");
  }
  return context;
};