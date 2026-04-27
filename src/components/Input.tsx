"use client";
import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Buat jadi opsional
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode; // Tambahkan prop ikon kiri
}

const Input = ({
  label,
  description,
  error,
  type,
  required,
  leftIcon,
  className = "",
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {(label || description) && (
        <div className="flex flex-col mb-0.5">
          {label && (
            <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </label>
          )}
          {description && (
            <span className="text-[11px] text-gray-400 font-medium leading-tight">
              {description}
            </span>
          )}
        </div>
      )}

      <div className="relative group">
        {/* Render Ikon Kiri jika ada */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          type={inputType}
          className={`
            w-full py-2.5 rounded-xl border text-black transition-all duration-200 outline-none text-sm
            ${leftIcon ? "pl-11 pr-4" : "px-4"} 
            ${
              error
                ? "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 bg-white"
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 font-bold text-[10px] tracking-widest p-1"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>

      {error && (
        <span className="text-[11px] text-red-500 font-semibold ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
