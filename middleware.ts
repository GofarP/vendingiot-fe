import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log("--- MIDDLEWARE HIT ---");
    console.log("Path:", request.nextUrl.pathname);
    const token = request.cookies.get('vending_token')?.value;
    const isLoginPage = request.nextUrl.pathname === '/login';

    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ]
}