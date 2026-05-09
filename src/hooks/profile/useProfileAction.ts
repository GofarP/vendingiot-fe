import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import profileService, { ChangePassword, UpdateProfile } from "@/src/services/profileServices";
import { toast } from "sonner";

export const useProfileAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  
  const handleUpdateInfo = async (data: UpdateProfile) => {
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

      toast.success(response.message || "Profil berhasil diperbarui!");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Gagal memperbarui profil";
      
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorMessage);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleChangePassword = async (data: ChangePassword) => {
    setIsLoading(true);
    try {
      const response = await profileService.changePassword(data);
      toast.success(response.message || "Password berhasil diubah!");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Gagal mengubah password";
      
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorMessage);
      }

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateInfo,
    handleChangePassword,
    isLoading,
  };
};