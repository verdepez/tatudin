import pg from 'pg';
import crypto from 'node:crypto';
import { promisify } from 'node:util';

const { Pool } = pg;
const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function seedStudioData(passedPool = null) {
  console.log('🌱 Iniciando seeding de datos para Tatudin Estudio...');
  const isStandalone = !passedPool;
  const pool = passedPool || new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://tatudin:tatudin@db:5432/tatudin' });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const defaultPassword = 'password123';
    const passwordHash = await hashPassword(defaultPassword);

    // 1. Crear o actualizar Usuario Owner del Estudio
    const ownerEmail = 'estudio@tatudin.com';
    let ownerRes = await client.query('SELECT id FROM users WHERE email = $1', [ownerEmail]);
    let ownerId;
    if (!ownerRes.rowCount) {
      const ins = await client.query(
        'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id',
        [ownerEmail, passwordHash, 'Pablo Administrador']
      );
      ownerId = ins.rows[0].id;
    } else {
      ownerId = ownerRes.rows[0].id;
      await client.query('UPDATE users SET password_hash = $1, full_name = $2 WHERE id = $3', [passwordHash, 'Pablo Administrador', ownerId]);
    }

    // 2. Crear o actualizar Estudio tipo "studio"
    let studioRes = await client.query(`
      SELECT s.id FROM studios s
      JOIN studio_memberships sm ON sm.studio_id = s.id
      WHERE sm.user_id = $1 AND sm.role = 'owner' LIMIT 1
    `, [ownerId]);

    let studioId;
    if (!studioRes.rowCount) {
      const insStudio = await client.query(
        'INSERT INTO studios (name, account_type, currency, timezone) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Black Lotus Tattoo Studio', 'studio', 'CLP', 'America/Santiago']
      );
      studioId = insStudio.rows[0].id;
      await client.query('INSERT INTO studio_memberships (user_id, studio_id, role, commission_percent) VALUES ($1, $2, $3, $4)', [ownerId, studioId, 'owner', 100.00]);
    } else {
      studioId = studioRes.rows[0].id;
      await client.query("UPDATE studios SET name = $1, account_type = 'studio', currency = 'CLP', timezone = 'America/Santiago' WHERE id = $2", ['Black Lotus Tattoo Studio', studioId]);
    }

    // 3. Crear los 5 Boxes y 2 Salas de Reuniones
    const spacesDef = [
      { name: 'Box 1 · Neotrad & Color', desc: 'Camilla hidráulica, iluminación regulable 6500K y estación sanitizada.', day: 45000, hour: 10000 },
      { name: 'Box 2 · Blackwork & Geometría', desc: 'Cabina aislada, apoyabrazos rotatorio y bandeja de acero quirúrgico.', day: 45000, hour: 10000 },
      { name: 'Box 3 · Fineline & Micro', desc: 'Lámpara con lupa de precisión, camilla ergonómica y luz natural.', day: 45000, hour: 10000 },
      { name: 'Box 4 · Realismo & Sombras', desc: 'Pantalla 4K para referencias, estación de pigmentos y soporte Pro.', day: 50000, hour: 12000 },
      { name: 'Box 5 · Guest Spot & Nómades', desc: 'Puesto flexible multi-estilo totalmente equipado para artistas visitantes.', day: 30000, hour: 10000 },
      { name: 'Sala de Consulta 1 · Bocetos & Diseño', desc: 'Mesa de dibujo digital con iPads Pro, proyector y mesa de calco.', day: 25000, hour: 8000 },
      { name: 'Sala de Reuniones 2 · Estudio & Equipo', desc: 'Sala para briefings con clientes, acuerdos de proyectos y reuniones del staff.', day: 25000, hour: 8000 }
    ];

    const spaceMap = {};
    for (const sp of spacesDef) {
      let spRes = await client.query('SELECT id FROM spaces WHERE studio_id = $1 AND name = $2', [studioId, sp.name]);
      if (!spRes.rowCount) {
        const ins = await client.query(
          'INSERT INTO spaces (studio_id, name, description, price_per_day, price_per_hour, is_active) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id',
          [studioId, sp.name, sp.desc, sp.day, sp.hour]
        );
        spaceMap[sp.name] = ins.rows[0].id;
      } else {
        spaceMap[sp.name] = spRes.rows[0].id;
        await client.query('UPDATE spaces SET description = $1, price_per_day = $2, price_per_hour = $3, is_active = TRUE WHERE id = $4', [sp.desc, sp.day, sp.hour, spRes.rows[0].id]);
      }
    }

    // 4. Crear Categorías de Compromiso
    const categoriesDef = [
      { name: 'Cita de Tatuaje', kind: 'tattoo', color: '#7C3AED', icon: 'check', reqClient: true, reqSpace: true, system: true },
      { name: 'Bocetos y Diseño con Cliente', kind: 'custom', color: '#059669', icon: 'edit', reqClient: true, reqSpace: true, system: false },
      { name: 'Arriendo de Box Nómada (3h)', kind: 'space_rental', color: '#2563EB', icon: 'box', reqClient: false, reqSpace: true, system: true },
      { name: 'Reunión de Equipo & Estrategia', kind: 'meeting', color: '#D97706', icon: 'clients', reqClient: false, reqSpace: true, system: true },
      { name: 'Marketing & Flash Day', kind: 'marketing', color: '#0284C7', icon: 'bell', reqClient: false, reqSpace: false, system: true }
    ];

    const categoryMap = {};
    for (const cat of categoriesDef) {
      let catRes = await client.query('SELECT id FROM commitment_categories WHERE studio_id = $1 AND name = $2', [studioId, cat.name]);
      if (!catRes.rowCount) {
        const ins = await client.query(
          'INSERT INTO commitment_categories (studio_id, name, kind, color, icon, requires_client, requires_space, is_system) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
          [studioId, cat.name, cat.kind, cat.color, cat.icon, cat.reqClient, cat.reqSpace, cat.system]
        );
        categoryMap[cat.name] = ins.rows[0].id;
      } else {
        categoryMap[cat.name] = catRes.rows[0].id;
      }
    }

    // 5. Crear 4 Artistas Residentes
    const residentsDef = [
      { name: 'Camila Tattoo', email: 'camila@ink.com', comm: 70 },
      { name: 'Diego Blackwork', email: 'diego@ink.com', comm: 70 },
      { name: 'Sofia Fineline', email: 'sofia@ink.com', comm: 70 },
      { name: 'Matias Realismo', email: 'matias@ink.com', comm: 75 }
    ];

    const residentMap = {};
    for (const r of residentsDef) {
      let uRes = await client.query('SELECT id FROM users WHERE email = $1', [r.email]);
      let uId;
      if (!uRes.rowCount) {
        const ins = await client.query('INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id', [r.email, passwordHash, r.name]);
        uId = ins.rows[0].id;
      } else {
        uId = uRes.rows[0].id;
        await client.query('UPDATE users SET password_hash = $1, full_name = $2 WHERE id = $3', [passwordHash, r.name, uId]);
      }
      residentMap[r.name] = uId;

      await client.query(`
        INSERT INTO studio_memberships (user_id, studio_id, role, status, commission_percent)
        VALUES ($1, $2, 'resident', 'active', $3)
        ON CONFLICT (user_id, studio_id) DO UPDATE SET role = 'resident', status = 'active', commission_percent = $3
      `, [uId, studioId, r.comm]);
    }

    // 6. Crear 4 Artistas Nómades / Guest Spot
    const nomadsDef = [
      { name: 'Lucas Nomad (BsAs)', email: 'lucas.nomad@gmail.com', ig: '@lucas.nomad.tattoo', dates: ['2026-08-31', '2026-09-06'], notes: 'Especialista en Neotradicional, invitado desde Argentina.' },
      { name: 'Elena Guest (Berlin)', email: 'elena.guest@berlin-ink.de', ig: '@elena_guest_art', dates: ['2026-08-31', '2026-09-06'], notes: 'Tatuadora invitada de Berlín, estilo Blackout & Ignorant Art.' },
      { name: 'Valeria Traveling', email: 'valeria.travel@nomadtattoo.io', ig: '@valetravel.ink', dates: ['2026-08-31', '2026-09-06'], notes: 'Gira sudamericana de Microrealismo botánico.' },
      { name: 'Gabriel Guest (CDMX)', email: 'gabriel.cdmx@guestart.com', ig: '@gabriel_guest_mx', dates: ['2026-08-31', '2026-09-06'], notes: 'Invitado especialista en Lettering & Chicano style.' }
    ];

    const nomadMap = {};
    for (const n of nomadsDef) {
      let uRes = await client.query('SELECT id FROM users WHERE email = $1', [n.email]);
      let uId;
      if (!uRes.rowCount) {
        const ins = await client.query('INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id', [n.email, passwordHash, n.name]);
        uId = ins.rows[0].id;
      } else {
        uId = uRes.rows[0].id;
        await client.query('UPDATE users SET password_hash = $1, full_name = $2 WHERE id = $3', [passwordHash, n.name, uId]);
      }
      nomadMap[n.name] = uId;

      await client.query(`
        INSERT INTO studio_memberships (user_id, studio_id, role, status, commission_percent)
        VALUES ($1, $2, 'nomad', 'active', 100.00)
        ON CONFLICT (user_id, studio_id) DO UPDATE SET role = 'nomad', status = 'active'
      `, [uId, studioId]);

      // Guest spot request aprobada
      await client.query(`
        INSERT INTO guest_spot_requests (studio_id, artist_name, artist_email, artist_instagram, space_id, start_date, end_date, status, notes)
        SELECT $1, $2, $3, $4, $5, $6, $7, 'approved', $8
        WHERE NOT EXISTS (
          SELECT 1 FROM guest_spot_requests WHERE studio_id = $1 AND artist_email = $3
        )
      `, [studioId, n.name, n.email, n.ig, spaceMap['Box 5 · Guest Spot & Nómades'], n.dates[0], n.dates[1], n.notes]);
    }

    // 7. Crear Base de Datos de Clientes
    const clientsDef = [
      { name: 'Valentina Morales', email: 'valen.morales@gmail.com', phone: '+56987654321', notes: 'Pieza de espalda completa neotradicional. Primera sesión de 4.' },
      { name: 'Ignacio Silva', email: 'ignacio.silva@outlook.com', phone: '+56976543210', notes: 'Manga geométrica en brazo izquierdo. Sin alergias conocidas.' },
      { name: 'Francisca Rojas', email: 'fran.rojas@gmail.com', phone: '+56965432109', notes: 'Diseño botánico floral en costillas, trazo ultra fino.' },
      { name: 'Benjamin Castro', email: 'benja.castro@gmail.com', phone: '+56954321098', notes: 'Retrato realista de mascota en pantorrilla con sombras.' },
      { name: 'Catalina Soto', email: 'cata.soto@gmail.com', phone: '+56943210987', notes: 'Lettering personalizado en antebrazo y clavícula.' },
      { name: 'Sebastian Herrera', email: 'seba.herrera@gmail.com', phone: '+56932109876', notes: 'Tigre japonés y olas en muslo derecho.' },
      { name: 'Martina Perez', email: 'martina.p@gmail.com', phone: '+56921098765', notes: 'Microtatuaje constelación en muñeca.' },
      { name: 'Tomas Gomez', email: 'tomas.g@gmail.com', phone: '+56910987654', notes: 'Cover-up de tatuaje antiguo en hombro con blackwork.' },
      { name: 'Constanza Diaz', email: 'coni.diaz@gmail.com', phone: '+56998765432', notes: 'Boceto y consulta previa para proyecto de manga completa.' },
      { name: 'Alonso Vega', email: 'alonso.v@gmail.com', phone: '+56987654320', notes: 'Reunión de diseño conceptual para tatuaje conmemorativo.' },
      { name: 'Javiera Munoz', email: 'javi.munoz@gmail.com', phone: '+56976543211', notes: 'Flash tattoo de artista nómade Lucas (Buenos Aires).' },
      { name: 'Rodrigo Fernandez', email: 'rodrigo.f@gmail.com', phone: '+56965432100', notes: 'Sesión especial con artista invitada Elena de Berlín.' },
      { name: 'Camila Navarro', email: 'cami.navarro@gmail.com', phone: '+56954321011', notes: 'Diseño botánico con Valeria Traveling.' },
      { name: 'Mateo Riquelme', email: 'mateo.r@gmail.com', phone: '+56943210922', notes: 'Lettering chicano con Gabriel de CDMX.' }
    ];

    const clientMap = {};
    for (const c of clientsDef) {
      let clRes = await client.query('SELECT id FROM clients WHERE studio_id = $1 AND email = $2', [studioId, c.email]);
      if (!clRes.rowCount) {
        const ins = await client.query(
          'INSERT INTO clients (studio_id, name, email, phone, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [studioId, c.name, c.email, c.phone, c.notes]
        );
        clientMap[c.name] = ins.rows[0].id;
      } else {
        clientMap[c.name] = clRes.rows[0].id;
      }
    }

    // 8. Crear Agenda Completa para la Próxima Semana (Lunes a Domingo)
    // Fechas: 2026-08-31 (Lunes) al 2026-09-06 (Domingo)
    const appointmentsDef = [
      // --- LUNES 31 DE AGOSTO ---
      {
        title: 'Reunión Semanal de Staff · Planificación y Sanitización',
        cat: 'Reunión de Equipo & Estrategia',
        artist: null,
        client: null,
        space: 'Sala de Reuniones 2 · Estudio & Equipo',
        date: '2026-08-31T09:00:00-04:00',
        dur: 60,
        status: 'completed',
        price: 0,
        deposit: 0,
        notes: 'Revisión de agenda semanal, insumos y bienvenida a los 4 nómades invitados.'
      },
      {
        title: 'Manga Oriental · Sesión 1 Líneas y Fondos',
        cat: 'Cita de Tatuaje',
        artist: 'Camila Tattoo',
        client: 'Sebastian Herrera',
        space: 'Box 1 · Neotrad & Color',
        date: '2026-08-31T10:30:00-04:00',
        dur: 180,
        status: 'completed',
        price: 150000,
        deposit: 50000,
        notes: 'Sesión de líneas en muslo. Pago a residente: $60.000.'
      },
      {
        title: 'Espalda Blackwork Geométrica',
        cat: 'Cita de Tatuaje',
        artist: 'Diego Blackwork',
        client: 'Ignacio Silva',
        space: 'Box 2 · Blackwork & Geometría',
        date: '2026-08-31T11:00:00-04:00',
        dur: 180,
        status: 'completed',
        price: 140000,
        deposit: 40000,
        notes: 'Geometría sagrada en omóplato. Pago a residente: $60.000.'
      },
      {
        title: 'Arriendo Box 3h · Lucas Nomad (Guest Spot BsAs)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Lucas Nomad (BsAs)',
        client: 'Javiera Munoz',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-08-31T11:00:00-04:00',
        dur: 180,
        status: 'completed',
        price: 30000,
        deposit: 30000,
        notes: 'Arriendo de 3 horas cobrado al nómade por el estudio ($30.000 fijo).'
      },
      {
        title: 'Boceto y Consulta Personalizada Manga Cobertura',
        cat: 'Bocetos y Diseño con Cliente',
        artist: 'Camila Tattoo',
        client: 'Constanza Diaz',
        space: 'Sala de Consulta 1 · Bocetos & Diseño',
        date: '2026-08-31T15:00:00-04:00',
        dur: 90,
        status: 'completed',
        price: 40000,
        deposit: 40000,
        notes: 'Diseño en iPad Pro y prueba de calco. Pago a residente: $40.000.'
      },
      {
        title: 'Arriendo Box 3h · Elena Guest (Guest Spot Berlín)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Elena Guest (Berlin)',
        client: 'Rodrigo Fernandez',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-08-31T15:00:00-04:00',
        dur: 180,
        status: 'completed',
        price: 30000,
        deposit: 30000,
        notes: 'Sesión Blackout Ignorant con cliente agendado por Elena. Cobro estudio: $30.000.'
      },

      // --- MARTES 01 DE SEPTIEMBRE ---
      {
        title: 'Composición Floral Fineline en Costillas',
        cat: 'Cita de Tatuaje',
        artist: 'Sofia Fineline',
        client: 'Francisca Rojas',
        space: 'Box 3 · Fineline & Micro',
        date: '2026-09-01T10:00:00-04:00',
        dur: 180,
        status: 'completed',
        price: 130000,
        deposit: 40000,
        notes: 'Trazo 1RL y sombreado suave. Pago a residente: $60.000.'
      },
      {
        title: 'Retrato Realista Mascota con Sombras',
        cat: 'Cita de Tatuaje',
        artist: 'Matias Realismo',
        client: 'Benjamin Castro',
        space: 'Box 4 · Realismo & Sombras',
        date: '2026-09-01T10:30:00-04:00',
        dur: 180,
        status: 'completed',
        price: 180000,
        deposit: 60000,
        notes: 'Fotografía en escala de grises. Pago a residente: $60.000.'
      },
      {
        title: 'Arriendo Box 3h · Valeria Traveling (Microrealismo)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Valeria Traveling',
        client: 'Camila Navarro',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-01T11:00:00-04:00',
        dur: 180,
        status: 'completed',
        price: 30000,
        deposit: 30000,
        notes: 'Cobro de arriendo nómade: $30.000 por 3h.'
      },
      {
        title: 'Reunión de Bocetos y Proyecto Gran Formato',
        cat: 'Bocetos y Diseño con Cliente',
        artist: 'Diego Blackwork',
        client: 'Alonso Vega',
        space: 'Sala de Consulta 1 · Bocetos & Diseño',
        date: '2026-09-01T15:30:00-04:00',
        dur: 90,
        status: 'completed',
        price: 40000,
        deposit: 40000,
        notes: 'Composición de patrones y simetría. Pago a residente: $40.000.'
      },
      {
        title: 'Arriendo Box 3h · Gabriel Guest (CDMX Lettering)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Gabriel Guest (CDMX)',
        client: 'Mateo Riquelme',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-01T15:30:00-04:00',
        dur: 180,
        status: 'completed',
        price: 30000,
        deposit: 30000,
        notes: 'Lettering estilo Chicano. Cobro estudio nómade: $30.000.'
      },

      // --- MIÉRCOLES 02 DE SEPTIEMBRE ---
      {
        title: 'Espalda Neotradicional Dragón y Peonías',
        cat: 'Cita de Tatuaje',
        artist: 'Camila Tattoo',
        client: 'Valentina Morales',
        space: 'Box 1 · Neotrad & Color',
        date: '2026-09-02T10:00:00-04:00',
        dur: 180,
        status: 'in_session',
        price: 160000,
        deposit: 50000,
        notes: 'Segunda sesión de saturación de color. Pago a residente: $60.000.'
      },
      {
        title: 'Cover-Up Blackwork en Hombro',
        cat: 'Cita de Tatuaje',
        artist: 'Diego Blackwork',
        client: 'Tomas Gomez',
        space: 'Box 2 · Blackwork & Geometría',
        date: '2026-09-02T11:00:00-04:00',
        dur: 180,
        status: 'in_session',
        price: 140000,
        deposit: 50000,
        notes: 'Bloqueo y textura sobre tatuaje antiguo. Pago a residente: $60.000.'
      },
      {
        title: 'Arriendo Box 3h · Lucas Nomad (Guest Spot BsAs)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Lucas Nomad (BsAs)',
        client: 'Catalina Soto',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-02T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Arriendo cobrado por el estudio: $30.000.'
      },
      {
        title: 'Boceto y Consulta Tipográfica y Lettering',
        cat: 'Bocetos y Diseño con Cliente',
        artist: 'Sofia Fineline',
        client: 'Catalina Soto',
        space: 'Sala de Consulta 1 · Bocetos & Diseño',
        date: '2026-09-02T15:00:00-04:00',
        dur: 90,
        status: 'confirmed',
        price: 40000,
        deposit: 40000,
        notes: 'Prueba tipográfica a mano alzada. Pago a residente: $40.000.'
      },
      {
        title: 'Arriendo Box 3h · Elena Guest (Guest Spot Berlín)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Elena Guest (Berlin)',
        client: 'Ignacio Silva',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-02T15:30:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Pieza avant-garde. Arriendo nómade: $30.000.'
      },

      // --- JUEVES 03 DE SEPTIEMBRE ---
      {
        title: 'Microtatuajes Fineline Constelaciones & Botánica',
        cat: 'Cita de Tatuaje',
        artist: 'Sofia Fineline',
        client: 'Martina Perez',
        space: 'Box 3 · Fineline & Micro',
        date: '2026-09-03T10:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 120000,
        deposit: 40000,
        notes: '3 microtatuajes en antebrazo y cuello. Pago a residente: $60.000.'
      },
      {
        title: 'Retrato de Ojo Realista con Lágrima',
        cat: 'Cita de Tatuaje',
        artist: 'Matias Realismo',
        client: 'Alonso Vega',
        space: 'Box 4 · Realismo & Sombras',
        date: '2026-09-03T10:30:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 170000,
        deposit: 50000,
        notes: 'Realismo puro en bíceps. Pago a residente: $60.000.'
      },
      {
        title: 'Arriendo Box 3h · Valeria Traveling (Microrealismo)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Valeria Traveling',
        client: 'Francisca Rojas',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-03T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Arriendo nómade: $30.000 por 3h.'
      },
      {
        title: 'Reunión de Bocetos y Proyecto Animal Mitológico',
        cat: 'Bocetos y Diseño con Cliente',
        artist: 'Matias Realismo',
        client: 'Sebastian Herrera',
        space: 'Sala de Consulta 1 · Bocetos & Diseño',
        date: '2026-09-03T15:00:00-04:00',
        dur: 90,
        status: 'confirmed',
        price: 40000,
        deposit: 40000,
        notes: 'Diseño digital y referencias anatómicas. Pago a residente: $40.000.'
      },
      {
        title: 'Arriendo Box 3h · Gabriel Guest (CDMX Lettering)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Gabriel Guest (CDMX)',
        client: 'Benjamin Castro',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-03T15:30:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Arriendo nómade: $30.000 por 3 horas.'
      },

      // --- VIERNES 04 DE SEPTIEMBRE ---
      {
        title: 'Peonías Neotradicionales en Antebrazo',
        cat: 'Cita de Tatuaje',
        artist: 'Camila Tattoo',
        client: 'Constanza Diaz',
        space: 'Box 1 · Neotrad & Color',
        date: '2026-09-04T10:30:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 140000,
        deposit: 50000,
        notes: 'Líneas y color brillante. Pago a residente: $60.000.'
      },
      {
        title: 'Brazalete Blackwork Tribal Moderno',
        cat: 'Cita de Tatuaje',
        artist: 'Diego Blackwork',
        client: 'Mateo Riquelme',
        space: 'Box 2 · Blackwork & Geometría',
        date: '2026-09-04T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 130000,
        deposit: 40000,
        notes: 'Líneas sólidas y trama de puntos. Pago a residente: $60.000.'
      },
      {
        title: 'Arriendo Box 3h · Lucas Nomad (Guest Spot BsAs)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Lucas Nomad (BsAs)',
        client: 'Valentina Morales',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-04T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Arriendo nómade: $30.000 por 3 horas.'
      },
      {
        title: 'Planificación de Flash Day y Campaña en Redes',
        cat: 'Marketing & Flash Day',
        artist: null,
        client: null,
        space: 'Sala de Reuniones 2 · Estudio & Equipo',
        date: '2026-09-04T17:30:00-04:00',
        dur: 90,
        status: 'confirmed',
        price: 0,
        deposit: 0,
        notes: 'Reunión de todo el equipo y nómades para coordinar posts y reels del fin de semana.'
      },

      // --- SÁBADO 05 DE SEPTIEMBRE ---
      {
        title: 'Flash Day Tattoo Especial · Piezas de Autor',
        cat: 'Cita de Tatuaje',
        artist: 'Sofia Fineline',
        client: 'Javiera Munoz',
        space: 'Box 3 · Fineline & Micro',
        date: '2026-09-05T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 120000,
        deposit: 60000,
        notes: 'Flash Day en el estudio. Pago a residente: $60.000.'
      },
      {
        title: 'Flash Day Tattoo · Realismo & Texturas',
        cat: 'Cita de Tatuaje',
        artist: 'Matias Realismo',
        client: 'Rodrigo Fernandez',
        space: 'Box 4 · Realismo & Sombras',
        date: '2026-09-05T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 160000,
        deposit: 60000,
        notes: 'Flash Day en el estudio. Pago a residente: $60.000.'
      },
      {
        title: 'Arriendo Box 3h · Elena Guest (Guest Spot Berlín)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Elena Guest (Berlin)',
        client: 'Martina Perez',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-05T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Flash Day nómade. Arriendo estudio: $30.000.'
      },
      {
        title: 'Arriendo Box 3h · Gabriel Guest (CDMX Lettering)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Gabriel Guest (CDMX)',
        client: 'Tomas Gomez',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-05T15:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Flash Day nómade tarde. Arriendo estudio: $30.000.'
      },

      // --- DOMINGO 06 DE SEPTIEMBRE ---
      {
        title: 'Arriendo Box 3h · Valeria Traveling (Fin de Gira)',
        cat: 'Arriendo de Box Nómada (3h)',
        artist: 'Valeria Traveling',
        client: 'Ignacio Silva',
        space: 'Box 5 · Guest Spot & Nómades',
        date: '2026-09-06T11:00:00-04:00',
        dur: 180,
        status: 'confirmed',
        price: 30000,
        deposit: 30000,
        notes: 'Última sesión de la gira sudamericana. Arriendo estudio: $30.000.'
      },
      {
        title: 'Reunión de Cierre Semanal & Balances del Estudio',
        cat: 'Reunión de Equipo & Estrategia',
        artist: null,
        client: null,
        space: 'Sala de Reuniones 2 · Estudio & Equipo',
        date: '2026-09-06T15:00:00-04:00',
        dur: 60,
        status: 'confirmed',
        price: 0,
        deposit: 0,
        notes: 'Revisión de liquidaciones a residentes, cobros de arriendos nómades y métricas de la semana.'
      }
    ];

    // Limpiar citas previas del estudio para una carga limpia
    await client.query('DELETE FROM appointments WHERE studio_id = $1', [studioId]);
    await client.query('DELETE FROM transactions WHERE studio_id = $1', [studioId]);

    // Insertar citas
    for (const app of appointmentsDef) {
      const catId = categoryMap[app.cat] || null;
      const artistId = app.artist ? (residentMap[app.artist] || nomadMap[app.artist] || null) : null;
      const clientId = app.client ? (clientMap[app.client] || null) : null;
      const spaceId = app.space ? (spaceMap[app.space] || null) : null;

      await client.query(`
        INSERT INTO appointments (studio_id, category_id, client_id, artist_id, space_id, title, notes, starts_at, duration_minutes, status, price, deposit)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [studioId, catId, clientId, artistId, spaceId, app.title, app.notes, app.date, app.dur, app.status, app.price, app.deposit]);
    }

    // 9. Registrar Transacciones Financieras y Liquidaciones (Ingresos y Egresos)
    // A) Ingresos por Arriendo de Boxes a Nómades ($30.000 c/u)
    const nomadIncomes = [
      { desc: 'Arriendo Box Nómada 3h · Lucas Nomad (BsAs)', amount: 30000, date: '2026-08-31', artist: nomadMap['Lucas Nomad (BsAs)'] },
      { desc: 'Arriendo Box Nómada 3h · Elena Guest (Berlín)', amount: 30000, date: '2026-08-31', artist: nomadMap['Elena Guest (Berlin)'] },
      { desc: 'Arriendo Box Nómada 3h · Valeria Traveling', amount: 30000, date: '2026-09-01', artist: nomadMap['Valeria Traveling'] },
      { desc: 'Arriendo Box Nómada 3h · Gabriel Guest (CDMX)', amount: 30000, date: '2026-09-01', artist: nomadMap['Gabriel Guest (CDMX)'] },
      { desc: 'Arriendo Box Nómada 3h · Lucas Nomad (BsAs)', amount: 30000, date: '2026-09-02', artist: nomadMap['Lucas Nomad (BsAs)'] },
      { desc: 'Arriendo Box Nómada 3h · Elena Guest (Berlín)', amount: 30000, date: '2026-09-02', artist: nomadMap['Elena Guest (Berlin)'] },
      { desc: 'Arriendo Box Nómada 3h · Valeria Traveling', amount: 30000, date: '2026-09-03', artist: nomadMap['Valeria Traveling'] },
      { desc: 'Arriendo Box Nómada 3h · Gabriel Guest (CDMX)', amount: 30000, date: '2026-09-03', artist: nomadMap['Gabriel Guest (CDMX)'] }
    ];

    for (const inc of nomadIncomes) {
      await client.query(`
        INSERT INTO transactions (studio_id, kind, description, amount, occurred_on, artist_id)
        VALUES ($1, 'income', $2, $3, $4, $5)
      `, [studioId, inc.desc, inc.amount, inc.date, inc.artist]);
    }

    // B) Ingresos por Citas de Tatuaje del Estudio
    const tattooIncomes = [
      { desc: 'Pago Sesión Manga Oriental · Sebastian Herrera', amount: 150000, date: '2026-08-31', artist: residentMap['Camila Tattoo'] },
      { desc: 'Pago Sesión Espalda Blackwork · Ignacio Silva', amount: 140000, date: '2026-08-31', artist: residentMap['Diego Blackwork'] },
      { desc: 'Pago Boceto & Consulta · Constanza Diaz', amount: 40000, date: '2026-08-31', artist: residentMap['Camila Tattoo'] },
      { desc: 'Pago Sesión Floral Fineline · Francisca Rojas', amount: 130000, date: '2026-09-01', artist: residentMap['Sofia Fineline'] },
      { desc: 'Pago Sesión Retrato Mascota Realismo · Benjamin Castro', amount: 180000, date: '2026-09-01', artist: residentMap['Matias Realismo'] },
      { desc: 'Pago Boceto & Diseño · Alonso Vega', amount: 40000, date: '2026-09-01', artist: residentMap['Diego Blackwork'] }
    ];

    for (const inc of tattooIncomes) {
      await client.query(`
        INSERT INTO transactions (studio_id, kind, description, amount, occurred_on, artist_id)
        VALUES ($1, 'income', $2, $3, $4, $5)
      `, [studioId, inc.desc, inc.amount, inc.date, inc.artist]);
    }

    // C) Egresos por Pagos y Liquidaciones a Artistas Residentes ($60.000 por tatuaje, $40.000 por boceto)
    const residentPayouts = [
      { desc: 'Liquidación comisiones · Camila Tattoo (Sesión Manga Oriental)', amount: 60000, date: '2026-08-31', artist: residentMap['Camila Tattoo'] },
      { desc: 'Liquidación comisiones · Camila Tattoo (Sesión Bocetos y Diseño)', amount: 40000, date: '2026-08-31', artist: residentMap['Camila Tattoo'] },
      { desc: 'Liquidación comisiones · Diego Blackwork (Sesión Espalda Blackwork)', amount: 60000, date: '2026-08-31', artist: residentMap['Diego Blackwork'] },
      { desc: 'Liquidación comisiones · Sofia Fineline (Sesión Floral Fineline)', amount: 60000, date: '2026-09-01', artist: residentMap['Sofia Fineline'] },
      { desc: 'Liquidación comisiones · Matias Realismo (Sesión Retrato Mascota)', amount: 60000, date: '2026-09-01', artist: residentMap['Matias Realismo'] },
      { desc: 'Liquidación comisiones · Diego Blackwork (Sesión Bocetos y Diseño)', amount: 40000, date: '2026-09-01', artist: residentMap['Diego Blackwork'] }
    ];

    for (const exp of residentPayouts) {
      await client.query(`
        INSERT INTO transactions (studio_id, kind, description, amount, occurred_on, artist_id)
        VALUES ($1, 'expense', $2, $3, $4, $5)
      `, [studioId, exp.desc, exp.amount, exp.date, exp.artist]);
    }

    // D) Gastos Generales e Insumos del Estudio
    const studioExpenses = [
      { desc: 'Insumos agujas Kwadron y cartuchos Cheyenne', amount: 85000, date: '2026-08-31' },
      { desc: 'Tintas Dynamic Triple Black & Eternal Colors', amount: 62000, date: '2026-09-01' },
      { desc: 'Mantenimiento preventivo autoclave & bioseguridad', amount: 45000, date: '2026-09-02' }
    ];

    for (const exp of studioExpenses) {
      await client.query(`
        INSERT INTO transactions (studio_id, kind, description, amount, occurred_on, artist_id)
        VALUES ($1, 'expense', $2, $3, $4, NULL)
      `, [studioId, exp.desc, exp.amount, exp.date]);
    }

    // E) Insumos de Inventario para el Estudio y Artistas
    const sampleInventoryItems = [
      { artist: null, name: 'Cartuchos Kwadron 03RL 0.25mm', cat: 'needles', unit: 'boxes', qty: 12, min: 4, cost: 24990, sale: 29990, sku: 'KW-03RL' },
      { artist: null, name: 'Cartuchos Kwadron 07M1 Mag', cat: 'needles', unit: 'boxes', qty: 8, min: 3, cost: 26990, sale: 32000, sku: 'KW-07M1' },
      { artist: null, name: 'Tinta Dynamic Triple Black 8oz', cat: 'inks', unit: 'bottles', qty: 6, min: 2, cost: 35000, sale: 42000, sku: 'DYN-BLK8' },
      { artist: null, name: 'Guantes Nitrilo Negro Talla M (100u)', cat: 'hygiene', unit: 'boxes', qty: 25, min: 8, cost: 6990, sale: 8500, sku: 'GLV-M' },
      { artist: null, name: 'Guantes Nitrilo Negro Talla S (100u)', cat: 'hygiene', unit: 'boxes', qty: 15, min: 5, cost: 6990, sale: 8500, sku: 'GLV-S' },
      { artist: null, name: 'Parche Dermal Care Roll 15cm x 10m', cat: 'aftercare', unit: 'rolls', qty: 4, min: 2, cost: 28000, sale: 36000, sku: 'DERM-ROLL' },
      { artist: null, name: 'Crema Aftercare Balm Tatudin 50g', cat: 'aftercare', unit: 'units', qty: 30, min: 10, cost: 4500, sale: 9990, sku: 'BALM-50G' },
      { artist: null, name: 'Jabón Quirúrgico Green Soap 1L', cat: 'hygiene', unit: 'bottles', qty: 5, min: 2, cost: 12500, sale: 15000, sku: 'GRN-1L' },
      { artist: residentMap['Camila Tattoo'], name: 'Set Pigmentos Neotrad Solid Ink (12 Colores)', cat: 'inks', unit: 'packs', qty: 2, min: 1, cost: 89000, sale: 0, sku: 'SLD-NEO12' },
      { artist: residentMap['Camila Tattoo'], name: 'Papel Hectográfico Spirit Thermal (100 Hojas)', cat: 'hygiene', unit: 'boxes', qty: 3, min: 1, cost: 32000, sale: 0, sku: 'SPR-100' },
      { artist: residentMap['Diego Blackwork'], name: 'Tinta Kuro Sumi Imperial Outlining 6oz', cat: 'inks', unit: 'bottles', qty: 4, min: 2, cost: 28000, sale: 0, sku: 'KUR-OUT6' }
    ];

    for (const it of sampleInventoryItems) {
      if (!it.artist) {
        const checkRes = await client.query('SELECT id FROM inventory_items WHERE studio_id = $1 AND name = $2 AND owner_user_id IS NULL', [studioId, it.name]);
        if (!checkRes.rowCount) {
          await client.query(`
            INSERT INTO inventory_items (
              studio_id, owner_user_id, name, category, unit, quantity, min_stock_alert, cost_price, sale_price, sku
            ) VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [studioId, it.name, it.cat, it.unit, it.qty, it.min, it.cost, it.sale, it.sku]);
        }
      } else {
        const checkRes = await client.query('SELECT id FROM inventory_items WHERE studio_id = $1 AND name = $2 AND owner_user_id = $3', [studioId, it.name, it.artist]);
        if (!checkRes.rowCount) {
          await client.query(`
            INSERT INTO inventory_items (
              studio_id, owner_user_id, name, category, unit, quantity, min_stock_alert, cost_price, sale_price, sku
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `, [studioId, it.artist, it.name, it.cat, it.unit, it.qty, it.min, it.cost, it.sale, it.sku]);
        }
      }
    }

    await client.query('COMMIT');
    console.log('✅ Seeding completado exitosamente con todas las entidades y agenda poblada.');
    console.log(`🔑 Credenciales de Acceso Estudio:`);
    console.log(`   Email: ${ownerEmail}`);
    console.log(`   Password: ${defaultPassword}`);
    return { ok: true, ownerEmail, defaultPassword };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en el seeding:', err);
    throw err;
  } finally {
    client.release();
    if (isStandalone) {
      await pool.end();
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed_studio.js')) {
  seedStudioData().catch(console.error);
}
