"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import Navbar from "@/src/components/Navbar";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsOpen(false);
    } else {
      const saved = localStorage.getItem("sidebar_open");
      setIsOpen(saved === "true" || saved === null);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebar_open", newState.toString());
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Memverifikasi Sesi...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? "lg:ml-64" : "ml-0"}`}
      >
        <Navbar isOpen={isOpen} toggle={toggleSidebar} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
