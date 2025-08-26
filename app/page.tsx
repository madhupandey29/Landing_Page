import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Chatbot } from "@/components/chatbot";
import { ProductCategoriesApi } from "@/components/product-categories-api";
import { FAQ } from "@/components/faq";
import { ContactForm } from "@/components/contact-form";

// ---------------------------
// API URLs
// ---------------------------
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";
const SEO_URL = RAW_BASE
  ? `${RAW_BASE}/seo/landing-page`
  : "http://localhost:7000/landing/seo/landing-page";
const PRODUCT_URL = RAW_BASE
  ? `${RAW_BASE}/product`
  : "http://localhost:7000/landing/product";
const LOC_URL = RAW_BASE
  ? `${RAW_BASE}/locations`
  : "http://localhost:7000/landing/locations";

const toId = (v: any) =>
  typeof v === "string" ? v.trim() : v?._id ? String(v._id).trim() : "";

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------------------------
// Metadata
// ---------------------------
export async function generateMetadata(): Promise<Metadata> {
  const seoJson = await fetchJson<any>(SEO_URL);
  const locJson = await fetchJson<any>(LOC_URL);

  const seos: any[] = Array.isArray(seoJson?.data) ? seoJson.data : [];
  const locs: any[] = Array.isArray(locJson?.data?.locations)
    ? locJson.data.locations
    : [];

  const defaultLoc =
    locs.find((l) => String(l?.name ?? "").toLowerCase() === "ahmedabad") ||
    null;
  const defaultLocId = defaultLoc?._id ?? "";
  const seoData =
    seos.find((s) => toId(s.location) === defaultLocId) || seos[0] || null;

  if (!seoData) {
    return {
      title: "Premium B2B Fabric Supplier | FabricPro",
      description:
        "Leading B2B fabric supplier for global garment manufacturers and retailers.",
    };
  }

  return {
    title: seoData.title || "FabricPro",
    description: seoData.description || "Premium fabrics",
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      siteName: seoData.ogSiteName,
      locale: seoData.ogLocale,
      type: seoData.ogType || "website",
      url: seoData.ogUrl,
      images: seoData.openGraph?.images,
    } as any,
    twitter: {
      card: seoData.twitterCard || "summary_large_image",
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
    },
    alternates: { canonical: seoData.canonical_url },
  };
}

// ---------------------------
// Page
// ---------------------------
export default async function Page() {
  const [seoJson, prodJson, locJson] = await Promise.all([
    fetchJson<any>(SEO_URL),
    fetchJson<any>(PRODUCT_URL),
    fetchJson<any>(LOC_URL),
  ]);

  const seos: any[] = Array.isArray(seoJson?.data) ? seoJson.data : [];
  const products: any[] = Array.isArray(prodJson?.data) ? prodJson.data : [];
  const locs: any[] = Array.isArray(locJson?.data?.locations)
    ? locJson.data.locations
    : [];

  const defaultLoc =
    locs.find((l) => String(l?.name ?? "").toLowerCase() === "ahmedabad") ||
    null;
  const defaultLocId = defaultLoc?._id ?? "";
  const seoData =
    seos.find((s) => toId(s.location) === defaultLocId) || seos[0] || null;

  let heroImage = "/placeholder.svg?height=600&width=800";
  let heroAlt = "Premium fabric warehouse";
  if (seoData) {
    const heroProd = products.find((p) => String(p._id) === toId(seoData.product));
    if (heroProd?.img) {
      heroImage = heroProd.img;
      heroAlt = heroProd.name || heroAlt;
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="hero relative bg-white text-slate-900 overflow-hidden pt-4 pb-8 sm:pt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div className="space-y-8 w-full mt-6 lg:mt-0">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                {seoData
                  ? (
                      <>
                        Premium{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                          {products.find((p) => String(p._id) === toId(seoData.product))?.name || "Fabrics"}
                        </span>{" "}
                        for Global Manufacturers
                      </>
                    )
                  : "Premium Fabrics for Global Manufacturers"}
              </h1>

              <p className="text-base sm:text-xl text-slate-600 max-w-2xl">
                Connect with leading fabric suppliers worldwide. Quality textiles,
                competitive pricing, and reliable supply chains.
              </p>

              {seoData && (
                <div className="bg-slate-100 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">SKU:</span>
                    <span className="ml-2">{seoData.sku}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Price:</span>
                    <span className="ml-2">${seoData.salesPrice}</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="px-8 py-4 btn-primary">Get Quote Now</a>
                <a href="tel:+1234567890" className="px-8 py-4 btn-secondary">📞 Call Now</a>
                <a
                  href="#catalog"
                  className="px-6 py-3 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white rounded-lg font-semibold transition-all duration-200"
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

            {/* Right (Image) */}
            <div className="relative flex items-center justify-center w-full min-h-[220px] sm:min-h-[320px] lg:min-h-[400px]">
              <div className="relative z-10 w-full h-56 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-lg">
                <Image src={heroImage} alt={heroAlt} fill className="object-cover" />
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
                      <Image
                        src="/placeholder.svg?height=500&width=600"
                        alt="Modern textile manufacturing facility"
                        width={600}
                        height={500}
                        loading="lazy"
                        className="rounded-2xl shadow-lg"
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




      {/* PRODUCTS */}
      <ProductCategoriesApi />

      {/* FAQ */}
      <FAQ />

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
            Get Your Custom Quote Today
          </h2>
          <div className="grid lg:grid-cols-2 gap-16">
            <ContactForm />
            <div className="space-y-6 text-white">
              <div>📞 +91 9925155141</div>
              <div>✉️ rajesh.goyal@amritafashions.com</div>
              <div>🏢 Ahmedabad, Gujarat-380015</div>
              <div>🕘 Mon–Sat: 9:30 AM – 7:00 PM IST</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating actions */}
      <WhatsAppButton />
      <Chatbot />
    </main>
  );
}
