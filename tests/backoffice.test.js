import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/server.js';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

test.before(async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
});

let rootCookie = '';
let normalCookie = '';

async function request(path, options = {}, cookie = '') {
  const headers = {
    'Content-Type': 'application/json',
    ...(cookie ? { Cookie: cookie } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const setCookie = response.headers.get('set-cookie');
  let newCookie = cookie;
  if (setCookie) {
    newCookie = setCookie.split(';')[0];
  }

  let data = null;
  const text = await response.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, data, cookie: newCookie };
}

test('Backoffice: Superadmin soyelroot@tatudin.cl can log in and has isSuperAdmin flag', async () => {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'soyelroot@tatudin.cl',
      password: 'password123'
    })
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.user.email, 'soyelroot@tatudin.cl');
  assert.equal(res.data.user.isSuperAdmin, true);
  rootCookie = res.cookie;

  const meRes = await request('/api/auth/me', {}, rootCookie);
  assert.equal(meRes.status, 200);
  assert.equal(meRes.data.user.isSuperAdmin, true);
});

test('Backoffice: Non-superadmin user gets 403 Forbidden on Backoffice endpoints', async () => {
  const normalEmail = `artist_${Date.now()}@tatudintest.com`;
  const regRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Normal Artist',
      email: normalEmail,
      password: 'password123',
      studioName: 'Regular Studio'
    })
  });

  assert.equal(regRes.status, 200);
  normalCookie = regRes.cookie;

  const statsRes = await request('/api/backoffice/stats', {}, normalCookie);
  assert.equal(statsRes.status, 403);
  assert.match(statsRes.data.error, /Acceso restringido/i);
});

test('Backoffice: Superadmin can fetch aggregated stats under Ley 19.628', async () => {
  const res = await request('/api/backoffice/stats', {}, rootCookie);
  assert.equal(res.status, 200);
  assert.ok(res.data.metrics);
  assert.ok(res.data.metrics.users);
  assert.ok(res.data.metrics.studios);
  assert.ok(res.data.metrics.finances);
  assert.match(res.data.system.lawCompliance, /Ley N° 19.628/i);
});

test('Backoffice: Superadmin can list and edit users', async () => {
  const usersRes = await request('/api/backoffice/users', {}, rootCookie);
  assert.equal(usersRes.status, 200);
  assert.ok(Array.isArray(usersRes.data));
  assert.ok(usersRes.data.length >= 2);

  const targetUser = usersRes.data.find(u => u.email !== 'soyelroot@tatudin.cl');
  assert.ok(targetUser);

  const editRes = await request(`/api/backoffice/users/${targetUser.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fullName: 'Updated Artist Name Backoffice'
    })
  }, rootCookie);

  assert.equal(editRes.status, 200);
  assert.equal(editRes.data.user.full_name, 'Updated Artist Name Backoffice');
});

test('Backoffice: Superadmin can list studios and switch master context', async () => {
  const studiosRes = await request('/api/backoffice/studios', {}, rootCookie);
  assert.equal(studiosRes.status, 200);
  assert.ok(Array.isArray(studiosRes.data));
  assert.ok(studiosRes.data.length >= 1);

  const targetStudio = studiosRes.data[0];
  const switchRes = await request('/api/backoffice/switch-studio-master', {
    method: 'POST',
    body: JSON.stringify({ studioId: targetStudio.id })
  }, rootCookie);

  assert.equal(switchRes.status, 200);
  assert.equal(switchRes.data.ok, true);
  assert.equal(switchRes.data.activeStudioId, targetStudio.id);
});

test('Backoffice: Superadmin can seed demo data and manage guest spots', async () => {
  const seedRes = await request('/api/backoffice/seed-demo', { method: 'POST' }, rootCookie);
  assert.equal(seedRes.status, 200);
  assert.equal(seedRes.data.ok, true);

  const gsRes = await request('/api/backoffice/guest-spots', {}, rootCookie);
  assert.equal(gsRes.status, 200);
  assert.ok(Array.isArray(gsRes.data));

  if (gsRes.data.length > 0) {
    const targetGs = gsRes.data[0];
    const updateGs = await request(`/api/backoffice/guest-spots/${targetGs.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved', notes: 'Aprobado desde Backoffice Root' })
    }, rootCookie);

    assert.equal(updateGs.status, 200);
    assert.equal(updateGs.data.request.status, 'approved');
  }
});

test('Backoffice: Superadmin can purge production data and root account remains preserved', async () => {
  const purgeRes = await request('/api/backoffice/purge-production', { method: 'POST' }, rootCookie);
  assert.equal(purgeRes.status, 200);
  assert.equal(purgeRes.data.ok, true);

  // Verify soyelroot@tatudin.cl can still log in and access stats
  const loginAgain = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'soyelroot@tatudin.cl',
      password: 'password123'
    })
  });

  assert.equal(loginAgain.status, 200);
  assert.equal(loginAgain.data.user.email, 'soyelroot@tatudin.cl');

  // Verify users count is 1 (only root remains)
  const usersAfter = await request('/api/backoffice/users', {}, loginAgain.cookie);
  assert.equal(usersAfter.status, 200);
  assert.equal(usersAfter.data.length, 1);
  assert.equal(usersAfter.data[0].email, 'soyelroot@tatudin.cl');

  // Re-seed demo data for pleasant user experience
  await request('/api/backoffice/seed-demo', { method: 'POST' }, loginAgain.cookie);
});
