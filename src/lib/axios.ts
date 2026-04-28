import axios from "axios";
import { useRouter } from "next/navigation";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Session is invalid or its over");
      window.location.href="/login"
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;