import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ContentProtection from "@/components/ContentProtection";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "ZenomiLearn - Emotional Regulation for Teens",
  description: "A guided journey to understanding, managing, and thriving with your emotions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <ContentProtection />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
