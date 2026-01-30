/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem('smart-retail-cart');
        if (cartData) {
          const items = JSON.parse(cartData);
          const count = Array.isArray(items) 
            ? items.reduce((total, item) => total + (item.quantity || 0), 0)
            : 0;
          return count;
        } else {
          return 0;
        }
      } catch (error) {
        console.error('Error reading cart count:', error);
        return 0;
      }
    };

    // Mark as hydrated and set initial count
    setIsHydrated(true);
    setCartCount(updateCartCount());

    // Listen for storage events (when cart changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smart-retail-cart') {
        setCartCount(updateCartCount());
      }
    };

    // Listen for custom cart update events (when cart changes in same tab)
    const handleCartUpdate = () => {
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setCartCount(updateCartCount());
      }, 0);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Poll for changes every 500ms as a fallback
    const interval = setInterval(() => {
      setCartCount(updateCartCount());
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  return { cartCount, isHydrated };
}