import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Kunci scroll body saat modal terbuka
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
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center">
          {/* Backdrop (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Main Container (The Sheet) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}

            // --- LOGIKA DRAG ---
            drag="y"
            dragConstraints={{ top: 0 }} // Tidak bisa ditarik ke atas, hanya bawah
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              // Jika ditarik ke bawah lebih dari 100px, jalankan onClose
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            // -------------------

            className="relative w-full max-w-xl bg-white 
              rounded-t-[3.5rem] sm:rounded-[3.5rem] 
              shadow-2xl overflow-hidden touch-none sm:m-4"
          >
            {/* Drag Handle Bar (Visual Cue) */}
            <div className="flex justify-center pt-6 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-10 pt-4 pb-6 text-center select-none">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-center leading-tight">
                <span className="text-blue-600 uppercase italic">
                  {title.split(" ")[0]}
                </span>
                {" "}
                <span className="text-blue-900 uppercase italic">
                  {title.split(" ").slice(1).join(" ")}
                </span>
              </h2>
              {subtitle && (
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[0.2em]">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Content Body */}
            <div className="px-10 py-2 max-h-[65vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer / Buttons (Jika ada) */}
            {footer && (
              <div className="px-10 pb-12 pt-6 flex gap-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}