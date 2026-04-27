"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "outline";
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  icon,
  className,
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
      className={`
        flex items-center justify-center gap-2 
        px-6 py-2.5 
        rounded-xl 
        text-sm font-bold 
        whitespace-nowrap  
        shrink-0     
        transition-all active:scale-95 
        disabled:opacity-50 
        ${styles[variant]} 
        ${className}
      `}
      {...props}
    >
      {/* Bungkus icon dan children agar sejajar sempurna */}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
