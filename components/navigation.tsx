"use client";
import React from "react";
import Link from "next/link";

export function Navigation() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b-0 sticky top-0 z-50 relative animated-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-slate-900">
                {process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name"}
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                Products
              </a>
              <a href="#about" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                About
              </a>
              <a href="#faq" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                Contact
              </a>
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Quote
              </a>
            </div>

            {/* Hamburger/Close for Mobile */}
            <div className="md:hidden flex items-center">
              <button
                className="text-slate-700 hover:text-slate-900 focus:outline-none"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  // Close Icon
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger Icon
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {open && (
          <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
            <div
              className="w-4/5 max-w-xs bg-sky-100 h-full shadow-lg p-6 flex flex-col relative transform transition-transform duration-300 ease-in-out translate-x-full animate-none"
              style={{ transform: "translateX(0)" }}
            >
              {/* Menu Header */}
              <div className="flex justify-between items-center mb-8 z-10 relative">
                <span className="text-xl font-bold text-slate-900">
                  {process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name"}
                </span>
                <button
                  className="text-slate-700 hover:text-slate-900 focus:outline-none"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  {/* Close Icon */}
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col gap-3 z-10 relative">
                <a
                  href="#products"
                  className="py-2 px-2 text-slate-800 font-medium rounded hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  Products
                </a>
                <a
                  href="#about"
                  className="py-2 px-2 text-slate-800 font-medium rounded hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  About
                </a>
                <a
                  href="#faq"
                  className="py-2 px-2 text-slate-800 font-medium rounded hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  FAQ
                </a>
                <a
                  href="#contact"
                  className="py-2 px-2 text-slate-800 font-medium rounded hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  Contact
                </a>
                <a
                  href="#contact"
                  className="mt-4 py-2 px-2 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Get Quote
                </a>
              </nav>
            </div>

            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setOpen(false)} />
          </div>
        )}
      </nav>

      <style jsx>{`
        .animated-border::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(270deg, #3b82f6, #10b981, #f59e0b, #ef4444, #3b82f6);
          background-size: 400% 400%;
          animation: moveGradient 6s ease infinite;
        }

        @keyframes moveGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
