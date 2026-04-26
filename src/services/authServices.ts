import { ApiValidationError, LoginRequest, LoginResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiValidationError;
    }

    return data as LoginResponse;
  },
  logout: async (): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }
};