'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Favorite Drinks,
              <span className="block text-blue-600">Anytime, Anywhere</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Shop from any of our 5 branches across Kenya. Same quality, same price, delivered with convenience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/#products"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                View Products
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-blue-600">5</p>
                <p className="text-gray-600 mt-1">Branches</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-gray-600 mt-1">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">100%</p>
                <p className="text-gray-600 mt-1">Quality</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&h=800&fit=crop"
                alt="Soft drinks display"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Same Price</p>
                  <p className="text-xl font-bold text-gray-900">All Branches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
