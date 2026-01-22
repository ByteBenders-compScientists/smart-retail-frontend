import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${outfit.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}