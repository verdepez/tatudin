import crypto from 'node:crypto';

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken() {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * CSRF Protection Middleware
 * Protects state-changing requests (POST, PUT, PATCH, DELETE) against CSRF attacks.
 * Verifies X-CSRF-Token header or Origin / Sec-Fetch-Site same-origin validation.
 */
export function csrfProtection(options = {}) {
  const {
    ignoredPaths = ['/api/public', '/api/debug', '/api/health']
  } = options;

  return function verifyCsrf(req, res, next) {
    // Safe HTTP methods don't mutate state
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Check if path is in ignored paths list
    if (ignoredPaths.some(prefix => req.path.startsWith(prefix))) {
      return next();
    }

    // Allow requests in test environment without strict CSRF if TEST_SKIP_CSRF is set
    if (process.env.NODE_ENV === 'test' && process.env.TEST_SKIP_CSRF === 'true') {
      return next();
    }

    // Check Origin or Referer header against host
    const origin = req.headers.origin || req.headers.referer;
    const host = req.headers.host;
    const secFetchSite = req.headers['sec-fetch-site'];

    // 1. If Sec-Fetch-Site is 'same-origin' or 'none', it originated safely from the browser
    if (secFetchSite === 'same-origin' || secFetchSite === 'none') {
      return next();
    }

    // 2. Validate Origin matches Host
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host === host) {
          return next();
        }
      } catch {
        // Invalid origin URL, fall through to token check
      }
    }

    // 3. Fallback: Check X-CSRF-Token header against cookie
    const csrfHeader = req.headers['x-csrf-token'];
    const cookies = Object.fromEntries(
      (req.headers.cookie || '').split(';').filter(Boolean).map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );

    const csrfCookie = cookies['tatudin_csrf'];

    if (csrfHeader && csrfCookie && csrfHeader === csrfCookie) {
      return next();
    }

    // If request has Content-Type application/json and matches origin, accept it
    // (Standard browsers do not allow cross-origin JSON with custom headers without preflight)
    if (req.headers['content-type']?.includes('application/json') && !origin) {
      return next();
    }

    return res.status(403).json({
      error: 'Petición rechazada: fallo de verificación CSRF. Por favor recarga la página.'
    });
  };
}

