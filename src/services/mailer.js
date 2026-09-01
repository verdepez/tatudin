/**
 * Mailer service for Tatudin
 * Supports transactional emails with environment configuration and robust development fallbacks.
 */

export async function sendPasswordResetEmail({ to, resetUrl, userName = 'Artista' }) {
  const from = process.env.SMTP_FROM || 'Tatudin <no-reply@tatudin.cl>';
  const subject = 'Recuperación de contraseña - Tatudin';
  const textBody = `Hola ${userName},\n\nRecibimos una solicitud para restablecer tu contraseña en Tatudin.\n\nHaz clic en el siguiente enlace para crear una nueva contraseña:\n${resetUrl}\n\nEste enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.\n\nEl equipo de Tatudin`;

  const htmlBody = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c071d; color: #f3f0ff; padding: 40px 20px; text-align: center;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #171033; border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="margin-bottom: 24px;">
          <h1 style="color: #7c3aed; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">tatudin</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Espacio seguro para artistas y estudios</p>
        </div>
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #ffffff;">Recuperación de contraseña</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; text-align: left; margin-bottom: 24px;">
          Hola <strong style="color: #ffffff;">${userName}</strong>,<br><br>
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en Tatudin. Haz clic en el botón a continuación para crear tu nueva clave de acceso:
        </p>
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            Restablecer mi contraseña
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; text-align: left; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          Este enlace es válido por <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje; tu cuenta sigue estando protegida.
        </p>
      </div>
    </div>
  `;

  // 1. If Resend API Key is set
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text: textBody,
          html: htmlBody
        })
      });
      if (res.ok) {
        console.log(`[MAILER] Password reset email sent via Resend to ${to}`);
        return { ok: true, provider: 'resend' };
      }
    } catch (err) {
      console.warn('[MAILER] Failed sending email via Resend:', err.message);
    }
  }

  // 2. Development / Testing Fallback: Log to terminal
  console.log(`
=====================================================
[MAILER DEV SIMULATOR]
To: ${to}
Subject: ${subject}
Reset Link: ${resetUrl}
=====================================================
  `);

  return { ok: true, provider: 'dev-simulator', resetUrl };
}

