import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('vending_token')?.value;
    const { pathname } = request.nextUrl;
    
    const isLoginPage = pathname === '/login';

    if (token) {
        try {
            const payload = decodeJwt(token);
            
            const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;

            if (isExpired) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                
                response.cookies.delete('vending_token');
                return response;
            }

            if (isLoginPage) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

        } catch (error) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('vending_token');
            return response;
        }
    } 
    
    else {
        if (!isLoginPage) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

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