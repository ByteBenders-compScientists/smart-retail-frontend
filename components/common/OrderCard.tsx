'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Calendar, CreditCard, Package } from 'lucide-react';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  emoji: string;
}

interface Order {
  id: string;
  branchName: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  mpesaTransactionId?: string;
}

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Order Header */}
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{order.branchName}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(order.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className={getPaymentStatusColor(order.paymentStatus)}>
                Payment: {order.paymentStatus}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>{order.items.length} item(s)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold text-blue-600">
              KSh {order.totalAmount}
            </p>
          </div>

          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Order Details (Expanded) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
          
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      KSh {item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-gray-900">
                  KSh {item.subtotal}
                </p>
              </div>
            ))}
          </div>

          {/* Transaction Details */}
          {order.mpesaTransactionId && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">M-Pesa Transaction ID:</span>{' '}
                {order.mpesaTransactionId}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
