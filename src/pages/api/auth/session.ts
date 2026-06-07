import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/auth/session  — Set the session cookie
 * DELETE /api/auth/session — Clear the session cookie
 *
 * Cookie config:
 *   Name:     __session_token
 *   HttpOnly: true  (inaccessible to JS — XSS-proof)
 *   Secure:   true  (HTTPS only in production)
 *   SameSite: Lax   (CSRF protection while allowing top-level navigations)
 *   Max-Age:  604800 (7 days)
 *   Path:     /
 */

const COOKIE_NAME = '__session_token';
const MAX_AGE = 604800; // 7 days in seconds

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid token.' });
    }

    // Build Set-Cookie header with all security flags
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieParts = [
      `${COOKIE_NAME}=${token}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${MAX_AGE}`,
    ];

    if (isProduction) {
      cookieParts.push('Secure');
    }

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    // Expire the cookie immediately
    const cookieParts = [
      `${COOKIE_NAME}=`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=0`,
    ];

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    return res.status(200).json({ ok: true });
  }

  // Method not allowed
  res.setHeader('Allow', 'POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
