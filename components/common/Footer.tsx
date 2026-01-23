'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-700/70 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
           <Image
                src="/images/logo.png"
                alt="Smart-Retail Logo"
                width={250}
                height={50}
                className="h-10 w-auto"
              />
            <p className="text-gray-300 mb-4">
              Your trusted supermarket chain across Kenya. Quality drinks at the same price, available at all our branches.
            </p>
            <div className="flex space-x-4 mt-6">
              <motion.a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-red-500 transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-red-500 transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-red-500 transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Features', 'Branches', 'Products', 'Register'].map((item, index) => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Link 
                    href={item === 'Register' ? '/auth/register' : `/#${item.toLowerCase()}`} 
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-300">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-400" />
                <span>Nairobi CBD, Kenya</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-400" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-400" />
                <span>info@smartretail.co.ke</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Drinx-Retailers. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400 flex-wrap justify-center">
              <span className="font-medium">Branches:</span>
              {['Nairobi (HQ)', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret'].map((branch, index) => (
                <span key={branch} className="px-2">{branch}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}