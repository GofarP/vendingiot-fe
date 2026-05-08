import Link from "next/link";
import { ArrowLeft, ChevronLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
            <p className="text-5xl font-extrabold leading-none tracking-tighter text-gray-900">
                403
            </p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                Tidak punya akses
            </h1>
            <p className="mt-2 mb-8 text-sm text-gray-400">
                Anda tidak punya akses untuk mengakses halaman ini
            </p>
            <Link
                href="/"
                className="group flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase italic text-[12px] tracking-[0.15em] shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all duration-300"
            >
                <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                Kembali ke Dashboard
            </Link>
        </div>
    );
}