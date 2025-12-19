/**
 * @go2asia/sdk/pulse
 * 
 * Pulse/Events API hooks and functions.
 * This file provides React Query hooks for events operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customInstance } from './mutator';

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
  // Placeholder - will be implemented when API is available
  return {
    data: undefined,
    isLoading: false,
    error: null,
  };
};
