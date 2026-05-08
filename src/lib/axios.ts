import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError | Error | null) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: AxiosError | Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    // --- LOGIKA BARU UNTUK 403 (FORBIDDEN) ---
    // Jika error 403 dan ini SUDAH merupakan request percobaan ulang (_retry),
    // artinya user memang benar-benar tidak punya akses. Tampilkan Forbidden Page.
    if (error.response?.status === 403 && originalRequest._retry) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("api-forbidden"));
      }
      return Promise.reject(error);
    }

    // Tentukan apakah harus mencoba refresh token
    // Kita coba refresh baik di 401 maupun 403 (percobaan pertama)
    const shouldRefresh = 
      (error.response?.status === 401 || error.response?.status === 403) && 
      !originalRequest._retry;

    if (shouldRefresh) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const oldToken = sessionStorage.getItem("token");
        const refreshToken = sessionStorage.getItem("refreshToken");

        // Gunakan axios standar agar tidak kena interceptor ini lagi (mencegah loop)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
          accessToken: oldToken,
          refreshToken: refreshToken
        });

        if (res.status === 200) {
          const { token, refreshToken: newRefreshToken } = res.data;

          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refreshToken", newRefreshToken);

          processQueue(null, token);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError: any) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;

        // Jika refresh token gagal (401/403 dari API Refresh), artinya sesi habis
        sessionStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;