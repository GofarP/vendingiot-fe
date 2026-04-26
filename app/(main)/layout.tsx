"use client";
import { useState } from "react";
import Sidebar from "@/src/components/Sidebar";
import Navbar from "@/src/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* ml-0 di mobile, lg:ml-64 di desktop agar tidak terpotong */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all duration-300">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="p-4 md:p-8 flex-1 animate-in fade-in duration-700">
          {children}
        </main>

        <footer className="p-6 text-center text-gray-400 text-[11px] border-t border-gray-100 bg-white/50">
          © 2026 VendingIoT System • Versi 1.0.4
        </footer>
      </div>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}