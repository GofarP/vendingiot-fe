"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Shield, Check } from "lucide-react";
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

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQ.length < 2) { setResults([]); return; }
      setLoading(true);
      try {
        const res = await roleService.getPermissions(debouncedQ);
        const grouped = res.data.reduce((acc: PermissionGroup[], curr: any) => {
          const cat = curr.permissionCategory?.name || "Lainnya";
          const exist = acc.find(g => g.category === cat);
          const p = { id: curr.id, name: curr.name };
          if (exist) exist.permissions.push(p);
          else acc.push({ category: cat, permissions: [p] });
          return acc;
        }, []);
        setResults(grouped);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSearchResults();
  }, [debouncedQ]);

  const handleFullAccessToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      try {
        const res = await roleService.getPermissions("");
        const allIds = res.data.map((p: any) => p.id);
        onChange(allIds);
      } catch (err) { console.error(err); }
    } else {
      onChange([]);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* --- HEADER --- */}
      <Input
        label="Cari Akses Kontrol"
        placeholder="Ketik nama modul..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        icon={loading ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <Search size={16} />}
      />

      {/* --- CONTROL BAR --- */}
      <div className="flex justify-between items-center px-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            onChange={handleFullAccessToggle}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-600 transition-colors">
            Akses Penuh
          </span>
        </label>

        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          <span className="text-[10px] font-black text-blue-600 uppercase italic tracking-tighter">
            {selectedIds.length} Selected
          </span>
        </div>
      </div>

      {/* --- MAIN CARD CONTAINER (SCROLL AREA) --- */}
      {/* p-8 adalah kuncinya biar gak mepet ke sudut container utama */}
      <div
        style={{ height: '380px' }}
        className="relative w-full border border-gray-100 rounded-[3rem] bg-gray-50/30 overflow-hidden shadow-inner"
      >
        <div className="h-full overflow-y-auto custom-scrollbar scroll-smooth">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <div className="py-12 px-6 sm:px-12 max-w-6xl mx-auto">
                {results.map((group) => {
                  const groupIds = group.permissions.map((p) => p.id);
                  const isGroupSelected = groupIds.every((id) => selectedIds.includes(id));

                  return (
                    <motion.div
                      key={group.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-gray-100 rounded-[2.5rem] p-10 mb-12 last:mb-0 shadow-sm"
                    >
                      {/* Header Grup */}
                      <div className="flex justify-between items-center mb-10 px-2">
                        <div className="space-y-2">
                          <h3 className="text-[12px] font-black uppercase text-blue-900 tracking-[0.3em] italic">
                            {group.category}
                          </h3>
                          <div className="h-[2px] w-10 bg-blue-600/20 rounded-full" />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const next = isGroupSelected
                              ? selectedIds.filter((id) => !groupIds.includes(id))
                              : Array.from(new Set([...selectedIds, ...groupIds]));
                            onChange(next);
                          }}
                          className={`text-[10px] font-black px-6 py-3 rounded-2xl border-2 transition-all active:scale-95 ${isGroupSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "text-gray-400 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                            }`}
                        >
                          {isGroupSelected ? "Deselect All" : "Select Group"}
                        </button>
                      </div>

                      {/* Grid 2 Kolom Item */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {group.permissions.map((p) => {
                          const isChecked = selectedIds.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-5 p-6 rounded-[1.5rem] cursor-pointer border-2 transition-all duration-300 ${isChecked
                                  ? "bg-blue-50/50 border-blue-500 shadow-sm"
                                  : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md"
                                }`}
                            >
                              <div className="flex-shrink-0">
                                <input
                                  type="checkbox"
                                  className="w-6 h-6 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                                  checked={isChecked}
                                  onChange={() => {
                                    const next = isChecked
                                      ? selectedIds.filter((id) => id !== p.id)
                                      : [...selectedIds, p.id];
                                    onChange(next);
                                  }}
                                />
                              </div>

                              <span className={`text-[11px] font-bold uppercase italic tracking-wider ${isChecked ? "text-blue-700" : "text-gray-500"
                                }`}>
                                {p.name.replace(`${group.category.toUpperCase()}-`, "").replace(/-/g, " ")}
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
              <div className="h-full flex items-center justify-center text-center p-20">
                <p className="text-[10px] font-black uppercase italic tracking-[0.25em] text-gray-300 leading-relaxed">
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