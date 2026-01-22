'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function BranchesSection() {
  const [selectedBranch, setSelectedBranch] = useState(0);

  const branches = [
    {
      name: 'Nairobi',
      isHQ: true,
      address: 'Tom Mboya Street, Nairobi CBD',
      phone: '+254 700 000 001',
      hours: 'Mon-Sat: 8AM - 8PM, Sun: 9AM - 6PM',
      image: '/images/nrb.jpg'
    },
    {
      name: 'Kisumu',
      isHQ: false,
      address: 'Oginga Odinga Road, Kisumu City',
      phone: '+254 700 000 002',
      hours: 'Mon-Sat: 8AM - 8PM, Sun: 9AM - 6PM',
      image: '/images/branch2.png'
    },
    {
      name: 'Mombasa',
      isHQ: false,
      address: 'Nyali Area, Mombasa Road',
      phone: '+254 700 000 003',
      hours: 'Mon-Sat: 8AM - 8PM, Sun: 9AM - 6PM',
      image: '/images/branch3.jpg'
    },
    {
      name: 'Nakuru',
      isHQ: false,
      address: 'Kenyatta Avenue, Nakuru Town',
      phone: '+254 700 000 004',
      hours: 'Mon-Sat: 8AM - 8PM, Sun: 9AM - 6PM',
      image: '/images/branch4.jpg'
    },
    {
      name: 'Eldoret',
      isHQ: false,
      address: 'Uganda Road, Eldoret Town',
      phone: '+254 700 000 005',
      hours: 'Mon-Sat: 8AM - 8PM, Sun: 9AM - 6PM',
      image: '/images/branch5.jpg'
    }
  ];

  const activeBranch = branches[selectedBranch];

  return (
    <section id="branches" className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Branches Across Kenya
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conveniently located in 5 major cities. Same products, same prices, same quality service.
          </p>
        </div>

        {/* Branch Display */}
        <div className="bg-white border-t-4 border-blue-600">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Branch Tabs - Left Side */}
            <div className="lg:col-span-2 border-r border-gray-200">
              {branches.map((branch, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBranch(index)}
                  className={`w-full text-left p-8 border-b border-gray-200 transition-all duration-300 ${
                    selectedBranch === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-2xl font-bold mb-1 ${
                        selectedBranch === index ? 'text-white' : 'text-gray-900'
                      }`}>
                        {branch.name}
                      </h3>
                      {branch.isHQ && (
                        <span className={`text-xs font-semibold px-2 py-1 ${
                          selectedBranch === index
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          HEADQUARTERS
                        </span>
                      )}
                    </div>
                    <div className={`w-3 h-3 ${
                      selectedBranch === index ? 'bg-white' : 'bg-blue-600'
                    }`}></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Branch Details - Right Side */}
            <div className="lg:col-span-3">
              {/* Branch Image */}
              <div className="relative h-80 bg-gray-200">
                <img
                  src={activeBranch.image}
                  alt={`${activeBranch.name} branch`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {activeBranch.name}
                  </h3>
                  {activeBranch.isHQ && (
                    <span className="inline-block bg-white/20 text-white px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                      Distribution Center & HQ
                    </span>
                  )}
                </div>
              </div>

              {/* Branch Information */}
              <div className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
                    <p className="text-lg font-semibold text-gray-900">{activeBranch.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Phone</p>
                    <a href={`tel:${activeBranch.phone}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {activeBranch.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Opening Hours</p>
                    <p className="text-lg font-semibold text-gray-900">{activeBranch.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-white p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-3">5</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Branches Nationwide</div>
              <p className="text-gray-600">Serving customers across Kenya</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-3">72</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Hours Per Week</div>
              <p className="text-gray-600">Extended operating hours for your convenience</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-3">100%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Price Consistency</div>
              <p className="text-gray-600">Same prices at every location</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}