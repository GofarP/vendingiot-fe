"use client"
import React, { useState } from "react"
interface InputProps extends React.InputEventHandler<HTMLInputElement> {
    label: string;
    error?: string;
    type: string;
}

const Input = ({ label, error, type, ...props }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold text-gray-700 ml-1">
                {label}
            </label>

            <div className="relative group">
                <input
                    {...props}
                    className={`
                    w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none
                    /* Kondisi jika ada error */
                    ${error
                            ? "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100"
                            : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                        }
                    /* Styling khusus saat input di-disable */
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 font-medium text-xs p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        {showPassword ? "HIDE" : "SHOW"}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500 font-medium ml-1">
                    {error}
                </span>
            )}
        </div>
    );
};
export default Input;