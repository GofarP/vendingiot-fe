"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Input from "./Input";

interface DataTableProps<T> {
  data: T[];
  columns: {
    label: string;
    render: (item: T, index: number) => React.ReactNode;
  }[];
  renderMobileCard: (item: T) => React.ReactNode;
  isLoading?: boolean;
  initialItemsPerPage?: number;
}

export default function DataTable<T>({
  data,
  columns,
  renderMobileCard,
  isLoading,
  initialItemsPerPage = 5,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const filteredData = useMemo(() => {
    return data.filter((item: any) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const startItem = filteredData.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + itemsPerPage, filteredData.length);

  useEffect(() => setCurrentPage(1), [search, itemsPerPage]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Show
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-gray-50 border-none text-gray-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {[5, 10, 25, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Entries
          </span>
        </div>

        <Input
          placeholder="Cari data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="w-full md:w-80"
        />
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-gray-400">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-6 py-4 ${i === 0 ? "pl-8" : ""} ${i === columns.length - 1 ? "pr-8" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, idx) => (
                      <td key={idx} className="px-6 py-5">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : currentData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-6 py-5 text-[13px] text-gray-600 font-medium ${i === 0 ? "pl-8" : ""} ${i === columns.length - 1 ? "pr-8" : ""}`}
                      >
                        {col.render(item, index + startIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {isLoading ? (
          <div className="h-32 bg-gray-50 animate-pulse rounded-3xl" />
        ) : (
          currentData.map((item, index) => (
            <div key={index}>{renderMobileCard(item)}</div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Showing <span className="text-blue-600">{startItem}</span> -{" "}
            <span className="text-blue-600">{endItem}</span> of{" "}
            {filteredData.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`
                min-w-9.5 h-9.5 px-3 rounded-xl text-xs font-black transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                    : "bg-white border border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600 shadow-sm"
                }
              `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
