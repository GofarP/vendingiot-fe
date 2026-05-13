"use client";

import { useHome } from "@/src/hooks/home/useHome";
import { Users, Cpu, Building2, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error, refresh } = useHome();

  const statCards = [
    {
      label: "Total Users",
      value: data?.totalUsers ?? 0,
      icon: <Users size={20} className="text-blue-600" />,
      desc: "Pengguna terdaftar",
    },
    {
      label: "Total Machines",
      value: data?.totalMachines ?? 0,
      icon: <Cpu size={20} className="text-purple-600" />,
      desc: "Unit IoT aktif",
    },
    {
      label: "Total Departments",
      value: data?.totalDepartments ?? 0,
      icon: <Building2 size={20} className="text-orange-600" />,
      desc: "Entitas departemen",
    },
  ];

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <button onClick={refresh} className="mt-2 underline text-sm">Coba lagi</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-blue-900">
          Ringkasan Statistik
        </h2>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="p-2 text-blue-900 hover:bg-blue-50 rounded-full transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-100 transition-transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                {card.icon}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-md mt-2" />
            ) : (
              <h3 className="text-3xl font-bold text-blue-900 mt-2">
                {card.value.toLocaleString()}
              </h3>
            )}
            
            <p className="text-xs text-gray-400 mt-2">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}