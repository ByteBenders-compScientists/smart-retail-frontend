'use client';

import { ShoppingCart, MapPin, CreditCard, Clock } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Easy Shopping',
      description: 'Browse and shop from our catalog of quality soft drinks with just a few clicks.',
    },
    {
      icon: MapPin,
      title: 'Multiple Branches',
      description: 'Choose from any of our 5 branches across Kenya - Nairobi, Kisumu, Mombasa, Nakuru, and Eldoret.',
    },
    {
      icon: CreditCard,
      title: 'M-Pesa Payment',
      description: 'Secure and instant payments through M-Pesa integration for seamless checkout.',
    },
    {
      icon: Clock,
      title: 'Same Day Service',
      description: 'Quick processing and same-day availability at your selected branch.',
    },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Smart-Retail?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make shopping for your favorite drinks simple, convenient, and affordable across all our locations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
