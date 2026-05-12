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
  photoUrl: string;
  photo?: File | null;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const profileService = {

  getCurrentUser: async (): Promise<Profile> => {
    const res = await axiosInstance.get("/api/auth/me");
    return res.data;
  },


  updateProfile: async (data: UpdateProfile, photo?: File) => {
    const formData = new FormData();

    formData.append("FullName", data.fullName);
    formData.append("Email", data.email);

    if (photo) {
      formData.append('Photo', photo);
    }

    const res = await axiosInstance.put("/api/profile/updateprofile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  changePassword: async (data: ChangePassword) => {
    const res = await axiosInstance.put("/api/profile/changepassword", data);
    return res.data;
  }
};

export default profileService;