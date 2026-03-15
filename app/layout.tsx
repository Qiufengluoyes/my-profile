import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import { description, siteName, siteUrl } from "./site-data";
import ScrollRestorer from "./components/ScrollRestorer";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const body = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} Center`,
    template: `%s | ${siteName}`
  },
  description,
  keywords: [
    "枫落丰源个人主页",
    "枫落丰源"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName,
    title: `「${siteName}」个人主页`,
    description
  },
  twitter: {
    card: "summary_large_image",
    title: `「${siteName}」个人主页`,
    description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#080c18" }
  ]
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ScrollRestorer />
        {children}
      </body>
    </html>
  );
}
