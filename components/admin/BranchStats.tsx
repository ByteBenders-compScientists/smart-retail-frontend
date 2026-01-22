'use client';

import { MapPin, TrendingUp, Package } from 'lucide-react';

interface BranchData {
  id: string;
  name: string;
  totalSales: number;
  totalOrders: number;
  topProduct: string;
  stockLevel: 'high' | 'medium' | 'low';
}

interface BranchStatsProps {
  branches: BranchData[];
}

export default function BranchStats({ branches }: BranchStatsProps) {
  const getStockColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          {/* Branch Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getStockColor(
                branch.stockLevel
              )}`}
            >
              {branch.stockLevel.toUpperCase()}
            </span>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Sales</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(branch.totalSales)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-lg font-semibold text-gray-900">
                {branch.totalOrders}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Top Product</span>
              <span className="text-sm font-semibold text-blue-600">
                {branch.topProduct}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">View Details</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}