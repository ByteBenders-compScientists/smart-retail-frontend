'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Favorite Drinks,
                <span className="block text-red-500">Anytime, Anywhere</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Shop from any of our 5 branches across Kenya. Same quality, same price, delivered with convenience.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/#products"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  View Products
                </Link>
              </motion.div>
            </motion.div>

            {/* Features List */}
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="space-y-3">
                {[
                  'Same price across all branches', 
                  'Top quality soft drinks', 
                  'Fast and convenient shopping'
                ].map((item, index) => (
                  <motion.div 
                    key={item} 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                  >
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {[
                { value: '5', label: 'Branches' },
                { value: '3', label: 'Products' },
                { value: '100%', label: 'Quality' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <p className="text-3xl font-bold text-red-500">{stat.value}</p>
                  <p className="text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Image
                src="/images/drinks/hero-image.png"
                alt="Soft drinks display"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -top-10 -right-10 w-20 h-20 bg-red-500 rounded-full opacity-70"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 4,
                }}
              />
              <motion.div 
                className="absolute -bottom-10 -left-10 w-16 h-16 bg-yellow-500 rounded-full opacity-70"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 5,
                  delay: 1
                }}
              />
            </motion.div>
            
            {/* Floating Card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 z-20 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 rounded-full p-3">
                  <ShoppingBag className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Same Price</p>
                  <p className="text-xl font-bold text-gray-900">All Branches</p>
                </div>
              </div>
            </motion.div>
            
            {/* Branch Pin */}
            <motion.div 
              className="absolute top-6 right-6 bg-white rounded-xl shadow-lg p-3 z-20 border border-gray-100"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <p className="font-medium text-gray-900">5 Locations</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}