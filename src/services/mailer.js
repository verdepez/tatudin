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

/**
 * Send booking confirmation email with full pre-session considerations
 */
export async function sendAppointmentConfirmationEmail({
  to,
  clientName = 'Cliente',
  artistName = 'Tu Artista',
  studioName = 'Tatudin Studio',
  startsAt,
  durationMinutes = 120,
  title = 'Sesión de Tatuaje',
  notes = '',
  deposit = 0
}) {
  const from = process.env.SMTP_FROM || 'Tatudin <no-reply@tatudin.cl>';
  const subject = `¡Cita Confirmada! - ${title} con ${artistName} en ${studioName}`;

  const dateObj = new Date(startsAt);
  const formattedDate = dateObj.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = dateObj.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const textBody = `Hola ${clientName},\n\nTu cita para "${title}" con ${artistName} en ${studioName} ha sido confirmada exitosamente.\n\n` +
    `DETALLES DE LA CITA:\n` +
    `- Fecha: ${formattedDate}\n` +
    `- Hora: ${formattedTime}\n` +
    `- Duración estimada: ${durationMinutes} min\n` +
    (deposit > 0 ? `- Seña registrada: $${Number(deposit).toLocaleString('es-CL')}\n` : '') +
    (notes ? `- Indicaciones: ${notes}\n\n` : '\n') +
    `CONSIDERACIONES Y CUIDADOS PREVIOS A TU SESIÓN:\n` +
    `1. Descansa bien: Duerme al menos 7-8 horas la noche anterior.\n` +
    `2. Alimentación: Come una comida completa 1 a 2 horas antes de tu sesión para mantener tus niveles de glucosa estables.\n` +
    `3. Hidratación: Bebe abundante agua los días previos y el día de la cita.\n` +
    `4. Restricciones: NO consumas alcohol, drogas ni anticoagulantes (como aspirina) 24 horas antes.\n` +
    `5. Vestimenta: Usa ropa cómoda y oscura que permita acceder fácilmente a la zona a tatuar.\n` +
    `6. Piel sana: Evita exponerte al sol o broncearte antes de la sesión. La piel no debe estar irritada.\n\n` +
    `¡Te esperamos en ${studioName}!`;

  const htmlBody = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c071d; color: #f3f0ff; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #171033; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #7c3aed; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">tatudin</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Confirmación Oficial de Cita</p>
        </div>

        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <h2 style="color: #10b981; font-size: 18px; margin: 0 0 6px 0;">✓ Cita confirmada</h2>
          <p style="margin: 0; color: #e2e8f0; font-size: 14px;">Hola <strong>${clientName}</strong>, tu espacio en <strong>${studioName}</strong> está reservado.</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.5px;">Detalles de la sesión</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Motivo:</strong> ${title}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Artista:</strong> ${artistName}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Fecha:</strong> ${formattedDate}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Hora:</strong> ${formattedTime} hrs (${durationMinutes} min aprox.)</p>
          ${deposit > 0 ? `<p style="margin: 6px 0; font-size: 14px; color: #34d399;"><strong>Seña abonada:</strong> $${Number(deposit).toLocaleString('es-CL')}</p>` : ''}
          ${notes ? `<p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;"><strong>Detalles acordados:</strong> ${notes}</p>` : ''}
        </div>

        <div style="border-left: 3px solid #7c3aed; padding-left: 16px; margin-bottom: 28px;">
          <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #ffffff;">📋 Consideraciones previas a tu cita:</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.6; color: #cbd5e1;">
            <li><strong>Descanso:</strong> Duerme al menos 7-8 horas la noche anterior.</li>
            <li><strong>Alimentación:</strong> Come una buena comida 1-2 horas antes para mantener tu energía.</li>
            <li><strong>Hidratación:</strong> Bebe agua suficiente los días previos.</li>
            <li><strong>Cero alcohol y aspirinas:</strong> No consumas alcohol ni anticoagulantes 24h antes.</li>
            <li><strong>Ropa cómoda:</strong> Usa prendas cómodas y oscuras que faciliten acceso a la zona.</li>
            <li><strong>Piel sana:</strong> Evita el sol y la irritación previa en la piel.</li>
          </ul>
        </div>

        <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          Tatudin · Gestión profesional y segura para estudios de tatuaje.
        </p>
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to: [to], subject, text: textBody, html: htmlBody })
      });
      if (res.ok) {
        console.log(`[MAILER] Appointment confirmation email sent to ${to}`);
        return { ok: true, provider: 'resend' };
      }
    } catch (err) {
      console.warn('[MAILER] Confirmation email via Resend failed:', err.message);
    }
  }

  console.log(`
=====================================================
[MAILER DEV SIMULATOR - CONFIRMACIÓN DE CITA]
To: ${to}
Subject: ${subject}
Date: ${formattedDate} ${formattedTime}
Artist: ${artistName} - Studio: ${studioName}
=====================================================
  `);

  return { ok: true, provider: 'dev-simulator' };
}

