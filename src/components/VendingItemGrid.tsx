import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import Input from "./Input";
import { useDebounce } from "../hooks/debounce/useDebounce";

interface VendingItemDetail {
  id: number;
  itemName: string;
  categoryName: string;
  price: number;
  quantity: number;
  capacity: number;
}

interface VendingItemGridProps {
  data: VendingItemDetail[];
  searchValue: string;
  onSearch: (query: string) => void;
  onRestock: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function VendingItemGrid({
  data,
  searchValue,
  onSearch,
  onRestock,
  onDelete,
  isLoading,
}: VendingItemGridProps) {
  // 1. Local state untuk nampung ketikan user biar instan
  const [searchTerm, setSearchTerm] = useState(searchValue);

  // 2. Pakai hook debounce lu
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 3. Hanya panggil onSearch (API fetch) pas debouncedSearch berubah
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // 4. Update searchTerm kalau searchValue dari parent berubah (misal di-reset)
  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="flex justify-end px-2">
        <Input
          placeholder="Cari barang di mesin ini..."
          value={searchTerm} // Hubungkan ke local state
          onChange={(e) => setSearchTerm(e.target.value)} // Update local state
          leftIcon={<Search size={18} className="text-gray-400" />}
          className="w-full md:w-80"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm flex flex-col items-center animate-pulse"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" />

              <div className="space-y-3 mb-6 w-full flex flex-col items-center">
                <div className="h-5 bg-gray-200 rounded-full w-3/4" />{" "}
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />{" "}
                <div className="h-4 bg-blue-50 rounded-full w-1/3 mt-2" />{" "}
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="h-10 bg-gray-100 rounded-2xl" />
                <div className="h-10 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          ))
        ) : data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-[2.5rem] border border-blue-400 p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md"
            >
              <button
                onClick={() => onDelete(item.id)}
                className="absolute top-5 right-5 text-red-500 hover:scale-110 transition-transform"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <div className="w-24 h-24 bg-[#D1D1E9] rounded-full mb-4 shadow-inner" />

              <div className="space-y-1 mb-6 w-full">
                <h3 className="text-xl font-bold text-gray-900 leading-tight truncate px-2">
                  {item.itemName}
                </h3>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                  {item.categoryName}
                </p>
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    Stok: {item.quantity} / {item.capacity}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => onRestock(item.id)}
                  className="bg-[#FFCC00] hover:bg-yellow-500 text-gray-900 py-3 rounded-2xl text-xs font-black uppercase transition-all active:scale-95"
                >
                  Restock
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-[#FF4D4D] hover:bg-red-600 text-white py-3 rounded-2xl text-xs font-black uppercase transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase italic tracking-widest">
            Barang tidak ditemukan atau masih kosong
          </div>
        )}
      </div>
    </div>
  );
}
