'use client';

import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  volume: string;
  unit: string;
  branchId?: string;
  branchName?: string;
}

export function useCart() {
  const [cartItems, setCartItems, removeCart, isHydrated] = useLocalStorage<CartItem[]>('smart-retail-cart', []);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => i.productId === item.productId && i.branchId === item.branchId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        return updatedItems;
      } else {
        // Add new item with unique id using crypto.randomUUID for better uniqueness
        const newItem: CartItem = {
          ...item,
          id: typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `${item.productId}-${item.branchId || 'default'}-${Date.now()}-${Math.random()}`,
        };
        return [...prevItems, newItem];
      }
    });
  }, [setCartItems]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [setCartItems]);

  const removeItem = useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, [setCartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    isHydrated,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getCartCount,
  };
}
