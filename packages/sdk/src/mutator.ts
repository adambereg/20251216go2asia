/**
 * Custom fetch instance for @go2asia/sdk
 * 
 * This mutator is used by Orval to generate SDK with custom fetch configuration.
 * 
 * Features:
 * - Base URL from NEXT_PUBLIC_API_URL (staging by default)
 * - X-Request-Id header on every request
 * - Clerk token integration via setupClerkAuth
 * - Unified error handling
 */

import { getAuthToken } from './clerk-integration';

interface FetchConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  [key: string]: unknown;
}

/**
 * Get base URL from environment variable
 * Defaults to staging gateway URL
 */
export function getBaseUrl(): string {
  // Client-side: use window.__NEXT_PUBLIC_API_URL__ or process.env
  if (typeof window !== 'undefined') {
    const windowApiUrl = (window as any).__NEXT_PUBLIC_API_URL__;
    if (windowApiUrl) return windowApiUrl;
    
    // Try to get from process.env (Next.js injects NEXT_PUBLIC_* vars)
    const envApiUrl = (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL;
    if (envApiUrl) return envApiUrl;
  }
  
  // Server-side or client-side fallback
  // Use globalThis.process to avoid TypeScript errors
  const envApiUrl = (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL;
  return (
    envApiUrl ||
    'https://go2asia-api-gateway-staging.fred89059599296.workers.dev'
  );
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  // Use crypto.randomUUID if available (browser/Node 18+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older environments
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Custom fetch instance with base URL, headers, and auth
 */
export const customInstance = async <T>(
  config: FetchConfig,
  url: string
): Promise<T> => {
  // Get base URL
  const baseUrl = getBaseUrl();
  
  // Build full URL (if url already contains domain, use it; otherwise prepend baseUrl)
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Generate request ID
  const requestId = generateRequestId();
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Id': requestId,
    ...config.headers,
  };
  
  // Add Authorization header if token is available
  try {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    // Silently fail if token retrieval fails (user might not be authenticated)
    // This allows public endpoints to work without auth
  }
  
  // Execute request
  const response = await globalThis.fetch(fullUrl, {
    ...config,
    headers,
  });
  
  // Handle errors
  if (!response.ok) {
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, create error object
      errorData = {
        error: {
          code: 'UNKNOWN_ERROR',
          message: response.statusText,
        },
        status: response.status,
        requestId,
      };
    }

    // Normalize backend error shapes.
    // Some downstream services respond as:
    //   { error: "BadRequest", message: "...", requestId: "..." }
    // while UI expects:
    //   { error: { code, message }, requestId }
    //
    // Keep backward-compatible fields, but ensure error is an object.
    if (errorData && typeof errorData === 'object') {
      if (typeof (errorData as any).error === 'string') {
        const code = (errorData as any).error;
        const message = (errorData as any).message || response.statusText;
        (errorData as any).error = { code, message };
      }
    }
    
    // Add status and requestId to error for better error handling in UI
    const error = {
      ...errorData,
      status: response.status,
      requestId,
    };
    
    throw error;
  }
  
  return response.json();
};

