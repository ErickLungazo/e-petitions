import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Petitions Kenya",
  description:
    "Engage with the Kenyan Parliament. Create, sign, and track petitions online.",
  keywords: [
    "petitions",
    "Kenya",
    "Parliament",
    "government",
    "democracy",
    "legislation",
    "public participation",
    "advocacy",
    "citizen engagement",
  ],
  openGraph: {
    title: "E-Petitions Kenya",
    description:
      "Engage with the Kenyan Parliament. Create, sign, and track petitions online.",
    url: "https://yourwebsite.com", // Replace with your actual URL
    siteName: "E-Petitions Kenya",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "E-Petitions Kenya Logo",
      },
    ],
    type: "website",
  },
  // Optional:
  //   authors: [
  //     {
  //       name: "Your Organization",
  //       url: "https://yourorganization.com",
  //     },
  //   ],
  //   creator: "Your Organization",
  //   publisher: "Your Organization",
  //   robots: {
  //     index: true,
  //     follow: true,
  //   },
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
        <Toaster />
        {children}
      </body>
    </html>
  );
}
