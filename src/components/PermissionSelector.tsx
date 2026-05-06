import React, { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, Info, Trash2 } from "lucide-react";
import { roleService, PermissionGroup } from "@/src/services/roleServices";
import { useDebounce } from "@/src/hooks/debounce/useDebounce";
import Input from "@/src/components/Input";

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
      if (debouncedQ.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await roleService.getPermissions(debouncedQ);
        const grouped = res.data.reduce((acc: PermissionGroup[], curr: any) => {
          const cat = curr.permissionCategory.name;
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

  const handleToggleCategory = (groupIds: number[], isSelect: boolean) => {
    const nextIds = isSelect
      ? Array.from(new Set([...selectedIds, ...groupIds]))
      : selectedIds.filter(id => !groupIds.includes(id));
    onChange(nextIds);
  };

  return (
    <div className="space-y-6">
      <Input
        label="Search Access Control"
        placeholder="Cari modul (ex: user, inventory)..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
      />

      {/* --- SELECTED SUMMARY & GLOBAL DESELECT ALL --- */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-8 py-5 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white text-[12px] font-black italic shadow-lg shadow-blue-100">
              {selectedIds.length}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-blue-900 italic tracking-[0.2em]">
                Permissions Active
              </span>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                Currently synchronized with database
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex items-center gap-2 px-6 py-2.5 text-[9px] font-black text-red-500 uppercase tracking-widest bg-white border border-red-100 rounded-2xl hover:bg-red-50 transition-all shadow-sm active:scale-95"
          >
            <Trash2 size={12} />
            Deselect All
          </button>
        </div>
      )}

      {/* --- SEARCH RESULTS --- */}
      <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {results.length > 0 ? (
          results.map(group => {
            const groupIds = group.permissions.map(p => p.id);
            const isAll = groupIds.every(id => selectedIds.includes(id));

            return (
              <div key={group.category} className="border border-gray-100 rounded-[3rem] overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-50/50 px-10 py-5 flex justify-between items-center border-b border-gray-100">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-[0.25em] italic">
                    {group.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleCategory(groupIds, !isAll)}
                    className={`text-[9px] font-black px-6 py-2 rounded-full border transition-all uppercase tracking-widest ${isAll ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-blue-500 border-blue-100 hover:bg-blue-50"
                      }`}
                  >
                    {isAll ? "Deselect Group" : "Select Group"}
                  </button>
                </div>

                <div className="p-6 grid gap-1">
                  {group.permissions.map(p => (
                    <label key={p.id} className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-gray-50 cursor-pointer group transition-all">
                      <div className="flex items-center gap-6">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500 transition-transform active:scale-90"
                          checked={selectedIds.map(String).includes(String(p.id))}
                          onChange={() => {
                            const isChecked = selectedIds.map(String).includes(String(p.id));
                            const next = isChecked
                              ? selectedIds.filter(x => String(x) !== String(p.id))
                              : [...selectedIds, p.id];
                            onChange(next);
                          }}
                        />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-blue-900 uppercase italic tracking-tight">
                          {p.name}
                        </span>
                      </div>
                      {selectedIds.includes(p.id) && <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in" />}
                    </label>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-gray-50/50 rounded-[3.5rem] border border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-5">
              <div className="p-6 bg-white rounded-full shadow-inner border border-gray-50">
                <Info size={36} className="text-gray-300" />
              </div>
              <div className="space-y-2">
                <p className="text-[13px] font-black uppercase italic tracking-[0.3em] text-gray-400">
                  {q.length < 2 ? "Waiting for Input" : "Access Not Found"}
                </p>
                <p className="text-[10px] font-bold text-gray-300 uppercase italic tracking-widest">
                  {q.length < 2 ? "Type at least 2 characters to search" : "Try another keyword"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};