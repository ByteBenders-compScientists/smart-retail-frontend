'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="contact" className="bg-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of customers enjoying convenient shopping across all our branches. Register now and get started in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Already have an account? Login
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-12 border-t border-blue-500">
            <p className="text-blue-100 mb-4">Have questions? We're here to help!</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white">
              <a href="tel:+254700000000" className="hover:text-blue-100 transition-colors">
                📞 +254 700 000 000
              </a>
              <a href="mailto:info@smartretail.co.ke" className="hover:text-blue-100 transition-colors">
                ✉️ info@smartretail.co.ke
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
