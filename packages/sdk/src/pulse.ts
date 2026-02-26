/**
 * @go2asia/sdk/pulse
 * 
 * Pulse/Events API hooks and functions.
 * This file provides React Query hooks for events operations.
 */

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customInstance } from './mutator';
import { listEvents } from './content';
import type { ContentEventDto, ListEventsParams, ListResponse } from './content';

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
 * Get events (public)
 *
 * @param _params - Query parameters (filters + pagination)
 * @returns React Query hook for events list
 */
export const useGetEvents = (_params?: (ListEventsParams & { enabled?: boolean })) => {
  const enabled = typeof _params?.enabled === 'boolean' ? _params.enabled : true;
  const anyParams = (_params ?? {}) as any;
  const params: ListEventsParams = {
    ...anyParams,
    dateFrom: anyParams?.dateFrom ?? anyParams?.date_from,
    dateTo: anyParams?.dateTo ?? anyParams?.date_to,
  };
  delete (params as any).enabled;
  delete (params as any).date_from;
  delete (params as any).date_to;

  return useQuery<ListResponse<ContentEventDto>, Error>({
    queryKey: ['content', 'events', params],
    enabled,
    queryFn: async () => {
      return await listEvents(params);
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
