import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
});


axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const oldToken = sessionStorage.getItem("token");
        const refreshToken = sessionStorage.getItem("refreshToken");

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
          accessToken: oldToken,
          refreshToken: refreshToken
        });

        if (res.status === 200) {
          const { token, refreshToken: newRefreshToken } = res.data;

          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;