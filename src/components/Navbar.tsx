"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import NavIcons from "./Navicons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest(".mobile-menu")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}>
      {/* Top Bar - Logo, Search Toggle, and Icons */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Left: Hamburger menu and logo */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 mr-1 lg:hidden"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`block absolute left-0 h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 top-2.5' : 'top-1'}`}></span>
                <span className={`block absolute left-0 h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'top-2.5'}`}></span>
                <span className={`block absolute left-0 h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 top-2.5' : 'top-4'}`}></span>
              </div>
            </button>
            
            <Link href="/" className="flex items-center gap-2 ml-1">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image 
                  src="/logo.svg" 
                  alt="Zukih Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hidden sm:block">
                zukih
              </div>
            </Link>
          </div>

          {/* Center: Search bar (hidden on mobile when not expanded) */}
          <div className={`flex-1 max-w-2xl mx-4 ${searchExpanded ? 'flex' : 'hidden md:flex'}`}>
            <SearchBar />
          </div>

          {/* Right: Icons and search toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search toggle for mobile */}
            <button 
              className="md:hidden p-2 text-gray-700"
              onClick={() => setSearchExpanded(!searchExpanded)}
              aria-label="Toggle search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <NavIcons />
          </div>
        </div>
      </div>

      {/* Secondary bar for categories on desktop */}
      <div className="hidden lg:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-12">
            <div className="flex space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium relative group py-2"
              >
                Homepage
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium relative group py-2"
              >
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium relative group py-2"
              >
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (Amazon style) */}
      <div className={`lg:hidden mobile-menu fixed inset-0 z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        {/* Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
        
        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <Link 
                href="/" 
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative w-8 h-8">
                  <Image 
                    src="/logo.svg" 
                    alt="Zukih Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  zukih
                </div>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User greeting (Amazon style) */}
            <div className="py-2">
              <p className="text-sm text-gray-500">Hello,</p>
              <p className="font-medium">Welcome to Zukih</p>
            </div>
          </div>
          
          {/* Navigation links */}
          <div className="p-4 space-y-1">
            <h3 className="text-lg font-bold mb-2">Shop By Department</h3>
            <Link 
              href="/" 
              className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Homepage
            </Link>
            <Link 
              href="/categories" 
              className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/products" 
              className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link 
              href="/sale" 
              className="block py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sale
            </Link>
          </div>
          
          {/* Additional sections like Amazon */}
          <div className="p-4 border-t">
            <h3 className="text-lg font-bold mb-2">Help & Settings</h3>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded">Your Account</a>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded">Customer Service</a>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded">Sign out</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;