import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useCriterion(id) {
  return useSWR(`/api/criteria/${id}`, fetcher);
}

export function usePendingCriteria() {
  return useSWR('/api/criteria/pending', fetcher, {
    refreshInterval: 10000,
    revalidateAll: false,
  });
}

export function useApprovedCriteria() {
  return useSWR('/api/criteria/approve', fetcher, {
    refreshInterval: 10000,
    revalidateAll: false,
  });
}

export function useRejectedCriteria() {
  return useSWR('/api/criteria/reject', fetcher, {
    refreshInterval: 10000,
    revalidateAll: false,
  });
}