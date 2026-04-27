"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface FormShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function FormShell({
  isOpen,
  onClose,
  title,
  children,
}: FormShellProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            drag={isDesktop ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.95 } : { y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
              relative bg-white w-full z-10 shadow-2xl flex flex-col touch-none
              ${
                isDesktop
                  ? "max-w-lg rounded-[2.5rem] overflow-hidden"
                  : "rounded-t-[2.5rem] max-h-[95vh]"
              }
            `}
          >
            {!isDesktop && (
              <div className="w-full flex justify-center p-4 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
            )}

            <div
              className={`px-8 flex items-center justify-center border-b border-gray-50 
                ${isDesktop ? "pt-12 pb-8" : "pb-6"}`}
            >
              <h3 className="text-xl font-black uppercase tracking-tighter text-blue-900 text-center leading-none">
                {title.split(" ")[0]}{" "}
                <span className="text-blue-600">
                  {title.split(" ").slice(1).join(" ")}
                </span>
              </h3>
            </div>

            <div className="px-8 py-6 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
