"use client";
import React from "react";

export default function MobileNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <nav className="lg:hidden w-full flex items-center justify-between py-4 px-2 bg-white border-b border-slate-100 sticky top-0 z-30">
      <span className="font-bold text-lg text-slate-900">FabricPro</span>
      <button
        aria-label="Open menu"
        className="p-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen(!open)}
      >
        {/* Hamburger icon */}
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-900">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg border-b border-slate-200 animate-fade-in z-40">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <a href="#products" className="block py-2 px-4 text-slate-800 font-medium hover:bg-slate-100 rounded">
                Products
              </a>
            </li>
            <li>
              <a href="#about" className="block py-2 px-4 text-slate-800 font-medium hover:bg-slate-100 rounded">
                About
              </a>
            </li>
            <li>
              <a href="#faq" className="block py-2 px-4 text-slate-800 font-medium hover:bg-slate-100 rounded">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="block py-2 px-4 text-slate-800 font-medium hover:bg-slate-100 rounded">
                Contact
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block py-2 px-4 mt-2 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Get Quote
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
