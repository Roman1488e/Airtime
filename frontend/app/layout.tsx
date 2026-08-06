import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import Script from "next/script";
import NetlifyIdentity from "@/components/netlify-identity";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <NetlifyIdentity />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
