"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useDebounce } from "../hooks/debounce/useDebounce";
import axiosInstance from "../lib/axios";

interface Option {
  value: string | number;
  label: string;
}

interface AsyncSelectProps {
  label?: string;
  placeholder?: string;
  apiEndpoint: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  required?: boolean;
}

export default function AsyncSelect({
  label,
  placeholder = "Cari data...",
  apiEndpoint,
  value,
  onChange,
  error,
  required = false,
}: AsyncSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); // Navigasi keyboard
  const [dropUp, setDropUp] = useState(false); // Smart positioning

  const debouncedSearch = useDebounce(searchTerm, 500);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 1. Logika Smart Positioning (Top vs Bottom)
  const checkSpace = () => {
    if (dropDownRef.current) {
      const rect = dropDownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Jika ruang di bawah kurang dari 300px, tampilkan di atas
      setDropUp(spaceBelow < 300);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkSpace();
      setActiveIndex(-1);
      window.addEventListener("scroll", checkSpace);
      window.addEventListener("resize", checkSpace);
    }
    return () => {
      window.removeEventListener("scroll", checkSpace);
      window.removeEventListener("resize", checkSpace);
    };
  }, [isOpen]);

  // 2. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || debouncedSearch.trim().length === 0) {
        setOptions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(apiEndpoint, {
          params: { search: debouncedSearch, page: 1, pageSize: 20 },
        });
        const result = response.data;
        if (result && result.data) {
          const mappedData = result.data.map((item: any) => ({
            value: item.id,
            label: item.name,
          }));
          setOptions(mappedData);
        }
      } catch (err) {
        console.error("Gagal load data:", err);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch, apiEndpoint, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
    setSearchTerm("");
  };

  // 4. Keyboard Navigation Logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          handleSelect(options[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Auto-scroll list saat navigasi keyboard
  useEffect(() => {
    if (activeIndex !== -1 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full space-y-1.5" ref={dropDownRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all border ${
          error 
            ? "border-red-500" 
            : isOpen 
              ? "border-blue-500 ring-2 ring-blue-50" 
              : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span className={`text-sm ${!selectedLabel ? "text-gray-400" : "text-gray-800 font-medium"}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div 
          className={`absolute z-[110] w-full bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Search size={16} className="text-gray-400" />
            <input
              autoFocus
              className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
              placeholder="Ketik untuk mencari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && <Loader2 size={16} className="animate-spin text-blue-500" />}
          </div>

          <ul ref={listRef} className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
            {options.length > 0 ? (
              options.map((opt, index) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`px-4 py-3 rounded-xl text-sm transition-all cursor-pointer mb-1 last:mb-0 ${
                    activeIndex === index 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100 scale-[0.98]" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{opt.label}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-gray-400 font-medium italic">
                {isLoading ? "Mencari data..." : "Ketik minimal 1 karakter..."}
              </li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-bold mt-1.5">{error}</p>}
    </div>
  );
}