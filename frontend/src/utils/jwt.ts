// Decode JWT payload without verification (client-side only)
export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Check if token is expired (with optional buffer in seconds)
export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  const expirationTime = (payload.exp as number) * 1000;
  const now = Date.now() + bufferSeconds * 1000;
  return now >= expirationTime;
}

// Get token expiration date
export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJWT(token);
  if (!payload?.exp) return null;
  return new Date((payload.exp as number) * 1000);
}
