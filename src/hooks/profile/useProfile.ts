import { useState } from "react";
import profileService, { ChangePassword, UpdateProfile } from "@/src/services/profileServices";
import { useAuth } from "@/src/context/AuthContext";
import {toast} from 'sonner';

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();


  const updateInfo = async (data: UpdateProfile) => {
    setIsLoading(true);
    try {
      const response = await profileService.updateProfile(data);

      const token = sessionStorage.getItem("token");
      const refreshToken = sessionStorage.getItem("refreshToken");

      setUser({
        ...response,
        accessToken: token,
        tokenType: "Bearer",
      });

      toast.success(response.message || "Profil diperbarui!");
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal memperbarui profil";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

 
  const changeUserPassword = async (data: ChangePassword) => {
    setIsLoading(true);
    try {
      const response = await profileService.changePassword(data);
      toast.success(response.message || "Password berhasil diganti!");
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal mengganti password";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateInfo,
    changeUserPassword,
    isLoading,
  };
};