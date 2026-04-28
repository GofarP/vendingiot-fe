import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(request: NextRequest) {

    // Lanjutkan request jika semua pengecekan lolos
    return NextResponse.next();
}

// Konfigurasi matcher agar middleware tidak berjalan di file static atau API
export const config = {
    matcher: [
        /*
         * Cocokkan semua request path kecuali yang dimulai dengan:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (folder public/assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};