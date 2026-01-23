'use client';
import { useState, useEffect } from 'react';
import { MapPin, Package, AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { getBranches } from '@/services/branchService';
import { getInventoryByBranch, restockBranch } from '@/services/adminService';
import type { ApiBranch } from '@/types/branch';
import type { ApiInventoryItem } from '@/types/inventory';

export default function RestockPage() {
  const { token } = useAuthContext();
  const [branches, setBranches] = useState<ApiBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [inventory, setInventory] = useState<ApiInventoryItem[]>([]);
  const [restockQuantities, setRestockQuantities] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const fetchedBranches = await getBranches(token);
        setBranches(fetchedBranches);
        
        // Auto-select first non-headquarters branch
        const nonHqBranch = fetchedBranches.find(b => !b.IsHeadquarter);
        if (nonHqBranch) {
          setSelectedBranch(nonHqBranch.ID);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load branches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [token]);

  // Fetch inventory when branch changes
  useEffect(() => {
    if (!selectedBranch) return;

    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getInventoryByBranch(selectedBranch, token);
        setInventory(response.inventory);
        
        // Reset restock quantities for new inventory
        const newQuantities: Record<string, string> = {};
        response.inventory.forEach(item => {
          newQuantities[item.ProductID] = '';
        });
        setRestockQuantities(newQuantities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
        setInventory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [selectedBranch, token]);

  const handleInputChange = (productId: string, value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setRestockQuantities(prev => ({
        ...prev,
        [productId]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const restockData = Object.entries(restockQuantities)
      .filter(([, qty]) => qty !== '' && parseInt(qty) > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity: parseInt(quantity)
      }));
    
    if (restockData.length === 0) {
      setError('Please enter quantities to restock');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit each restock request
      for (const item of restockData) {
        await restockBranch({
          branchId: selectedBranch,
          productId: item.productId,
          quantity: item.quantity
        }, token);
      }
      
      setShowSuccess(true);
      
      // Refresh inventory after successful restock
      const response = await getInventoryByBranch(selectedBranch, token);
      setInventory(response.inventory);
      
      // Reset form
      const newQuantities: Record<string, string> = {};
      response.inventory.forEach(item => {
        newQuantities[item.ProductID] = '';
      });
      setRestockQuantities(newQuantities);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock < 20) return { label: 'Low Stock', color: 'bg-red-100 text-red-700', icon: TrendingDown };
    if (stock < 50) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700', icon: TrendingUp };
  };

  const totalToRestock = Object.values(restockQuantities)
    .filter(qty => qty !== '')
    .reduce((sum, qty) => sum + parseInt(qty), 0);

  const currentBranch = branches.find(b => b.ID === selectedBranch);
  const headquartersBranch = branches.find(b => b.IsHeadquarter);

  if (isLoading && branches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading branches and inventory...</p>
        </div>
      </div>
    );
  }

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
              Restock order submitted successfully! Inventory will be transferred from {headquartersBranch?.Name || 'headquarters'}.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
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
                key={branch.ID}
                onClick={() => !branch.IsHeadquarter && setSelectedBranch(branch.ID)}
                disabled={branch.IsHeadquarter}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  branch.IsHeadquarter
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedBranch === branch.ID
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">{branch.Name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Note: {headquartersBranch?.Name || 'Headquarters'} is the source of all inventory and cannot be restocked
          </p>
        </div>

        {/* Restock Form */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Current Stock Levels - {currentBranch?.Name}</span>
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
            {isLoading ? (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Loading inventory...</p>
              </div>
            ) : inventory.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No inventory found for this branch</p>
              </div>
            ) : (
              inventory.map((item: ApiInventoryItem) => {
                const status = getStockStatus(item.Quantity);
                const StatusIcon = status.icon;
                const restockQty = restockQuantities[item.ProductID];
                const newStock = restockQty ? item.Quantity + parseInt(restockQty) : item.Quantity;
                
                return (
                  <div key={item.ID} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">{item.Product.Name}</h3>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Current Stock:</span>
                            <span className="text-base font-bold text-gray-900">{item.Quantity} {item.Product.Unit}</span>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{status.label}</span>
                          </span>
                          {restockQty && parseInt(restockQty) > 0 && (
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-500">→</span>
                              <span className="text-green-700 font-semibold">New: {newStock} {item.Product.Unit}</span>
                              <span className="text-xs text-green-600">(+{restockQty})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Restock Input */}
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-gray-700 mb-1">
                            Add {item.Product.Unit}
                          </label>
                          <input
                            type="text"
                            value={restockQuantities[item.ProductID] || ''}
                            onChange={(e) => handleInputChange(item.ProductID, e.target.value)}
                            placeholder="0"
                            disabled={isSubmitting}
                            className="w-32 h-12 placeholder:text-gray-500 text-gray-500 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary Footer */}
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Restocking from {headquartersBranch?.Name || 'Headquarters'}</p>
                  <p>All inventory will be transferred from headquarters. Ensure sufficient stock is available at {headquartersBranch?.Name || 'headquarters'} before submitting this order.</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={totalToRestock === 0 || isSubmitting}
                className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Restock Order'}
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
                {headquartersBranch?.Name || 'Headquarters'} Inventory Status
              </h3>
              <p className="text-sm text-blue-800">
                Current HQ stock levels are sufficient for this restock operation. After confirmation, the specified quantities will be deducted from {headquartersBranch?.Name || 'headquarters'} and added to {currentBranch?.Name}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}