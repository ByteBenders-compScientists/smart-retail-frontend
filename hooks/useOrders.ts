'use client';

import { useState, useCallback, useEffect } from 'react';
import * as orderService from '@/services/orderService';
import { mapApiOrderToDisplay, type OrderDisplay } from '@/types/order';

export function useOrders(token?: string | null) {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (t?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders(t ?? token);
      setOrders(data.map(mapApiOrderToDisplay));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}

export function useOrder(orderId: string | null, token?: string | null) {
  const [order, setOrder] = useState<OrderDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(
    async (id: string, t?: string | null) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrderById(id, t ?? token);
        setOrder(mapApiOrderToDisplay(data));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load order');
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setOrder(null);
      setError(null);
      setIsLoading(false);
    }
  }, [orderId, fetchOrder]);

  return { order, isLoading, error, refetch: () => orderId && fetchOrder(orderId) };
}
