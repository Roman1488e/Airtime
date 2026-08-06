import type React from "react";
import "./globals.css";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Providers from "@/components/providers";
import Script from "next/script";
import NetlifyIdentity from "@/components/netlify-identity";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], variable: "--font-cormorant", weight: ["500", "600", "700"] });

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
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <NetlifyIdentity />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
