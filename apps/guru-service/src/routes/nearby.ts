import type { RequestContext } from '../middleware/context';
import { errorResponse, json } from '../middleware/http';
import { parseNearbyByTypeQuery, parseNearbyQuery, parseTypeParam, parseWhatToDoQuery } from '../query/nearbyQuery';
import { getNearbyResponse, getWhatToDoResponse } from '../services/nearbyService';

type Env = {
  RIELT_SERVICE_URL?: string;
  RF_SERVICE_URL?: string;
  QUEST_SERVICE_URL?: string;
  CONTENT_SERVICE_URL?: string;
};

export async function handleNearbyRoute(request: Request, env: Env, context: RequestContext): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/v1/guru/nearby' && request.method === 'GET') {
    const query = parseNearbyQuery(url.searchParams);
    if (!query) {
      return errorResponse('VALIDATION_ERROR', 'Invalid nearby query parameters', context.requestId, 400);
    }

    const response = await getNearbyResponse(query, env, context.requestId);
    return json(response);
  }

  const nearbyByTypeMatch = path.match(/^\/v1\/guru\/nearby\/([^/]+)$/);
  if (nearbyByTypeMatch && request.method === 'GET') {
    const type = parseTypeParam(decodeURIComponent(nearbyByTypeMatch[1] ?? ''));
    if (!type) {
      return errorResponse('VALIDATION_ERROR', 'Invalid nearby type', context.requestId, 400);
    }

    const query = parseNearbyByTypeQuery(url.searchParams, type);
    if (!query) {
      return errorResponse('VALIDATION_ERROR', 'Invalid nearby-by-type query parameters', context.requestId, 400);
    }

    const response = await getNearbyResponse(query, env, context.requestId);
    return json(response);
  }

  if (path === '/v1/guru/what-to-do' && request.method === 'GET') {
    const query = parseWhatToDoQuery(url.searchParams);
    if (!query) {
      return errorResponse('VALIDATION_ERROR', 'Invalid what-to-do query parameters', context.requestId, 400);
    }

    const response = await getWhatToDoResponse(query, env, context.requestId);
    return json(response);
  }

  return null;
}
