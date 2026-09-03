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

test('Schedules: Setup authenticated user and studio', async () => {
  const uniqueEmail = `schedule_test_${Date.now()}@tatudintest.com`;
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Schedule Owner',
      email: uniqueEmail,
      password: 'password123',
      studioName: 'Estudio Schedules'
    })
  });
  assert.equal(res.status, 201);
  currentStudioId = res.data.user.studio_id;
  assert.ok(currentStudioId);
});

test('Schedules: Create a new appointment schedule with own color and availability rules', async () => {
  const payload = {
    title: 'Citas Flash de Tatuaje',
    color: '#D97706',
    durationMinutes: 90,
    minLeadHours: 4,
    maxAdvanceDays: 30,
    instructions: 'Asistir con piel limpia y bien hidratado.',
    rules: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '12:00', endTime: '20:00' }
    ]
  };

  const res = await request('/api/schedules', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  assert.equal(res.status, 201);
  assert.equal(res.data.title, 'Citas Flash de Tatuaje');
  assert.equal(res.data.color, '#D97706');
  assert.equal(res.data.duration_minutes, 90);
  assert.equal(res.data.is_locked, false);
  assert.ok(res.data.slug);
  assert.equal(res.data.rules.length, 3);
});

test('Schedules: List schedules and verify color and rules are included', async () => {
  const res = await request('/api/schedules');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data));
  const created = res.data.find(s => s.title === 'Citas Flash de Tatuaje');
  assert.ok(created);
  assert.equal(created.color, '#D97706');
  assert.equal(created.rules.length, 3);
});

test('Schedules: Lock and unlock schedule (is_locked toggle)', async () => {
  const list = await request('/api/schedules');
  const target = list.data.find(s => s.title === 'Citas Flash de Tatuaje');
  assert.ok(target);

  // Lock
  const lockRes = await request(`/api/schedules/${target.id}/lock`, {
    method: 'PATCH',
    body: JSON.stringify({ isLocked: true })
  });
  assert.equal(lockRes.status, 200);
  assert.equal(lockRes.data.is_locked, true);

  // Public endpoint reports locked
  const publicRes = await request(`/api/public/schedules/${target.slug}`);
  assert.equal(publicRes.status, 200);
  assert.equal(publicRes.data.schedule.isLocked, true);

  // Attempt booking while locked should fail with 403
  const bookAttempt = await request(`/api/public/schedules/${target.slug}/book`, {
    method: 'POST',
    body: JSON.stringify({
      clientName: 'Cliente Rechazado',
      startsAt: '2026-09-07T10:00:00'
    })
  });
  assert.equal(bookAttempt.status, 403);

  // Unlock
  const unlockRes = await request(`/api/schedules/${target.id}/lock`, {
    method: 'PATCH',
    body: JSON.stringify({ isLocked: false })
  });
  assert.equal(unlockRes.status, 200);
  assert.equal(unlockRes.data.is_locked, false);

  // Book appointment while unlocked
  const bookSuccess = await request(`/api/public/schedules/${target.slug}/book`, {
    method: 'POST',
    body: JSON.stringify({
      clientName: 'Mariana Gómez',
      clientEmail: 'mariana@example.com',
      clientPhone: '+56 9 8888 7777',
      startsAt: '2026-09-07T10:00:00',
      notes: 'Flash brazo antebrazo'
    })
  });
  assert.equal(bookSuccess.status, 201);
  assert.ok(bookSuccess.data.appointment);
  assert.equal(bookSuccess.data.appointment.duration_minutes, 90);
  assert.ok(bookSuccess.data.appointment.title.includes('Mariana Gómez'));
});

test.after(() => {
  setTimeout(() => process.exit(0), 100);
});


