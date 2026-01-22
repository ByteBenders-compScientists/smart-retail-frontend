'use client';

import { useState } from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp, Users, Zap, BarChart3 } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import SalesChart from '@/components/admin/SalesChart';
import BranchStats from '@/components/admin/BranchStats';

export default function AdminDashboard() {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mock data - replace with actual API calls
  const stats = {
    totalRevenue: 245000,
    totalOrders: 1247,
    totalProducts: 6,
    activeCustomers: 856,
  };

  const branchData = [
    {
      id: 'nairobi',
      name: 'Nairobi HQ',
      totalSales: 85000,
      totalOrders: 420,
      topProduct: 'Coca-Cola',
      stockLevel: 'high' as const,
    },
    {
      id: 'kisumu',
      name: 'Kisumu',
      totalSales: 52000,
      totalOrders: 267,
      topProduct: 'Sprite',
      stockLevel: 'medium' as const,
    },
    {
      id: 'mombasa',
      name: 'Mombasa',
      totalSales: 48000,
      totalOrders: 245,
      topProduct: 'Fanta',
      stockLevel: 'low' as const,
    },
    {
      id: 'nakuru',
      name: 'Nakuru',
      totalSales: 35000,
      totalOrders: 178,
      topProduct: 'Pepsi',
      stockLevel: 'high' as const,
    },
    {
      id: 'eldoret',
      name: 'Eldoret',
      totalSales: 25000,
      totalOrders: 137,
      topProduct: 'Mountain Dew',
      stockLevel: 'medium' as const,
    },
  ];

  const salesByBranchData = {
    labels: ['Nairobi', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret'],
    datasets: [
      {
        label: 'Revenue (KSh)',
        data: [85000, 52000, 48000, 35000, 25000],
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
      },
    ],
  };

  const salesByProductData = {
    labels: ['Coca-Cola', 'Fanta', 'Sprite', 'Pepsi', 'Mountain Dew', 'Mirinda'],
    datasets: [
      {
        label: 'Units Sold',
        data: [450, 320, 280, 210, 190, 150],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(163, 230, 53, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  };

  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (KSh)',
        data: [180000, 195000, 210000, 225000, 235000, 245000],
        borderColor: 'rgb(15, 23, 42)',
        backgroundColor: 'rgba(15, 23, 42, 0.1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card with Background Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/drinks2.jpg)' }}
          />
          
          {/* Slate Overlay */}
          <div className="absolute inset-0 bg-slate-900/90" />

          {/* Content */}
          <div className="relative px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, Administrator! 👋
                </h1>
                <p className="text-gray-300 text-lg">
                  {currentDate} • {currentTime}
                </p>
                <p className="text-gray-400 mt-2">
                  Here&apos;s what&apos;s happening with your stores today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-300">Active Now</p>
                      <p className="text-2xl font-bold text-white">24</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-300">Online Users</p>
                      <p className="text-2xl font-bold text-white">142</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={`KSh ${stats.totalRevenue.toLocaleString()}`}
            subtitle="Last 30 days"
            icon={DollarSign}
            color="blue"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            subtitle="All branches"
            icon={ShoppingCart}
            color="green"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Products"
            value={stats.totalProducts}
            subtitle="Active items"
            icon={Package}
            color="orange"
          />
          <StatsCard
            title="Active Customers"
            value={stats.activeCustomers}
            subtitle="This month"
            icon={TrendingUp}
            color="red"
            trend={{ value: 15.3, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all text-left group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Restock Inventory</h3>
                <p className="text-sm text-gray-600">Manage stock across all branches</p>
              </div>
              <Package className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>

          <button className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all text-left group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
                <p className="text-sm text-gray-600">Comprehensive sales analytics</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
          </button>

          <button className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all text-left group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
                <p className="text-sm text-gray-600">Customer & staff accounts</p>
              </div>
              <Users className="h-8 w-8 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
          </button>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesChart
            type="bar"
            title="Revenue by Branch"
            data={salesByBranchData}
          />
          <SalesChart
            type="doughnut"
            title="Products Performance"
            data={salesByProductData}
          />
        </div>

        {/* Monthly Trend */}
        <div className="mb-8">
          <SalesChart
            type="line"
            title="Monthly Revenue Trend"
            data={monthlyTrendData}
          />
        </div>

        {/* Branch Stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Branch Performance
          </h2>
          <BranchStats branches={branchData} />
        </div>
      </div>
    </div>
  );
}