'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="contact" className="bg-blue-600/30  py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Start Shopping with Drinx Retailers Today
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Join our growing community of satisfied customers. Shop from any of our 5 branches across Kenya and enjoy the same great prices everywhere.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/auth/register"
              className="group inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              Create Your Account
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold text-lg hover:bg-blue-700 transition-all duration-300"
            >
              Sign In to Your Account
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-blue-500">
            <div>
              <div className="text-5xl font-bold text-white mb-2">5</div>
              <div className="text-blue-100 font-medium">Branches Nationwide</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 font-medium">Online Shopping</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 font-medium">Price Consistency</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}