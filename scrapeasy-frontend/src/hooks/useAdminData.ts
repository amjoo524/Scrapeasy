"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publicApi } from '../lib/api';

const adminApi = {
  // These endpoints are expected to be implemented on your backend.
  // If your frontend previously had these, re-add them to ../lib/api.ts.
  getDashboard: async () => {
    throw new Error('adminApi.getDashboard is not implemented');
  },
  getCustomers: async () => {
    throw new Error('adminApi.getCustomers is not implemented');
  },
  getRiders: async () => {
    throw new Error('adminApi.getRiders is not implemented');
  },
  getScrapRates: async () => {
    throw new Error('adminApi.getScrapRates is not implemented');
  },
  updateScrapRates: async (body: unknown) => {
    throw new Error('adminApi.updateScrapRates is not implemented');
  },
};



export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30000,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: adminApi.getCustomers,
  });
}

export function useRiders() {
  return useQuery({
    queryKey: ['admin', 'riders'],
    queryFn: adminApi.getRiders,
  });
}

export function useScrapRates() {
  return useQuery({
    queryKey: ['admin', 'scrap-rates'],
    queryFn: adminApi.getScrapRates,
  });
}

export function useUpdateScrapRates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateScrapRates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'scrap-rates'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}
