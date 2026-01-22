'use client';

import { useState, useCallback, useEffect } from 'react';
import * as branchService from '@/services/branchService';
import { mapApiBranchToDisplay, type BranchDisplay } from '@/types/branch';

export function useBranches(token?: string | null) {
  const [branches, setBranches] = useState<BranchDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async (t?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await branchService.getBranches(t ?? token);
      setBranches(data.map(mapApiBranchToDisplay));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load branches');
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { branches, isLoading, error, refetch: fetchBranches };
}
