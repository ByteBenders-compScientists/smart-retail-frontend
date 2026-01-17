import { DrinkBrand } from './product';
import { BranchLocation } from './branch';

export interface CartItem {
  productId: string;
  productName: DrinkBrand;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  branchId: string;
  branchName: BranchLocation;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'mpesa';
  mpesaTransactionId?: string;
  orderStatus: 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface CreateOrderData {
  branchId: string;
  items: CartItem[];
  totalAmount: number;
  phone: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  checkoutRequestId?: string;
}