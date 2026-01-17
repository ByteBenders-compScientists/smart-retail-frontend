'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart-Retail</h3>
            <p className="text-gray-600 mb-4">
              Your trusted supermarket chain across Kenya. Quality drinks at the same price, available at all our branches.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#branches" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-600">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Nairobi CBD, Kenya</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-600">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-600">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>info@smartretail.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} Smart-Retail. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="font-medium">Branches:</span>
              <span>Nairobi (HQ)</span>
              <span>Kisumu</span>
              <span>Mombasa</span>
              <span>Nakuru</span>
              <span>Eldoret</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
