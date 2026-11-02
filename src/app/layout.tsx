import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import ContentProtection from "@/components/ContentProtection";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "ZenomiLearn - Emotional Regulation for Teens",
  description: "A guided journey to understanding, managing, and thriving with your emotions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <ContentProtection />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
