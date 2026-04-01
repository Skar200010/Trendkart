import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
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
          {/* <AIChatbot /> */}
        </Providers>
        <Script id="noupe-chatbot" strategy="afterInteractive">
          {`
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.id = 'noupe-chatbot-left';
            style.innerHTML = '[data-noupe-widget] { left: 20px !important; right: auto !important; } [data-noupe-widget] iframe { left: 20px !important; right: auto !important; }';
            head.appendChild(style);
          `}
        </Script>
        <Script src="https://www.noupe.com/embed/019d1a622fdc7926b1238991668cc362c54d.js" strategy="afterInteractive" />
        <Script id="cuelinks-widget" strategy="afterInteractive">
          {`
            var cId = '271326';
            (function(d, t) {
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src = (document.location.protocol == 'https:' ? 'https://cdn0.cuelinks.com/js/' : 'http://cdn0.cuelinks.com/js/') + 'cuelinksv2.js';
              document.getElementsByTagName('body')[0].appendChild(s);
            }());
          `}
        </Script>
      </body>
    </html>
  );
}
