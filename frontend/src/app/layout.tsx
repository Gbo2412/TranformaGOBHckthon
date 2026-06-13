import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Despacho Presidencial — Consulta tu expediente 24/7",
  description:
    "Conversa con nuestro asistente y conoce el estado de tu trámite ante el Despacho Presidencial en cualquier momento, desde cualquier lugar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E2C5C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
