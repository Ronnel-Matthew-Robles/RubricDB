import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useDepartments() {
  return useSWR(`/api/departments`, fetcher);
}