import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drinx retailers - Best prices on soft drinks in Kenya",
  description: "Discover unbeatable prices on top-quality soft drinks at Drinx retailers across Kenya. Enjoy the same great prices at all our branches, from Nairobi to Eldoret. Shop now for refreshing beverages!",
  keywords: 'soft drinks, drink retailers, Kenya, affordable drinks, beverage prices, Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, quality drinks, Drinx',
  applicationName: 'Drinx Retailers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
