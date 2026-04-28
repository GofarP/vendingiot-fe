// src/app/layout.tsx
import { AuthProvider } from "@/src/context/AuthContext"; // Sesuaikan path-nya
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider dipasang di sini agar mencakup seluruh aplikasi */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
