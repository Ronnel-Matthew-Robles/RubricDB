import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useApprovedCriteriaFromActivityId(id) {
  return useSWR(`/api/activity/${id}/approved`, fetcher);
}
