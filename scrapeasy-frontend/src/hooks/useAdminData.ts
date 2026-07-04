"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

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