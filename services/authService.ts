import { api } from './api';
import type { User, LoginData, RegisterData, AuthResponse } from '@/types/user';

const AUTH_BASE = '/api/v1/auth';

export async function register(data: RegisterData): Promise<AuthResponse> {
  return api<AuthResponse>(`${AUTH_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return api<AuthResponse>(`${AUTH_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<{ message: string }> {
  return api<{ message: string }>(`${AUTH_BASE}/logout`, {
    method: 'POST',
  });
}

export async function getCurrentUser(token: string): Promise<User> {
  return api<User>(`${AUTH_BASE}/me`, {
    method: 'GET',
    token,
  });
}
