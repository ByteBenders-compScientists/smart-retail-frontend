'use client';

import { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import ReportTable from '@/components/admin/ReportTable';
import SalesChart from '@/components/admin/SalesChart';
import { useAuthContext } from '@/contexts/AuthContext';
import { getSalesReport, getBranchReport } from '@/services/reportService';
import type { SalesReportResponse, BranchReportResponse } from '@/types/report';

export default function ReportsPage() {
  const { token } = useAuthContext();
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  
  // API Data state
  const [salesData, setSalesData] = useState<SalesReportResponse | null>(null);
  const [branchReportData, setBranchReportData] = useState<BranchReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on selection
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case '7days':
        start.setDate(end.getDate() - 7);
        break;
      case '30days':
        start.setDate(end.getDate() - 30);
        break;
      case '90days':
        start.setDate(end.getDate() - 90);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            startDate: customStartDate,
            endDate: customEndDate,
          };
        }
        return null;
      default:
        start.setDate(end.getDate() - 30);
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  };

  // Fetch sales report
  const fetchSalesReport = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dates = getDateRange();
      if (!dates && dateRange === 'custom') {
        setError('Please select both start and end dates');
        setIsLoading(false);
        return;
      }
      
      const filters = dates ? {
        startDate: dates.startDate,
        endDate: dates.endDate,
        ...(selectedBranchId && { branchId: selectedBranchId }),
      } : undefined;
      
      const data = await getSalesReport(filters, token);
      setSalesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sales report');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch branch report
  const fetchBranchReport = async (branchId: string) => {
    if (!branchId) return;
    
    try {
      const dates = getDateRange();
      const filters = dates ? {
        startDate: dates.startDate,
        endDate: dates.endDate,
      } : undefined;
      
      const data = await getBranchReport(branchId, filters, token);
      setBranchReportData(data);
    } catch (err) {
      console.error('Failed to load branch report:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchSalesReport();
  }, []);

  // Fetch branch report when selected branch changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchBranchReport(selectedBranchId);
    }
  }, [selectedBranchId]);

  // Apply filters handler
  const handleApplyFilters = () => {
    fetchSalesReport();
    if (selectedBranchId) {
      fetchBranchReport(selectedBranchId);
    }
  };

  // Transform API data to display format for tables
  const getSalesByBranchData = () => {
    if (!salesData?.salesByBranch) return [];
    
    return Object.entries(salesData.salesByBranch).map(([branchName, data], idx) => ({
      id: String(idx + 1),
      branch: branchName,
      orders: 0, // API doesn't provide orders count in salesByBranch
      revenue: data.revenue || 0,
      avgOrder: 0,
    }));
  };

  const getSalesByBrandData = () => {
    if (!salesData?.salesByBrand) return [];
    
    const total = Object.values(salesData.salesByBrand).reduce(
      (sum, brand) => sum + (brand.revenue || 0),
      0
    );
    
    return Object.entries(salesData.salesByBrand).map(([brandName, data], idx) => ({
      id: String(idx + 1),
      product: brandName,
      unitsSold: data.units || 0,
      revenue: data.revenue || 0,
      percentage: total > 0 ? ((data.revenue || 0) / total) * 100 : 0,
    }));
  };

  const salesByBranchReport = getSalesByBranchData();
  const salesByProductReport = getSalesByBrandData();

  const totalRevenue = salesData?.grandTotal || 0;
  const totalOrders = branchReportData?.branchSales.totalOrders || 0;

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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full placeholder:text-gray-500 text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Filters */}
            {dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full placeholder:text-gray-500 text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="branch">By Branch</option>
                <option value="product">By Product</option>
              </select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button 
                onClick={handleApplyFilters}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Filter className="h-4 w-4" />
                <span>{isLoading ? 'Loading...' : 'Apply Filters'}</span>
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