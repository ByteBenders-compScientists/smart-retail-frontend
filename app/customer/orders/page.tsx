/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/customer/Navigation';
import MarqueeBanner from '@/components/customer/MarqueeBanner';
import { useAuthContext } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useBranches } from '@/hooks/useBranches';
import type { OrderDisplay } from '@/types/order';
import { ROUTES } from '@/lib/constants';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MapPin, 
  CreditCard, 
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  Repeat,
  ArrowUpRight,
  ShoppingBag,
  BarChart3,
  Phone,
  AlertCircle
} from 'lucide-react';

type UIOrderStatus = 'delivered' | 'processing' | 'shipped' | 'cancelled' | 'pending';

function mapOrderStatus(apiStatus: OrderDisplay['orderStatus']): UIOrderStatus {
  switch (apiStatus) {
    case 'completed':
      return 'delivered';
    case 'processing':
      return 'processing';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  volume: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: UIOrderStatus;
  branch: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  rating?: number;
  review?: string;
}

function mapOrderDisplayToUI(order: OrderDisplay): Order {
  return {
    id: order.id,
    orderNumber: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
    date: order.createdAt.split('T')[0],
    status: mapOrderStatus(order.orderStatus),
    branch: order.branchName,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.productName,
      brand: item.productBrand,
      price: item.price,
      quantity: item.quantity,
      image: item.image ?? '/images/placeholder.png',
      volume: item.volume ?? '',
    })),
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod === 'mpesa' ? 'M-Pesa' : order.paymentMethod,
    deliveredDate: order.completedAt?.split('T')[0],
  };
}

