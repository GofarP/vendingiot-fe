"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    const savedUser = sessionStorage.getItem("vending_user");
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const logout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");

    try {
      await authService.logout(refreshToken);
    } catch (error) {
      console.error(
        "Gagal logout di server, tapi tetap bersihkan browser:",
        error,
      );
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
};
