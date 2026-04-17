import type { GatewayPrincipal } from '../middleware/auth';
import { readJsonObject } from '../middleware/http';
import {
  createTrip,
  createTripItem,
  createTripNote,
  createTripTask,
  getTripDetail,
  patchTripItem,
  listTrips,
  patchTripTask,
  removeTripItem,
} from '../services/organizerService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleTripsRoute(
  request: Request,
  env: Env,
  requestId: string,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  if (!principal) return null;

  const path = new URL(request.url).pathname;

  if (path === '/v1/organizer/trips' && request.method === 'GET') {
    return listTrips(env, principal, requestId);
  }

  if (path === '/v1/organizer/trips' && request.method === 'POST') {
    const body = await readJsonObject(request);
    return createTrip(env, body, principal, requestId);
  }

  const tripMatch = path.match(/^\/v1\/organizer\/trips\/([^/]+)$/);
  if (tripMatch && request.method === 'GET') {
    return getTripDetail(env, principal, decodeURIComponent(tripMatch[1]), requestId);
  }

  const itemMatch = path.match(/^\/v1\/organizer\/trips\/([^/]+)\/items$/);
  if (itemMatch && request.method === 'POST') {
    const body = await readJsonObject(request);
    return createTripItem(env, principal, decodeURIComponent(itemMatch[1]), body, requestId);
  }

  const itemDeleteMatch = path.match(/^\/v1\/organizer\/trips\/([^/]+)\/items\/([^/]+)$/);
  if (itemDeleteMatch && request.method === 'DELETE') {
    return removeTripItem(env, principal, decodeURIComponent(itemDeleteMatch[1]), decodeURIComponent(itemDeleteMatch[2]), requestId);
  }

  if (itemDeleteMatch && request.method === 'PATCH') {
    const body = await readJsonObject(request);
    return patchTripItem(
      env,
      principal,
      decodeURIComponent(itemDeleteMatch[1]),
      decodeURIComponent(itemDeleteMatch[2]),
      body,
      requestId
    );
  }

  const taskMatch = path.match(/^\/v1\/organizer\/trips\/([^/]+)\/tasks$/);
  if (taskMatch && request.method === 'POST') {
    const body = await readJsonObject(request);
    return createTripTask(env, principal, decodeURIComponent(taskMatch[1]), body, requestId);
  }

  const taskPatchMatch = path.match(/^\/v1\/organizer\/trips\/([^/]+)\/tasks\/([^/]+)$/);
  if (taskPatchMatch && request.method === 'PATCH') {
    const body = await readJsonObject(request);
    return patchTripTask(
      env,
      principal,
      decodeURIComponent(taskPatchMatch[1]),
      decodeURIComponent(taskPatchMatch[2]),
      body,
      requestId
    );
  }

  const noteMatch = path.match(/^\/v1\/organizer\/trips\/([^/]+)\/notes$/);
  if (noteMatch && request.method === 'POST') {
    const body = await readJsonObject(request);
    return createTripNote(env, principal, decodeURIComponent(noteMatch[1]), body, requestId);
  }

  return null;
}
