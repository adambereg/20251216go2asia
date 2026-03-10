type JwtPayload = Record<string, unknown>;

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function signHs256Jwt(payload: JwtPayload, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  const signatureB64 = Buffer.from(signature)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

export async function makeUserJwt(
  secret: string,
  overrides: JwtPayload = {}
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return signHs256Jwt(
    {
      sub: 'user_test_1',
      iat: now,
      exp: now + 300,
      ...overrides,
    },
    secret
  );
}

export async function makeGatewayJwt(
  secret: string,
  overrides: JwtPayload = {}
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return signHs256Jwt(
    {
      iss: 'api-gateway',
      aud: 'downstream',
      sub: 'api-gateway',
      iat: now,
      exp: now + 300,
      ...overrides,
    },
    secret
  );
}

export async function makeServiceJwt(
  secret: string,
  audience: string,
  overrides: JwtPayload = {}
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return signHs256Jwt(
    {
      iss: 'go2asia-service-auth',
      aud: audience,
      sub: 'test-service',
      iat: now,
      exp: now + 300,
      ...overrides,
    },
    secret
  );
}

export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
