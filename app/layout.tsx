// app/layout.tsx
import type React from "react";
import type { Metadata, Viewport } from "next";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title:
    "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions - FabricPro",
  description:
    "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers. Premium quality textiles, competitive pricing, worldwide shipping.",
  keywords:
    "B2B fabric supplier, textile manufacturer, bulk fabric orders, garment industry, clothing retailers, fabric importers, wholesale textiles, global fabric trade",
  authors: [{ name: "FabricPro Team" }],
  openGraph: {
    title: "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions",
    description:
      "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers.",
    type: "website",
    siteName: "FabricPro",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions",
    description:
      "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    "format-detection": "telephone=no",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "x-ua-compatible": "IE=edge",
    charset: "utf-8",
    "content-language": "en",
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-system antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
