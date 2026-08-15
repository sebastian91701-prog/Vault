import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAULT — Tu caja fuerte digital",
  description: "Vault. Todo seguro. Todo tuyo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-vaultbg">{children}</body>
    </html>
  );
}
