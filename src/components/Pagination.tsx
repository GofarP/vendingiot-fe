"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  // Hitung range data yang sedang tampil (misal: 1 - 10 dari 50)
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null; // Sembunyikan jika hanya 1 halaman

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info Stats */}
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
        Showing <span className="text-gray-700 font-black">{startItem}</span> to{" "}
        <span className="text-gray-700 font-black">{endItem}</span> of{" "}
        <span className="text-gray-700 font-black">{totalItems}</span> Entries
      </p>

      {/* Navigasi Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  w-9 h-9 rounded-xl text-xs font-bold transition-all
                  ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-white border border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                  }
                `}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
