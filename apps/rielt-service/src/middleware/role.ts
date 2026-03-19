import type { GatewayPrincipal } from './auth';
import { errorResponse } from './http';

export function hasAnyRole(principal: GatewayPrincipal | null, allowedRoles: string[]): boolean {
  if (!principal) return false;
  if (allowedRoles.length === 0) return true;
  return principal.roles.some((role) => allowedRoles.includes(role));
}

export function requireAnyRole(
  principal: GatewayPrincipal | null,
  allowedRoles: string[],
  requestId: string
): { ok: true } | { ok: false; res: Response } {
  if (hasAnyRole(principal, allowedRoles)) return { ok: true };
  return { ok: false, res: errorResponse('FORBIDDEN', 'Insufficient role', requestId, 403) };
}