export default function OrdersPage() {
  const { token } = useAuthContext();
  const { orders: apiOrders, isLoading, error, refetch } = useOrders(token);
  const { branches: apiBranches } = useBranches(token);

  const orders = useMemo(() => apiOrders.map(mapOrderDisplayToUI), [apiOrders]);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { id: 'all', name: 'All Orders', icon: Package, count: orders.length },
    { id: 'delivered', name: 'Delivered', icon: CheckCircle, count: orders.filter(o => o.status === 'delivered').length },
    { id: 'processing', name: 'Processing', icon: RefreshCw, count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', name: 'Shipped', icon: Truck, count: orders.filter(o => o.status === 'shipped').length },
    { id: 'pending', name: 'Pending', icon: Clock, count: orders.filter(o => o.status === 'pending').length },
    { id: 'cancelled', name: 'Cancelled', icon: XCircle, count: orders.filter(o => o.status === 'cancelled').length }
  ];

  // Build branch options from API data
  const branchOptions = useMemo(
    () => [
      { id: 'all', name: 'All Branches' },
      ...apiBranches.map((b) => ({
        id: b.id,
        name: b.isHeadquarter ? `${b.name} (HQ)` : b.name,
      })),
    ],
    [apiBranches]
  );

  const dateOptions = [
    { id: 'all', name: 'All Time' },
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'Last 3 Months' },
    { id: 'year', name: 'This Year' }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'processing': return RefreshCw;
      case 'shipped': return Truck;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Update filtered orders when orders change
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  // Filter orders
  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.branch.toLowerCase().includes(query) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query)
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Branch filter
    if (branchFilter !== 'all') {
      const selectedBranch = apiBranches.find(b => b.id === branchFilter);
      if (selectedBranch) {
        result = result.filter(order => order.branch.includes(selectedBranch.name));
      }
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return orderDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return orderDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, branchFilter, dateFilter, orders, apiBranches]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const reorderItems = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // In a real app, this would add items to cart
      console.log('Reordering items from order:', orderId);
      alert(`Adding ${order.items.length} items from order ${order.orderNumber} to your cart`);
    }
  };

  const downloadInvoice = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // In a real app, this would generate/download invoice
      console.log('Downloading invoice for order:', orderId);
      alert(`Downloading invoice for order ${order.orderNumber}`);
    }
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const avgOrderValue = totalSpent / totalOrders;
    
    return { totalOrders, totalSpent, deliveredOrders, avgOrderValue };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Marquee Banner */}
      <MarqueeBanner />
      
      {/* Navigation */}
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
                <p className="text-xs text-red-600 mt-1">Check your connection and try again.</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Order History
              </h1>
              <p className="text-slate-600">
                Track, manage, and review all your orders
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={ROUTES.CUSTOMER_SHOP}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all rounded-lg"
              >
                <ShoppingBag className="h-5 w-5" />
                Continue Shopping
              </Link>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors rounded-lg"
              >
                <Filter className="h-5 w-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.totalOrders}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Orders</h3>
            <p className="text-xs text-slate-500 mt-1">All time purchases</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.totalSpent)}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Spent</h3>
            <p className="text-xs text-slate-500 mt-1">Lifetime value</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.deliveredOrders}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Delivered</h3>
            <p className="text-xs text-slate-500 mt-1">Successful deliveries</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.avgOrderValue)}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Average Order</h3>
            <p className="text-xs text-slate-500 mt-1">Per order value</p>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Filter Orders</h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setBranchFilter('all');
                  setDateFilter('all');
                }}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Order number, product, branch..."
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {statusOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name} ({option.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Branch
                </label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {branchOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {dateOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Status Quick Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Status Filter</h3>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isActive = statusFilter === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setStatusFilter(option.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{option.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Orders Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {filteredOrders.length} Orders Found
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {statusFilter !== 'all' && `Showing ${statusFilter} orders`}
                  {branchFilter !== 'all' && ` from ${branchOptions.find(b => b.id === branchFilter)?.name}`}
                  {dateFilter !== 'all' && ` in the ${dateOptions.find(d => d.id === dateFilter)?.name?.toLowerCase()}`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={selectAllOrders}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Select All</span>
                </div>
                
                {selectedOrders.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                    <span className="text-sm font-medium">{selectedOrders.length} selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const isExpanded = expandedOrder === order.id;
                const isSelected = selectedOrders.includes(order.id);
                
                return (
                  <div key={order.id} className="transition-colors hover:bg-slate-50">
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOrderSelection(order.id)}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h4 className="font-semibold text-slate-900">
                                {order.orderNumber}
                              </h4>
                              
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                <StatusIcon className="h-3 w-3" />
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              
                              {order.rating && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < order.rating! ? 'fill-yellow-400' : ''}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(order.date)} • {getDaysAgo(order.date)}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{order.branch}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <CreditCard className="h-4 w-4" />
                                <span>{order.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-900">
                              {formatCurrency(order.totalAmount)}
                            </div>
                            <div className="text-sm text-slate-500">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          {/* Order Items */}
                          <div className="mb-6">
                            <h5 className="text-sm font-semibold text-slate-900 mb-4">Order Items</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h6 className="font-medium text-slate-900 truncate">{item.name}</h6>
                                    <p className="text-sm text-slate-500">{item.volume}</p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-sm font-medium text-slate-900">
                                        {formatCurrency(item.price)} × {item.quantity}
                                      </span>
                                      <span className="font-semibold text-slate-900">
                                        {formatCurrency(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Order Timeline */}
                          <div className="mb-6">
                            <h5 className="text-sm font-semibold text-slate-900 mb-4">Order Timeline</h5>
                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                              <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Package className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h6 className="font-medium text-slate-900">Order Placed</h6>
                                    <p className="text-sm text-slate-500">{formatDate(order.date)}</p>
                                  </div>
                                </div>
                                
                                {order.status !== 'cancelled' && order.status !== 'pending' && (
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <RefreshCw className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-slate-900">Order Confirmed</h6>
                                      <p className="text-sm text-slate-500">
                                        {formatDate(new Date(new Date(order.date).getTime() + 3600000).toISOString().split('T')[0])}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                
                                {order.status === 'shipped' || order.status === 'delivered' ? (
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                      <Truck className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-slate-900">Order Shipped</h6>
                                      <p className="text-sm text-slate-500">
                                        {order.estimatedDelivery && `Estimated delivery: ${formatDate(order.estimatedDelivery)}`}
                                      </p>
                                      {order.trackingNumber && (
                                        <p className="text-sm text-slate-500">
                                          Tracking: <span className="font-medium">{order.trackingNumber}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ) : null}
                                
                                {order.status === 'delivered' && order.deliveredDate && (
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-slate-900">Order Delivered</h6>
                                      <p className="text-sm text-slate-500">
                                        Delivered on {formatDate(order.deliveredDate)}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                
                                {order.status === 'cancelled' && (
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-slate-900">Order Cancelled</h6>
                                      <p className="text-sm text-slate-500">
                                        Order was cancelled
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Order Actions */}
                          <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                            {order.status === 'delivered' && !order.review && (
                              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg">
                                <Star className="h-4 w-4" />
                                Leave Review
                              </button>
                            )}
                            
                            {order.status !== 'cancelled' && (
                              <button
                                onClick={() => reorderItems(order.id)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors rounded-lg"
                              >
                                <Repeat className="h-4 w-4" />
                                Reorder Items
                              </button>
                            )}
                            
                            <button
                              onClick={() => downloadInvoice(order.id)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors rounded-lg"
                            >
                              <Download className="h-4 w-4" />
                              Download Invoice
                            </button>
                            
                            {order.status === 'delivered' && order.rating && order.review && (
                              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors rounded-lg">
                                <MessageSquare className="h-4 w-4" />
                                View Review
                              </button>
                            )}
                            
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors rounded-lg">
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            
                            {order.status === 'pending' || order.status === 'processing' ? (
                              <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors rounded-lg">
                                <XCircle className="h-4 w-4" />
                                Cancel Order
                              </button>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No orders found
                </h3>
                <p className="text-slate-600 mb-8">
                  {searchQuery || statusFilter !== 'all' || branchFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your filters to see more results'
                    : 'You haven\'t placed any orders yet'}
                </p>
                <Link
                  href={ROUTES.CUSTOMER_SHOP}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all rounded-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="p-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold">1-{filteredOrders.length}</span> of{' '}
                  <span className="font-semibold">{filteredOrders.length}</span> orders
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
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Fastest Delivery</h4>
                  <p className="text-sm text-slate-500">Your record: 45 minutes</p>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Order: ORD-20240108-006 • Eldoret Branch
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Most Ordered</h4>
                  <p className="text-sm text-slate-500">Coca-Cola Original 500ml</p>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                12 orders • 48 bottles total
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Favorite Branch</h4>
                  <p className="text-sm text-slate-500">Nairobi HQ</p>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                8 orders • 72% of your purchases
              </div>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Need Help With Your Orders?</h3>
              <p className="text-slate-600 mb-4">
                Our support team is here to help with order tracking, returns, refunds, or any questions.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-900">0700 000 000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-600">Available 24/7</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors rounded-lg whitespace-nowrap">
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}