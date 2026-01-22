'use client';

import { useState } from 'react';
import { Package, AlertTriangle, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  emoji: string;
}

interface RestockFormProps {
  branchName: string;
  products: Product[];
  onSubmit: (restockData: { productId: string; quantity: number }[]) => void;
}

export default function RestockForm({ branchName, products, onSubmit }: RestockFormProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const restockData = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    // Simulate API call
    setTimeout(() => {
      onSubmit(restockData);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setQuantities(products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {}));
      }, 2000);
    }, 1000);
  };

  const getTotalRestock = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  if (showSuccess) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Restock Successful!
          </h3>
          <p className="text-gray-600">
            {branchName} branch has been restocked successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Package className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Restock {branchName} Branch
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product List */}
        <div className="space-y-4">
          {products.map((product) => {
            const isLowStock = product.currentStock < 20;
            
            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 ${
                  isLowStock ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{product.emoji}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        Current Stock: <span className="font-medium">{product.currentStock}</span> units
                      </p>
                    </div>
                  </div>
                  {isLowStock && (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-medium">Low Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Restock Quantity:
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, quantities[product.id] - 10)}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      -10
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={quantities[product.id]}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, quantities[product.id] + 10)}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      +10
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    New Total: <span className="font-semibold">{product.currentStock + quantities[product.id]}</span> units
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Total Units to Restock:</span>
            <span className="text-2xl font-bold text-blue-600">{getTotalRestock()}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || getTotalRestock() === 0}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </span>
          ) : (
            `Confirm Restock (${getTotalRestock()} units)`
          )}
        </button>
      </form>
    </div>
  );
}