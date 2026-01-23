'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { getProducts } from '@/services/productService';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByBrand,
  getProductStock
} from '@/services/adminProductService';
import type { ApiProduct, CreateProductRequest, UpdateProductRequest, ProductStockResponse } from '@/types/product';
import { parseTags } from '@/types/product';

type ModalMode = 'create' | 'edit' | 'stock' | 'delete' | null;

export default function AdminProductsPage() {
  const { token } = useAuthContext();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [productStock, setProductStock] = useState<ProductStockResponse | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    brand: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 4.5,
    reviews: 0,
    category: '',
    volume: '',
    unit: 'single',
    tags: [],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts(token);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.Name.toLowerCase().includes(query) ||
          p.Brand.toLowerCase().includes(query) ||
          p.Category.toLowerCase().includes(query)
      );
    }

    if (brandFilter) {
      filtered = filtered.filter((p) => p.Brand === brandFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, brandFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleFilterByBrand = async (brand: string) => {
    if (!brand) {
      setBrandFilter('');
      return;
    }

    try {
      setLoading(true);
      setBrandFilter(brand);
      const data = await getProductsByBrand(brand, token);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter products');
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      rating: 4.5,
      reviews: 0,
      category: '',
      volume: '',
      unit: 'single',
      tags: [],
    });
    setError('');
  };

  const openEditModal = (product: ApiProduct) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.Name,
      brand: product.Brand,
      description: product.Description,
      price: product.Price,
      originalPrice: product.OriginalPrice || 0,
      image: product.Image,
      rating: product.Rating,
      reviews: product.Reviews,
      category: product.Category,
      volume: product.Volume,
      unit: product.Unit,
      tags: parseTags(product.Tags),
    });
    setError('');
  };

  const openStockModal = async (product: ApiProduct) => {
    setModalMode('stock');
    setSelectedProduct(product);
    setProductStock(null);
    setError('');

    try {
      const stockData = await getProductStock(product.ID, token);
      setProductStock(stockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stock data');
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
    setProductStock(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'create') {
        await createProduct(formData, token);
        setSuccess('Product created successfully!');
      } else if (modalMode === 'edit' && selectedProduct) {
        const updateData: UpdateProductRequest = { ...formData };
        await updateProduct(selectedProduct.ID, updateData, token);
        setSuccess('Product updated successfully!');
      }

      setTimeout(() => {
        closeModal();
        loadProducts();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (product: ApiProduct) => {
    setModalMode('delete');
    setSelectedProduct(product);
    setError('');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      setFormLoading(true);
      await deleteProduct(selectedProduct.ID, token);
      setSuccess('Product deleted successfully!');
      closeModal();
      loadProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'rating' || name === 'reviews'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const uniqueBrands = Array.from(new Set(products.map((p) => p.Brand))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage products across all branches</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {error && !modalMode && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            {/* Brand Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={brandFilter}
                onChange={(e) => handleFilterByBrand(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              >
                <option value="">All Brands</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Create Product</span>
            </button>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || brandFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first product'}
            </p>
            {!searchQuery && !brandFilter && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
              >
                <Plus className="h-5 w-5" />
                <span>Create Product</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.ID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={product.Image}
                            alt={product.Name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{product.Name}</p>
                            <p className="text-sm text-gray-500">{product.Volume}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{product.Brand}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{product.Category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">KSh {product.Price}</p>
                          {product.OriginalPrice && product.OriginalPrice > product.Price && (
                            <p className="text-xs text-gray-500 line-through">
                              KSh {product.OriginalPrice}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-900">{product.Rating}</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-500">({product.Reviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openStockModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Stock"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalMode && (modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold text-white">
                {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (KSh) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (KSh)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume *</label>
                  <input
                    type="text"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500ml"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  >
                    <option value="single">Single</option>
                    <option value="crate">Crate</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={handleTagsChange}
                  placeholder="e.g., popular, classic, carbonated"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{modalMode === 'create' ? 'Create Product' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {modalMode === 'stock' && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold text-white">
                Stock Levels - {selectedProduct.Name}
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {!productStock ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700 mb-1">Total Stock</p>
                      <p className="text-2xl font-bold text-blue-900">{productStock.total_stock}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700 mb-1">Branches</p>
                      <p className="text-2xl font-bold text-green-900">{productStock.branches}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-700 mb-1">Avg per Branch</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {Math.round(productStock.total_stock / productStock.branches)}
                      </p>
                    </div>
                  </div>

                  {/* Branch Stocks */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Stock by Branch</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {productStock.branch_stocks.map((stock) => (
                        <div
                          key={stock.ID}
                          className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <Package className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {stock.Branch.Name}
                                    {stock.Branch.IsHeadquarter && (
                                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        HQ
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">{stock.Branch.Address}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{stock.Quantity}</p>
                              <p className="text-xs text-gray-500">
                                Last restocked: {new Date(stock.LastRestocked).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Delete Product</h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex items-start space-x-3 mb-6">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium mb-2">
                    Are you sure you want to delete this product?
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{selectedProduct.Name}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone. The product will be permanently removed from all branches.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={formLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      <span>Delete Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
