import type { Metadata } from "next"
import Image from "next/image"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Chatbot } from "@/components/chatbot"
import { ProductCategories } from "@/components/product-categories"
import { FAQ } from "@/components/faq"
import { ContactForm } from "@/components/contact-form"

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: "Premium B2B Fabric Supplier | Global Textile Manufacturing Solutions - FabricPro",
  description:
    "Leading B2B fabric supplier for global garment manufacturers, clothing retailers, and fabric importers. Premium quality textiles, competitive pricing, worldwide shipping. ISO certified with 500+ partners across 50+ countries.",
  keywords:
    "B2B fabric supplier, textile manufacturer, bulk fabric orders, garment industry, clothing retailers, fabric importers, wholesale textiles, global fabric trade, cotton fabrics, silk materials, synthetic blends, technical textiles",
}

// Structured data for better SEO
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
        name: "FabricPro"
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "FabricPro"
        }
      }
    }
  ]
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="min-h-screen bg-white">
        {/* Hero Section - Critical above-the-fold content */}
        <section className="hero relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                    Premium Fabrics for
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                      Global Manufacturers
                    </span>
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                    Connect with leading fabric suppliers worldwide. Quality textiles, competitive pricing, and reliable
                    supply chains for garment manufacturers and retailers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 btn-primary">
                    Get Quote Now
                  </a>
                  <a href="tel:+1234567890" className="inline-flex items-center justify-center px-8 py-4 btn-secondary">
                    📞 Call Now
                  </a>
                  <a href="#catalog" className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 rounded-lg font-semibold transition-all duration-200">
                    📋 Free Catalog
                  </a>
                </div>

                <div className="flex items-center space-x-8 text-sm text-slate-400">
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

              <div className="relative">
                {/* Animated colorful shadow background */}
                <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
                  <div
                    className="w-full h-full animate-gradient-move"
                    style={{
                      backgroundImage: `url('/placeholder.svg?height=600&width=800'), linear-gradient(120deg, #60a5fa88 0%, #34d39988 50%, #f472b688 100%)`,
                      backgroundBlendMode: 'overlay',
                      backgroundSize: 'cover, 200% 200%',
                      backgroundPosition: 'center, 0% 50%',
                      filter: 'blur(24px) brightness(1.2)',
                      opacity: 0.7,
                      transition: 'background-position 2s',
                    }}
                  />
                </div>
                <div className="relative z-10">
                  {/* 4. Lazy-load images with explicit sizing */}
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Premium fabric warehouse with organized textile rolls"
                    width={1200}
                    height={600}
                    priority
                    fetchPriority="high"
                    className="rounded-2xl shadow-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Leading B2B Fabric Supplier Worldwide
              </h2>
              <p className="text-slate-600 mb-8">ISO 9001 Certified • 500+ Global Partners • Ships to 50+ Countries</p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto mb-8" />
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <p className="text-lg text-slate-700 leading-relaxed">
                  As a premier B2B fabric supplier, we specialize in providing high-quality textiles to global garment
                  manufacturers, clothing retailers, and fabric trading companies. Our extensive network spans across
                  major textile hubs worldwide, ensuring consistent supply chains and competitive pricing for bulk
                  fabric orders.
                </p>

                <p className="text-lg text-slate-700 leading-relaxed">
                  Our commitment to excellence extends beyond product quality to encompass reliable logistics, flexible
                  payment terms, and comprehensive customer support. Whether you're sourcing fabrics for fast fashion,
                  luxury apparel, or industrial textiles, our experienced team works closely with fabric importers and
                  manufacturers to deliver customized solutions.
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

        {/* Trusted By Section */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Trusted by Leading Brands Worldwide</h2>
              <p className="text-slate-600">Ships to 50+ countries • MOQ 100 meters • 24-hour response time</p>
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Success Story</h3>
                  <p className="text-slate-600">How Acme Apparel reduced lead times by 30% with our fabrics</p>
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
                  <a href="#case-study" className="text-blue-600 hover:text-blue-700 font-medium">
                    Read Full Case Study →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <ProductCategories />

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Form */}
        <section id="contact" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Get Your Custom Quote Today</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Connect with our fabric specialists for personalized pricing and bulk order solutions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <ContactForm />

              <div className="space-y-8">
                <div className="bg-slate-800 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl">📞</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Phone</div>
                        <a href="tel:+919925155141" className="text-slate-300 hover:text-white transition-colors">
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
                        <div className="text-slate-300">404, Safal Prelude,Corporate Rd, Prahlad Nagar,<br /> Ahmedabad,
                           Gujarat-380015</div>
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp Button and Chatbot */}
        <WhatsAppButton />
        <Chatbot />
      </main>
    </>
  )
}
