import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",   // show fallback font immediately — no invisible text
  preload: true,
});

export const metadata: Metadata = {
  title: "Kalori AI - Smart Meal Tracking",
  description: "AI-powered meal scanner and macro tracker. Stop guessing your macros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-[#f8f9fa] text-gray-900" suppressHydrationWarning>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
