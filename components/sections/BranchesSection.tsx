'use client';

import { MapPin, Phone, Clock } from 'lucide-react';

export default function BranchesSection() {
  const branches = [
    {
      name: 'Nairobi',
      isHQ: true,
      address: 'Nairobi CBD, Kenya',
      phone: '+254 700 000 001',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
    },
    {
      name: 'Kisumu',
      isHQ: false,
      address: 'Kisumu City, Kenya',
      phone: '+254 700 000 002',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    },
    {
      name: 'Mombasa',
      isHQ: false,
      address: 'Mombasa Road, Kenya',
      phone: '+254 700 000 003',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop',
    },
    {
      name: 'Nakuru',
      isHQ: false,
      address: 'Nakuru Town, Kenya',
      phone: '+254 700 000 004',
      image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=600&h=400&fit=crop',
    },
    {
      name: 'Eldoret',
      isHQ: false,
      address: 'Eldoret Town, Kenya',
      phone: '+254 700 000 005',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=400&fit=crop',
    },
  ];

  return (
    <section id="branches" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Branches
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are conveniently located across Kenya to serve you better. Visit any of our branches for the same great service.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Branch Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={branch.image}
                  alt={`${branch.name} branch`}
                  className="w-full h-full object-cover"
                />
                {branch.isHQ && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Headquarters
                  </div>
                )}
              </div>

              {/* Branch Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {branch.name}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 text-gray-600">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span>{branch.phone}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span>Mon - Sat: 8AM - 8PM</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
