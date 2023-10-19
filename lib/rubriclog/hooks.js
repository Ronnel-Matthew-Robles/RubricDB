import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useRubricLogApprover(rubricId) {
  return useSWR(`/api/rubriclog/${rubricId}`, fetcher);
}