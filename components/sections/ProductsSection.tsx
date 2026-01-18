'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState(0);

  const products = [
    {
      name: 'Coca-Cola',
      size: '500ml',
      price: '60',
      image: '/images/cola.jpg',
      bgColor: 'bg-red-600',
      lightBg: 'bg-red-50',
      hoverColor: 'hover:bg-red-700'
    },
    {
      name: 'Fanta Orange',
      size: '500ml',
      price: '60',
      image: '/images/fanta.jpg',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      name: 'Sprite',
      size: '500ml',
      price: '60',
      image: '/images/sprite.jpg',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      hoverColor: 'hover:bg-green-600'
    },
    {
      name: 'Pepsi',
      size: '500ml',
      price: '60',
      image: '/images/pepsi.jpg',
      bgColor: 'bg-blue-600',
      lightBg: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      name: 'Mountain Dew',
      size: '500ml',
      price: '60',
      image: '/images/dew.jpg',
      bgColor: 'bg-lime-500',
      lightBg: 'bg-lime-50',
      hoverColor: 'hover:bg-lime-600'
    },
    {
      name: 'Mirinda',
      size: '500ml',
      price: '60',
      image: '/images/mirinda.jpg',
      bgColor: 'bg-yellow-500',
      lightBg: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-600'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveProduct(index)}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image Area - 3/4 of card */}
              <div className="relative h-96 overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 ${product.lightBg} transition-all duration-300 ${
                  activeProduct === index ? 'opacity-100' : 'opacity-50'
                }`}></div>
                
                {/* Product Image */}
                <div className="relative h-full flex items-center justify-center p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={400}
                    className={`object-contain w-full h-full transform transition-transform duration-500 ${
                      activeProduct === index ? 'scale-110' : 'scale-100'
                    }`}
                  />
                </div>

                {/* Active Indicator */}
                {activeProduct === index && (
                  <div className={`absolute top-0 left-0 w-full h-2 ${product.bgColor}`}></div>
                )}
              </div>

              {/* Product Info - 1/4 of card */}
              <div className="p-6 bg-white">
                {/* Product Name & Size */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{product.size}</p>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.price}
                      </span>
                      <span className="text-lg text-gray-600 ml-1">KSh</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">All branches</p>
                  </div>

                  <Link
                    href="/auth/register"
                    className={`px-6 py-3 ${product.bgColor} ${product.hoverColor} text-white font-semibold rounded-lg transition-colors`}
                  >
                    Buy
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Same Price Everywhere</h4>
              <p className="text-gray-600">Consistent pricing across all 5 branches</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Always Fresh</h4>
              <p className="text-gray-600">Daily stock replenishment from headquarters</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Quality Guaranteed</h4>
              <p className="text-gray-600">Premium soft drinks from trusted brands</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}