"use client";
import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Import icon silang

interface FormShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function FormShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: FormShellProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* OVERLAY / BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />

          {/* MODAL CONTENT */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}

            // Drag feature khusus mobile
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150) onClose();
            }}

            className="relative w-full max-w-xl bg-white 
              /* Mobile: Tumbuh dari bawah, rounded atas saja */
              rounded-t-[3.5rem] rounded-b-none 
              /* Desktop: Bulat sempurna di tengah */
              sm:rounded-[3.5rem] 
              shadow-2xl flex flex-col
              max-h-[95vh] sm:max-h-[85vh] overflow-hidden"
          >
            {/* TOMBOL SILANG (Hanya muncul di Desktop) */}
            <button
              onClick={onClose}
              className="hidden sm:flex absolute top-8 right-8 w-10 h-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all z-50 shadow-sm"
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* DRAG HANDLE (Hanya muncul di Mobile) */}
            <div className="flex-none flex justify-center pt-6 pb-2 cursor-grab active:cursor-grabbing sm:hidden">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* HEADER AREA */}
            <div className="flex-none px-10 pt-4 sm:pt-12 pb-6 text-center select-none">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase italic">
                <span className="text-blue-600">{title.split(" ")[0]}</span>
                {" "}
                <span className="text-blue-900">{title.split(" ").slice(1).join(" ")}</span>
              </h2>
              {subtitle && (
                <p className="text-[11px] text-gray-400 font-bold mt-2 uppercase tracking-[0.25em]">
                  {subtitle}
                </p>
              )}
            </div>

            {/* CONTENT AREA (Area scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-14 py-4 custom-scrollbar touch-auto">
              {children}
            </div>

            {/* FOOTER AREA */}
            {footer && (
              <div className="flex-none px-10 sm:px-14 pb-12 pt-6 flex gap-4 bg-white border-t border-gray-50 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}