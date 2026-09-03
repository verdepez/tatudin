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

test('Calendar Sync: Setup authenticated owner and studio', async () => {
  const uniqueEmail = `sync_owner_${Date.now()}@tatudintest.com`;
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Sync Studio Owner',
      email: uniqueEmail,
      password: 'password123',
      studioName: 'Estudio Sincronizado'
    })
  });
  assert.equal(res.status, 201);
  currentStudioId = res.data.user.studio_id;
  assert.ok(currentStudioId);
});

test('Category Color: Update filter category color and verify persistence', async () => {
  const catsRes = await request('/api/categories');
  assert.equal(catsRes.status, 200);
  assert.ok(Array.isArray(catsRes.data) && catsRes.data.length > 0);

  const targetCat = catsRes.data[0];
  const newCustomColor = '#06B6D4'; // Cyan

  const patchRes = await request(`/api/categories/${targetCat.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ color: newCustomColor })
  });
  assert.equal(patchRes.status, 200);
  assert.equal(patchRes.data.color, newCustomColor);

  // Verify on get
  const verifyRes = await request('/api/categories');
  const updatedCat = verifyRes.data.find(c => c.id === targetCat.id);
  assert.equal(updatedCat.color, newCustomColor);
});

test('Calendar Import: Import appointments from RFC 5545 .ics content', async () => {
  const sampleIcs = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Google Inc//Google Calendar 70.9054//EN',
    'BEGIN:VEVENT',
    'UID:google-external-event-101@google.com',
    'DTSTART:20260910T140000Z',
    'DTEND:20260910T163000Z',
    'SUMMARY:Sesión Manga Japonesa - Carlos',
    'DESCRIPTION:Traer bocetos finales y pagar saldo.',
    'LOCATION:Box 2',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:apple-external-event-202@apple.com',
    'DTSTART:20260911T100000Z',
    'DTEND:20260911T120000Z',
    'SUMMARY:Cover Up Espalda - Valentina',
    'DESCRIPTION:Primera sesión de líneas.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const importRes = await request('/api/calendar/import-ics', {
    method: 'POST',
    body: JSON.stringify({
      icsContent: sampleIcs,
      calendarName: 'Google Calendar de Prueba'
    })
  });

  assert.equal(importRes.status, 200);
  assert.equal(importRes.data.ok, true);
  assert.equal(importRes.data.totalEvents, 2);
  assert.equal(importRes.data.importedCount, 2);
  assert.equal(importRes.data.updatedCount, 0);

  // Check appointments in database
  const apptsRes = await request('/api/appointments');
  assert.equal(apptsRes.status, 200);
  const importedAppt1 = apptsRes.data.find(a => a.external_uid === 'google-external-event-101@google.com');
  const importedAppt2 = apptsRes.data.find(a => a.external_uid === 'apple-external-event-202@apple.com');

  assert.ok(importedAppt1);
  assert.equal(importedAppt1.title, 'Sesión Manga Japonesa - Carlos');
  assert.equal(importedAppt1.duration_minutes, 150);
  assert.equal(importedAppt1.external_source, 'ics_import');
  assert.equal(importedAppt1.external_calendar_name, 'Google Calendar de Prueba');

  assert.ok(importedAppt2);
  assert.equal(importedAppt2.title, 'Cover Up Espalda - Valentina');
  assert.equal(importedAppt2.duration_minutes, 120);
});

test('Calendar Import: Re-importing identical .ics is idempotent (updates without duplicate)', async () => {
  const sampleIcsUpdated = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'UID:google-external-event-101@google.com',
    'DTSTART:20260910T140000Z',
    'DTEND:20260910T170000Z',
    'SUMMARY:Sesión Manga Japonesa (Horario Extendido)',
    'DESCRIPTION:Extendida 30 minutos.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const reimportRes = await request('/api/calendar/import-ics', {
    method: 'POST',
    body: JSON.stringify({
      icsContent: sampleIcsUpdated,
      calendarName: 'Google Calendar Actualizado'
    })
  });

  assert.equal(reimportRes.status, 200);
  assert.equal(reimportRes.data.importedCount, 0);
  assert.equal(reimportRes.data.updatedCount, 1);

  // Verify updated
  const apptsRes = await request('/api/appointments');
  const updated = apptsRes.data.find(a => a.external_uid === 'google-external-event-101@google.com');
  assert.equal(updated.title, 'Sesión Manga Japonesa (Horario Extendido)');
  assert.equal(updated.duration_minutes, 180);
});

test('Calendar Live Feed: Retrieve feed URLs and query RFC 5545 feed endpoint', async () => {
  const urlRes = await request('/api/calendar/feed-url');
  assert.equal(urlRes.status, 200);
  assert.ok(urlRes.data.token);
  assert.ok(urlRes.data.feedUrl.includes('/api/calendar/feed/'));
  assert.ok(urlRes.data.webcalUrl.startsWith('webcal://'));
  assert.ok(urlRes.data.googleUrl.includes('calendar.google.com'));

  // Request actual RFC 5545 feed
  const feedRes = await request(`/api/calendar/feed/${urlRes.data.token}.ics`);
  assert.equal(feedRes.status, 200);
  assert.ok(feedRes.headers.get('content-type').includes('text/calendar'));
  assert.ok(feedRes.data.includes('BEGIN:VCALENDAR'));
  assert.ok(feedRes.data.includes('BEGIN:VEVENT'));
  assert.ok(feedRes.data.includes('SUMMARY:Sesión Manga Japonesa'));
  assert.ok(feedRes.data.includes('END:VCALENDAR'));
});

test.after(() => {
  setTimeout(() => process.exit(0), 100);
});
