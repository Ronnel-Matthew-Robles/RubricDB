import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useRubrics() {
  return useSWR(`/api/rubric`, fetcher);
}

export function usePublishedRubrics() {
  return useSWR(`/api/rubric/published`, fetcher);
}

export function useUnpublishedRubrics() {
  return useSWR(`/api/rubric/unpublished`, fetcher);
}