"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { LoginResponse } from "../types/auth";

interface AuthContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  isLoading: boolean;
  hasPermission: (PermissionName: string) => boolean;
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

  const hasPermission = (permissionName: string) => {
    return user?.permissions?.includes(permissionName) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("diperlukan root layout untuk AuthProvider");
  }
  return context;
};
