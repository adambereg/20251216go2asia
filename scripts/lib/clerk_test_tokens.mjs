import process from 'node:process';

function required(name) {
  const value = (process.env[name] || '').trim();
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function baseApiUrl() {
  const raw = required('CLERK_INSTANCE_URL');
  const url = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  if (url.includes('/v1')) return url;
  return `${url}/v1`;
}

async function clerkRequest(path, init) {
  const secret = required('CLERK_SECRET_KEY');
  const url = `${baseApiUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    throw new Error(`Clerk API ${path} failed (${res.status}): ${text.slice(0, 240)}`);
  }
  return json;
}

async function mintForUser(userId) {
  const session = await clerkRequest('/sessions', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
  const sessionId = session?.id;
  if (!sessionId) throw new Error(`Session creation returned no id for user ${userId}`);

  const token = await clerkRequest(`/sessions/${sessionId}/tokens`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  const jwt = token?.jwt || token?.token;
  if (!jwt) throw new Error(`Token mint returned no jwt for user ${userId}`);
  return jwt;
}

export async function mintClerkJwtForUser(userId) {
  return mintForUser(userId);
}

export async function mintTestTokens() {
  const ownerUserId = required('CLERK_TEST_USER_OWNER');
  const altUserId = required('CLERK_TEST_USER_ALT');
  const [ownerJwt, altJwt] = await Promise.all([mintForUser(ownerUserId), mintForUser(altUserId)]);
  return { ownerJwt, altJwt };
}
