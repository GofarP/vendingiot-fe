import { useState, useEffect, useCallback } from "react";
import { homeService, HomeStats } from "@/src/services/homeServices";

/**
 * Custom Hook useHome
 * Digunakan untuk mengelola data statistik dashboard VendingIot.
 */
export const useHome = () => {
  const [data, setData] = useState<HomeStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await homeService.getStats();
      setData(stats);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengambil data statistik");
      console.error("Home Stats Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchStats 
  };
};