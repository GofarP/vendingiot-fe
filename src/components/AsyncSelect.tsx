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
  required?: boolean; // Tambahan prop required
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
    <div className="relative w-full space-y-1.5" ref={dropDownRef}>
      {/* LABEL DIUPDATE SAMA SEPERTI INPUT */}
      {label && (
        <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Tombol Utama / Input Display DIUPDATE SAMA SEPERTI INPUT */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all border ${
          error 
            ? "border-red-500 focus:border-red-500" 
            : isOpen 
              ? "border-blue-500" 
              : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span
          className={`text-sm ${!selectedLabel ? "text-gray-400" : "text-gray-800"}`}
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
        <div className="absolute z-[100] w-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Box inside Dropdown */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-3">
            <Search size={16} className="text-gray-400" />
            <input
              autoFocus
              className="w-full text-sm outline-none text-gray-800 placeholder:text-gray-400"
              placeholder="Ketik untuk mencari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-blue-500" />
            )}
          </div>

          {/* List Options */}
          <ul className="max-h-60 overflow-y-auto p-1.5">
            {options.length > 0 ? (
              options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-xs text-gray-400 font-medium italic">
                {isLoading ? "Mencari data..." : "Data tidak ditemukan"}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* ERROR MESSAGE DIUPDATE SAMA SEPERTI INPUT */}
      {error && (
        <p className="text-xs text-red-500 font-bold mt-1.5">{error}</p>
      )}
    </div>
  );
}