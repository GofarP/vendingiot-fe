import { AuthProvider } from "@/src/context/AuthContext";
import AuthGuard from "@/src/components/AuthGuard";
import "./globals.css";
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>
            {children}
            <Toaster position="top-right" richColors />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}