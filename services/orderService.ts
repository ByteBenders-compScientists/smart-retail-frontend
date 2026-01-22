import { api } from './api';
import type { CreateOrderRequest, CreateOrderResponse, ApiOrder } from '@/types/order';

const BASE = '/api/v1/orders';

export async function createOrder(
  data: CreateOrderRequest,
  token?: string | null
): Promise<CreateOrderResponse> {
  return api<CreateOrderResponse>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function getOrders(token?: string | null): Promise<ApiOrder[]> {
  return api<ApiOrder[]>(BASE, { token });
}

export async function getOrderById(
  orderId: string,
  token?: string | null
): Promise<ApiOrder> {
  return api<ApiOrder>(`${BASE}/${orderId}`, { token });
}
