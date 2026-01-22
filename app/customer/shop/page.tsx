'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Navigation from '@/components/customer/Navigation';
import MarqueeBanner from '@/components/customer/MarqueeBanner';
import FilterSidebar from '@/components/customer/FilterSidebar';
import ProductCard from '@/components/customer/ProductCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useBranches } from '@/hooks/useBranches';
import { useBranchInventory } from '@/hooks/useBranchInventory';
import { useCart } from '@/hooks/useCart';
import type { ProductDisplay } from '@/types/product';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  TrendingUp, 
  Flame, 
  ShoppingCart, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Package,
  Sparkles,
  SlidersHorizontal,
  X,
  Filter as FilterIcon,
  Star,
  ChevronRight,
  ChevronLeft,
  CupSoda,
  AlertCircle
} from 'lucide-react';


const categories = [
  { id: 'all', name: 'All Products', icon: Package, count: 20 },
  { id: 'trending', name: 'Trending Now', icon: TrendingUp, count: 8 },
  { id: 'coke', name: 'Coca-Cola', icon: Package, count: 7 },
  { id: 'fanta', name: 'Fanta', icon: Package, count: 7 },
  { id: 'sprite', name: 'Sprite', icon: Package, count: 5 },
  { id: 'crates', name: 'Crates (24pcs)', icon: Package, count: 3 },
  { id: 'diet', name: 'Diet & Zero', icon: Package, count: 3 },
  { id: 'specials', name: 'Special Editions', icon: Sparkles, count: 4 },
  { id: 'litre+', name: '1L+ Bottles', icon: Package, count: 6 }
];

// Dummy branches removed - using API data instead

const sortOptions = [
  { id: 'popular', name: 'Most Popular', icon: TrendingUp },
  { id: 'rating', name: 'Highest Rated', icon: Star },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'newest', name: 'Newest First' },
  { id: 'stock', name: 'In Stock First' }
];

