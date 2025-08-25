export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Amrita Global Enterprises</h3>
            <p className="text-slate-300 leading-relaxed">
              Leading B2B fabric supplier connecting global manufacturers with premium textiles worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <span>📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors"
              >
                <span>🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <span>💼</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cotton Fabrics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Silk Materials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Synthetic Blends
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Technical Textiles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bulk Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Custom Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Quality Control
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Global Shipping
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-slate-300">
              <p>📞 +91 9925155141</p>
              <p>✉️ rajesh.goyal@amritafashions.com</p>
              <p>🏢 404, Safal Prelude,Corporate Rd, Prahlad Nagar, Ahmedabad, Gujarat-380015</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2025  Amrita Global Enterprises. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
