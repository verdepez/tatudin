// In-memory sliding window rate limiter
const rateLimitStores = new Map();

/**
 * Creates a rate limiting middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Max requests allowed per windowMs per IP/key
 * @param {string} options.message - Error message when rate limit is exceeded
 * @param {Function} [options.keyGenerator] - Custom key generator function
 */
export function createRateLimiter(options) {
  const {
    windowMs = 60 * 1000,
    max = 30,
    message = 'Demasiadas solicitudes. Por favor intente más tarde.',
    keyGenerator = (req) => {
      const forwarded = req.headers['x-forwarded-for'];
      return forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || '127.0.0.1');
    }
  } = options;

  return function rateLimiter(req, res, next) {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!rateLimitStores.has(key)) {
      rateLimitStores.set(key, []);
    }

    const timestamps = rateLimitStores.get(key);
    // Remove expired timestamps
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

    if (validTimestamps.length >= max) {
      const oldestValid = validTimestamps[0];
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldestValid)) / 1000);
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        error: message,
        retryAfter: retryAfterSeconds
      });
    }

    validTimestamps.push(now);
    rateLimitStores.set(key, validTimestamps);

    // Housekeeping: periodic cleanup if store gets large
    if (rateLimitStores.size > 10000) {
      for (const [k, v] of rateLimitStores.entries()) {
        if (v.every(ts => now - ts >= windowMs)) {
          rateLimitStores.delete(k);
        }
      }
    }

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - validTimestamps.length)));

    return next();
  };
}

// Predefined rate limiters
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: 'Demasiados intentos de inicio de sesión. Por seguridad, espera 15 minutos.'
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests
  message: 'Demasiadas solicitudes de recuperación de contraseña. Intenta en una hora.'
});

export const publicApiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Límite de solicitudes alcanzado. Por favor espera un momento.'
});

