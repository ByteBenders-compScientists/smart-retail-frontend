'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus, Star, Check, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    stock: number;
    category: string;
    branches: string[];
    volume: string;
  };
  onAddToCart: (productId: string, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product.id, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'coke': return 'bg-red-500';
      case 'fanta': return 'bg-orange-500';
      case 'sprite': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="group sahdow-xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full rounded-md">
      {/* Product Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Stock Badge - only when we have per-branch stock (e.g. branch inventory) */}
        {product.branches.length > 0 && (
          <div className="absolute top-3 left-3 z-10">
            {product.stock > 0 ? (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase">
                Out of Stock
              </span>
            )}
          </div>
        )}

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase">
              Sale
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <div className="relative w-40 h-40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.png';
              }}
            />
          </div>
        </div>

        {/* Brand Tag */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 ${getBrandColor(product.brand)} text-white text-xs font-bold uppercase`}>
            {product.brand}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 font-medium">
            {product.rating}
          </span>
          <span className="ml-1 text-sm text-gray-400">
            ({product.reviews})
          </span>
        </div>

        {/* Available Branches */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="font-medium">
              {product.branches.length > 0
                ? `Available at ${product.branches.length} branch${product.branches.length === 1 ? '' : 'es'}`
                : 'Available at all branches'}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              KSh {product.price.toFixed(0)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                KSh {product.originalPrice.toFixed(0)}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <p className="text-xs text-green-600 font-medium mt-1">
              Save KSh {(product.originalPrice - product.price).toFixed(0)}
            </p>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border-2 border-gray-300">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-bold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              disabled={quantity >= 50}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={(product.branches.length > 0 && product.stock === 0) || isAdding}
          className={`w-full rounded-md flex items-center justify-center py-3 px-4 font-bold transition-all duration-300 uppercase text-sm ${
            product.branches.length > 0 && product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAdding
              ? 'bg-emerald-600 text-white'
              : 'bg-sky-600 text-white hover:bg-sky-700 active:scale-95'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Added!
            </>
          ) : product.branches.length > 0 && product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add KSh {(product.price * quantity).toFixed(0)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}