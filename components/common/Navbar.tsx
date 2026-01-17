'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
           <Image
                src="/images/logo.png"
                alt="Smart-Retail Logo"
                width={250}
                height={50}
                />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/#features" 
              className="text-white hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </Link>
            <Link 
              href="/#branches" 
              className="text-white hover:text-blue-600 transition-colors font-medium"
            >
              Branches
            </Link>
            <Link 
              href="/#products" 
              className="text-white hover:text-blue-600 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              href="/#contact" 
              className="text-white hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="px-4 py-2 text-white hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/auth/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/#features"
              className="block py-2 text-white hover:text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#branches"
              className="block py-2 text-white hover:text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Branches
            </Link>
            <Link 
              href="/#products"
              className="block py-2 text-white hover:text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/#contact"
              className="block py-2 text-white hover:text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2 border-t border-gray-200">
              <Link 
                href="/auth/login"
                className="block w-full px-4 py-2 text-center text-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth/register"
                className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
