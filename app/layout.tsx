import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Readers School — Futuristic Academy Hub",
  description: "A state-of-the-art educational interface featuring glassmorphic designs, secure Supabase authentication, offline PWA access, and real-time student analytics.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Readers School",
  },
};

export const viewport: Viewport = {
  themeColor: "#05050f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
