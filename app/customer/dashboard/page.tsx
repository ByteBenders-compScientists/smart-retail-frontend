'use client';

import { useState } from 'react';
import Navigation from '@/components/customer/Navigation';
import MarqueeBanner from '@/components/customer/MarqueeBanner';
import FilterSidebar from '@/components/customer/FilterSidebar';
import ProductCard from '@/components/customer/ProductCard';
import { Filter, Search, TrendingUp, Flame, Sparkles, Coffee, ShoppingCart, Truck, Shield, MapPin } from 'lucide-react';

// Mock data for products
const products = [
  {
    id: '1',
    name: 'Coca-Cola Original 500ml',
    brand: 'Coke',
    description: 'Classic Coca-Cola taste. Available in single bottles or crates.',
    price: 60.00,
    originalPrice: 65.00,
    image: '/images/drinks/coke.png',
    rating: 4.8,
    reviews: 1250,
    stock: 45,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Kisumu Branch', 'Mombasa Branch', 'Nakuru Branch', 'Eldoret Branch'],
    volume: '500ml',
    unit: 'single'
  },
  {
    id: '2',
    name: 'Coca-Cola Original 500ml Crate',
    brand: 'Coke',
    description: 'Coca-Cola 500ml crate of 24 bottles. Perfect for parties and events.',
    price: 1400.00,
    originalPrice: 1560.00,
    image: '/images/drinks/cokes.png',
    rating: 4.8,
    reviews: 850,
    stock: 120,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Kisumu Branch', 'Mombasa Branch', 'Nakuru Branch', 'Eldoret Branch'],
    volume: '500ml x 24',
    unit: 'crate'
  },
  {
    id: '3',
    name: 'Coca-Cola Original 1 Litre',
    brand: 'Coke',
    description: 'Coca-Cola in a larger 1 litre bottle. Great for sharing.',
    price: 110.00,
    image: '/images/drinks/litre.webp',
    rating: 4.7,
    reviews: 680,
    stock: 80,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Kisumu Branch', 'Mombasa Branch', 'Nakuru Branch', 'Eldoret Branch'],
    volume: '1L',
    unit: 'single'
  },
  {
    id: '4',
    name: 'Fanta Orange 500ml',
    brand: 'Fanta',
    description: 'Bursting with orange flavor. Refreshing anytime.',
    price: 60.00,
    image: '/images/drinks/orangee.png',
    rating: 4.6,
    reviews: 980,
    stock: 32,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Mombasa Branch', 'Eldoret Branch'],
    volume: '500ml',
    unit: 'single'
  },
  {
    id: '5',
    name: 'Fanta Orange 500ml Crate',
    brand: 'Fanta',
    description: 'Fanta Orange 500ml crate of 24 bottles. Bulk savings!',
    price: 1400.00,
    image: '/images/drinks/fantas.png',
    rating: 4.6,
    reviews: 520,
    stock: 95,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Mombasa Branch', 'Eldoret Branch'],
    volume: '500ml x 24',
    unit: 'crate'
  },
  {
    id: '6',
    name: 'Fanta Orange 2 Litre',
    brand: 'Fanta',
    description: 'Fanta Orange in 2 litre bottle. Maximum refreshment.',
    price: 180.00,
    image: '/images/drinks/fant.png',
    rating: 4.5,
    reviews: 420,
    stock: 60,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Mombasa Branch'],
    volume: '2L',
    unit: 'single'
  },
  {
    id: '7',
    name: 'Sprite Lemon-Lime 500ml',
    brand: 'Sprite',
    description: 'Crisp, clean lemon-lime flavor. Caffeine-free.',
    price: 60.00,
    image: '/images/drinks/sp.png',
    rating: 4.7,
    reviews: 1120,
    stock: 58,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Kisumu Branch', 'Nakuru Branch'],
    volume: '500ml',
    unit: 'single'
  },
  {
    id: '8',
    name: 'Sprite Lemon-Lime 500ml Crate',
    brand: 'Sprite',
    description: 'Sprite 500ml crate of 24 bottles. Stock up and save.',
    price: 1400.00,
    image: '/images/drinks/spritecrate.png',
    rating: 4.7,
    reviews: 640,
    stock: 110,
    category: 'Soft Drinks',
    branches: ['Nairobi HQ', 'Kisumu Branch', 'Nakuru Branch'],
    volume: '500ml x 24',
    unit: 'crate'
  },
  {
    id: '9',
    name: 'Coca-Cola Zero Sugar 500ml',
    brand: 'Coke',
    description: 'All the Coca-Cola taste, zero sugar. Zero calories.',
    price: 65.00,
    image: '/images/drinks/zero.png',
    rating: 4.5,
    reviews: 760,
    stock: 28,
    category: 'Diet Drinks',
    branches: ['Nairobi HQ', 'Kisumu Branch', 'Mombasa Branch'],
    volume: '500ml',
    unit: 'single'
  },
  {
    id: '10',
    name: 'Sprite Zero Sugar 1 Litre',
    brand: 'Sprite',
    description: 'Great Sprite taste with zero sugar and zero calories.',
    price: 115.00,
    image: '/images/drinks/spritezero.png',
    rating: 4.3,
    reviews: 420,
    stock: 37,
    category: 'Diet Drinks',
    branches: ['Nairobi HQ', 'Nakuru Branch'],
    volume: '1L',
    unit: 'single'
  },
  {
    id: '11',
    name: 'Fanta Pineapple 500ml',
    brand: 'Fanta',
    description: 'Tropical pineapple flavor. Sweet and refreshing.',
    price: 60.00,
    originalPrice: 65.00,
    image: '/images/drinks/pine.webp',
    rating: 4.4,
    reviews: 540,
    stock: 19,
    category: 'Soft Drinks',
    branches: ['Mombasa Branch', 'Eldoret Branch'],
    volume: '500ml',
    unit: 'single'
  },
  {
    id: '12',
    name: 'Coca-Cola Vanilla 500ml',
    brand: 'Coke',
    description: 'Classic Coca-Cola with smooth vanilla twist. Limited edition.',
    price: 70.00,
    image: '/images/drinks/vani.png',
    rating: 4.9,
    reviews: 890,
    stock: 15,
    category: 'Special Editions',
    branches: ['Nairobi HQ'],
    volume: '500ml',
    unit: 'single'
  }
];

