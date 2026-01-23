/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/customer/Navigation';
import MarqueeBanner from '@/components/customer/MarqueeBanner';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBranches } from '@/hooks/useBranches';
import { useCart } from '@/hooks/useCart';
import * as orderService from '@/services/orderService';
import * as paymentService from '@/services/paymentService';
import { ROUTES } from '@/lib/constants';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Shield, 
  Truck, 
  Clock, 
  CreditCard, 
  Phone, 
  Lock, 
  CheckCircle,
  AlertCircle,
  MapPin,
  Package,
  Heart,
  Store,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  time: string;
  icon: any;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

export default function CartPage() {
  const { user, token } = useAuthContext();
  const { branches: apiBranches, isLoading: branchesLoading } = useBranches(token);
  const { cartItems, updateQuantity, removeItem, clearCart, getCartTotal } = useCart();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedDelivery, setSelectedDelivery] = useState('pickup');
  const [selectedPayment, setSelectedPayment] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone ?? '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  const branchOptions = apiBranches.map((b) => ({
    id: b.id,
    name: b.isHeadquarter ? `${b.name} (HQ)` : b.name,
    displayName: b.name,
  }));

  useEffect(() => {
    if (apiBranches.length > 0 && !selectedBranchId) {
      const defaultBranch = apiBranches.find((b) => b.isHeadquarter) ?? apiBranches[0];
      setSelectedBranchId(defaultBranch.id);
    }
  }, [apiBranches, selectedBranchId]);

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'pickup',
      name: 'Pickup at Store',
      description: 'Collect your order from the selected branch',
      price: 0,
      time: 'Ready in 15 mins',
      icon: Store
    },
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Delivery to your location within Nairobi',
      price: 200,
      time: '1-2 business days',
      icon: Truck
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Same-day delivery within Nairobi',
      price: 400,
      time: '3-5 hours',
      icon: Clock
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay securely via M-Pesa',
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, Mastercard, or Amex',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Maximum quantity constant
  const MAX_CART_QUANTITY = 50;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + deliveryFee + tax;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const moveToWishlist = (id: string) => {
    // In real app, this would move item to wishlist
    console.log('Moving item to wishlist:', id);
    removeItem(id);
  };

  const validateMpesaPhone = (phone: string) => {
    // Kenyan phone number validation: starts with 0 or +254, 9-10 digits
    const regex = /^(?:0|\+?254)(?:(7(?:(?:[01249][0-9])|(?:5[7-9])|(6[8-9]))[0-9]{6})|(11[0-1][0-9]{6}))$/;
    return regex.test(phone);
  };

  const formatPhoneForMpesa = (phone: string): string => {
    // Convert to 254XXXXXXXXX format
    if (phone.startsWith('+254')) {
      return phone.slice(1);
    }
    if (phone.startsWith('0')) {
      return '254' + phone.slice(1);
    }
    if (phone.startsWith('254')) {
      return phone;
    }
    return '254' + phone;
  };

  const handleManualRefresh = async () => {
    if (!orderId) return;
    
    setError(null);
    try {
      const status = await paymentService.getPaymentStatus(orderId, token);
      setPaymentStatus(status.status);
      if (status.transactionId) {
        setTransactionId(status.transactionId);
      }
      
      if (status.status === 'completed') {
        setTimeout(() => {
          setShowMpesaModal(false);
          setOrderPlaced(true);
          clearCart();
          setIsProcessing(false);
        }, 2000);
      } else if (status.status === 'failed') {
        setError('Payment failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Unable to check payment status. Please try again.');
      console.error('Manual refresh error:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateMpesaPhone(mpesaPhone)) {
      setError('Please enter a valid M-Pesa phone number');
      return;
    }

    if (!selectedBranchId) {
      setError('Please select a branch');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentStatus('pending');
    setTransactionId('');
    setPollAttempts(0);

    try {
      // Step 1: Create order
      const orderData = {
        branchId: selectedBranchId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productBrand: item.brand,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        totalAmount: total,
        phone: formatPhoneForMpesa(mpesaPhone),
      };

      const orderResponse = await orderService.createOrder(orderData, token);
      const createdOrderId = orderResponse.order.ID;
      setOrderId(createdOrderId);

      // Step 2: Initiate M-Pesa payment
      const paymentData = {
        orderId: createdOrderId,
        phone: formatPhoneForMpesa(mpesaPhone),
        amount: total,
      };

      const paymentResponse = await paymentService.initiateMpesaPayment(paymentData, token);
      setCheckoutRequestId(paymentResponse.checkoutRequestId);
      setShowMpesaModal(true);
      // Payment status will be polled by useEffect when orderId and showMpesaModal are set
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!orderId || !showMpesaModal) return;

    let pollInterval: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 60;

    const pollPaymentStatus = async () => {
      attempts++;
      setPollAttempts(attempts);
      try {
        const status = await paymentService.getPaymentStatus(orderId, token);
        setPaymentStatus(status.status);
        if (status.transactionId) {
          setTransactionId(status.transactionId);
        }

        if (status.status === 'completed') {
          if (pollInterval) clearInterval(pollInterval);
          setTimeout(() => {
            setShowMpesaModal(false);
            setOrderPlaced(true);
            clearCart();
            setIsProcessing(false);
          }, 2000);
        } else if (status.status === 'failed') {
          if (pollInterval) clearInterval(pollInterval);
          setError('Payment failed. Please try again.');
          setIsProcessing(false);
        } else if (attempts >= maxAttempts) {
          if (pollInterval) clearInterval(pollInterval);
          setError('Payment verification timeout. Please check your M-Pesa message or contact support if you completed the payment.');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Payment status check error:', err);
        if (attempts >= maxAttempts) {
          if (pollInterval) clearInterval(pollInterval);
          setError('Unable to verify payment status. Please check your orders or contact support.');
          setIsProcessing(false);
        }
      }
    };

    // Start polling immediately, then every 3 seconds
    pollPaymentStatus();
    pollInterval = setInterval(pollPaymentStatus, 3000);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [orderId, showMpesaModal, token]);

  const continueShopping = () => {
    window.location.href = '/customer/shop';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Marquee Banner */}
      <MarqueeBanner />
      
      {/* Navigation */}
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Your Shopping Cart
              </h1>
              <p className="text-slate-600">
                Review your items and proceed to checkout
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/customer/shop"
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Continue Shopping</span>
              </Link>
              
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="font-medium">Clear Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            {orderPlaced ? (
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Order Placed Successfully!
                </h2>
                <p className="text-slate-600 mb-2">
                  Your order has been confirmed and payment received.
                </p>
                <p className="text-slate-600 mb-6">
                  Order ID: <span className="font-semibold text-slate-900">{orderId}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={ROUTES.CUSTOMER_ORDERS}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all rounded-lg text-center"
                  >
                    View Order Details
                  </Link>
                  <button
                    onClick={continueShopping}
                    className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors rounded-lg"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 mb-8">
                  Looks like you haven&apos;t added any items to your cart yet.
                </p>
                <Link
                  href="/customer/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg transition-all rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Branch Selection */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Collection/Delivery Location</h3>
                </div>
                <div className="space-y-4">
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    disabled={branchesLoading}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:opacity-50"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-600">
                    {selectedBranchId
                      ? `All items in your cart are available at ${branchOptions.find((b) => b.id === selectedBranchId)?.displayName ?? 'selected branch'}`
                      : 'Select a branch'}
                  </p>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Cart Items ({cartItems.length})
                  </h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    const Icon = {
                      'Coke': 'text-red-500 bg-red-50',
                      'Fanta': 'text-orange-500 bg-orange-50',
                      'Sprite': 'text-green-500 bg-green-50'
                    }[item.brand];

                    return (
                      <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center p-2">
                            <div className="relative w-full h-full">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain"
                                sizes="96px"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${Icon}`}>
                                    {item.brand}
                                  </span>
                                  <span className="text-xs text-slate-500">{item.unit}</span>
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-slate-500 mb-2">
                                  {item.volume} • {item.branchName ? `Available at ${item.branchName}` : 'Available at all branches'}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-slate-900">
                                  {formatCurrency(item.price)}
                                </div>
                                {item.originalPrice && (
                                  <div className="text-sm text-slate-500 line-through">
                                    {formatCurrency(item.originalPrice)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center border border-slate-300 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-12 text-center font-medium text-slate-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= MAX_CART_QUANTITY}
                                    className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="text-sm text-slate-500">
                                  <span className="font-medium text-slate-900">
                                    {formatCurrency(itemTotal)}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-green-600 ml-2">
                                      Save {formatCurrency((item.originalPrice - item.price) * item.quantity)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => moveToWishlist(item.id)}
                                  className="flex items-center gap-1 text-slate-600 hover:text-pink-600 transition-colors"
                                >
                                  <Heart className="h-4 w-4" />
                                  <span className="text-sm font-medium">Save for later</span>
                                </button>
                                
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="text-sm font-medium">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Delivery Options</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {deliveryOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedDelivery === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedDelivery(option.id)}
                        className={`p-4 border rounded-xl text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{option.name}</h4>
                              <p className="text-sm text-slate-500 mt-1">{option.time}</p>
                            </div>
                          </div>
                          
                          <div className="text-lg font-bold text-slate-900">
                            {option.price === 0 ? 'FREE' : formatCurrency(option.price)}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Discount</span>
                          <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Delivery</span>
                        <span className="font-medium text-slate-900">
                          {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax (16% VAT)</span>
                        <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-slate-900">Total</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">
                              {formatCurrency(total)}
                            </div>
                            <p className="text-sm text-slate-500">Inclusive of all taxes</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-4">Payment Method</h4>
                      
                      <div className="space-y-3 mb-6">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon;
                          const isSelected = selectedPayment === method.id;
                          
                          return (
                            <button
                              key={method.id}
                              onClick={() => setSelectedPayment(method.id)}
                              className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${method.bgColor} ${method.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-slate-900">{method.name}</div>
                                <div className="text-sm text-slate-500">{method.description}</div>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* M-Pesa Phone Input */}
                      {selectedPayment === 'mpesa' && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <label className="block text-sm font-semibold text-slate-900 mb-3">
                            M-Pesa Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <input
                              type="tel"
                              value={mpesaPhone}
                              onChange={(e) => setMpesaPhone(e.target.value)}
                              placeholder="07XX XXX XXX"
                              className="block w-full pl-10 pr-4 py-3 bg-white border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-slate-900 font-medium placeholder-slate-500"
                            />
                          </div>
                          {mpesaPhone && !validateMpesaPhone(mpesaPhone) && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              Please enter a valid Kenyan phone number
                            </p>
                          )}
                        </div>
                      )}

                      {/* Security Badges */}
                      <div className="flex items-center justify-center gap-6 py-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Shield className="h-5 w-5" />
                          <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Lock className="h-5 w-5" />
                          <span className="text-sm font-medium">SSL Encrypted</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || cartItems.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Complete Order • {formatCurrency(total)}
                        </>
                      )}
                    </button>

                    {/* Additional Info */}
                    <div className="text-center pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-500">
                        By placing your order, you agree to our{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                          Terms & Conditions
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Need Help */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Need Help?</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Our customer support team is available 24/7 to assist you with your order.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">0700 000 000</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">24/7 Support Available</span>
                    </div>
                  </div>
                </div>

                {/* Return Policy */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Return Policy</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>30-day money-back guarantee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Free returns on unopened items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Easy exchange at any branch</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* M-Pesa Payment Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Complete Payment via M-Pesa
              </h3>
              <p className="text-slate-600">
                Check your phone for an M-Pesa prompt
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Order Total</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Phone Number</span>
                  <span className="font-semibold text-slate-900">{mpesaPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Order ID</span>
                  <span className="font-semibold text-slate-900 text-xs">{orderId}</span>
                </div>
                {transactionId && (
                  <div className="flex justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-600">Transaction ID</span>
                    <span className="font-semibold text-green-600 text-xs">{transactionId}</span>
                  </div>
                )}
              </div>

              {paymentStatus === 'pending' && (
                <>
                  <div className="flex items-center justify-center gap-3 py-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <p className="text-center text-sm text-slate-500">
                    Enter your M-Pesa PIN on your phone to complete the payment
                  </p>
                  <p className="text-center text-xs text-slate-400">
                    Checking status... (Attempt {pollAttempts} of 60)
                  </p>
                </>
              )}

              {paymentStatus === 'completed' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
                  <p className="text-sm text-slate-500 mt-2">Your order has been confirmed</p>
                  {transactionId && (
                    <p className="text-xs text-slate-400 mt-2">
                      Transaction: {transactionId}
                    </p>
                  )}
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-lg font-semibold text-red-600">Payment Failed</p>
                  <p className="text-sm text-slate-500 mt-2">{error || 'Please try again or contact support'}</p>
                  <p className="text-xs text-slate-400 mt-2">Order ID: {orderId}</p>
                </div>
              )}
            </div>

            {paymentStatus === 'pending' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>
                    Don&apos;t see the prompt? Check your phone&apos;s messages or dial *234# to approve the payment
                  </p>
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="w-full py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Payment Status
                </button>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <button
                onClick={() => {
                  setShowMpesaModal(false);
                  setOrderPlaced(true);
                  clearCart();
                }}
                className="w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            )}

            {paymentStatus === 'failed' && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowMpesaModal(false);
                    setPaymentStatus('pending');
                  }}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}