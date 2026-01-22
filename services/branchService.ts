import { api } from './api';
import type { ApiBranch } from '@/types/branch';

const BASE = '/api/v1/branches';

export async function getBranches(token?: string | null): Promise<ApiBranch[]> {
  return api<ApiBranch[]>(BASE, { token });
}

export async function getBranchById(
  branchId: string,
  token?: string | null
): Promise<ApiBranch> {
  return api<ApiBranch>(`${BASE}/${branchId}`, { token });
}
