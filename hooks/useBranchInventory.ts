'use client';

import { useState, useCallback, useEffect } from 'react';
import * as productService from '@/services/productService';
import {
  mapBranchInventoryToDisplay,
  type ProductDisplay,
} from '@/types/product';
import type { BranchDisplay } from '@/types/branch';

export function useBranchInventory(
  branchId: string | null,
  branchName?: string,
  token?: string | null
) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(
    async (bid: string, bname?: string, t?: string | null) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getBranchInventory(bid, t);
        setProducts(
          data.map((p) => mapBranchInventoryToDisplay(p, bname))
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load inventory');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!branchId || branchId === 'all') {
      setProducts([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    fetchInventory(branchId, branchName, token);
  }, [branchId, branchName, token, fetchInventory]);

  return { products, isLoading, error, refetch: () => fetchInventory(branchId ?? '', branchName, token) };
}
