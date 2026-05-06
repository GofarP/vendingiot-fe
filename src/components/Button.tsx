"use client";
import React from "react";
import { Loader2 } from "lucide-react"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "warning" | "outline";
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
    // Biru Solid
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700",
    // Merah Solid (Biar nggak jadi outline pink)
    danger: "bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600",
    // Putih Bergaris
    outline: "border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white",
    // Kuning Solid (Khusus Edit)
    warning: "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-100 hover:bg-yellow-500",
  };

  return (
    <button
      disabled={disabled || isLoading}
      /* 
         URUTAN PENTING: 
         ${styles[variant]} ditaruh di akhir sebelum ${className} 
         biar warnanya nggak ketimpa utility class lain.
      */
      className={`
        flex items-center justify-center gap-2 
        px-6 py-2.5 
        rounded-xl 
        text-sm font-bold 
        whitespace-nowrap shrink-0     
        transition-all active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant]} 
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          <span>Mohon Tunggu...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
}