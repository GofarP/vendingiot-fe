"use client";
import React from "react";
import { Loader2 } from "lucide-react"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "outline";
  icon?: React.ReactNode;
  isLoading?: boolean; 
}

export default function Button({
  children,
  variant = "primary",
  icon,
  className,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700",
    danger: "bg-red-50 text-red-500 hover:bg-red-100",
    outline: "border border-gray-200 text-gray-600 hover:bg-gray-50",
  };

  return (
    <button
      // Tombol otomatis disabled kalau lagi loading
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center gap-2 
        px-6 py-2.5 
        rounded-xl 
        text-sm font-bold 
        whitespace-nowrap  
        shrink-0     
        transition-all active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant]} 
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        // Tampilan saat loading: Spinner berputar
        <>
          <Loader2 className="animate-spin" size={18} />
          <span>Mohon Tunggu...</span>
        </>
      ) : (
        // Tampilan normal
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}