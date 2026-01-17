'use client';

import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  emoji: string;
}

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
      {/* Product Icon */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded flex items-center justify-center text-3xl">
        {item.emoji}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
        <p className="text-sm text-gray-600">KSh {item.price} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrement}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[6rem]">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-lg font-bold text-blue-600">
            KSh {item.subtotal}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
