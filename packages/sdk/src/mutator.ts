/**
 * Custom fetch instance for @go2asia/sdk
 * 
 * This mutator is used by Orval to generate SDK with custom fetch configuration.
 */

interface FetchConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  [key: string]: unknown;
}

export const customInstance = async <T>(
  config: FetchConfig,
  url: string
): Promise<T> => {
  const response = await globalThis.fetch(url, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: {
        code: 'UNKNOWN_ERROR',
        message: response.statusText,
      },
    }));
    throw error;
  }

  return response.json();
};

