import { createLogger } from '@go2asia/logger';

import { type GatewayPrincipal } from '../middleware/auth';
import { readJsonObject } from '../middleware/http';
import {
  attachMedia,
  createPost,
  deletePost,
  detachMedia,
  getPost,
  repostPost,
} from '../services/spaceService';
import type { SpaceEventPublisher } from '../events/publisher';

type Env = {
  DATABASE_URL?: string;
  MEDIA_SERVICE_URL?: string;
  SPACE_MAX_MEDIA_ATTACHMENTS?: string;
  SPACE_MAX_TEXT_LENGTH?: string;
};

export async function handlePostsRoute(
  request: Request,
  env: Env,
  requestId: string,
  logger: ReturnType<typeof createLogger>,
  publisher: SpaceEventPublisher,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/space/posts' && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return createPost(env, body, principal, requestId, publisher);
  }

  const postMatch = path.match(/^\/v1\/space\/posts\/([^/]+)$/);
  if (postMatch && request.method === 'GET') {
    return getPost(env, decodeURIComponent(postMatch[1]), principal, requestId);
  }
  if (postMatch && request.method === 'DELETE' && principal) {
    return deletePost(env, decodeURIComponent(postMatch[1]), principal, requestId, publisher);
  }

  const repostMatch = path.match(/^\/v1\/space\/posts\/([^/]+)\/repost$/);
  if (repostMatch && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return repostPost(env, decodeURIComponent(repostMatch[1]), body, principal, requestId, publisher);
  }

  const attachMatch = path.match(/^\/v1\/space\/posts\/([^/]+)\/media$/);
  if (attachMatch && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    const gatewayAuthToken = request.headers.get('X-Gateway-Auth') ?? '';
    return attachMedia(
      env,
      decodeURIComponent(attachMatch[1]),
      body,
      principal,
      requestId,
      gatewayAuthToken,
      logger,
      publisher
    );
  }

  const detachMatch = path.match(/^\/v1\/space\/posts\/([^/]+)\/media\/([^/]+)$/);
  if (detachMatch && request.method === 'DELETE' && principal) {
    return detachMedia(
      env,
      decodeURIComponent(detachMatch[1]),
      decodeURIComponent(detachMatch[2]),
      principal,
      requestId,
      publisher
    );
  }

  return null;
}
