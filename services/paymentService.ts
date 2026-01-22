import { api } from './api';

const BASE = '/api/v1/payments';

export interface InitiateMpesaRequest {
  orderId: string;
  phone: string;
  amount: number;
}

export interface InitiateMpesaResponse {
  checkoutRequestId: string;
  merchantRequestId: string;
  message: string;
  success: boolean;
  transactionId: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
}

export async function initiateMpesaPayment(
  data: InitiateMpesaRequest,
  token?: string | null
): Promise<InitiateMpesaResponse> {
  return api<InitiateMpesaResponse>(`${BASE}/mpesa/initiate`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function getPaymentStatus(
  orderId: string,
  token?: string | null
): Promise<PaymentStatusResponse> {
  return api<PaymentStatusResponse>(`${BASE}/${orderId}/status`, { token });
}
