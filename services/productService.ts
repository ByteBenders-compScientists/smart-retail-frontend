import { api } from './api';
import type { ApiProduct, ApiBranchInventoryItem } from '@/types/product';

const BASE = '/api/v1/products';

export async function getProducts(token?: string | null): Promise<ApiProduct[]> {
  return api<ApiProduct[]>(BASE, { token });
}

export async function getProductById(
  productId: string,
  token?: string | null
): Promise<ApiProduct> {
  return api<ApiProduct>(`${BASE}/${productId}`, { token });
}

export async function getBranchInventory(
  branchId: string,
  token?: string | null
): Promise<ApiBranchInventoryItem[]> {
  return api<ApiBranchInventoryItem[]>(`${BASE}/branch/${branchId}`, { token });
}
