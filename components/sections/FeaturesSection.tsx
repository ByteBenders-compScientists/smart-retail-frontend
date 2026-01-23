'use client';

import { useState } from 'react';
import { ShoppingCart, MapPin, CreditCard, Clock } from 'lucide-react';

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: ShoppingCart,
      number: '01',
      title: 'Easy Shopping Experience',
      description: 'Browse our complete catalog of premium soft drinks with an intuitive interface designed for speed and convenience. Add items to cart, review, and checkout in seconds.',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      hoverBg: 'hover:bg-red-500',
      borderColor: 'border-red-200'
    },
    {
      icon: MapPin,
      number: '02',
      title: 'Multiple Branch Locations',
      description: 'Shop from any of our 5 strategically located branches across Kenya - Nairobi HQ, Kisumu, Mombasa, Nakuru, and Eldoret. Same products, same prices everywhere.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      hoverBg: 'hover:bg-orange-500',
      borderColor: 'border-orange-200'
    },
    {
      icon: CreditCard,
      number: '03',
      title: 'Secure M-Pesa Payments',
      description: 'Complete your purchase with Kenya\'s most trusted payment method. Instant M-Pesa integration ensures your transactions are safe, secure, and processed immediately.',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      hoverBg: 'hover:bg-green-500',
      borderColor: 'border-green-200'
    },
    {
      icon: Clock,
      number: '04',
      title: 'Same Day Availability',
      description: 'Quick order processing with same-day availability at your selected branch. Our efficient distribution system ensures products are always in stock and ready for you.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      hoverBg: 'hover:bg-blue-500',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <section id="features" className="bg-gray-50 py-20 overflow-hidden -mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Drinx Retailers?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make shopping for your favorite drinks simple, convenient, and affordable across all our locations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group bg-white rounded-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer transform hover:-translate-y-2"
              >
                {/* Feature Number - Large Background */}
                <div className="absolute top-2 right-4 z-0">
                  <span className={`text-7xl font-bold transition-all duration-300 ${
                    isHovered ? 'text-white/30' : 'text-gray-100'
                  }`}>
                    {feature.number}
                  </span>
                </div>
                
                {/* Icon */}
                <div 
                  className={`${feature.bgColor} rounded-full w-16 h-16 flex items-center justify-center mb-5 relative z-10 transition-all duration-300 ${
                    isHovered ? 'scale-110 rotate-6' : ''
                  }`}
                >
                  <Icon className={`h-8 w-8 ${feature.color} transition-all duration-300 ${
                    isHovered ? 'scale-110' : ''
                  }`} />
                </div>
                
                {/* Content */}
                <h3 className={`text-xl font-semibold mb-2 relative z-10 transition-colors duration-300 ${
                  isHovered ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed relative z-10 transition-colors duration-300 ${
                  isHovered ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>

                {/* Hover Background Overlay */}
                <div 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  } ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                  style={{ zIndex: 1 }}
                ></div>

                {/* Keep content above overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}