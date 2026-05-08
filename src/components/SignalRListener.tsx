"use client";

import { useEffect, useRef } from "react";
import { startSignalR } from "../lib/signalRService";
import { useAuth } from "@/src/context/AuthContext"; 
import axiosInstance from "../lib/axios";

export default function SignalRListener() {
  const { user, isLoading, setUser } = useAuth();
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    if (isLoading || !user) return;

    const init = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ SignalR: Token tidak ditemukan di sessionStorage.");
        return;
      }

      try {
        if (!connectionRef.current) {
          connectionRef.current = await startSignalR(token);
          console.log("✅ SignalR Connected for:", user.email);

          connectionRef.current.on("OnPermissionChanged", async () => {
            console.warn("🔔 Sinyal diterima: Izin berubah. Merefresh token...");

            try {
              const oldToken = sessionStorage.getItem("token");
              const refreshToken = sessionStorage.getItem("refreshToken");

              if (!oldToken || !refreshToken) {
                console.error("❌ Gagal refresh: Token tidak lengkap di storage.");
                return;
              }

              const res = await axiosInstance.post("/api/auth/refresh", {
                accessToken: oldToken,
                refreshToken: refreshToken,
              });

              if (res.status === 200 && res.data.token) {
                const updatedUserData = {
                  ...res.data, 
                  accessToken: res.data.token, 
                  tokenType: res.data.tokenType || "Bearer" 
                };
                
                setUser(updatedUserData);

                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("refreshToken", res.data.refreshToken);

                console.log("State User & Sidebar berhasil diperbarui otomatis!");
              }
            } catch (refreshErr) {
              console.error("SignalR Refresh Token Error:", refreshErr);
            }
          });
        }
      } catch (err) {
        console.error("SignalR Init Error:", err);
      }
    };

    init();

    return () => {
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => {
            console.log("👋 SignalR Disconnected");
            connectionRef.current = null;
          })
          .catch((err: any) => console.warn("SignalR Stop Error:", err));
      }
    };
  }, [user, isLoading, setUser]);

  return null;
}