'use client';

import { useState, useCallback, useEffect } from 'react';
import * as productService from '@/services/productService';
import {
  mapApiProductToDisplay,
  type ProductDisplay,
} from '@/types/product';

export function useProducts(token?: string | null) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (t?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(t ?? token);
      setProducts(data.map(mapApiProductToDisplay));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}
