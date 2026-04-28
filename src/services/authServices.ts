import axiosInstance from "../lib/axios";
import { LoginRequest, LoginResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/api/auth/login", credentials);
    return response.data;
  },

  logout: async (refreshToken: string | null): Promise<void> => {
    if (!refreshToken) return;
    await axiosInstance.post("/api/auth/logout", {
      refreshToken: refreshToken
    });
  }
};