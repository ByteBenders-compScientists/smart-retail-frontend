/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Filter, X, Sliders, Check, Star, TrendingUp } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ isOpen, onClose, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    categories: ['Coke', 'Fanta', 'Sprite'],
    priceRange: { min: 0, max: 100 },
    sortBy: 'popular',
    inStock: true,
    branch: 'all'
  });

  const categories = [
    { id: 'coke', name: 'Coke', color: 'bg-red-500' },
    { id: 'fanta', name: 'Fanta', color: 'bg-orange-500' },
    { id: 'sprite', name: 'Sprite', color: 'bg-green-500' }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: TrendingUp },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated', icon: Star },
    { id: 'newest', name: 'Newest First' }
  ];

  const branches = [
    { id: 'all', name: 'All Branches' },
    { id: 'nairobi', name: 'Nairobi HQ' },
    { id: 'kisumu', name: 'Kisumu Branch' },
    { id: 'mombasa', name: 'Mombasa Branch' },
    { id: 'nakuru', name: 'Nakuru Branch' },
    { id: 'eldoret', name: 'Eldoret Branch' }
  ];

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      const newFilters = { ...prev, categories: newCategories };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSortChange = (sortId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, sortBy: sortId };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleBranchChange = (branchId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, branch: branchId };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleStockToggle = () => {
    setFilters(prev => {
      const newFilters = { ...prev, inStock: !prev.inStock };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const defaultFilters = {
      categories: ['Coke', 'Fanta', 'Sprite'],
      priceRange: { min: 0, max: 100 },
      sortBy: 'popular',
      inStock: true,
      branch: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-full lg:h-auto 
        bg-white border-r border-gray-200 z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Sort By */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <Sliders className="h-4 w-4 mr-2" />
                Sort By
              </h3>
              <div className="space-y-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        filters.sortBy === option.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        {Icon && <Icon className="h-4 w-4 mr-3" />}
                        <span>{option.name}</span>
                      </div>
                      {filters.sortBy === option.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      filters.categories.includes(category.name)
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${category.color} mr-3`} />
                      <span>{category.name}</span>
                    </div>
                    {filters.categories.includes(category.name) && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Branch Availability */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Branch</h3>
              <div className="space-y-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchChange(branch.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filters.branch === branch.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Availability</h3>
              <button
                onClick={handleStockToggle}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  filters.inStock
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <span>In Stock Only</span>
                <div className={`h-6 w-11 rounded-full p-1 transition-all ${
                  filters.inStock ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`h-4 w-4 rounded-full bg-white transform transition-transform ${
                    filters.inStock ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          {/* Active Filters Badges */}
          <div className="p-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-700"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="ml-2 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.inStock && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-700">
                  In Stock
                  <button
                    onClick={handleStockToggle}
                    className="ml-2 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.branch !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-700">
                  {branches.find(b => b.id === filters.branch)?.name}
                  <button
                    onClick={() => handleBranchChange('all')}
                    className="ml-2 hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}