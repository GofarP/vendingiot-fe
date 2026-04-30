"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Loader2, X } from "lucide-react";
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
}

export default function AsyncSelect({
  label,
  placeholder = "Cari data...",
  apiEndpoint,
  value,
  onChange,
  error,
}: AsyncSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || debouncedSearch.trim().length === 0) {
        setOptions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(apiEndpoint, {
          params: {
            search: debouncedSearch,
            page: 1,
            pageSize: 20,
          },
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
        console.error("Gagal load data Select via Axios:", err);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, apiEndpoint, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div className="relative w-full space-y-2" ref={dropDownRef}>
      {label && (
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
          {label}
        </label>
      )}

      {/* Tombol Utama / Input Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-50 border-2 ${isOpen ? "border-blue-500" : "border-transparent"} ${error ? "border-red-500" : ""} rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100/80`}
      >
        <span
          className={`text-sm font-bold ${!selectedLabel ? "text-gray-400" : "text-gray-700"}`}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Box inside Dropdown */}
          <div className="p-4 border-b border-gray-50 flex items-center gap-3">
            <Search size={16} className="text-gray-400" />
            <input
              autoFocus
              className="w-full text-sm font-bold outline-none text-gray-700 placeholder:text-gray-300"
              placeholder="Ketik untuk mencari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-blue-500" />
            )}
          </div>

          {/* List Options */}
          <ul className="max-h-60 overflow-y-auto p-2">
            {options.length > 0 ? (
              options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-gray-400 font-bold uppercase italic">
                {isLoading ? "Mencari data..." : "Data tidak ditemukan"}
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">
          {error}
        </p>
      )}
    </div>
  );
}
