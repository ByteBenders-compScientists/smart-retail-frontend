import { api } from './api';
import type {
  ApiInventoryResponse,
  RestockRequest,
  ApiRestockLog,
  RestockLogsDateFilter,
  RestockLogsBranchFilter,
} from '@/types/inventory';

const ADMIN_BASE = '/api/v1/admin';

/**
 * Get all inventory across all branches
 * GET /api/v1/admin/inventory
 */
export async function getAllInventory(
  token?: string | null
): Promise<ApiInventoryResponse> {
  return api<ApiInventoryResponse>(`${ADMIN_BASE}/inventory`, { token });
}

/**
 * Get inventory for a specific branch
 * GET /api/v1/admin/inventory?branchId={branchId}
 */
export async function getInventoryByBranch(
  branchId: string,
  token?: string | null
): Promise<ApiInventoryResponse> {
  return api<ApiInventoryResponse>(
    `${ADMIN_BASE}/inventory?branchId=${encodeURIComponent(branchId)}`,
    { token }
  );
}

/**
 * Restock a branch with a product
 * POST /api/v1/admin/restock
 */
export async function restockBranch(
  data: RestockRequest,
  token?: string | null
): Promise<void> {
  return api<void>(`${ADMIN_BASE}/restock`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * Get all restock logs
 * GET /api/v1/admin/restock-logs
 */
export async function getRestockLogs(
  token?: string | null
): Promise<ApiRestockLog[]> {
  return api<ApiRestockLog[]>(`${ADMIN_BASE}/restock-logs`, { token });
}

/**
 * Get restock logs for a specific branch
 * GET /api/v1/admin/restock-logs?branchId={branchId}
 */
export async function getRestockLogsByBranch(
  branchId: string,
  token?: string | null
): Promise<ApiRestockLog[]> {
  return api<ApiRestockLog[]>(
    `${ADMIN_BASE}/restock-logs?branchId=${encodeURIComponent(branchId)}`,
    { token }
  );
}

/**
 * Get restock logs with date filter
 * GET /api/v1/admin/restock-logs?startDate={startDate}&endDate={endDate}
 */
export async function getRestockLogsWithDateFilter(
  filters: RestockLogsDateFilter,
  token?: string | null
): Promise<ApiRestockLog[]> {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  return api<ApiRestockLog[]>(
    `${ADMIN_BASE}/restock-logs?${params.toString()}`,
    { token }
  );
}

/**
 * Get restock logs with combined filters (branch + date)
 * GET /api/v1/admin/restock-logs?branchId={branchId}&startDate={startDate}&endDate={endDate}
 */
export async function getRestockLogsWithFilters(
  branchFilter?: RestockLogsBranchFilter,
  dateFilter?: RestockLogsDateFilter,
  token?: string | null
): Promise<ApiRestockLog[]> {
  const params = new URLSearchParams();
  if (branchFilter?.branchId) params.append('branchId', branchFilter.branchId);
  if (dateFilter?.startDate) params.append('startDate', dateFilter.startDate);
  if (dateFilter?.endDate) params.append('endDate', dateFilter.endDate);
  
  return api<ApiRestockLog[]>(
    `${ADMIN_BASE}/restock-logs?${params.toString()}`,
    { token }
  );
}
