import { AuthProvider } from "@/src/context/AuthContext";
import AuthGuard from "@/src/components/AuthGuard";
import "./globals.css";
import { Toaster } from 'sonner';
import SignalRListener from "@/src/components/SignalRListener";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthGuard>
            <SignalRListener token={token}/>
            {children}
            <Toaster closeButton position="top-right" richColors />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}