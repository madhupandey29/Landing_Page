import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Chatbot } from "@/components/chatbot";
import { ProductCategories } from "@/components/product-categories";
import { ProductCategoriesApi } from "@/components/product-categories-api";
import { FAQ } from "@/components/faq";
import { ContactForm } from "@/components/contact-form";
import { fetchSeoData } from "@/lib/seo";

// In Next.js 15 some dynamic contexts provide `params` as a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// --- Types used locally (minimal, to avoid "any") ---
type ProductDoc = {
  _id: string;
  name?: string;
  img?: string;
  image1?: string;
  image2?: string;
};

type SeoDoc = {
  product?: string | { _id?: string };
  // ... other fields are present but not needed for the image logic
};

// Valid OpenGraph types
const validOgTypes = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
] as const;

// Valid Twitter card types
const validTwitterCards = ["summary", "summary_large_image", "player", "app"] as const;

// Treat anything with a dot as a static asset (favicon.ico, icon-192x192.png, robots.txt, etc.)
const isAssetSlug = (slug?: string) => !!slug && slug.includes(".");

// Helper: normalize id whether seoData.product is a string or {_id}
function getLinkedProductId(prod: SeoDoc["product"]): string {
  if (!prod) return "";
  if (typeof prod === "string") return prod.trim();
  if (typeof prod === "object" && prod._id) return String(prod._id).trim();
  return "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ await the params (Next 15 fix)
  if (isAssetSlug(slug)) return {};

  try {
    const seoData: any = await fetchSeoData(slug);

    if (seoData && seoData.slug === slug) {
      const ogType = (validOgTypes as readonly string[]).includes(seoData.ogType as any)
        ? (seoData.ogType as (typeof validOgTypes)[number])
        : "website";

      const twitterCard = (validTwitterCards as readonly string[]).includes(
        seoData.twitterCard as any
      )
        ? (seoData.twitterCard as (typeof validTwitterCards)[number])
        : "summary_large_image";

      return {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        authors: seoData.author_name ? [{ name: seoData.author_name }] : undefined,
        robots: seoData.robots,
        openGraph: {
          title: seoData.ogTitle,
          description: seoData.ogDescription,
          siteName: seoData.ogSiteName,
          locale: seoData.ogLocale,
          type: ogType,
          url: seoData.ogUrl,
          images: seoData.openGraph?.images,
        } as any, // minimal assertion for images array flexibility
        twitter: {
          card: twitterCard,
          title: seoData.twitterTitle,
          description: seoData.twitterDescription,
        },
        // verification: {
        //   google: seoData.googleSiteVerification,
        // },
        other: {
          "format-detection": seoData.formatDetection,
          "apple-mobile-web-app-capable": seoData.mobileWebAppCapable,
          "apple-mobile-web-app-status-bar-style": seoData.appleStatusBarStyle,
          "x-ua-compatible": seoData.xUaCompatible,
          charset: seoData.charset,
          canonical: seoData.canonical_url,
          "content-language": seoData.contentLanguage,
          hreflang: seoData.hreflang,
          "x-default": seoData.x_default,
        },
        alternates: {
          canonical: seoData.canonical_url,
        },
      };
    }

    // Static fallback
    return {
      title:
        "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions - FabricPro",
      description:
        "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers. Premium quality textiles, competitive pricing, worldwide shipping.",
      keywords:
        "B2B fabric supplier, textile manufacturer, bulk fabric orders, garment industry, clothing retailers, fabric importers, wholesale textiles, global fabric trade",
      authors: [{ name: "FabricPro Team" }],
      robots: "index, follow",
      openGraph: {
        title:
          "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions",
        description:
          "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers.",
        siteName: "FabricPro",
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title:
          "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions",
        description:
          "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers.",
      },
      other: {
        "format-detection": "telephone=no",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "x-ua-compatible": "IE=edge",
        charset: "utf-8",
        "content-language": "en",
        /*  canonical: "https://yourdomain.com", */
        // "google-site-verification": "your-google-verification-code",
      },
    };
  } catch {
    return {
      title:
        "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions - FabricPro",
      description:
        "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers.",
    };
  }
}

