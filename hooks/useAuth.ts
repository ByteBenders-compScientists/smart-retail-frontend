'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import * as authService from '@/services/authService';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';
import type { User, LoginData, RegisterData } from '@/types/user';

export function getDashboardPath(role: User['role']): string {
  return role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD;
}

export function useAuth() {
  const [token, setToken, removeToken, tokenHydrated] = useLocalStorage<string | null>(
    STORAGE_KEYS.AUTH_TOKEN,
    null
  );
  const [user, setUser, removeUser, userHydrated] = useLocalStorage<User | null>(
    STORAGE_KEYS.USER_DATA,
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [authCheckDone, setAuthCheckDone] = useState(false);

  const isHydrated = tokenHydrated && userHydrated;
  const isAuthenticated = !!(token && user);

  const persistAuth = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  }, [setToken, setUser]);

  const clearAuth = useCallback(() => {
    removeToken();
    removeUser();
  }, [removeToken, removeUser]);

  const login = useCallback(
    async (data: LoginData) => {
      setIsLoading(true);
      try {
        const res = await authService.login(data);
        persistAuth(res.token, res.user);
        return { user: res.user, token: res.token };
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuth]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);
      try {
        const res = await authService.register(data);
        persistAuth(res.token, res.user);
        return { user: res.user, token: res.token };
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuth]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Clear local state even if API fails (e.g. network)
    } finally {
      clearAuth();
      setIsLoading(false);
    }
  }, [clearAuth]);

  const getMe = useCallback(async () => {
    if (!token) {
      setAuthCheckDone(true);
      return null;
    }
    try {
      const me = await authService.getCurrentUser(token);
      setUser(me);
      return me;
    } catch {
      clearAuth();
      return null;
    } finally {
      setAuthCheckDone(true);
    }
  }, [token, setUser, clearAuth]);

  useEffect(() => {
    if (!isHydrated) return;
    getMe();
  }, [isHydrated, getMe]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isHydrated,
    authCheckDone,
    login,
    register,
    logout,
    getMe,
    getDashboardPath,
    clearAuth,
  };
}
