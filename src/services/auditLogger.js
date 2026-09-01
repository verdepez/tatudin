/**
 * Audit Logging Service
 * Records sensitive actions across the platform for compliance, security, and traceability.
 */

export async function logAuditEvent({
  pool,
  studioId = null,
  userId = null,
  action,
  entityType = null,
  entityId = null,
  details = null,
  req = null
}) {
  if (!pool) return null;

  try {
    let ipAddress = '127.0.0.1';
    let userAgent = 'system';

    if (req) {
      const forwarded = req.headers['x-forwarded-for'];
      ipAddress = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || '127.0.0.1');
      userAgent = req.headers['user-agent'] || 'unknown';
      if (!userId && req.user?.id) userId = req.user.id;
      if (!studioId && req.studioId) studioId = req.studioId;
    }

    const query = `
      INSERT INTO audit_logs (
        studio_id, user_id, action, entity_type, entity_id, details, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `;

    const res = await pool.query(query, [
      studioId ? Number(studioId) : null,
      userId ? Number(userId) : null,
      action,
      entityType,
      entityId ? Number(entityId) : null,
      details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent
    ]);

    return res.rows[0];
  } catch (err) {
    console.warn('[AUDIT LOG] Warning: Failed to record audit log event:', err.message);
    return null;
  }
}

