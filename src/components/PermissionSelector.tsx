"use client";
import React, { useState, useEffect } from "react";
import { Search, Loader2, Check } from "lucide-react";
import { roleService, PermissionGroup } from "@/src/services/roleServices";
import { useDebounce } from "@/src/hooks/debounce/useDebounce";
import Input from "@/src/components/Input";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export const PermissionSelector = ({ selectedIds, onChange }: Props) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQ = useDebounce(q, 500);

  // Fetch data berdasarkan input pencarian
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQ.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await roleService.getPermissions(debouncedQ);
        const grouped = res.data.reduce((acc: PermissionGroup[], curr: any) => {
          const cat = curr.permissionCategory?.name || "Lainnya";
          const exist = acc.find((g) => g.category === cat);
          const p = { id: curr.id, name: curr.name };
          if (exist) exist.permissions.push(p);
          else acc.push({ category: cat, permissions: [p] });
          return acc;
        }, []);
        setResults(grouped);
      } catch (err) {
        console.error("Gagal mengambil permission:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [debouncedQ]);

  // Toggle Semua Akses
  const handleFullAccessToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      try {
        const res = await roleService.getPermissions("");
        onChange(res.data.map((p: any) => p.id));
      } catch (err) {
        console.error(err);
      }
    } else {
      onChange([]);
    }
  };

  return (
    <div className="flex flex-col space-y-5 h-full">
      {/* HEADER SEARCH */}
      <Input
        label="Cari Akses Kontrol"
        placeholder="Ketik nama modul (misal: machine, user)..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        leftIcon={
          loading ? (
            <Loader2 size={16} className="animate-spin text-blue-500" />
          ) : (
            <Search size={16} />
          )
        }
      />

      {/* CONTROL BAR */}
      <div className="flex justify-between items-center px-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            onChange={handleFullAccessToggle}
            className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-600 transition-colors">
            Akses Penuh
          </span>
        </label>

        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          <span className="text-[10px] font-black text-blue-600 uppercase italic tracking-widest">
            {selectedIds.length} Selected
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER (SCROLL AREA) */}
      <div className="flex-1 min-h-[350px] border border-gray-100 rounded-[2.5rem] bg-gray-50/40 overflow-hidden shadow-inner">
        <div className="h-full overflow-y-auto p-5 sm:p-8 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <div className="space-y-8">
                {results.map((group) => {
                  const groupIds = group.permissions.map((p) => p.id);
                  const isGroupSelected = groupIds.every((id) =>
                    selectedIds.includes(id)
                  );

                  return (
                    <motion.div
                      key={group.category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm"
                    >
                      {/* Group Header */}
                      <div className="flex justify-between items-center mb-6 px-1">
                        <div className="space-y-1">
                          <h3 className="text-[12px] font-black uppercase text-blue-950 tracking-[0.2em] italic">
                            {group.category}
                          </h3>
                          <div className="h-[3px] w-8 bg-blue-600/20 rounded-full" />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const next = isGroupSelected
                              ? selectedIds.filter((id) => !groupIds.includes(id))
                              : Array.from(new Set([...selectedIds, ...groupIds]));
                            onChange(next);
                          }}
                          className={`text-[9px] font-black px-5 py-2 rounded-xl border-2 transition-all active:scale-95 ${
                            isGroupSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "text-gray-400 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                          }`}
                        >
                          {isGroupSelected ? "Deselect" : "Select Group"}
                        </button>
                      </div>

                      {/* --- GRID 2 KOLOM --- */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.permissions.map((p) => {
                          const isChecked = selectedIds.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                                isChecked
                                  ? "bg-blue-50/50 border-blue-500 shadow-sm"
                                  : "bg-white border-transparent hover:bg-gray-50/50 hover:border-gray-200"
                              }`}
                            >
                              {/* Custom Checkbox */}
                              <div className="pt-0.5 flex-shrink-0">
                                <div
                                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                    isChecked
                                      ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-100"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  {isChecked && (
                                    <Check
                                      size={14}
                                      className="text-white"
                                      strokeWidth={4}
                                    />
                                  )}
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isChecked}
                                    onChange={() => {
                                      const next = isChecked
                                        ? selectedIds.filter((id) => id !== p.id)
                                        : [...selectedIds, p.id];
                                      onChange(next);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Nama Permission Asli */}
                              <span
                                className={`text-[10px] font-black uppercase italic tracking-wider leading-tight whitespace-normal break-words pt-0.5 ${
                                  isChecked ? "text-blue-900" : "text-gray-500"
                                }`}
                              >
                                {p.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-10 opacity-30">
                <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-gray-400 leading-relaxed">
                  Cari modul untuk konfigurasi <br /> atau aktifkan akses penuh
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};