'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState(0);

  const products = [
    {
      name: 'Coca-Cola',
      size: '500ml',
      price: '60',
      image: '/images/drinks/cocacola.png',
      bgColor: 'bg-red-500',
      lightBg: 'bg-red-50'
    },
    {
      name: 'Fanta Orange',
      size: '500ml',
      price: '60',
      image: '/images/drinks/fanta.png',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50'
    },
    {
      name: 'Sprite',
      size: '500ml',
      price: '60',
      image: '/images/drinks/sprite.png',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50'
    }
  ];

  return (
    <section id="products" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium Soft Drinks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quality beverages at consistent pricing across all our branches in Kenya.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-gray-200">
          {products.map((product, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveProduct(index)}
              className="group relative bg-white border-r border-b border-gray-200 p-12 hover:bg-gray-50 transition-all duration-300"
            >
              {/* Product Image Area */}
              <div className="relative h-80 flex items-center justify-center mb-8">
                {/* Placeholder for product image */}
                <div className={`absolute inset-0 ${product.lightBg} transition-opacity duration-300 ${
                  activeProduct === index ? 'opacity-100' : 'opacity-0'
                }`}></div>
                <div className="relative z-10 w-40 h-64 flex items-center justify-center">
                  <div className={`w-32 h-48 ${product.bgColor} transform transition-transform duration-500 ${
                    activeProduct === index ? 'scale-110' : 'scale-100'
                  }`}></div>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6">{product.size}</p>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {product.price}
                    <span className="text-2xl text-gray-600 ml-2">KSh</span>
                  </div>
                  <p className="text-sm text-gray-500">Same price at all branches</p>
                </div>

                {/* Add to Cart */}
                <Link
                  href="/auth/register"
                  className={`inline-block w-full py-4 ${product.bgColor} text-white font-semibold hover:opacity-90 transition-opacity`}
                >
                  Add to Cart
                </Link>
              </div>

              {/* Active Indicator */}
              {activeProduct === index && (
                <div className={`absolute top-0 left-0 w-full h-1 ${product.bgColor}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 bg-gray-50 p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Check className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Same Price Everywhere</h4>
              <p className="text-gray-600">Consistent pricing across all 5 branches</p>
            </div>
            <div>
              <Check className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Always Fresh</h4>
              <p className="text-gray-600">Daily stock replenishment from headquarters</p>
            </div>
            <div>
              <Check className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Quality Guaranteed</h4>
              <p className="text-gray-600">Premium soft drinks from trusted brands</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}