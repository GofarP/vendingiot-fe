import axiosInstance from "../lib/axios";

export interface Profile {
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

export interface UpdateProfile {
  fullName: string;
  email: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const profileService = {
  
  getCurrentUser: async (): Promise<Profile> => {
    const res = await axiosInstance.get("/api/profile/me");
    return res.data;
  },

  
  updateProfile: async (data: UpdateProfile) => {
    const res = await axiosInstance.put("/api/profile/profile", data);
    return res.data;
  },

  
  changePassword: async (data: ChangePassword) => {
    // Menyesuaikan dengan route [HttpPut("change-password")] di Backend
    const res = await axiosInstance.put("/api/profile/change-password", data);
    return res.data;
  }
};

export default profileService;