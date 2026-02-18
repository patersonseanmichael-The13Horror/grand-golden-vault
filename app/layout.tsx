import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "The Velvet Vault — Digital E-Lounge",
  description: "A private lounge of polished experience and discreet privilege.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
