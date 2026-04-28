import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch (err: any) {
      setError("Gagal keluar dari sistem. Silahkan coba lagi.");
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { performLogout, isLoading, error };
};