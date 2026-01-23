import { api } from './api';
import type {
  SalesReportResponse,
  SalesReportFilters,
  BranchReportResponse,
  BranchReportFilters,
} from '@/types/report';

const ADMIN_REPORTS_BASE = '/api/v1/admin/reports';

/**
 * Get sales report with optional filters
 * GET /api/v1/admin/reports/sales
 */
export async function getSalesReport(
  filters?: SalesReportFilters,
  token?: string | null
): Promise<SalesReportResponse> {
  let url = `${ADMIN_REPORTS_BASE}/sales`;
  
  // Build query string from filters
  if (filters) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.branchId) params.append('branchId', filters.branchId);
    if (filters.productId) params.append('productId', filters.productId);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return api<SalesReportResponse>(url, { token });
}

/**
 * Get branch report with optional date filters
 * GET /api/v1/admin/reports/branch/:branchId
 */
export async function getBranchReport(
  branchId: string,
  filters?: BranchReportFilters,
  token?: string | null
): Promise<BranchReportResponse> {
  let url = `${ADMIN_REPORTS_BASE}/branch/${branchId}`;
  
  // Build query string from filters
  if (filters) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return api<BranchReportResponse>(url, { token });
}
