'use client';

import { Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-slate-600 text-white py-3 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          {/* Left Side - Contact Info */}
          <div className="flex items-center text-sm">
            <a 
              href="tel:+254700000000" 
              className="flex items-center gap-2 hover:text-red-500 transition-colors pr-4"
            >
              <Phone className="h-4 w-4" />
              <span>+254 700 000 000</span>
            </a>
            <span className="text-gray-600">|</span>
            <a 
              href="mailto:info@drinkretailers.co.ke" 
              className="flex items-center gap-2 hover:text-red-500 transition-colors pl-4"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">info@drinkretailers.co.ke</span>
            </a>
          </div>

          {/* Right Side - Social Media */}
          <div className="flex items-center">
            <span className="text-sm text-gray-300 hidden md:inline pr-4">Follow us:</span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <div className="flex items-center md:pl-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors hover:scale-110 transform px-2"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <span className="text-gray-600">|</span>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors hover:scale-110 transform px-2"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <span className="text-gray-600">|</span>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors hover:scale-110 transform pl-2"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}