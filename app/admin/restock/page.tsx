'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import RestockForm from '@/components/admin/RestockForm';

export default function RestockPage() {
  const [selectedBranch, setSelectedBranch] = useState('kisumu');

  const branches = [
    { id: 'nairobi', name: 'Nairobi HQ' },
    { id: 'kisumu', name: 'Kisumu' },
    { id: 'mombasa', name: 'Mombasa' },
    { id: 'nakuru', name: 'Nakuru' },
    { id: 'eldoret', name: 'Eldoret' },
  ];

  // Mock product data - replace with actual API call
  const getProductsForBranch = (branchId: string) => {
    return [
      {
        id: 'prod-cola',
        name: 'Coca-Cola',
        currentStock: 45,
        emoji: '🥤',
      },
      {
        id: 'prod-fanta',
        name: 'Fanta Orange',
        currentStock: 12,
        emoji: '🍊',
      },
      {
        id: 'prod-sprite',
        name: 'Sprite',
        currentStock: 67,
        emoji: '💚',
      },
      {
        id: 'prod-pepsi',
        name: 'Pepsi',
        currentStock: 28,
        emoji: '🔵',
      },
      {
        id: 'prod-dew',
        name: 'Mountain Dew',
        currentStock: 15,
        emoji: '🟢',
      },
      {
        id: 'prod-mirinda',
        name: 'Mirinda',
        currentStock: 33,
        emoji: '🟡',
      },
    ];
  };

  const handleRestock = (restockData: { productId: string; quantity: number }[]) => {
    console.log('Restocking:', selectedBranch, restockData);
    // API call here
  };

  const currentBranch = branches.find(b => b.id === selectedBranch);
  const products = getProductsForBranch(selectedBranch);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restock Inventory</h1>
          <p className="text-gray-600 mt-2">
            Manage inventory levels across all branches from headquarters
          </p>
        </div>

        {/* Branch Selector */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Branch to Restock
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  selectedBranch === branch.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">{branch.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restock Form */}
        <RestockForm
          branchName={currentBranch?.name || ''}
          products={products}
          onSubmit={handleRestock}
        />

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All restocking is done from Nairobi Headquarters inventory. 
            Make sure HQ has sufficient stock before restocking branches.
          </p>
        </div>
      </div>
    </div>
  );
}