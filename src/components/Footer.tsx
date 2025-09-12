import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                  <Image 
                    src="/logo.svg" 
                    alt="Zukih Logo" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  zukih
                </span>
              </Link>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Your trusted partner for quality vehicles and exceptional service. Driving your dreams forward.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-indigo-600 transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
                aria-label="Facebook"
              >
                <div className="relative h-5 w-5">
                  <Image 
                    src="/facebook.png" 
                    alt="Facebook" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-pink-600 transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
                aria-label="Instagram"
              >
                <div className="relative h-5 w-5">
                  <Image 
                    src="/instagram.png" 
                    alt="Instagram" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </a>
              
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Site Map
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Purchase', 'Features', 'Contact us'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-indigo-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500"></span>
            </h3>
            
            {/* Phone Numbers */}
            <div className="flex items-start mb-5">
              <div className="bg-indigo-500 p-2 rounded-lg mr-4 flex-shrink-0">
                <div className="relative h-5 w-5">
                  <Image 
                    src="/phone1.jpg" 
                    alt="Phone" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>
              <ul className="space-y-1">
                {['+254703483886', '+254722825342', '+254727945946', '+2540202213851'].map((number) => (
                  <li key={number} className="text-gray-400 hover:text-white transition-colors">
                    {number}
                  </li>
                ))}
              </ul>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <div className="bg-indigo-500 p-2 rounded-lg mr-4">
                <div className="relative h-5 w-5">
                  <Image
                    src="/mail.jpg"
                    alt="Email"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="text-gray-400 hover:text-white transition-colors">
                zukihautotraders@gmail.com
              </span>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500"></span>
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Zukih Auto Traders. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;