import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu, Amiri } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FooterWrapper from "@/components/layout/FooterWrapper";
import Image from "next/image";
import { absoluteUrl, siteConfig } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  weight: ['400', '700'],
  variable: "--font-nastaliq",
  subsets: ["arabic"], // Urdu uses arabic character set in google fonts
});

const amiri = Amiri({
  weight: ['400', '700'],
  variable: "--font-amiri",
  subsets: ["arabic"],
});
export const metadata: Metadata = {
  title: {
    default: "Islami Jamiat-e-Talaba Bahawalpur",
    template: "%s",
  },
  description: siteConfig.defaultDescription,
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Islami Jamiat-e-Talaba Bahawalpur",
    description: siteConfig.defaultDescription,
    siteName: siteConfig.name,
    locale: "en_PK",
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Islami Jamiat-e-Talaba Bahawalpur",
    description: siteConfig.defaultDescription,
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoNastaliq.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col font-sans bg-transparent text-gray-900 shadow-none relative">
        {/* Global Watermark */}
        <div className="fixed inset-0 -z-50 pointer-events-none bg-[#FAFCFF]">
           <div className="absolute inset-0 bg-gradient-to-br from-[#1C7F93]/5 via-[#FAFCFF] to-[#123962]/5 mix-blend-multiply"></div>
           <div className="absolute inset-0 opacity-[0.03] grayscale">
              <Image src="/noor.png" alt="Theme Background" fill className="object-cover object-bottom" priority />
           </div>
        </div>

        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
