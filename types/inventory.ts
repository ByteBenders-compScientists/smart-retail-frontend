import type { ApiBranch } from './branch';
import type { ApiProduct } from './product';

/**
 * Inventory item from GET /api/v1/admin/inventory
 */
export interface ApiInventoryItem {
  ID: string;
  BranchID: string;
  ProductID: string;
  Quantity: number;
  LastRestocked: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Branch: ApiBranch;
  Product: ApiProduct;
}

/**
 * Response from GET /api/v1/admin/inventory
 */
export interface ApiInventoryResponse {
  inventory: ApiInventoryItem[];
  lowStockAlerts: ApiInventoryItem[];
  lowStockThreshold: number;
}

/**
 * Request body for POST /api/v1/admin/restock
 */
export interface RestockRequest {
  branchId: string;
  productId: string;
  quantity: number;
}

/**
 * User information in restock log
 */
export interface ApiRestockUser {
  DeletedAt: string | null;
  ID: string;
  Name: string;
  Email: string;
  Phone: string;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/**
 * Restock log item from GET /api/v1/admin/restock-logs
 */
export interface ApiRestockLog {
  ID: string;
  BranchID: string;
  ProductID: string;
  QuantityAdded: number;
  PreviousQuantity: number;
  NewQuantity: number;
  RestockedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Branch: ApiBranch;
  Product: ApiProduct;
  RestockedByUser: ApiRestockUser;
}

/**
 * Query parameters for restock logs with date filter
 */
export interface RestockLogsDateFilter {
  startDate?: string; // ISO 8601 format: 2026-01-01
  endDate?: string;   // ISO 8601 format: 2026-01-31
}

/**
 * Query parameters for restock logs by branch
 */
export interface RestockLogsBranchFilter {
  branchId: string;
}
