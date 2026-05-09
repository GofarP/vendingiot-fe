"use client";

import { useEffect, useRef } from "react";
import { startSignalR } from "../lib/signalRService";
import { useAuth } from "@/src/context/AuthContext"; 
import axiosInstance from "../lib/axios";

export default function SignalRListener() {
  const { user, isLoading, setUser } = useAuth();
  const connectionRef = useRef<any>(null);
  const isRestarting = useRef(false);

  useEffect(() => {
    if (isLoading || !user) return;

    const init = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        if (connectionRef.current && !isRestarting.current) return;

        connectionRef.current = await startSignalR(token);
        console.log("✅ SignalR Connected");
        isRestarting.current = false;

        connectionRef.current.on("OnPermissionChanged", async () => {
          console.warn("🔔 Izin berubah. Merefresh...");

          try {
            const oldToken = sessionStorage.getItem("token");
            const refreshToken = sessionStorage.getItem("refreshToken");

            const res = await axiosInstance.post("/api/auth/refresh", {
              accessToken: oldToken,
              refreshToken: refreshToken,
            });


            if (res.status === 200 && res.data.token) {
              isRestarting.current = true; 

              // 1. Update Token di storage DULU sebelum update State
              sessionStorage.setItem("token", res.data.token);
              sessionStorage.setItem("refreshToken", res.data.refreshToken);

              setUser({
                ...res.data,
                accessToken: res.data.token,
                tokenType: res.data.tokenType || "Bearer"
              });

              if (connectionRef.current) {
                await connectionRef.current.stop();
                connectionRef.current = null;
              }
            }
          } catch (refreshErr) {
            console.error("❌ Refresh Error:", refreshErr);
            isRestarting.current = false;
          }
        });
      } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
        isRestarting.current = false;
      }
    };

    init();

    return () => {
      if (connectionRef.current && !isRestarting.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        console.log("👋 SignalR Stopped (Logout/Unmount)");
      }
    };
  }, [user, isLoading, setUser]); 

  return null;
}