// Structured data (example)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "FabricPro",
      description: "Leading B2B fabric supplier for global garment manufacturers",
      url: "https://fabricpro.com",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-234-567-8900",
        contactType: "sales",
        email: "sales@fabricpro.com",
      },
    },
    {
      "@type": "Product",
      name: "Premium B2B Fabric Supply",
      description: "High-quality textiles for global garment manufacturers",
      brand: {
        "@type": "Brand",
        name: "FabricPro",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "FabricPro",
        },
      },
    },
  ],
};

export default async function SlugPage({ params }: Props) {
  const { slug } = await params; // ✅ await the params
  if (isAssetSlug(slug)) return null;

  // Lazy import product fetcher to keep top-level import light
  const [{ fetchProductData }] = await Promise.all([import("@/lib/seo")]);

  const [seoData, products] = await Promise.all([
    fetchSeoData(slug),
    fetchProductData(),
  ]);

  // --- Find the linked product once, reuse in multiple places ---
  const linkedProductId = getLinkedProductId((seoData as SeoDoc | undefined)?.product);
  const matchingProduct: ProductDoc | null =
    (Array.isArray(products) ? (products as ProductDoc[]).find((p) => p._id === linkedProductId) : null) || null;

  // HERO image stays as before (uses "img")
  let heroImage = "/placeholder.svg?height=600&width=800";
  let heroAlt = "Premium fabric warehouse with organized textile rolls";
  if (matchingProduct?.img) {
    heroImage = matchingProduct.img;
    heroAlt = matchingProduct.name || heroAlt;
  }

  // ✅ Company Overview right panel image uses SECOND image:
  // priority: image2 → image1 → img → placeholder
  const overviewImage =
    (matchingProduct?.image2?.trim() ||
      matchingProduct?.image1?.trim() ||
      matchingProduct?.img?.trim() ||
      "/placeholder.svg?height=500&width=600");

  const overviewAlt =
    (matchingProduct?.name ? `${matchingProduct.name} — secondary view` : "Modern textile manufacturing facility");

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-white">
        {/* ───────────────────────────────────────────────────────────
            HERO
        ─────────────────────────────────────────────────────────── */}
        <section className="hero relative bg-white text-slate-900 overflow-hidden pt-4 pb-8 sm:pt-8">
          <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Column: Text */}
              <div className="space-y-8 w-full mt-6 lg:mt-0">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                    {matchingProduct?.name ? (
                      <>
                        Premium{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                          {matchingProduct.name}
                        </span>{" "}
                        for Global Manufacturers
                      </>
                    ) : (
                      <>Premium Fabrics for Global Manufacturers</>
                    )}
                  </h1>

                  <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                    Connect with leading fabric suppliers worldwide. Quality textiles,
                    competitive pricing, and reliable supply chains for garment
                    manufacturers and retailers.
                  </p>

                  {seoData && (
                    <div className="bg-slate-100 rounded-lg p-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">SKU:</span>
                          <span className="text-slate-900 ml-2">
                            {(seoData as any).sku}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Price:</span>
                          <span className="text-slate-900 ml-2">
                            ${(seoData as any).salesPrice}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Rating:</span>
                          <span className="text-slate-900 ml-2">
                            {(seoData as any).rating_value}/5
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Reviews:</span>
                          <span className="text-slate-900 ml-2">
                            {(seoData as any).rating_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-8 py-4 btn-primary"
                  >
                    Get Quote Now
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center justify-center px-8 py-4 btn-secondary"
                  >
                    📞 Call Now
                  </a>
                  <a
                    href="#catalog"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white rounded-lg font-semibold transition-all duration-200"
                  >
                    📋 Free Catalog
                  </a>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span>ISO Certified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span>Global Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="relative flex items-center justify-center w-full min-h-[220px] sm:min-h-[320px] lg:min-h-[400px]">
                <div className="relative z-10 w-full h-56 sm:h-80 lg:h-[420px] lg:max-w-2xl lg:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg animate-shadow">
                  <Image
                    src={heroImage}
                    alt={heroAlt}
                    fill
                    priority
                    fetchPriority="high"
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 800px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────
            COMPANY OVERVIEW
        ─────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Leading B2B Fabric Supplier Worldwide
              </h2>
              <p className="text-slate-600 mb-8">
                ISO 9001 Certified • 500+ Global Partners • Ships to 50+ Countries
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto mb-8" />
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <p className="text-lg text-slate-700 leading-relaxed">
                  As a premier B2B fabric supplier, we specialize in providing
                  high-quality textiles to global garment manufacturers, clothing
                  retailers, and fabric trading companies. Our extensive network spans
                  across major textile hubs worldwide, ensuring consistent supply
                  chains and competitive pricing for bulk fabric orders.
                </p>

                <p className="text-lg text-slate-700 leading-relaxed">
                  Our commitment to excellence extends beyond product quality to
                  encompass reliable logistics, flexible payment terms, and
                  comprehensive customer support. Whether you&rsquo;re sourcing fabrics for
                  fast fashion, luxury apparel, or industrial textiles, our team
                  delivers customized solutions.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-slate-600">Global Partners</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                    <div className="text-slate-600">Countries Served</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* ✅ Updated to show second product image (image2 → image1 → img) */}
                <Image
                  src={overviewImage}
                  alt={overviewAlt}
                  width={600}
                  height={500}
                  loading="lazy"
                  className="rounded-2xl shadow-lg object-cover w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────
            TRUSTED BY
        ─────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Trusted by Leading Brands Worldwide
              </h2>
              <p className="text-slate-600">
                Ships to 50+ countries • MOQ 100 meters • 24-hour response time
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="bg-slate-100 h-16 rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-semibold">ACME APPAREL</span>
              </div>
              <div className="bg-slate-100 h-16 rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-semibold">FASHION CORP</span>
              </div>
              <div className="bg-slate-100 h-16 rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-semibold">TEXTILE PLUS</span>
              </div>
              <div className="bg-slate-100 h-16 rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-semibold">GLOBAL WEAR</span>
              </div>
            </div>

            {/* Case Study */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-emerald-50 p-8 rounded-2xl border border-blue-100">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Success Story
                  </h3>
                  <p className="text-slate-600">
                    How Acme Apparel reduced lead times by 30% with our fabrics
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
                    <div className="text-sm text-slate-600">Faster Lead Times</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">15%</div>
                    <div className="text-sm text-slate-600">Cost Reduction</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-purple-600 mb-2">99.8%</div>
                    <div className="text-sm text-slate-600">Quality Rate</div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <a
                    href="#case-study"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read Full Case Study →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────
            CATALOG (anchor used by the hero button)
        ─────────────────────────────────────────────────────────── */}
        {/* (optional) kept commented out */}

        {/* ───────────────────────────────────────────────────────────
            PROCESS
        ─────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Simple Buying Process  abc
              </h2>
              <p className="text-slate-600 mt-2">
                From sampling to shipment—optimized for speed and quality.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Brief & Samples", text: "Share GSM, blend, finish and colors." },
                { step: "2", title: "Quote & Lead Time", text: "Clear pricing & timelines upfront." },
                { step: "3", title: "PO & Production", text: "QC checks across the production run." },
                { step: "4", title: "Logistics & Delivery", text: "Global shipping with tracking." },
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                    {s.step}
                  </div>
                  <div className="font-semibold mt-4">{s.title}</div>
                  <div className="text-sm text-slate-600 mt-2">{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────
            PRODUCT CATEGORIES
        ─────────────────────────────────────────────────────────── */}
        {/* <ProductCategories /> */}
        <ProductCategoriesApi />

        {/* ───────────────────────────────────────────────────────────
            FAQ
        ─────────────────────────────────────────────────────────── */}
        <FAQ />

        {/* ───────────────────────────────────────────────────────────
            CONTACT
        ─────────────────────────────────────────────────────────── */}
        <section id="contact" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Get Your Custom Quote Today
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Connect with our fabric specialists for personalized pricing and bulk order
                solutions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <ContactForm />

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Phone</div>
                    <a
                      href="tel:+919925155141"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      +91 9925155141
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <a
                      href="mailto: rajesh.goyal@amritafashions.com"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      rajesh.goyal@amritafashions.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Office</div>
                    <div className="text-slate-300">
                      404, Safal Prelude, Corporate Rd, Prahlad Nagar,
                      <br />
                      Ahmedabad, Gujarat-380015
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🕘</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Hours</div>
                    <div className="text-slate-300">Mon–Sat: 9:30 AM – 7:00 PM IST</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating actions */}
        <WhatsAppButton />
        <Chatbot />
      </main>
    </>
  );
}