const categories = [
  { id: 'all', name: 'All Products', icon: Coffee, count: 12 },
  { id: 'trending', name: 'Trending', icon: TrendingUp, count: 5 },
  { id: 'coke', name: 'Coke', icon: Coffee, count: 4 },
  { id: 'fanta', name: 'Fanta', icon: Coffee, count: 4 },
  { id: 'sprite', name: 'Sprite', icon: Coffee, count: 3 },
  { id: 'crates', name: 'Crates (24pcs)', icon: Coffee, count: 3 },
  { id: 'specials', name: 'Special Offers', icon: Flame, count: 3 }
];

const branches = [
  { id: 'all', name: 'All Branches', location: 'View All' },
  { id: 'nairobi', name: 'Nairobi HQ', location: 'Nairobi' },
  { id: 'kisumu', name: 'Kisumu Branch', location: 'Kisumu' },
  { id: 'mombasa', name: 'Mombasa Branch', location: 'Mombasa' },
  { id: 'nakuru', name: 'Nakuru Branch', location: 'Nakuru' },
  { id: 'eldoret', name: 'Eldoret Branch', location: 'Eldoret' }
];

export default function DashboardPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [filters, setFilters] = useState({
    categories: ['Coke', 'Fanta', 'Sprite'],
    priceRange: { min: 0, max: 2000 },
    sortBy: 'popular',
    inStock: true,
    branch: 'all'
  });

  // Filter products based on active filters
  const filteredProducts = products.filter(product => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by active category
    if (activeCategory !== 'all') {
      if (activeCategory === 'trending') {
        return product.rating >= 4.5;
      } else if (activeCategory === 'crates') {
        return product.unit === 'crate';
      } else if (activeCategory === 'specials') {
        return product.originalPrice !== undefined;
      } else if (activeCategory !== 'all') {
        return product.brand.toLowerCase() === activeCategory.toLowerCase();
      }
    }

    // Filter by selected categories from sidebar
    if (filters.categories.length > 0 && !filters.categories.includes(product.brand)) {
      return false;
    }

    // Filter by stock
    if (filters.inStock && product.stock === 0) {
      return false;
    }

    // Filter by selected branch
    const branchToCheck = selectedBranch !== 'all' ? selectedBranch : filters.branch;
    if (branchToCheck !== 'all') {
      const branchMap: Record<string, string> = {
        'nairobi': 'Nairobi HQ',
        'kisumu': 'Kisumu Branch',
        'mombasa': 'Mombasa Branch',
        'nakuru': 'Nakuru Branch',
        'eldoret': 'Eldoret Branch'
      };
      if (branchToCheck in branchMap && !product.branches.includes(branchMap[branchToCheck])) {
        return false;
      }
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      default: // popular
        return b.rating * b.reviews - a.rating * a.reviews;
    }
  });

  const handleAddToCart = (productId: string, quantity: number) => {
    console.log(`Added ${quantity} of product ${productId} to cart`);
  };

  const currentBranch = branches.find(b => b.id === selectedBranch) || branches[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Marquee Banner at the very top */}
      <MarqueeBanner />
      
      {/* Navigation */}
      <Navigation />
      
      <div className="flex">
        {/* Thin Filter Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)]">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              onFilterChange={setFilters}
            />
          </div>
        </aside>

        {/* Mobile Filter Sidebar */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}>
            <div className="absolute inset-y-0 left-0 w-80 max-w-full" onClick={(e) => e.stopPropagation()}>
              <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilterChange={setFilters}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              <span className="font-medium text-gray-900">Show Filters</span>
            </button>
          </div>

          {/* Welcome Header with Branch Selector */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 lg:p-10 mb-8 text-white shadow-xl rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                  Welcome back, John! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Shop singles, litres, or crates from any of our 5 branches.
                </p>
              </div>
              
              {/* Branch Selector */}
              <div className="bg-white/10 backdrop-blur-md p-4 border border-white/20 min-w-[280px] rounded-xl">
                <div className="flex items-center gap-2 mb-3 ">
                  <MapPin className="h-5 w-5 text-blue-200" />
                  <span className="text-sm font-medium text-blue-100">Shopping Location</span>
                </div>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-blue-200 mt-2">
                  Currently showing products from {currentBranch.name}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drinks (Coke, Fanta, Sprite)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl pl-12 pr-4 py-3.5 bg-white/95 backdrop-blur-sm border-2 border-blue-600/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                />
              </div>
              <button className="flex rounded-xl items-center justify-center px-6 py-3.5 bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap">
                <ShoppingCart className="h-5 w-5 mr-2" />
                View Cart (3)
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Browse Categories</h2>
              <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1">
                {filteredProducts.length} products
              </span>
            </div>
            <div className="flex overflow-x-auto pb-3 gap-3 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex rounded-md items-center px-5 py-3.5 whitespace-nowrap transition-all shadow-sm ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-semibold">{category.name}</span>
                    <span className={`ml-2.5 text-xs px-2 py-1 font-bold ${
                      activeCategory === category.id
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === 'trending' ? '🔥 Trending Now' : 
               activeCategory === 'crates' ? '📦 Crates (24 Bottles)' :
               activeCategory === 'specials' ? '🎉 Special Offers' : 
               '🥤 All Drinks'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid - Responsive */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-12">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border-2 border-dashed border-gray-300">
              <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No drinks found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setSelectedBranch('all');
                  setFilters({
                    categories: ['Coke', 'Fanta', 'Sprite'],
                    priceRange: { min: 0, max: 2000 },
                    sortBy: 'popular',
                    inStock: true,
                    branch: 'all'
                  });
                }}
                className="px-8 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Why Choose Us */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Shop With Drinx Retailers?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Same Price Everywhere</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Enjoy consistent pricing across all 5 branches. No surprises, just great value wherever you shop.
                </p>
              </div>
              <div className="bg-white p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Bulk Discounts</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Buy crates and save! Perfect for events, parties, or stocking up your business.
                </p>
              </div>
              <div className="bg-white p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Secure M-Pesa Payments</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Fast, secure payments via M-Pesa. Complete checkout in under 30 seconds.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}