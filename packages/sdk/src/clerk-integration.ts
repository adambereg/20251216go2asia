/**
 * @go2asia/sdk/clerk-integration
 * 
 * Clerk authentication integration utilities.
 * 
 * This module provides integration between Clerk authentication and the SDK.
 * The setupClerkAuth function should be called from ClerkAuthSetup component
 * to enable automatic token injection into API requests.
 */

/**
 * Type for Clerk getToken function
 */
export type GetTokenFn = () => Promise<string | null>;

/**
 * Global variable to store the token getter function
 * This is set by setupClerkAuth() and used by mutator.ts
 */
let getTokenFn: GetTokenFn | null = null;

/**
 * Setup Clerk authentication for SDK
 * 
 * This function should be called from ClerkAuthSetup component
 * after Clerk is loaded and getToken is available.
 * 
 * @param getToken - Function to get Clerk JWT token
 */
export const setupClerkAuth = (getToken: GetTokenFn): void => {
  getTokenFn = getToken;
};

/**
 * Get authentication token
 * 
 * This function is used by mutator.ts to get the current user's token.
 * Returns null if no token is available (user not authenticated or setupClerkAuth not called).
 * 
 * @returns Promise resolving to JWT token or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  if (!getTokenFn) {
    return null;
  }
  
  try {
    return await getTokenFn();
  } catch (error) {
    // Silently fail if token retrieval fails
    // This allows public endpoints to work without auth
    return null;
  }
};

/**
 * Check if Clerk auth is set up
 * 
 * @returns true if setupClerkAuth has been called
 */
export const isClerkAuthSetup = (): boolean => {
  return getTokenFn !== null;
};



