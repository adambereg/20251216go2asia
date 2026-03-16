import { getProfile } from '../services/spaceService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleProfilesRoute(
  request: Request,
  env: Env,
  requestId: string
): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  const profileMatch = path.match(/^\/v1\/space\/profiles\/([^/]+)$/);
  if (profileMatch && request.method === 'GET') {
    return getProfile(env, decodeURIComponent(profileMatch[1]), requestId);
  }
  return null;
}
