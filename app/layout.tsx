import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
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
  metadataBase: new URL('https://retaliationesports.net'),
  title: "Retaliation Esports - We're finally retaliating",
  description: "We're finally retaliating. RETALIATION ESPORTS - Competitive gaming organization with elite teams and tournaments.",
  keywords: ["esports", "gaming", "tournaments", "competitive gaming", "retaliation esports"],
  authors: [{ name: "Retaliation Esports" }],
  openGraph: {
    title: "Retaliation Esports",
    description: "We're finally retaliating. RETALIATION ESPORTS",
    url: "https://retaliationesports.net",
    siteName: "Retaliation Esports",
    images: [
      {
        url: "/images/icon.png",
        width: 512,
        height: 512,
        alt: "Retaliation Esports Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retaliation Esports",
    description: "We're finally retaliating. RETALIATION ESPORTS",
    images: ["/images/icon.png"],
  },
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