export default function ShopPage() {
  // Auth and API hooks
  const { token } = useAuthContext();
  const { products: allProducts, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts(token);
  const { branches: apiBranches, isLoading: branchesLoading, error: branchesError, refetch: refetchBranches } = useBranches(token);
  const { addToCart } = useCart();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filters, setFilters] = useState({
    categories: ['Coke', 'Fanta', 'Sprite'],
    priceRange: { min: 0, max: 2000 },
    inStock: true,
    branch: 'all',
    minRating: 0,
    unit: 'all'
  });
  const [quickFilters, setQuickFilters] = useState({
    bestsellers: false,
    specialOffers: false,
    limitedStock: false,
    newArrivals: false
  });

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Build branches options from API data
  const branches = useMemo(
    () => [
      { id: 'all', name: 'All Branches', location: 'All Locations' },
      ...apiBranches.map((b) => ({
        id: b.id,
        name: b.isHeadquarter ? `${b.name} (HQ)` : b.name,
        location: b.name,
      })),
    ],
    [apiBranches]
  );

  const selectedBranchName = selectedBranch === 'all'
    ? undefined
    : apiBranches.find((b) => b.id === selectedBranch)?.name;

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on all active filters
  const filteredProducts = useMemo(() => {
    return sourceProducts.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'trending') {
        if (!product.tags?.includes('Bestseller') && product.rating < 4.5) return false;
      } else if (activeCategory === 'crates') {
        if (product.unit !== 'crate') return false;
      } else if (activeCategory === 'diet') {
        if (!product.tags?.some(tag => ['Sugar Free', 'Zero Calories'].includes(tag))) return false;
      } else if (activeCategory === 'specials') {
        if (!product.tags?.includes('Limited Edition') && !product.tags?.includes('Special Flavor')) return false;
      } else if (activeCategory === 'litre+') {
        if (!['1L', '2L'].includes(product.volume)) return false;
      } else if (product.brand.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // Brand filters from sidebar
    if (filters.categories.length > 0 && !filters.categories.includes(product.brand)) {
      return false;
    }

    // Stock filter
    if (filters.inStock && product.stock === 0) {
      return false;
    }

    // Unit filter
    if (filters.unit !== 'all') {
      if (filters.unit === 'crate' && product.unit !== 'crate') return false;
      if (filters.unit === 'single' && product.unit !== 'single') return false;
    }

    // Branch filter - only apply when using sidebar filter, not when branch is selected at top level
    // (top level branch selection is handled by useBranchInventory)
    if (selectedBranch === 'all' && filters.branch !== 'all') {
      const branchName = apiBranches.find(b => b.id === filters.branch)?.name;
      if (branchName && product.branches && product.branches.length > 0) {
        if (!product.branches.some(b => b.toLowerCase().includes(branchName.toLowerCase()))) {
          return false;
        }
      }
    }

    // Price range filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }

    // Rating filter
    if (product.rating < filters.minRating) {
      return false;
    }

    // Quick filters
    if (quickFilters.bestsellers && !product.tags?.includes('Bestseller')) return false;
    if (quickFilters.specialOffers && !product.originalPrice) return false;
    if (quickFilters.limitedStock && product.stock >= 30) return false;
    if (quickFilters.newArrivals && product.reviews < 100) return false;

    return true;
    });
  }, [sourceProducts, searchQuery, activeCategory, filters, quickFilters, apiBranches, selectedBranch]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'stock':
          return b.stock - a.stock;
        default: // popular
          return (b.rating * b.reviews) - (a.rating * a.reviews);
      }
    });
  }, [filteredProducts, sortBy]);

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = sourceProducts.find(p => p.id === productId);
    if (!product) {
      // TODO: Show user-friendly toast notification
      console.error('Product not found');
      return;
    }

    addToCart({
      productId,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity,
      volume: product.volume,
      unit: product.unit,
      branchId: selectedBranch !== 'all' ? selectedBranch : undefined,
      branchName: selectedBranch !== 'all' ? selectedBranchName : undefined,
    });
  };

  const currentBranch = branches.find(b => b.id === selectedBranch) || branches[0];

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedBranch('all');
    setSortBy('popular');
    setFilters({
      categories: ['Coke', 'Fanta', 'Sprite'],
      priceRange: { min: 0, max: 2000 },
      inStock: true,
      branch: 'all',
      minRating: 0,
      unit: 'all'
    });
    setQuickFilters({
      bestsellers: false,
      specialOffers: false,
      limitedStock: false,
      newArrivals: false
    });
  };

  const activeFilterCount = Object.values(quickFilters).filter(Boolean).length + 
    (filters.categories.length < 3 ? 1 : 0) + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.unit !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (selectedBranch !== 'all' ? 1 : 0);

  const hasError = productsError || branchesError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Marquee Banner at the very top */}
      <MarqueeBanner />
      
      {/* Navigation */}
      <Navigation />
      
      <div className="flex max-w-8xl mx-auto">
        {/* Filter Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-slate-200">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              onFilterChange={setFilters}
              branches={branches}
            />
          </div>
        </aside>

        {/* Mobile Filter Overlay */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsFilterOpen(false)}>
            <div className="absolute inset-y-0 left-0 w-80 max-w-full" onClick={(e) => e.stopPropagation()}>
              <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilterChange={setFilters}
                branches={branches}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 lg:px-8 py-6 lg:py-8">
          {/* Shop Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  Drinx Shop
                </h1>
                <p className="text-slate-600 text-lg">
                  Explore our extensive collection of drinks from all 5 branches
                </p>
              </div>
              
              {/* Branch Selector */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">Shopping Location</span>
                </div>
                <div className="relative">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full rounded-md px-4 py-3 bg-white text-slate-900 font-medium border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none"
                    disabled={branchesLoading}
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Products available at {currentBranch.name}
                </p>
              </div>
            </div>

            {/* Search and Controls Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search drinks, brands, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 rounded-md pr-4 py-3.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  <FilterIcon className="h-5 w-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* View Toggle and Sort */}
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex rounded-md items-center gap-2 px-4 py-3.5 bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                      <SlidersHorizontal className="h-5 w-5" />
                      <span>Sort: {sortOptions.find(o => o.id === sortBy)?.name}</span>
                      {showSortDropdown ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {showSortDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                        {sortOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.id}
                              onClick={() => {
                                setSortBy(option.id);
                                setShowSortDropdown(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                                sortBy === option.id ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                              }`}
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              <span>{option.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Clear Filters Button */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 border border-slate-300 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                        Search: &quot;{searchQuery}&quot;
                        <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedBranch !== 'all' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                        Branch: {currentBranch.name}
                        <button onClick={() => setSelectedBranch('all')} className="hover:text-green-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {Object.entries(quickFilters).map(([key, value]) => {
                      if (value) {
                        const label = key === 'bestsellers' ? 'Bestsellers' :
                                     key === 'specialOffers' ? 'Special Offers' :
                                     key === 'limitedStock' ? 'Limited Stock' : 'New Arrivals';
                        return (
                          <span key={key} className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
                            {label}
                            <button onClick={() => setQuickFilters({...quickFilters, [key]: false})} className="hover:text-purple-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Filters</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setQuickFilters({...quickFilters, bestsellers: !quickFilters.bestsellers})}
                className={`px-4 py-2.5 rounded-lg border transition-all ${
                  quickFilters.bestsellers
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Bestsellers
                </div>
              </button>
              <button
                onClick={() => setQuickFilters({...quickFilters, specialOffers: !quickFilters.specialOffers})}
                className={`px-4 py-2.5 rounded-lg border transition-all ${
                  quickFilters.specialOffers
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-orange-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Special Offers
                </div>
              </button>
              <button
                onClick={() => setQuickFilters({...quickFilters, limitedStock: !quickFilters.limitedStock})}
                className={`px-4 py-2.5 rounded-lg border transition-all ${
                  quickFilters.limitedStock
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-red-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Limited Stock
                </div>
              </button>
              <button
                onClick={() => setQuickFilters({...quickFilters, newArrivals: !quickFilters.newArrivals})}
                className={`px-4 py-2.5 rounded-lg border transition-all ${
                  quickFilters.newArrivals
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-green-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CupSoda className="h-4 w-4" />
                  New Arrivals
                </div>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Browse Categories</h3>
            <div className="relative">
              <button
                onClick={() => {
                  const container = document.getElementById('categories-scroll');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 border border-slate-200"
              >
                <ChevronLeft className="h-5 w-5 text-slate-700" />
              </button>
              <div id="categories-scroll" className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar px-12">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-5 py-3.5 whitespace-nowrap transition-all rounded-xl ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md border border-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        activeCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  const container = document.getElementById('categories-scroll');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 border border-slate-200"
              >
                <ChevronRight className="h-5 w-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Products Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {filteredProducts.length} Products
                {searchQuery && (
                  <span className="text-slate-600 font-normal ml-2">
                    matching &quot;{searchQuery}&quot;
                  </span>
                )}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Showing products from {currentBranch.name}
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm text-slate-600">
                View: {viewMode === 'grid' ? 'Grid' : 'List'}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">In Stock</span>
              </div>
            </div>
          </div>

          {/* Error State */}
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

          {/* Products Grid/List */}
          {isLoading && !hasError ? (
            <div className="flex flex-col items-center justify-center py-24">
              <RefreshCw className="h-12 w-12 text-sky-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            viewMode === 'grid' ? (
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
              <div className="space-y-4 mb-12">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-slate-200 hover:shadow-lg transition-shadow rounded-xl p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-40 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center p-4">
                        <div className="relative w-full h-full">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              {product.category}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mt-1">
                              {product.name}
                            </h3>
                            <p className="text-slate-600 mt-2">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <div className="text-2xl font-bold text-slate-900">
                              KSh {product.price.toFixed(2)}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-slate-500 line-through">
                                KSh {product.originalPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-600">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              product.stock > 20 ? 'bg-green-500' : 'bg-orange-500'
                            }`}></div>
                            <span className="text-sm text-slate-600">
                              {product.stock} in stock
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Available in {product.branches.length} branches
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {product.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-gradient-to-b from-white to-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No products found</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all rounded-xl"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors rounded-xl"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-8">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">1-{Math.min(20, sortedProducts.length)}</span> of{' '}
                <span className="font-semibold">{sortedProducts.length}</span> products
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg">
                  2
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg">
                  3
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Why Shop With Us */}
          <div className="mt-20 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Shop With Drinx Retailers?
              </h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Experience shopping like never before with our comprehensive collection and exceptional service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 border border-slate-200 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <ShoppingCart className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Wide Selection</h3>
                <p className="text-slate-600 leading-relaxed">
                  Choose from singles, litres, or crates across all popular brands. Something for every occasion.
                </p>
              </div>
              
              <div className="bg-white p-8 border border-slate-200 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Branch Flexibility</h3>
                <p className="text-slate-600 leading-relaxed">
                  Shop from any of our 5 branches. Same great products, same great prices everywhere.
                </p>
              </div>
              
              <div className="bg-white p-8 border border-slate-200 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bulk Savings</h3>
                <p className="text-slate-600 leading-relaxed">
                  Save big with crate purchases. Perfect for events, businesses, or stocking up your fridge.
                </p>
              </div>
              
              <div className="bg-white p-8 border border-slate-200 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Special Editions</h3>
                <p className="text-slate-600 leading-relaxed">
                  Discover limited edition flavors and exclusive products you won&apos;t find anywhere else.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}