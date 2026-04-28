"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  X,
  ShieldEllipsis,
} from "lucide-react";
import { useLogout } from "../hooks/logout/useLogout";
import { useAuth } from "../context/AuthContext";
import { permission } from "process";

const menuGroups = [
  {
    title: "Utama",
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Data Master",
    items: [
      {
        name: "Employee",
        href: "/employee",
        icon: Users,
        permission: "",
      },
      {
        name: "Department",
        href: "/department",
        icon: Package,
        permission: "",
      },
      {
        name:"Permission Category",
        href:"/permission-category",
        icon:ShieldEllipsis,
        permission:''
      }
    ],
  },
  {
    title: "Sistem",
    items: [
      { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { hasPermission, isLoading } = useAuth();
  const { logout, isLoggingOut } = useLogout();

  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const filteredMenu = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || hasPermission(item.permission),
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (isLoading) return null;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white flex flex-col z-50 transition-transform duration-300 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-6 flex items-center justify-between border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black italic">
            V
          </div>
          <span className="text-xl font-bold">
            Vending<span className="text-blue-400">IoT</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-800 rounded-md" // Hapus lg:hidden
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {filteredMenu.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-blue-400/60">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleItemClick} // Menggunakan fungsi pengecekan lebar layar
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      active
                        ? "bg-blue-600 shadow-lg shadow-blue-900/50"
                        : "hover:bg-blue-800/50 text-blue-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="font-semibold text-[13px]">
                        {item.name}
                      </span>
                    </div>
                    {active && (
                      <ChevronRight size={14} className="opacity-50" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
