// app/layout.tsx
import type React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  // verification: {
  //   google: "your-google-verification-code",
  // },
  other: {
    "format-detection": "telephone=no",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "x-ua-compatible": "IE=edge",
    charset: "utf-9",
    "content-language": "en",
  },
  /* alternates: { canonical: "https://yourdomain.com" }, */
  generator: "v0.dev",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;               // e.g. G-XXXXXXXXXX
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;     // e.g. abcdef1234

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head> 
         {GA_ID ? (
          <>
           
            <meta name="google-site-verification" content={GA_ID} />
            {/* <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script> */}
          </>
        ) : null}

        {/* --- Microsoft Clarity --- */}
        {CLARITY_ID ? (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        ) : null}

        {/* --- SPA route-change pageview helper for GA + (optional) Clarity --- */}
        <Script id="analytics-spa-hook" strategy="afterInteractive">
          {`
            (function() {
              var GA_ID='${GA_ID ?? ""}';
              function track(url){
                if (window.gtag && GA_ID) {
                  window.gtag('config', GA_ID, { page_path: url });
                }
                if (window.clarity) {
                  try { window.clarity('set','page', url); } catch(e){}
                }
              }
              function current(){ return location.pathname + location.search; }
              var pushState = history.pushState;
              var replaceState = history.replaceState;
              function fire(){ track(current()); }

              history.pushState = function() { pushState.apply(this, arguments); fire(); };
              history.replaceState = function() { replaceState.apply(this, arguments); fire(); };
              window.addEventListener('popstate', fire);
              document.addEventListener('DOMContentLoaded', fire);
            })();
          `}
        </Script>
      </head>
      <body className="font-system antialiased">
        {/* --- Google Analytics 4 (gtag.js) --- */}
       

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
