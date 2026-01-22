/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { MapPin, Package, AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

export default function RestockPage() {
  const [selectedBranch, setSelectedBranch] = useState('kisumu');
  const [restockQuantities, setRestockQuantities] = useState<Record<string, string>>({
    'prod-cola': '',
    'prod-fanta': '',
    'prod-sprite': '',
    'prod-pepsi': '',
    'prod-dew': '',
    'prod-mirinda': ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const branches = [
    { id: 'nairobi', name: 'Nairobi HQ', disabled: true },
    { id: 'kisumu', name: 'Kisumu' },
    { id: 'mombasa', name: 'Mombasa' },
    { id: 'nakuru', name: 'Nakuru' },
    { id: 'eldoret', name: 'Eldoret' },
  ];

  // Mock stock data per branch
  const branchInventory: Record<string, any> = {
    kisumu: [
      { id: 'prod-cola', name: 'Coca-Cola', currentStock: 45, unit: 'Crates' },
      { id: 'prod-fanta', name: 'Fanta Orange', currentStock: 12, unit: 'Crates' },
      { id: 'prod-sprite', name: 'Sprite', currentStock: 67, unit: 'Crates' },
      { id: 'prod-pepsi', name: 'Pepsi', currentStock: 28, unit: 'Crates' },
      { id: 'prod-dew', name: 'Mountain Dew', currentStock: 15, unit: 'Crates' },
      { id: 'prod-mirinda', name: 'Mirinda', currentStock: 33, unit: 'Crates' },
    ],
    mombasa: [
      { id: 'prod-cola', name: 'Coca-Cola', currentStock: 38, unit: 'Crates' },
      { id: 'prod-fanta', name: 'Fanta Orange', currentStock: 55, unit: 'Crates' },
      { id: 'prod-sprite', name: 'Sprite', currentStock: 42, unit: 'Crates' },
      { id: 'prod-pepsi', name: 'Pepsi', currentStock: 9, unit: 'Crates' },
      { id: 'prod-dew', name: 'Mountain Dew', currentStock: 31, unit: 'Crates' },
      { id: 'prod-mirinda', name: 'Mirinda', currentStock: 18, unit: 'Crates' },
    ],
    nakuru: [
      { id: 'prod-cola', name: 'Coca-Cola', currentStock: 52, unit: 'Crates' },
      { id: 'prod-fanta', name: 'Fanta Orange', currentStock: 28, unit: 'Crates' },
      { id: 'prod-sprite', name: 'Sprite', currentStock: 35, unit: 'Crates' },
      { id: 'prod-pepsi', name: 'Pepsi', currentStock: 41, unit: 'Crates' },
      { id: 'prod-dew', name: 'Mountain Dew', currentStock: 7, unit: 'Crates' },
      { id: 'prod-mirinda', name: 'Mirinda', currentStock: 44, unit: 'Crates' },
    ],
    eldoret: [
      { id: 'prod-cola', name: 'Coca-Cola', currentStock: 19, unit: 'Crates' },
      { id: 'prod-fanta', name: 'Fanta Orange', currentStock: 36, unit: 'Crates' },
      { id: 'prod-sprite', name: 'Sprite', currentStock: 23, unit: 'Crates' },
      { id: 'prod-pepsi', name: 'Pepsi', currentStock: 50, unit: 'Crates' },
      { id: 'prod-dew', name: 'Mountain Dew', currentStock: 29, unit: 'Crates' },
      { id: 'prod-mirinda', name: 'Mirinda', currentStock: 11, unit: 'Crates' },
    ],
  };

  const currentBranch = branches.find(b => b.id === selectedBranch);
  const currentInventory = branchInventory[selectedBranch] || [];

  const handleInputChange = (productId: string, value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setRestockQuantities(prev => ({
        ...prev,
        [productId]: value
      }));
    }
  };

  const handleSubmit = () => {
    const restockData = Object.entries(restockQuantities)
      .filter(([_, qty]) => qty !== '' && parseInt(qty) > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity: parseInt(quantity)
      }));
    
    if (restockData.length === 0) {
      alert('Please enter quantities to restock');
      return;
    }

    console.log('Restocking Branch:', selectedBranch);
    console.log('Restock Data:', restockData);
    
    setShowSuccess(true);
    
    // Reset form
    setRestockQuantities({
      'prod-cola': '',
      'prod-fanta': '',
      'prod-sprite': '',
      'prod-pepsi': '',
      'prod-dew': '',
      'prod-mirinda': ''
    });
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getStockStatus = (stock: number) => {
    if (stock < 20) return { label: 'Low Stock', color: 'bg-red-100 text-red-700', icon: TrendingDown };
    if (stock < 50) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', icon: TrendingUp };
  };

  const totalToRestock = Object.values(restockQuantities)
    .filter(qty => qty !== '')
    .reduce((sum, qty) => sum + parseInt(qty), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restock Branches</h1>
          <p className="text-gray-600 mt-2">
            Transfer inventory from Nairobi Headquarters to branch locations
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 font-medium">
              Restock order submitted successfully! Inventory will be transferred from Nairobi HQ.
            </p>
          </div>
        )}

        {/* Branch Selector */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Select Branch to Restock
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => !branch.disabled && setSelectedBranch(branch.id)}
                disabled={branch.disabled}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  branch.disabled
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedBranch === branch.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">{branch.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Note: Nairobi HQ is the source of all inventory and cannot be restocked
          </p>
        </div>

        {/* Restock Form */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Current Stock Levels - {currentBranch?.name}</span>
              </h2>
              {totalToRestock > 0 && (
                <span className="text-sm text-gray-300">
                  {totalToRestock} crates to transfer
                </span>
              )}
            </div>
          </div>

          {/* Product List */}
          <div className="divide-y divide-gray-200">
            {currentInventory.map((product: any) => {
              const status = getStockStatus(product.currentStock);
              const StatusIcon = status.icon;
              const restockQty = restockQuantities[product.id];
              const newStock = restockQty ? product.currentStock + parseInt(restockQty) : product.currentStock;
              
              return (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Current Stock:</span>
                          <span className="text-base font-bold text-gray-900">{product.currentStock} {product.unit}</span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{status.label}</span>
                        </span>
                        {restockQty && parseInt(restockQty) > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-500">→</span>
                            <span className="text-green-700 font-semibold">New: {newStock} {product.unit}</span>
                            <span className="text-xs text-green-600">(+{restockQty})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Restock Input */}
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-700 mb-1">
                          Add Crates
                        </label>
                        <input
                          type="text"
                          value={restockQuantities[product.id]}
                          onChange={(e) => handleInputChange(product.id, e.target.value)}
                          placeholder="0"
                          className="w-32 h-12 placeholder:text-gray-500 text-gray-500 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Restocking from Nairobi HQ</p>
                  <p>All inventory will be transferred from headquarters. Ensure sufficient stock is available at Nairobi HQ before submitting this order.</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={totalToRestock === 0}
                className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
              >
                Confirm Restock Order
              </button>
            </div>
          </div>
        </div>

        {/* HQ Stock Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start space-x-3">
            <Package className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Nairobi HQ Inventory Status
              </h3>
              <p className="text-sm text-blue-800">
                Current HQ stock levels are sufficient for this restock operation. After confirmation, the specified quantities will be deducted from Nairobi headquarters and added to {currentBranch?.name}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}