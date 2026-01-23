'use client';

import { Star, Truck, Shield, Tag, Gift, Clock, RefreshCw, Zap, Sparkles, TrendingUp, BottleWine } from 'lucide-react';

const marqueeItems = [
  {
    icon: Truck,
    text: 'FREE Delivery on Orders Above KSh 2,000',
    iconColor: 'text-yellow-300',
    textColor: 'text-blue-100'
  },
  {
    icon: Star,
    text: 'Rated 4.8★ by 2,500+ Happy Customers',
    iconColor: 'text-amber-300',
    textColor: 'text-blue-100'
  },
  {
    icon: Shield,
    text: '100% Secure M-Pesa Payments',
    iconColor: 'text-green-300',
    textColor: 'text-blue-100'
  },
  {
    icon: Tag,
    text: 'Same Price Across All 5 Branches',
    iconColor: 'text-purple-300',
    textColor: 'text-blue-100'
  },
  {
    icon: Gift,
    text: '🎁 Buy 12 Bottles, Get 1 FREE',
    iconColor: 'text-pink-300',
    textColor: 'text-blue-100'
  },
  {
    icon: Clock,
    text: 'Same-Day Restocking Guaranteed',
    iconColor: 'text-cyan-300',
    textColor: 'text-blue-100'
  },
  {
    icon: RefreshCw,
    text: 'Instant Refund Policy - No Questions',
    iconColor: 'text-red-300',
    textColor: 'text-blue-100'
  },
  {
    icon: Zap,
    text: '⚡ Checkout in Under 30 Seconds',
    iconColor: 'text-orange-300',
    textColor: 'text-blue-100'
  },
  {
    icon: BottleWine,
    text: '🥤Fresh Stock Daily from All Branches',
    iconColor: 'text-teal-300',
    textColor: 'text-blue-100'
  },
  {
    icon: TrendingUp,
    text: 'Join 10,000+ Regular Customers',
    iconColor: 'text-indigo-300',
    textColor: 'text-blue-100'
  }
];

export default function MarqueeBanner() {
  return (
    <div className="relative overflow-hidden bg-blue-600 border-b border-blue-700">
      {/* Gradient overlays for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-600 to-transparent z-10 pointer-events-none"></div>
      
      {/* Marquee Container */}
      <div className="flex animate-marquee-smooth py-3">
        {/* First set of items */}
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`first-${index}`}
              className="inline-flex items-center mx-6 group cursor-pointer"
            >
              <Icon className={`h-5 w-5 ${item.iconColor} mr-3 group-hover:scale-110 transition-transform`} />
              <span className={`font-semibold ${item.textColor} whitespace-nowrap text-sm group-hover:text-white transition-colors`}>
                {item.text}
              </span>
            </div>
          );
        })}
        
        {/* Second set (duplicate for seamless loop) */}
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`second-${index}`}
              className="inline-flex items-center mx-6 group cursor-pointer"
            >
              <Icon className={`h-5 w-5 ${item.iconColor} mr-3 group-hover:scale-110 transition-transform`} />
              <span className={`font-semibold ${item.textColor} whitespace-nowrap text-sm group-hover:text-white transition-colors`}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marquee-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee-smooth {
          animation: marquee-smooth 30s linear infinite;
        }
        
        .animate-marquee-smooth:hover {
          animation-play-state: paused;
        }

        @media (min-width: 768px) {
          .animate-marquee-smooth {
            animation: marquee-smooth 50s linear infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-smooth {
            animation: marquee-smooth 100s linear infinite;
          }
        }
      `}</style>
    </div>
  );
}