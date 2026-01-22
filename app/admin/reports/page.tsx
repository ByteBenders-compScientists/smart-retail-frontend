'use client';

import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import ReportTable from '@/components/admin/ReportTable';
import SalesChart from '@/components/admin/SalesChart';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('all');

  // Mock data - replace with actual API calls
  const salesByBranchReport = [
    {
      id: '1',
      branch: 'Nairobi HQ',
      orders: 420,
      revenue: 85000,
      avgOrder: 202,
    },
    {
      id: '2',
      branch: 'Kisumu',
      orders: 267,
      revenue: 52000,
      avgOrder: 195,
    },
    {
      id: '3',
      branch: 'Mombasa',
      orders: 245,
      revenue: 48000,
      avgOrder: 196,
    },
    {
      id: '4',
      branch: 'Nakuru',
      orders: 178,
      revenue: 35000,
      avgOrder: 197,
    },
    {
      id: '5',
      branch: 'Eldoret',
      orders: 137,
      revenue: 25000,
      avgOrder: 182,
    },
  ];

  const salesByProductReport = [
    {
      id: '1',
      product: 'Coca-Cola',
      unitsSold: 450,
      revenue: 27000,
      percentage: 24.3,
    },
    {
      id: '2',
      product: 'Fanta Orange',
      unitsSold: 320,
      revenue: 19200,
      percentage: 17.2,
    },
    {
      id: '3',
      product: 'Sprite',
      unitsSold: 280,
      revenue: 16800,
      percentage: 15.1,
    },
    {
      id: '4',
      product: 'Pepsi',
      unitsSold: 210,
      revenue: 12600,
      percentage: 11.3,
    },
    {
      id: '5',
      product: 'Mountain Dew',
      unitsSold: 190,
      revenue: 11400,
      percentage: 10.2,
    },
    {
      id: '6',
      product: 'Mirinda',
      unitsSold: 150,
      revenue: 9000,
      percentage: 8.1,
    },
  ];

  const formatCurrency = (value: number) => `KSh ${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const branchColumns = [
    { key: 'branch', label: 'Branch' },
    { key: 'orders', label: 'Total Orders' },
    { key: 'revenue', label: 'Revenue', format: formatCurrency },
    { key: 'avgOrder', label: 'Avg Order', format: formatCurrency },
  ];

  const productColumns = [
    { key: 'product', label: 'Product' },
    { key: 'unitsSold', label: 'Units Sold' },
    { key: 'revenue', label: 'Revenue', format: formatCurrency },
    { key: 'percentage', label: 'Share', format: formatPercentage },
  ];

  const totalRevenue = salesByBranchReport.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesByBranchReport.reduce((sum, item) => sum + item.orders, 0);

  const handleExport = () => {
    console.log('Exporting report...');
    // Implement export functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive sales analytics across all branches
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="branch">By Branch</option>
                <option value="product">By Product</option>
              </select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-green-600">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Average Order</p>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(Math.round(totalRevenue / totalOrders))}
            </p>
          </div>
        </div>

        {/* Sales by Branch Table */}
        {(reportType === 'all' || reportType === 'branch') && (
          <div className="mb-8">
            <ReportTable
              title="Sales by Branch"
              columns={branchColumns}
              data={salesByBranchReport}
              onExport={handleExport}
            />
          </div>
        )}

        {/* Sales by Product Table */}
        {(reportType === 'all' || reportType === 'product') && (
          <div className="mb-8">
            <ReportTable
              title="Sales by Product"
              columns={productColumns}
              data={salesByProductReport}
              onExport={handleExport}
            />
          </div>
        )}
      </div>
    </div>
  );
}