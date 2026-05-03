"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PAGES = ["/login", "/register"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isPublic = PUBLIC_PAGES.includes(pathname);
    const hasSession = !!sessionStorage.getItem("vending_user");

    if (isPublic) {
      if (hasSession) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    } else {
      if (!hasSession) {
        router.replace("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse ml-1">
            Memverifikasi Akses
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}