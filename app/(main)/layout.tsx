"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import Navbar from "@/src/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; 
      const savedState = localStorage.getItem("sidebar_open");

      if (isMobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(savedState === null ? true : savedState === "true");
      }

      setIsInitialized(true);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isInitialized && window.innerWidth >= 1024) {
      localStorage.setItem("sidebar_open", String(isSidebarOpen));
    }
  }, [isSidebarOpen, isInitialized]);

  if (!isInitialized) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? "lg:pl-64" : "pl-0"}`}
      >
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-4 md:p-8 flex-1">{children}</main>

        <footer className="p-4 text-center text-xs text-gray-400 border-t bg-white">
          © 2026 VendingIoT System • Versi 1.0.4
        </footer>
      </div>
    </div>
  );
}
