"use client";
import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";

interface FormShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClass?: string;
}

export default function FormShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClass = "max-w-xl",
}: FormShellProps) {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />

          {/* SHEET / MODAL CONTENT */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            
            // FITUR BOTTOM SHEET: Drag untuk menutup di mobile
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              // Jika ditarik ke bawah lebih dari 100px, tutup modalnya
              if (info.offset.y > 100) onClose();
            }}

            className={`relative w-full ${maxWidthClass} bg-white 
              rounded-t-[2.5rem] sm:rounded-[3rem] 
              shadow-2xl flex flex-col
              max-h-[95vh] sm:max-h-[88vh] overflow-hidden`}
          >
            
            {/* DRAG HANDLE (Hanya muncul di Mobile) */}
            <div className="flex-none flex justify-center pt-4 pb-2 sm:hidden cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Tombol Close (Sembunyi di mobile, pakai Drag Handle aja) */}
            <button
              onClick={onClose}
              className="hidden sm:flex absolute top-6 right-8 w-10 h-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all z-50 border border-gray-100"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex-none px-8 pt-4 sm:pt-10 pb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight">
                <span className="text-blue-600">{title.split(" ")[0]}</span>
                {" "}
                <span className="text-blue-900">{title.split(" ").slice(1).join(" ")}</span>
              </h2>
              {subtitle && (
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Area Konten */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-2 custom-scrollbar">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex-none px-8 sm:px-10 py-6 pb-10 sm:pb-10 bg-white border-t border-gray-50 flex gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}