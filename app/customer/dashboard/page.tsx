'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/customer/Navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import MarqueeBanner from '@/components/customer/MarqueeBanner';
import FilterSidebar from '@/components/customer/FilterSidebar';
import ProductCard from '@/components/customer/ProductCard';
import {
  Filter,
  Search,
  TrendingUp,
  Flame,
  Coffee,
  ShoppingCart,
  Truck,
  Shield,
  MapPin,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useBranches } from '@/hooks/useBranches';
import { useBranchInventory } from '@/hooks/useBranchInventory';
import type { ProductDisplay } from '@/types/product';
import { ROUTES } from '@/lib/constants';

const categories = [
  { id: 'all', name: 'All Products', icon: Coffee },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'coke', name: 'Coke', icon: Coffee },
  { id: 'fanta', name: 'Fanta', icon: Coffee },
  { id: 'sprite', name: 'Sprite', icon: Coffee },
  { id: 'crates', name: 'Crates (24pcs)', icon: Coffee },
  { id: 'specials', name: 'Special Offers', icon: Flame },
];

export default function DashboardPage() {
  const { user, token } = useAuthContext();
  const { products: allProducts, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts(token);
  const { branches, isLoading: branchesLoading, error: branchesError, refetch: refetchBranches } = useBranches(token);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [filters, setFilters] = useState({
    categories: ['Coke', 'Fanta', 'Sprite'],
    priceRange: { min: 0, max: 2000 },
    sortBy: 'popular',
    inStock: true,
    branch: 'all',
  });

  const branchOptions = useMemo(
    () => [
      { id: 'all', name: 'All Branches', location: 'View All' },
      ...branches.map((b) => ({
        id: b.id,
        name: b.isHeadquarter ? `${b.name} (HQ)` : b.name,
        location: b.name,
      })),
    ],
    [branches]
  );

  const selectedBranchName = selectedBranch === 'all'
    ? undefined
    : branches.find((b) => b.id === selectedBranch)?.name;

  const { products: branchProducts, isLoading: branchLoading } = useBranchInventory(
    selectedBranch === 'all' ? null : selectedBranch,
    selectedBranchName ?? undefined,
    token
  );

  const isProductsLoading = productsLoading || branchesLoading;
  const isBranchLoading = selectedBranch !== 'all' && branchLoading;
  const isLoading = isProductsLoading || isBranchLoading;

  const sourceProducts: ProductDisplay[] =
    selectedBranch === 'all' ? allProducts : branchProducts;

  const filteredProducts = useMemo(() => {
    return sourceProducts.filter((product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (activeCategory !== 'all') {
        if (activeCategory === 'trending') return product.rating >= 4.5;
        if (activeCategory === 'crates') return product.unit === 'crate';
        if (activeCategory === 'specials') return product.originalPrice != null;
        return product.brand.toLowerCase() === activeCategory.toLowerCase();
      }

      if (filters.categories.length > 0 && !filters.categories.includes(product.brand)) {
        return false;
      }

      if (filters.inStock && product.branches.length > 0 && product.stock === 0) {
        return false;
      }

      if (
        filters.priceRange &&
        (product.price < filters.priceRange.min || product.price > filters.priceRange.max)
      ) {
        return false;
      }

      return true;
    });
  }, [sourceProducts, searchQuery, activeCategory, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        default:
          return b.rating * b.reviews - a.rating * a.reviews;
      }
    });
  }, [filteredProducts, filters.sortBy]);

  const handleAddToCart = (productId: string, quantity: number) => {
    console.log(`Added ${quantity} of product ${productId} to cart`);
  };

  const currentBranch = branchOptions.find((b) => b.id === selectedBranch) ?? branchOptions[0];
  const hasError = productsError || branchesError;

  return (
    <div className="min-h-screen bg-gray-50">
      <MarqueeBanner />
      <Navigation />

      <div className="flex">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)]">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              onFilterChange={setFilters}
              branches={branchOptions}
            />
          </div>
        </aside>

        {isFilterOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="absolute inset-y-0 left-0 w-80 max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilterChange={setFilters}
                branches={branchOptions}
              />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-4 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              <span className="font-medium text-gray-900">Show Filters</span>
            </button>
          </div>

          <div className="relative p-6 lg:p-10 mb-8 text-white shadow-xl rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url(https://i.pinimg.com/1200x/65/86/a9/6586a930db1e4efed4ac1bdb6a9a09eb.jpg)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/70 to-slate-900/95" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                    Welcome back, {user?.name ?? 'there'}! 👋
                  </h1>
                  <p className="text-white text-lg">
                    Shop singles, litres, or crates from our branches.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 border border-white/20 min-w-[280px] rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium text-white">Shopping Location</span>
                  </div>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                    disabled={branchesLoading}
                  >
                    {branchOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white mt-2">
                    {selectedBranch === 'all'
                      ? 'Showing products from all branches'
                      : `Showing inventory at ${currentBranch.name}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drinks (Coke, Fanta, Sprite)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl pl-12 pr-4 py-3.5 bg-white/95 backdrop-blur-sm border-2 border-sky-600/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                  />
                </div>
                <Link
                  href={ROUTES.CUSTOMER_CART}
                  className="flex rounded-xl items-center justify-center px-6 py-3.5 bg-white text-sky-600 font-semibold hover:bg-sky-50 transition-colors shadow-lg whitespace-nowrap"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  View Cart
                </Link>
              </div>
            </div>
          </div>

          {hasError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {productsError ?? branchesError}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Check your connection and try again.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  refetchProducts();
                  refetchBranches();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Browse Categories</h2>
              <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1">
                {filteredProducts.length} products
              </span>
            </div>
            <div className="flex overflow-x-auto pb-3 gap-3 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex rounded-md items-center px-5 py-3.5 whitespace-nowrap transition-all shadow-sm ${
                      activeCategory === cat.id
                        ? 'bg-sky-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-semibold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === 'trending'
                ? '🔥 Trending Now'
                : activeCategory === 'crates'
                  ? '📦 Crates (24 Bottles)'
                  : activeCategory === 'specials'
                    ? '🎉 Special Offers'
                    : '🥤 All Drinks'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {isLoading && !hasError ? (
            <div className="flex flex-col items-center justify-center py-24">
              <RefreshCw className="h-12 w-12 text-sky-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
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
                We couldn&apos;t find any products matching your criteria. Try
                adjusting your filters or search.
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
                    branch: 'all',
                  });
                }}
                className="px-8 py-3 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Shop With Drinx Retailers?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Same Price Everywhere</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Enjoy consistent pricing across all branches. No surprises, just
                  great value wherever you shop.
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
                  Buy crates and save! Perfect for events, parties, or stocking up
                  your business.
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
                  Fast, secure payments via M-Pesa. Complete checkout in under 30
                  seconds.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
