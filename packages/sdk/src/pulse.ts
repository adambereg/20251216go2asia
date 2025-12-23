/**
 * @go2asia/sdk/pulse
 * 
 * Pulse/Events API hooks and functions.
 * This file provides React Query hooks for events operations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { ContentEventDto, ListResponse } from './content';

/**
 * Register event request parameters
 */
export interface RegisterEventParams {
  eventId: string;
}

/**
 * Register event response (minimal, actual response may vary)
 */
export interface RegisterEventResponse {
  success: boolean;
  message?: string;
}

/**
 * Register for an event
 * 
 * @returns React Query mutation hook for event registration
 */
export const useRegisterEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<RegisterEventResponse, Error, RegisterEventParams>({
    mutationFn: async ({ eventId }: RegisterEventParams) => {
      return customInstance<RegisterEventResponse>(
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
        `/v1/content/events/${eventId}/register`
      );
    },
    onSuccess: () => {
      // Invalidate balance query to refetch after registration
      queryClient.invalidateQueries({ queryKey: ['points', 'balance'] });
      // Invalidate transactions to show new transaction
      queryClient.invalidateQueries({ queryKey: ['points', 'transactions'] });
    },
  });
};

/**
 * Get events (placeholder for future use)
 * 
 * @param _params - Query parameters (placeholder)
 * @returns React Query hook (placeholder)
 */
export const useGetEvents = (_params?: any) => {
  const limit = typeof _params?.limit === 'number' ? _params.limit : 50;
  return useQuery<ListResponse<ContentEventDto>, Error>({
    queryKey: ['content', 'events', { limit }],
    queryFn: async () => {
      const endpoint = `/v1/content/events`;
      const qs = `?limit=${encodeURIComponent(String(limit))}`;
      try {
        const data = await customInstance<ListResponse<ContentEventDto>>({ method: 'GET' }, `${endpoint}${qs}`);
        if (!data?.items || data.items.length === 0) {
          // eslint-disable-next-line no-console
          console.warn(`FALLBACK_TO_MOCKS: reason=EMPTY endpoint=${endpoint}`);
        }
        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `FALLBACK_TO_MOCKS: reason=ERROR endpoint=${endpoint}`,
          err instanceof Error ? err.message : err
        );
        throw err as Error;
      }
    },
    staleTime: 30_000,
  });
};
