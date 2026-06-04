import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./global.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Krishi Bazar | Premium Agricultural Marketplace",
  description: "Empowering farmers and merchants with a smart, direct, and transparent agricultural trading ecosystem.",
  keywords: ["agriculture", "trading platform", "direct-to-farmer", "smart bazaar", "krishi bazar", "agritech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
