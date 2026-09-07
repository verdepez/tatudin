import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/server.js';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

let cookieHeader = '';
let currentStudioId = null;

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-test-suite': 'tatudin',
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

test('Roles & Flujos: Independent Studio Setup & account_type in /api/auth/me', async () => {
  const uniqueEmail = `indep_${Date.now()}@tatudintest.com`;
  const regRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Artista Independiente Test',
      email: uniqueEmail,
      password: 'password123',
      studioName: 'Estudio Privado',
      accountType: 'independent'
    })
  });

  assert.ok([200, 201].includes(regRes.status));
  assert.ok(regRes.data.user);

  const meRes = await request('/api/auth/me');
  assert.equal(meRes.status, 200);
  assert.equal(meRes.data.user.account_type, 'independent');
  currentStudioId = meRes.data.user.active_studio_id || meRes.data.user.studio_id;
});

test('Roles & Flujos: Managed artist without app access cannot log in (403 Forbidden)', async () => {
  // Studio owner registers a managed artist without interactive app access
  const managedEmail = `artist_managed_${Date.now()}@tatudintest.com`;
  const addRes = await request('/api/members', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Artista Sin Cuenta',
      email: managedEmail,
      role: 'resident',
      commissionPercent: 70.0,
      hasAppAccess: false
    })
  });

  assert.equal(addRes.status, 201);
  assert.ok(addRes.data.id);
  const artistId = addRes.data.id;

  // Attempt login with managed artist credentials
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-test-suite': 'tatudin' },
    body: JSON.stringify({
      email: managedEmail,
      password: 'tatudin123'
    })
  });

  assert.equal(loginRes.status, 403);
  const loginData = await loginRes.json();
  assert.match(loginData.error, /no (cuenta|tiene habilitado).*acceso interactivo/i);
});

