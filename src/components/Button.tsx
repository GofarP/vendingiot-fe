"use client"
import React from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";

type ButtonSize="sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?:ButtonVariant;
    size?:ButtonSize;
    isLoading?:boolean;
    leftIcon:React.ReactNode;
    rightIcon:React.ReactNode;
}


const Button=({
    children,
    variant="primary",
    size="md",
    isLoading=false,
    leftIcon,
    rightIcon,
    className="",
    disabled,
    ...props
}:ButtonProps)=>{
    const baseStyles="inline-flex  items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    const variants={
        primary:"bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
        secondary:"bg-gray-100 text-gray-900 hover:bg-gray-200",
    };
}
