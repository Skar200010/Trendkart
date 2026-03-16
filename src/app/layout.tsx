import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIChatbot from "@/components/AIChatbot";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "TrendKart - Your Fashion Destination",
    template: "%s | TrendKart",
  },
  description: "Discover the latest trends in men's and women's fashion. Shop trending styles, compare prices, and find the best deals on TrendKart.",
  keywords: ["fashion", "clothing", "men's fashion", "women's fashion", "shopping", "trendy", "online shopping"],
  authors: [{ name: "TrendKart" }],
  creator: "TrendKart",
  publisher: "TrendKart",
  metadataBase: new URL("https://trendkart.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trendkart.com",
    siteName: "TrendKart",
    title: "TrendKart - Your Fashion Destination",
    description: "Discover the latest trends in men's and women's fashion",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TrendKart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendKart - Your Fashion Destination",
    description: "Discover the latest trends in men's and women's fashion",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <AIChatbot />
        </Providers>
      </body>
    </html>
  );
}
