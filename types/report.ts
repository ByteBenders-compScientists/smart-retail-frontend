import type { ApiBranch } from './branch';

/** Sales report filters */
export interface SalesReportFilters {
  branchId?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
}

/** Sales data by brand */
export interface BrandSales {
  revenue: number;
  units: number;
}

/** GET /api/v1/admin/reports/sales */
export interface SalesReportResponse {
  filters: {
    branchId: string;
    endDate: string;
    productId: string;
    startDate: string;
  };
  grandTotal: number;
  salesByBranch: Record<string, number>; // Branch name -> total revenue
  salesByBrand: Record<string, BrandSales>;
}

/** Branch sales data */
export interface BranchSalesData {
  topProducts: Record<string, number>; // Product name -> units sold
  totalOrders: number;
  totalRevenue: number;
}

/** GET /api/v1/admin/reports/branch/:branchId */
export interface BranchReportResponse {
  branch: ApiBranch;
  branchSales: BranchSalesData;
}

/** Branch report filters */
export interface BranchReportFilters {
  startDate?: string;
  endDate?: string;
}