test('Roles & Flujos: Guest spot approval sets has_app_access=false and denies interactive login', async () => {
  const guestEmail = `guest_spot_${Date.now()}@tatudintest.com`;
  
  // Submit public guest spot request
  const pubRes = await request('/api/public/guest-spots', {
    method: 'POST',
    body: JSON.stringify({
      studioId: currentStudioId,
      artistName: 'Guest Nomad Tatuador',
      artistEmail: guestEmail,
      artistInstagram: '@guest_nomad',
      startDate: '2026-12-01',
      endDate: '2026-12-10',
      notes: 'Estadía de 10 días'
    })
  });
  assert.ok([200, 201].includes(pubRes.status));
  const guestRequestId = pubRes.data.id;

  // Approve guest spot as Studio Owner
  const approveRes = await request(`/api/guest-spots/${guestRequestId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'approved' })
  });
  assert.equal(approveRes.status, 200);

  // Attempt login as guest
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-test-suite': 'tatudin' },
    body: JSON.stringify({
      email: guestEmail,
      password: 'tatudin123'
    })
  });
  assert.equal(loginRes.status, 403);
  const loginData = await loginRes.json();
  assert.match(loginData.error, /no (cuenta|tiene habilitado).*acceso interactivo/i);
});

test('Roles & Flujos: Appointment notification generation for artist', async () => {
  // Add a managed artist
  const artistEmail = `artist_notif_${Date.now()}@tatudintest.com`;
  const addRes = await request('/api/members', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Artista Notificable',
      email: artistEmail,
      role: 'resident',
      commissionPercent: 65.0
    })
  });
  assert.equal(addRes.status, 201);
  const artistId = addRes.data.id;

  // Book appointment for that artist
  const apptRes = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      artistId,
      title: 'Tatuaje Fineline Notificación',
      startsAt: '2026-12-15T15:00:00Z',
      durationMinutes: 120,
      price: 80000,
      deposit: 20000,
      notes: 'Diseño botánico brazo'
    })
  });

  assert.equal(apptRes.status, 201);
  assert.ok(apptRes.data.notification);
  assert.equal(apptRes.data.notification.artistName, 'Artista Notificable');
  assert.match(apptRes.data.notification.text, /Tatuaje Fineline Notificación/);
  assert.match(apptRes.data.notification.text, /80\.000/);
});

test('Roles & Flujos: Settlement generation produces WhatsApp/Email formatted message', async () => {
  const artistEmail = `artist_settle_${Date.now()}@tatudintest.com`;
  const addRes = await request('/api/members', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Artista Para Liquidar',
      email: artistEmail,
      role: 'resident',
      commissionPercent: 70.0
    })
  });
  assert.equal(addRes.status, 201);
  const artistId = addRes.data.id;

  const settleRes = await request('/api/finances/settle', {
    method: 'POST',
    body: JSON.stringify({
      artistId,
      amount: 150000,
      notes: 'Transferencia liquidación semanal'
    })
  });

  assert.equal(settleRes.status, 201);
  assert.ok(settleRes.data.ok);
  assert.ok(settleRes.data.messageText);
  assert.match(settleRes.data.messageText, /Artista Para Liquidar/);
  assert.match(settleRes.data.messageText, /150\.000/);
  assert.match(settleRes.data.messageText, /Transferencia liquidación semanal/);
});

test('Dashboard & Agenda: Today agenda and unmanaged past appointments', async () => {
  // Create an appointment for today
  const todayISO = new Date().toISOString();
  const todayApptRes = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Compromiso Para Hoy Test',
      startsAt: todayISO,
      durationMinutes: 60,
      price: 50000,
      status: 'confirmed'
    })
  });
  assert.equal(todayApptRes.status, 201);
  const todayApptId = todayApptRes.data.id;

  // Create an appointment in the past (e.g. 3 days ago)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 3);
  const pastApptRes = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Compromiso Pasado No Gestionado Test',
      startsAt: pastDate.toISOString(),
      durationMinutes: 60,
      price: 60000,
      status: 'confirmed'
    })
  });
  assert.equal(pastApptRes.status, 201);
  const pastApptId = pastApptRes.data.id;

  // Query GET /api/dashboard
  const dashRes = await request('/api/dashboard');
  assert.equal(dashRes.status, 200);
  assert.ok(Array.isArray(dashRes.data.appointments));
  assert.ok(Array.isArray(dashRes.data.unmanagedAppointments));

  // Today's appointment must be in dashRes.data.appointments
  const foundToday = dashRes.data.appointments.find(a => a.id === todayApptId);
  assert.ok(foundToday, 'Today appointment must be in dashboard appointments');

  // Past appointment must NOT be in appointments (today's agenda)
  const foundPastInToday = dashRes.data.appointments.find(a => a.id === pastApptId);
  assert.ok(!foundPastInToday, 'Past appointment must not be in today appointments');

  // Past appointment must be in unmanagedAppointments
  const foundPastInUnmanaged = dashRes.data.unmanagedAppointments.find(a => a.id === pastApptId);
  assert.ok(foundPastInUnmanaged, 'Past appointment must be in unmanagedAppointments');

  // Query GET /api/appointments?unmanaged=true
  const unmRes = await request('/api/appointments?unmanaged=true');
  assert.equal(unmRes.status, 200);
  assert.ok(Array.isArray(unmRes.data));
  const foundInUnmEndpoint = unmRes.data.find(a => a.id === pastApptId);
  assert.ok(foundInUnmEndpoint, 'Past appointment must be returned by unmanaged=true query');

  // Resolve past appointment via PATCH status: completed
  const patchRes = await request(`/api/appointments/${pastApptId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'completed' })
  });
  assert.equal(patchRes.status, 200);
  assert.equal(patchRes.data.status, 'completed');

  // Verify that it is no longer in unmanagedAppointments
  const afterUnmRes = await request('/api/appointments?unmanaged=true');
  assert.equal(afterUnmRes.status, 200);
  const foundAfterResolve = afterUnmRes.data.find(a => a.id === pastApptId);
  assert.ok(!foundAfterResolve, 'Resolved appointment must not be in unmanaged appointments');
});

