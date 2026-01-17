/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }