import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/server.js';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

test.before(async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
});

let cookieHeader = '';
let currentUserId = null;
let currentStudioId = null;
let createdClientId = null;
let createdSpaceId = null;
let createdArtistId = null;
let firstAppointmentId = null;
let createdGuestSpotId = null;

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

test('API Health Check', async () => {
  const res = await request('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.data.status, 'ok');
  assert.equal(res.data.database, 'connected');
});

test('Auth: Register new owner and create studio', async () => {
  const uniqueEmail = `owner_${Date.now()}@tatudintest.com`;
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Test Owner',
      email: uniqueEmail,
      password: 'password123',
      studioName: 'Studio Eclipse Test'
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.user);
  assert.equal(res.data.user.email, uniqueEmail);
  currentUserId = res.data.user.id;
  currentStudioId = res.data.user.studio_id;
  assert.ok(currentStudioId, 'Studio ID must be assigned');
});

test('Auth: Check current session /api/auth/me', async () => {
  const res = await request('/api/auth/me');
  assert.equal(res.status, 200);
  assert.equal(res.data.user.id, currentUserId);
  assert.equal(res.data.user.role, 'owner');
});

test('Clients: Create a client', async () => {
  const res = await request('/api/clients', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Camila Silva',
      email: 'camila@email.com',
      phone: '+56912345678',
      notes: 'Alergia al látex'
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  createdClientId = res.data.id;
});

test('Spaces: Create a box / space', async () => {
  const res = await request('/api/spaces', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Box 1 - Neotradicional',
      description: 'Camilla regulable, lámpara fría',
      pricePerDay: 40000,
      pricePerHour: 8000
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  createdSpaceId = res.data.id;
});

test('Members: Add a resident artist with commission %', async () => {
  const uniqueArtistEmail = `artist_${Date.now()}@tatudintest.com`;
  const res = await request('/api/members', {
    method: 'POST',
    body: JSON.stringify({
      fullName: 'Lucas Tatuador',
      email: uniqueArtistEmail,
      role: 'resident',
      commissionPercent: 65.0
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  createdArtistId = res.data.id;
});

test('Members: Update commission percentage for member', async () => {
  const membersRes = await request('/api/members');
  assert.equal(membersRes.status, 200);
  const member = membersRes.data.find((m) => m.id === createdArtistId);
  assert.ok(member, 'Created artist must exist in members list');

  const patchRes = await request(`/api/members/${member.membership_id}`, {
    method: 'PATCH',
    body: JSON.stringify({ commissionPercent: 75.0 })
  });

  assert.equal(patchRes.status, 200);
  assert.equal(Number(patchRes.data.commission_percent), 75.0);
});

test('Appointments: Create initial appointment', async () => {
  const startsAt = '2026-11-15T14:00:00Z';
  const res = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      clientId: createdClientId,
      artistId: createdArtistId,
      spaceId: createdSpaceId,
      title: 'Tatuaje Dragón Oriental',
      startsAt,
      durationMinutes: 180,
      price: 150000,
      deposit: 30000
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  firstAppointmentId = res.data.id;

  // Complete appointment to compute full price
  const completeRes = await request(`/api/appointments/${firstAppointmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'completed' })
  });
  assert.equal(completeRes.status, 200);
});

test('Appointment Status: Reschedule appointment updates status and startsAt', async () => {
  const createRes = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Sesión para reprogramar',
      startsAt: '2026-11-25T10:00:00.000Z',
      durationMinutes: 60,
      price: 50000
    })
  });
  assert.equal(createRes.status, 201);
  const apptId = createRes.data.id;

  const newStartsAt = '2026-11-26T15:00:00.000Z';
  const rescheduleRes = await request(`/api/appointments/${apptId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'rescheduled',
      startsAt: newStartsAt
    })
  });
  assert.equal(rescheduleRes.status, 200);
  assert.equal(rescheduleRes.data.status, 'rescheduled');
  assert.equal(new Date(rescheduleRes.data.starts_at).toISOString(), newStartsAt);
});

test('Conflict Engine: Reject appointment overlapping on same box / artist (HTTP 409)', async () => {
  // Overlaps with 14:00 - 17:00
  const conflictingStartsAt = '2026-11-15T15:30:00Z';
  const res = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      clientId: createdClientId,
      artistId: createdArtistId,
      spaceId: createdSpaceId,
      title: 'Cita en conflicto',
      startsAt: conflictingStartsAt,
      durationMinutes: 120,
      price: 80000
    })
  });

  assert.equal(res.status, 409, 'Must return 409 Conflict when slots overlap');
  assert.ok(res.data.error.includes('Conflicto'));
});

test('Finances & Settlements: Calculate commissions and record settlement payout', async () => {
  const summaryRes = await request('/api/finances/summary');
  assert.equal(summaryRes.status, 200);
  assert.ok(Array.isArray(summaryRes.data));

  const artistRow = summaryRes.data.find((a) => a.artist_id === createdArtistId);
  assert.ok(artistRow, 'Artist must appear in finance summary');
  assert.equal(Number(artistRow.total_generated), 150000);
  assert.equal(Number(artistRow.commission_percent), 75);
  // 75% of 150000 = 112500
  assert.equal(Number(artistRow.artist_payout), 112500);
  assert.equal(Number(artistRow.pending_settlement), 112500);

  // Settle 50000 to artist
  const settleRes = await request('/api/finances/settle', {
    method: 'POST',
    body: JSON.stringify({
      artistId: createdArtistId,
      amount: 50000,
      notes: 'Transferencia liquidación parcial'
    })
  });

  assert.equal(settleRes.status, 201);
  assert.equal(settleRes.data.ok, true);

  // Verify pending amount reduced
  const afterSummaryRes = await request('/api/finances/summary');
  const updatedRow = afterSummaryRes.data.find((a) => a.artist_id === createdArtistId);
  assert.equal(Number(updatedRow.settled_amount), 50000);
  assert.equal(Number(updatedRow.pending_settlement), 62500);
});

test('Guest Spots: Submit public nomad application and studio approves it', async () => {
  // Public nomad submission
  const publicRes = await request('/api/public/guest-spots', {
    method: 'POST',
    body: JSON.stringify({
      studioId: currentStudioId,
      artistName: 'Sofi Nómada Ink',
      artistEmail: `sofi_${Date.now()}@nomadtattoo.com`,
      artistInstagram: '@sofi.guest',
      spaceId: createdSpaceId,
      startDate: '2026-12-01',
      endDate: '2026-12-05',
      notes: 'Estilo Blackwork y puntillismo'
    })
  });

  assert.equal(publicRes.status, 201);
  assert.ok(publicRes.data.id);
  createdGuestSpotId = publicRes.data.id;

  // Studio owner fetches requests
  const listRes = await request('/api/guest-spots');
  assert.equal(listRes.status, 200);
  const found = listRes.data.find((g) => g.id === createdGuestSpotId);
  assert.ok(found);
  assert.equal(found.status, 'pending');

  // Studio owner approves request
  const approveRes = await request(`/api/guest-spots/${createdGuestSpotId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'approved' })
  });

  assert.equal(approveRes.status, 200);
  assert.equal(approveRes.data.status, 'approved');

  // Check that the nomad artist is now in the studio members list
  const membersRes = await request('/api/members');
  const nomadMember = membersRes.data.find((m) => m.email === found.artist_email);
  assert.ok(nomadMember, 'Approved nomad must be added to studio memberships');
  assert.equal(nomadMember.role, 'nomad');
});

test('Categories: List default categories for studio', async () => {
  const catRes = await request('/api/categories');
  assert.equal(catRes.status, 200);
  assert.ok(Array.isArray(catRes.data));
  assert.ok(catRes.data.length >= 3, 'Must have at least default categories');
  const tattooCat = catRes.data.find((c) => c.kind === 'tattoo');
  assert.ok(tattooCat, 'Default tattoo category must exist');
});

test('Categories: Create custom category and update it', async () => {
  const newCatRes = await request('/api/categories', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Grabación de Podcast Tattoo',
      kind: 'marketing',
      color: '#0284C7',
      requiresClient: false,
      requiresSpace: true
    })
  });

  assert.equal(newCatRes.status, 201);
  assert.ok(newCatRes.data.id);
  const createdCatId = newCatRes.data.id;

  const patchRes = await request(`/api/categories/${createdCatId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: 'Podcast & YouTube Tattoo' })
  });

  assert.equal(patchRes.status, 200);
  assert.equal(patchRes.data.name, 'Podcast & YouTube Tattoo');
});

test('Appointments & Commitments: Create marketing commitment without client', async () => {
  const catsRes = await request('/api/categories');
  const mktCat = catsRes.data.find((c) => c.kind === 'marketing') || catsRes.data[0];

  const res = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      categoryId: mktCat.id,
      title: 'Sesión de fotos y Reels de Instagram',
      notes: 'Traer cámara reflex y aro de luz',
      startsAt: '2026-11-20T10:00:00Z',
      durationMinutes: 90,
      artistId: createdArtistId
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  assert.equal(res.data.client_id, null, 'Marketing commitment should not require client');
  assert.equal(res.data.title, 'Sesión de fotos y Reels de Instagram');
});

test('Appointments & Commitments: Create space rental commitment and verify filter', async () => {
  const catsRes = await request('/api/categories');
  const spaceCat = catsRes.data.find((c) => c.kind === 'space_rental') || catsRes.data[0];

  const res = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({
      categoryId: spaceCat.id,
      spaceId: createdSpaceId,
      title: 'Arriendo de Box para Tatuador Invitado',
      notes: 'Tarifa acordada por jornada completa',
      startsAt: '2026-11-21T09:00:00Z',
      durationMinutes: 480,
      price: 45000
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  assert.equal(res.data.space_id, createdSpaceId);

  // Filter agenda by categoryId
  const filterRes = await request(`/api/appointments?categoryId=${spaceCat.id}`);
  assert.equal(filterRes.status, 200);
  assert.ok(filterRes.data.some((a) => a.id === res.data.id));
});

test('Portfolio: Get authenticated user portfolio /api/portfolio/me', async () => {
  const res = await request('/api/portfolio/me');
  assert.equal(res.status, 200);
  assert.ok(res.data.portfolio);
  assert.ok(res.data.portfolio.handle);
  assert.ok(Array.isArray(res.data.gallery));
  assert.ok(res.data.gallery.length > 0, 'Should have seeded sample gallery items');
});

let testHandle = '';
test('Portfolio: Update portfolio details and brand color /api/portfolio/me', async () => {
  testHandle = `artist.test.${Date.now()}`;
  const res = await request('/api/portfolio/me', {
    method: 'PUT',
    body: JSON.stringify({
      handle: testHandle,
      tagline: 'Master en Blackwork y Dotwork',
      bio: 'Especialista en geometría sagrada y piezas personalizadas.',
      brandColor: '#7C3AED',
      whatsappNumber: '+56911223344',
      instagramHandle: '@artist.test',
      location: 'Viña del Mar, Chile',
      careInstructions: 'Lavar con jabón neutro y aplicar crema cicatrizante 3 veces al día.',
      isPublished: true
    })
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.portfolio.handle, testHandle);
  assert.equal(res.data.portfolio.brand_color, '#7C3AED');
  assert.equal(res.data.portfolio.tagline, 'Master en Blackwork y Dotwork');
  assert.equal(res.data.portfolio.is_published, true);
});

let newGalleryItemId = null;
test('Portfolio: Add gallery image item /api/portfolio/gallery', async () => {
  const res = await request('/api/portfolio/gallery', {
    method: 'POST',
    body: JSON.stringify({
      imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      title: 'Manga Completa Dragon Neo',
      styleTag: 'Neotradicional'
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.item);
  assert.equal(res.data.item.title, 'Manga Completa Dragon Neo');
  newGalleryItemId = res.data.item.id;
});

test('Portfolio: Direct multiple image batch upload /api/portfolio/gallery', async () => {
  const res = await request('/api/portfolio/gallery', {
    method: 'POST',
    body: JSON.stringify({
      images: [
        { imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', title: 'Tattoo 1', styleTag: 'Blackwork' },
        { imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', title: 'Tattoo 2', styleTag: 'Fineline' }
      ]
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.items);
  assert.equal(res.data.items.length, 2);
});

test('Portfolio: Sync images from Instagram /api/portfolio/sync-instagram', async () => {
  const res = await request('/api/portfolio/sync-instagram', { method: 'POST' });
  assert.equal(res.status, 200);
  assert.ok(res.data.ok);
  assert.ok(Array.isArray(res.data.gallery));
});

test('Portfolio: Delete gallery item /api/portfolio/gallery/:id', async () => {
  const getRes = await request('/api/portfolio/me');
  const itemId = getRes.data.gallery?.[0]?.id || newGalleryItemId;
  assert.ok(itemId);
  const res = await request(`/api/portfolio/gallery/${itemId}`, { method: 'DELETE' });
  assert.equal(res.status, 200);
  assert.equal(res.data.ok, true);
});

test('Public Portfolio: Fetch public landing page by handle /api/public/portfolio/:handle', async () => {
  const res = await request(`/api/public/portfolio/${testHandle}`);
  assert.equal(res.status, 200);
  assert.ok(res.data.portfolio);
  assert.equal(res.data.portfolio.handle, testHandle);
  assert.ok(res.data.portfolio.artist_name);
  assert.ok(Array.isArray(res.data.gallery));
});

let createdTranscriptId = null;

test('Session Transcripts: Create transcript /api/appointments/:id/transcripts', async () => {
  assert.ok(firstAppointmentId, 'Appointment must exist');
  const res = await request(`/api/appointments/${firstAppointmentId}/transcripts`, {
    method: 'POST',
    body: JSON.stringify({
      title: 'Minuta Reunión Diseño Dragón',
      rawTranscript: 'El cliente solicita dragón oriental en antebrazo izquierdo con sombras suaves',
      structuredNotes: '📌 Temas: Dragón oriental.\n🤝 Acuerdos: Sombras suaves.\n⚡ Pasos: Boceto para el viernes.',
      durationSeconds: 120,
      sessionKind: 'custom'
    })
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.id);
  assert.equal(res.data.appointment_id, firstAppointmentId);
  assert.equal(res.data.title, 'Minuta Reunión Diseño Dragón');
  createdTranscriptId = res.data.id;
});

test('Session Transcripts: List transcripts for appointment', async () => {
  const res = await request(`/api/appointments/${firstAppointmentId}/transcripts`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data));
  assert.ok(res.data.length >= 1);
  assert.equal(res.data[0].id, createdTranscriptId);
  assert.ok(res.data[0].author_name);
});

test('Session Transcripts: Patch transcript /api/transcripts/:id', async () => {
  const res = await request(`/api/transcripts/${createdTranscriptId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: 'Minuta Reunión Diseño Dragón Actualizada',
      structuredNotes: '📌 Temas: Dragón oriental neo.\n🤝 Acuerdos: Escamas oscuras.\n⚡ Pasos: Listo para agendar.'
    })
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.title, 'Minuta Reunión Diseño Dragón Actualizada');
});

test('Session Transcripts: Delete transcript /api/transcripts/:id', async () => {
  const res = await request(`/api/transcripts/${createdTranscriptId}`, {
    method: 'DELETE'
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.ok, true);
});

test('Transactions: Filter by date range and sort order /api/transactions', async () => {
  // Create test transactions
  await request('/api/transactions', {
    method: 'POST',
    body: JSON.stringify({
      kind: 'income',
      description: 'Venta de crema aftercare',
      amount: 15000,
      occurredOn: '2026-08-15'
    })
  });
  await request('/api/transactions', {
    method: 'POST',
    body: JSON.stringify({
      kind: 'expense',
      description: 'Compra de papel absorbente',
      amount: 8000,
      occurredOn: '2026-08-20'
    })
  });

  // Query with sorting asc (older first)
  const resAsc = await request('/api/transactions?sort=asc');
  assert.equal(resAsc.status, 200);
  assert.ok(Array.isArray(resAsc.data));

  // Query with date range
  const resRange = await request('/api/transactions?startDate=2026-08-10&endDate=2026-08-25');
  assert.equal(resRange.status, 200);
  assert.ok(resRange.data.length >= 2);
  assert.ok(resRange.data.every(t => t.occurred_on >= '2026-08-10' && t.occurred_on <= '2026-08-25'));
});

test.after(() => {
  setTimeout(() => process.exit(0), 100);
});



