"use client";
import { Menu, Bell, Search, UserCircle } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"><Menu size={24} /></button>
        <div className="hidden md:flex relative w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari data..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative"><Bell size={22} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
        <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-none">Admin Utama</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">Super Admin</p>
          </div>
          <UserCircle size={32} className="text-gray-300" />
        </div>
      </div>
    </header>
  );
}