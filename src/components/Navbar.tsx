"use client";
import React, { useState } from "react";
import { Menu, Bell, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      {/* Kiri: Menu Hamburger (Mobile) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className=" p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Kanan: Notifikasi & Profil */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profil Section */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 border-l pl-4 border-gray-100 hover:opacity-80 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none">
                {user?.fullName}
              </p>
              <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">
                {user?.roles?.[0] || "No Role"}
              </p>
            </div>
            <div className="relative">
              <UserCircle size={32} className="text-gray-300" />
              {/* Icon indikator dropdown untuk mobile */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full sm:hidden border border-gray-100">
                <ChevronDown size={12} className="text-gray-500" />
              </div>
            </div>
          </button>

          {/* Dropdown Profile (Muncul di Mobile saat diklik) */}
          {showProfile && (
            <>
              {/* Overlay untuk menutup saat klik di luar */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfile(false)}
              ></div>

              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-20 animate-in fade-in zoom-in duration-200">
                {/* Header Dropdown (Hanya muncul di mobile) */}
                <div className="px-4 py-2 border-b border-gray-50 sm:hidden mb-2">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase">
                    {user?.roles?.[0]}
                  </p>
                </div>

                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Profil Saya
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Pengaturan Akun
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
