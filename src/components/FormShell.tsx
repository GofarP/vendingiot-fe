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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}

            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}

            className="relative w-full max-w-xl bg-white 
              /* Layout & Shape Mobile */
              m-0 rounded-t-[3.5rem] rounded-b-none 
              /* Layout & Shape Desktop (sm:) */
              sm:m-6 sm:rounded-[3.5rem] 
              /* Core Structure */
              shadow-2xl flex flex-col
              max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
          >
            <div className="flex-none flex justify-center pt-6 pb-2 cursor-grab active:cursor-grabbing sm:hidden">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="flex-none px-10 pt-4 sm:pt-10 pb-6 text-center select-none">
              <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight uppercase italic">
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

            <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-2 custom-scrollbar touch-auto">
              {children}
            </div>

            {footer && (
              <div className="flex-none px-10 sm:px-12 pb-12 pt-6 flex gap-4 bg-white border-t border-gray-50 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}