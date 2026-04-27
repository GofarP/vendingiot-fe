"use client";
import React from "react";

interface MobileCardProps<T> {
  data: T[];
  isLoading?: boolean;
  // Fungsi untuk merender bagian-bagian kartu secara fleksibel
  renderHeader: (item: T) => React.ReactNode;
  renderBody: (item: T) => React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
}

export default function MobileCard<T>({
  data,
  isLoading,
  renderHeader,
  renderBody,
  renderActions,
}: MobileCardProps<T>) {
  // Skeleton Loading khusus Mobile
  if (isLoading) {
    return (
      <div className="space-y-4 md:hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[2rem] border border-gray-100 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-50 rounded w-full" />
              <div className="h-3 bg-gray-50 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:hidden">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
          >
            {/* Header: Biasanya Icon + Title */}
            <div className="mb-4">{renderHeader(item)}</div>

            {/* Body: Deskripsi atau info tambahan */}
            <div className="mb-6">{renderBody(item)}</div>

            {/* Footer: Tombol Aksi */}
            {renderActions && (
              <div className="flex gap-3 pt-4 border-t border-gray-50">
                {renderActions(item)}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-10 text-center text-gray-400 italic text-sm">
          Data tidak ditemukan
        </div>
      )}
    </div>
  );
}
