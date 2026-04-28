// src/app/(main)/layout.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/src/components/Sidebar";
import Navbar from "@/src/components/Navbar";
import { AuthProvider } from "@/src/context/AuthContext"; // Pastikan path sesuai

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. Inisialisasi state (default false agar tidak flicker di mobile)
  const [isOpen, setIsOpen] = useState(false);

  // 2. Sinkronisasi dengan localStorage & Handle Responsive Initial State
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_open");
    if (saved !== null) {
      setIsOpen(saved === "true");
    } else {
      // Jika belum ada di storage, Desktop (>=1024px) otomatis buka, Mobile tutup
      setIsOpen(window.innerWidth >= 1024);
    }
  }, []);

  // 3. Fungsi Toggle yang rapi untuk dikirim ke Navbar
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebar_open", newState.toString());
  };

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* SIDEBAR: Posisinya fixed, z-50 */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* KONTAINER UTAMA: Harus punya margin kiri jika sidebar buka (khusus Desktop) */}
        <div 
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
            ${isOpen ? "lg:ml-64" : "ml-0"}`} 
        >
          {/* NAVBAR: Menerima prop toggle untuk tombol hamburger */}
          <Navbar isOpen={isOpen} toggle={toggleSidebar} />
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}