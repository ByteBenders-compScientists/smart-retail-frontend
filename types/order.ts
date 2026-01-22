import { DrinkBrand } from './product';
import { BranchLocation } from './branch';
import type { ApiProduct } from './product';
import type { ApiBranch } from './branch';

/** Order Item from API */
export interface ApiOrderItem {
  DeletedAt: string | null;
  ID: string;
  OrderID: string;
  ProductID: string;
  Product: ApiProduct | null;
  ProductBrand: string;
  Quantity: number;
  Price: number;
  Subtotal: number;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Order from API */
export interface ApiOrder {
  DeletedAt: string | null;
  ID: string;
  UserID: string;
  BranchID: string;
  Branch: ApiBranch | null;
  TotalAmount: number;
  PaymentStatus: 'pending' | 'completed' | 'failed';
  PaymentMethod: 'mpesa';
  MpesaTransactionID: string | null;
  OrderStatus: 'processing' | 'completed' | 'cancelled';
  CreatedAt: string;
  UpdatedAt: string;
  CompletedAt: string | null;
  OrderItems: ApiOrderItem[] | null;
}

/** Create Order Request */
export interface CreateOrderRequest {
  branchId: string;
  items: {
    productId: string;
    productBrand: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  totalAmount: number;
  phone: string;
}

/** Create Order Response */
export interface CreateOrderResponse {
  order: ApiOrder;
  paymentUrl: string;
}

/** UI-friendly Order Item */
export interface OrderItemDisplay {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  quantity: number;
  price: number;
  subtotal: number;
  image?: string;
  volume?: string;
}

/** UI-friendly Order */
export interface OrderDisplay {
  id: string;
  userId: string;
  branchId: string;
  branchName: string;
  items: OrderItemDisplay[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'mpesa';
  mpesaTransactionId?: string;
  orderStatus: 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function mapApiOrderToDisplay(order: ApiOrder): OrderDisplay {
  return {
    id: order.ID,
    userId: order.UserID,
    branchId: order.BranchID,
    branchName: order.Branch?.Name ?? 'Unknown Branch',
    items: (order.OrderItems ?? []).map((item) => ({
      id: item.ID,
      productId: item.ProductID,
      productName: item.Product?.Name ?? 'Unknown Product',
      productBrand: item.ProductBrand,
      quantity: item.Quantity,
      price: item.Price,
      subtotal: item.Subtotal,
      image: item.Product?.Image,
      volume: item.Product?.Volume,
    })),
    totalAmount: order.TotalAmount,
    paymentStatus: order.PaymentStatus,
    paymentMethod: order.PaymentMethod,
    mpesaTransactionId: order.MpesaTransactionID ?? undefined,
    orderStatus: order.OrderStatus,
    createdAt: order.CreatedAt,
    updatedAt: order.UpdatedAt,
    completedAt: order.CompletedAt ?? undefined,
  };
}

/** Legacy types for backward compatibility */
export interface CartItem {
  productId: string;
  productName: DrinkBrand;
  quantity: number;
  price: number;
  subtotal: number;
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
