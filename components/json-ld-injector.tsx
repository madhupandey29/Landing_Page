'use client';

import Script from 'next/script';

interface JsonLdInjectorProps {
  videoLd?: any;
  logoLd?: any;
  breadcrumbLd?: any;
  localBusinessLd?: any;
  productLd: any;
  organizationLd: any;
}

export default function JsonLdInjector({
  videoLd,
  logoLd,
  breadcrumbLd,
  localBusinessLd,
  productLd,
  organizationLd
}: JsonLdInjectorProps) {
  return (
    <>
      {videoLd && (
        <Script
          id="video-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
          strategy="beforeInteractive"
        />
      )}
      {logoLd && (
        <Script
          id="logo-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(logoLd) }}
          strategy="beforeInteractive"
        />
      )}
      {breadcrumbLd && (
        <Script
          id="breadcrumb-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
          strategy="beforeInteractive"
        />
      )}
      {localBusinessLd && (
        <Script
          id="local-business-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
          strategy="beforeInteractive"
        />
      )}
      <Script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        strategy="beforeInteractive"
      />
      <Script
        id="organization-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        strategy="beforeInteractive"
      />
    </>
  );
}
