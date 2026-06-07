/**
 * Auth Cookie Utilities
 * ---------------------
 * Syncs the JWT stored in localStorage with an httpOnly cookie so that
 * Next.js Edge Middleware can gate protected routes server-side (middleware
 * cannot access localStorage).
 *
 * Cookie name: __session_token
 * Flags: HttpOnly, Secure, SameSite=Lax, Max-Age=604800 (7 days)
 */

/** Persist JWT as an httpOnly session cookie via the API route. */
export async function setAuthCookie(token: string): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    // Non-blocking — the cookie is a defense-in-depth layer.
    // If this fails, the client-side AuthGuard still protects.
    console.error('[auth-cookies] Failed to set session cookie:', err);
  }
}

/** Clear the httpOnly session cookie via the API route. */
export async function removeAuthCookie(): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('[auth-cookies] Failed to clear session cookie:', err);
  }
}
