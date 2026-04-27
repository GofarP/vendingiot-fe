"use client";
import React from "react";
import { Search } from "lucide-react";
import Input from "./Input";
import Pagination from "./Pagination";

interface DataTableProps<T> {
  data: T[];
  columns: {
    label: string;
    render: (item: T, index: number) => React.ReactNode;
  }[];
  renderMobileCard: (item: T) => React.ReactNode;
  isLoading?: boolean;

  // Metadata dari API .NET
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };

  // Callback untuk Hook useDepartment
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}

export default function DataTable<T>({
  data,
  columns,
  renderMobileCard,
  isLoading,
  meta,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  searchValue,
}: DataTableProps<T>) {

  const startItem = meta.totalCount === 0 ? 0 : (meta.currentPage - 1) * meta.pageSize + 1;
  const endItem = Math.min(meta.currentPage * meta.pageSize, meta.totalCount);

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">

      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Show
          </span>
          <select
            value={meta.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-gray-50 border-none text-gray-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
          >
            {[10, 25, 50, 100].map((v) => (
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
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
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
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-5">
                      <div className="h-4 bg-gray-100 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={`px-6 py-5 text-[13px] text-gray-600 font-medium ${i === 0 ? "pl-8" : ""} ${i === columns.length - 1 ? "pr-8" : ""}`}
                    >
                      {col.render(item, (meta.currentPage - 1) * meta.pageSize + index)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-gray-400 italic text-sm"
                >
                  Data tidak ditemukan atau masih kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {isLoading ? (
          <div className="h-32 bg-gray-50 animate-pulse rounded-[2rem]" />
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <div key={index}>{renderMobileCard(item)}</div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-400 italic text-sm">
            Data tidak ditemukan
          </div>
        )}
      </div>

      <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Showing <span className="text-blue-600">{startItem}</span> -{" "}
          <span className="text-blue-600">{endItem}</span> of{" "}
          {meta.totalCount} Entries
        </p>

        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
          totalItems={meta.totalCount}
          itemsPerPage={meta.pageSize}
        />
      </div>
    </div>
  );
}