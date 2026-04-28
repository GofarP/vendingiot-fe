"use client";
import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/logout/useLogout"; // Sesuaikan path hook logout kamu

interface NavbarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function Navbar({ isOpen, toggle }: NavbarProps) {
  const { user } = useAuth();
  const { performLogout } = useLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown saat klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger */}
        <button
          onClick={toggle}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />
        <h2 className="font-medium text-gray-500 hidden md:block">
          Dashboard Control Panel
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifikasi */}
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative mr-2">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>{" "}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-4 border-l border-gray-100 hover:bg-gray-50 p-2 rounded-xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {user?.fullName || "Guest User"}
              </p>
              <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">
                {user?.roles?.[0] || "No Role"}
              </p>
            </div>

            <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-500 border border-gray-300 shadow-sm relative">
              <User size={20} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
              <div className="px-4 py-3 border-b border-gray-50 mb-1 sm:hidden">
                <p className="text-sm font-bold text-gray-800">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-blue-600">
                  {" "}
                  {user?.roles?.[0] || "No Role"}
                </p>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <User size={16} />
                <span>Profil Saya</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <Settings size={16} />
                <span>Pengaturan</span>
              </button>

              <div className="h-px bg-gray-100 my-1"></div>

              <button
                onClick={performLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
              >
                <LogOut size={16} />
                <span>Keluar Aplikasi</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
