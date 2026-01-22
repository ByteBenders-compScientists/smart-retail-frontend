'use client';

import { useState, useCallback, useEffect } from 'react';
import * as branchService from '@/services/branchService';
import { mapApiBranchToDisplay, type BranchDisplay } from '@/types/branch';

export function useBranches(token?: string | null) {
  const [branches, setBranches] = useState<BranchDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async (t?: string | null) => {
    if (!t) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await branchService.getBranches(t);
      setBranches(data.map(mapApiBranchToDisplay));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load branches');
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchBranches(token);
  }, [token, fetchBranches]);

  return { branches, isLoading, error, refetch: fetchBranches };
}
