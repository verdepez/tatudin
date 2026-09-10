import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/server.js';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

test.before(async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
});

let cookieHeader = '';
let currentStudioId = null;

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    cookieHeader = setCookie.split(';')[0];
  }

  let data = null;
  const text = await response.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, data, headers: response.headers };
}

test('Public Booking Flow: Setup artist and studio', async () => {
  const uniqueEmail = `artist_link_${Date.now()}@tatudintest.com`;
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Tatuador Pro',
      email: uniqueEmail,
      password: 'password123',
      studioName: 'Estudio Enlaces'
    })
  });
  assert.equal(res.status, 201);
  currentStudioId = res.data.user.studio_id;
  assert.ok(currentStudioId);
});

test('Public Booking Flow: Generate appointment link with 2-views limit and custom expiration', async () => {
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  const res = await request('/api/appointments/generate-link', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Tatuaje Dragón Oriental',
      startsAt: tomorrow,
      durationMinutes: 180,
      price: 150000,
      deposit: 30000,
      notes: 'Traer diseño de referencia impreso',
      tokenDurationHours: 12
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.token);
  assert.ok(res.data.shareUrl);
  assert.equal(res.data.maxViews, 2);
  assert.ok(res.data.whatsappShareText.includes('Tatuaje Dragón Oriental'));

  const token = res.data.token;

  // First opening: should succeed (view 1 of 2)
  const view1 = await request(`/api/public/booking-token/${token}`);
  assert.equal(view1.status, 200);
  assert.equal(view1.data.tokenViewsCount, 1);
  assert.equal(view1.data.title, 'Tatuaje Dragón Oriental');

  // Second opening: should succeed (view 2 of 2)
  const view2 = await request(`/api/public/booking-token/${token}`);
  assert.equal(view2.status, 200);
  assert.equal(view2.data.tokenViewsCount, 2);

  // Third opening: must be blocked with 403 MAX_VIEWS_REACHED
  const view3 = await request(`/api/public/booking-token/${token}`);
  assert.equal(view3.status, 403);
  assert.equal(view3.data.code, 'MAX_VIEWS_REACHED');
});

test('Public Booking Flow: Confirm appointment with valid client and RUT', async () => {
  const nextWeek = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  const genRes = await request('/api/appointments/generate-link', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Manga Completa Sesión 1',
      startsAt: nextWeek,
      durationMinutes: 240,
      price: 200000,
      deposit: 50000,
      notes: 'Sesión de líneas principales',
      tokenDurationHours: 24
    })
  });

  assert.equal(genRes.status, 201);
  const token = genRes.data.token;

  // Attempt confirmation with invalid RUT: must be rejected
  const badRutRes = await request(`/api/public/booking-token/${token}/confirm`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Carlos',
      lastName: 'Santana',
      rut: '11.111.111-9',
      hasNoRut: false,
      phone: '+56 9 8888 7777',
      email: 'carlos@santana.cl',
      acceptTerms: true
    })
  });
  assert.equal(badRutRes.status, 400);
  assert.ok(badRutRes.data.error.includes('RUT'));

  // Attempt confirmation with hasNoRut: true (foreign client) -> must succeed!
  const okConfirm = await request(`/api/public/booking-token/${token}/confirm`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Carlos',
      lastName: 'Santana',
      rut: '',
      hasNoRut: true,
      phone: '+56 9 8888 7777',
      email: 'carlos@santana.cl',
      clientNotes: 'Piel sensible en antebrazo',
      acceptTerms: true
    })
  });

  assert.equal(okConfirm.status, 200);
  assert.equal(okConfirm.data.ok, true);
  assert.equal(okConfirm.data.appointment.status, 'confirmed');
  assert.ok(okConfirm.data.appointment.terms_accepted_at);

  const confirmedApptId = okConfirm.data.appointment.id;

  // Process due automations while appointment is NOT completed -> must cancel or not send
  const procRes = await request('/api/automations/process-due', { method: 'POST' });
  assert.equal(procRes.status, 200);

  // Now mark appointment as completed:
  const patchRes = await request(`/api/appointments/${confirmedApptId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'completed' })
  });
  assert.equal(patchRes.status, 200);
  assert.equal(patchRes.data.status, 'completed');
});

test('External Calendars: List and handle endpoints', async () => {
  const listRes = await request('/api/calendar/external');
  assert.equal(listRes.status, 200);
  assert.ok(Array.isArray(listRes.data));
});

test('Public Booking Flow: Propose multiple slot options and client selects option 2', async () => {
  const slot1 = new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString();
  const slot2 = new Date(Date.now() + 11 * 24 * 3600 * 1000).toISOString();

  const genRes = await request('/api/appointments/generate-link', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Tatuaje Fineline Geométrico',
      startsAt: slot1,
      durationMinutes: 90,
      price: 80000,
      deposit: 20000,
      notes: 'Por favor elegir el día que más les acomode',
      tokenDurationHours: 48,
      proposedSlots: [
        { index: 0, startsAt: slot1, durationMinutes: 90 },
        { index: 1, startsAt: slot2, durationMinutes: 120 }
      ],
      isMultiSession: false
    })
  });

  assert.equal(genRes.status, 201);
  const token = genRes.data.token;
  assert.ok(token);

  // Fetch token info
  const viewRes = await request(`/api/public/booking-token/${token}`);
  assert.equal(viewRes.status, 200);
  assert.equal(viewRes.data.proposedSlots.length, 2);
  assert.equal(viewRes.data.isMultiSession, false);

  // Client confirms selecting slot option 1 (slot2)
  const confirmRes = await request(`/api/public/booking-token/${token}/confirm`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Sofía',
      lastName: 'Valenzuela',
      rut: '18.123.456-7',
      hasNoRut: true,
      phone: '+56 9 5555 4444',
      email: 'sofia@valenzuela.cl',
      acceptTerms: true,
      selectedSlotIndex: 1
    })
  });

  assert.equal(confirmRes.status, 200);
  assert.equal(confirmRes.data.ok, true);
  assert.equal(confirmRes.data.appointment.selected_slot_index, 1);
  // Ensure the appointment's final starts_at matches slot2
  assert.equal(new Date(confirmRes.data.appointment.starts_at).getTime(), new Date(slot2).getTime());
  assert.equal(confirmRes.data.appointment.duration_minutes, 120);

  // Verify that querying the appointment includes the client's last name in client_name
  const apptRes = await request(`/api/appointments/${confirmRes.data.appointment.id}`);
  assert.equal(apptRes.status, 200);
  assert.equal(apptRes.data.client_name, 'Sofía Valenzuela');
  assert.equal(apptRes.data.client_last_name, 'Valenzuela');
});

test.after(() => {
  setTimeout(() => process.exit(0), 100);
});
