// src/hooks/login/useLogin.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";

export const useLogin = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const performLogin = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        credentials
      );

      if (response.status === 200) {
        const { token, refreshToken, ...userData } = response.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("vending_user", JSON.stringify(userData));
        setUser(userData);

        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setFieldErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        setError(err.response.data.message || "Email atau password salah");
      } else {
        setError("Terjadi kesalahan pada server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { performLogin, isLoading, error, fieldErrors };
};