/**
 * Send post-care and loyalty email (scheduled for 3 business days after completed appointment)
 */
export async function sendLoyaltyAndAftercareEmail({
  to,
  clientName = 'Cliente',
  artistName = 'Tu Artista',
  studioName = 'Tatudin Studio',
  title = 'Tatuaje'
}) {
  const from = process.env.SMTP_FROM || 'Tatudin <no-reply@tatudin.cl>';
  const subject = `¿Cómo va la cicatrización de tu ${title}? ✨ Seguimiento y Cuidados - ${studioName}`;

  const textBody = `Hola ${clientName},\n\n` +
    `Han pasado unos días desde tu sesión de "${title}" con ${artistName} en ${studioName}.\n` +
    `Queremos saber cómo estás y asegurarnos de que tu tatuaje esté cicatrizando de forma perfecta.\n\n` +
    `RECORDATORIO DE CUIDADOS EN ESTA ETAPA (Día 3 a 7):\n` +
    `- Tu piel puede empezar a sentirse tirante o pelarse suavemente. ¡Es completamente normal!\n` +
    `- Lava 2 a 3 veces al día con agua tibia y jabón neutro sin frotar con toallas ásperas.\n` +
    `- Aplica una capa muy fina de crema cicatrizante recomendada.\n` +
    `- NO arranques ninguna costra ni te rasques.\n` +
    `- Evita sumergirte en piscinas, tinajas, saunas o mar durante al menos 2 semanas.\n` +
    `- Cero exposición directa al sol.\n\n` +
    `REVISIÓN Y PRÓXIMA SESIÓN:\n` +
    `Si tienes cualquier duda sobre cómo evoluciona la piel, puedes responder este correo o escribirle a ${artistName}.\n` +
    `¡Nos encantaría ver el resultado! Etiqueta a @${studioName.toLowerCase().replace(/\\s+/g, '')} en tus historias de Instagram.\n\n` +
    `Además, como cliente especial tienes beneficios preferentes para tu próxima pieza.\n\n` +
    `Con cariño,\nEl equipo de ${studioName}`;

  const htmlBody = `
    <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c071d; color: #f3f0ff; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #171033; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #7c3aed; font-size: 28px; margin: 0; font-weight: 800;">tatudin</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Seguimiento Post-Sesión & Cuidados</p>
        </div>

        <h2 style="font-size: 20px; color: #ffffff; margin-bottom: 12px; text-align: center;">¿Cómo va tu ${title}? ✨</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Hola <strong style="color: #ffffff;">${clientName}</strong>,<br><br>
          Esperamos que estés disfrutando tu nueva pieza hecha por <strong>${artistName}</strong> en <strong>${studioName}</strong>. 
          En esta etapa de cicatrización (primeros días hábiles), la piel inicia su regeneración natural.
        </p>

        <div style="background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #c4b5fd;">🛡️ Claves de cuidado para esta semana:</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.6; color: #e2e8f0;">
            <li><strong>Higiene suave:</strong> Lava 2-3 veces al día con agua tibia y jabón neutro.</li>
            <li><strong>Humectación justa:</strong> Aplica una capa muy fina de crema; no satures la piel.</li>
            <li><strong>No rascar:</strong> Si pica o se descama, no quites cáscaras.</li>
            <li><strong>Cero inmersión:</strong> No entres a piscinas, tinajas, saunas ni al mar por 15 días.</li>
            <li><strong>Protección solar:</strong> No expongas el tatuaje fresco al sol directo.</li>
          </ul>
        </div>

        <div style="background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #ffffff;">¿Pensando en tu próxima sesión?</h3>
          <p style="color: #94a3b8; font-size: 13.5px; margin: 0 0 16px 0;">Como cliente de la casa, tienes prioridad de agenda para tu próximo proyecto o retoque.</p>
          <p style="margin: 0; font-size: 14px; color: #a78bfa;">
            Escríbenos o comparte tu foto etiquetando a tu artista <strong>${artistName}</strong>.
          </p>
        </div>

        <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          Enviado con dedicación por ${studioName} vía Tatudin.
        </p>
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to: [to], subject, text: textBody, html: htmlBody })
      });
      if (res.ok) {
        console.log(`[MAILER] Loyalty/aftercare email sent to ${to}`);
        return { ok: true, provider: 'resend' };
      }
    } catch (err) {
      console.warn('[MAILER] Loyalty email via Resend failed:', err.message);
    }
  }

  console.log(`
=====================================================
[MAILER DEV SIMULATOR - FIDELIZACIÓN Y CUIDADOS POST-CITA]
To: ${to}
Subject: ${subject}
Client: ${clientName} - Artist: ${artistName}
=====================================================
  `);

  return { ok: true, provider: 'dev-simulator' };
}

