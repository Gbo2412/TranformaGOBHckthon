import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Despacho Presidencial — Consulta tu expediente 24/7",
  description:
    "Conversa con nuestro asistente y conoce el estado de tu trámite ante el Despacho Presidencial en cualquier momento, desde cualquier lugar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC362E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-surface-page font-sans text-ink-primary antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
