import { api } from './api';
import type { ApiBranch, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch';

const BASE = '/api/v1/branches';
const ADMIN_BASE = '/api/v1/admin/branches';

export async function getBranches(token?: string | null): Promise<ApiBranch[]> {
  return api<ApiBranch[]>(BASE, { token });
}

export async function getBranchById(
  branchId: string,
  token?: string | null
): Promise<ApiBranch> {
  return api<ApiBranch>(`${BASE}/${branchId}`, { token });
}

// Admin endpoints
export async function createBranch(
  payload: CreateBranchPayload,
  token?: string | null
): Promise<ApiBranch> {
  return api<ApiBranch>(ADMIN_BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function updateBranch(
  branchId: string,
  payload: UpdateBranchPayload,
  token?: string | null
): Promise<ApiBranch> {
  return api<ApiBranch>(`${ADMIN_BASE}/${branchId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  });
}

export async function deleteBranch(
  branchId: string,
  token?: string | null
): Promise<void> {
  return api<void>(`${ADMIN_BASE}/${branchId}`, {
    method: 'DELETE',
    token,
  });
}
