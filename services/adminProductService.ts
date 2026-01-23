import { api } from './api';
import type { 
  ApiProduct, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductStockResponse 
} from '@/types/product';

const BASE = '/api/v1/admin/products';

/**
 * Create a new product
 * POST /api/v1/admin/products
 */
export async function createProduct(
  data: CreateProductRequest,
  token?: string | null
): Promise<ApiProduct> {
  return api<ApiProduct>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * Update an existing product
 * PUT /api/v1/admin/products/:id
 */
export async function updateProduct(
  productId: string,
  data: UpdateProductRequest,
  token?: string | null
): Promise<ApiProduct> {
  return api<ApiProduct>(`${BASE}/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * Delete a product
 * DELETE /api/v1/admin/products/:id
 */
export async function deleteProduct(
  productId: string,
  token?: string | null
): Promise<void> {
  return api<void>(`${BASE}/${productId}`, {
    method: 'DELETE',
    token,
  });
}

/**
 * Get products by brand
 * GET /api/v1/admin/products/brand?brand=BrandName
 */
export async function getProductsByBrand(
  brand: string,
  token?: string | null
): Promise<ApiProduct[]> {
  return api<ApiProduct[]>(`${BASE}/brand?brand=${encodeURIComponent(brand)}`, {
    token,
  });
}

/**
 * Get product stock across all branches
 * GET /api/v1/admin/products/:id/stock
 */
export async function getProductStock(
  productId: string,
  token?: string | null
): Promise<ProductStockResponse> {
  return api<ProductStockResponse>(`${BASE}/${productId}/stock`, {
    token,
  });
}
