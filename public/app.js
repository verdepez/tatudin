const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');

// Helper to format currency
const money = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value || 0));

// SVG Icons library
const ICONS = {
  home: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  clients: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  finances: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  settings: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  income: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  expense: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  userCheck: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>',
  edit: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
  box: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.4 1.3-1.95 1.38-.51.08-1.17.11-3.37-.8-2.64-1.1-4.32-3.8-4.45-3.98-.13-.18-1.07-1.42-1.07-2.72 0-1.29.68-1.93.92-2.19.24-.26.53-.33.71-.33.18 0 .36 0 .52.01.17.01.39-.06.61.47.24.57.8 1.95.87 2.09.07.14.12.31.02.5-.1.18-.15.29-.3.47-.15.18-.32.39-.45.53-.15.15-.3.32-.13.62.18.3 1.13 1.86 2.43 3.01 1.67 1.48 3.08 1.94 3.52 2.16.44.22.7.19.96-.11.26-.3.12-2.06 1.41-2.06.31 0 .61.08.92.17.31.09 1.96.93 2.3 1.09.34.17.57.25.65.39.08.14.08.82-.16 1.5z"/></svg>',
  download: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  percent: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  copy: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  user: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  image: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
  share: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>',
  cloudUpload: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>'
};

const icon = (name) => ICONS[name] || '';

const STATUS_MAP = {
  inquiry: { label: 'Consulta', class: 'status-inquiry' },
  confirmed: { label: 'Confirmada', class: 'status-confirmed' },
  deposit_paid: { label: 'Seña pagada', class: 'status-deposit' },
  in_session: { label: 'En sesión', class: 'status-session' },
  completed: { label: 'Completada', class: 'status-completed' },
  cancelled: { label: 'Cancelada', class: 'status-cancelled' }
};

const ROLE_MAP = {
  owner: { label: 'Propietario', class: 'role-owner' },
  admin: { label: 'Administrador', class: 'role-admin' },
  resident: { label: 'Residente', class: 'role-resident' },
  nomad: { label: 'Nómade', class: 'role-nomad' }
};

let debugLogsBuffer = [];
function logToDebugConsole(msg) {
  const time = new Date().toLocaleTimeString();
  const logEl = document.getElementById('debug-log-output');
  const line = `[${time}] ${msg}`;
  debugLogsBuffer.push(line);
  if (debugLogsBuffer.length > 60) debugLogsBuffer.shift();
  if (logEl) {
    logEl.textContent = debugLogsBuffer.join('\n');
    logEl.scrollTop = logEl.scrollHeight;
  }
}

const api = (url, options = {}) => {
  const method = options.method || 'GET';
  const shortBody = options.body ? ` [Body: ${options.body.slice(0, 80)}]` : '';
  logToDebugConsole(`> ${method} ${url}${shortBody}`);
  return fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options }).then(async (response) => {
    let data = {};
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      logToDebugConsole(`< ${method} ${url} HTTP ${response.status} (Texto plano: ${text.slice(0, 100)})`);
      throw new Error(text || `Error ${response.status}: No se pudo procesar la solicitud`);
    }
    const respSummary = JSON.stringify(data).slice(0, 100);
    logToDebugConsole(`< ${method} ${url} HTTP ${response.status} ${response.ok ? '✓ OK' : '⚠ FALLÓ'} [${respSummary}]`);
    if (!response.ok) throw new Error(data.error || 'No se pudo completar la operación');
    return data;
  });
};

let clients = [];
let members = [];
let spaces = [];
let categories = [];
let userStudios = [];
let activeStudio = null;
let currentUser = null;
let agendaFilter = { date: null, artistId: 'all', spaceId: 'all', categoryId: 'all' };
let onboarding = JSON.parse(localStorage.getItem('tatudin_onboarding') || '{}');

function formatTime(isoString) {
  if (!isoString) return '10:00';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '10:00';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNextDefaultDateTime() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function saveOnboarding(values) {
  onboarding = { ...onboarding, ...values };
  const safeOnboarding = { ...onboarding };
  delete safeOnboarding.password;
  localStorage.setItem('tatudin_onboarding', JSON.stringify(safeOnboarding));
  return api('/api/onboarding', { method: 'PUT', body: JSON.stringify(safeOnboarding) });
}

function onboardingHeader(step, title, description, isLogin = false) {
  if (isLogin) {
    return `
      <div class="onboarding-top">
        <span class="onboarding-top-spacer"></span>
        <strong>tatudin</strong>
        <span class="onboarding-top-spacer"></span>
      </div>
      ${title ? `<div class="auth-fade"><h1>${title}</h1><p>${description}</p></div>` : ''}
    `;
  }
  return `
    <div class="onboarding-top">
      ${step ? '<button class="onboarding-close" data-onboarding-back aria-label="Volver">×</button>' : '<span class="onboarding-top-spacer"></span>'}
      <strong>tatudin</strong>
      ${step ? `<span class="onboarding-step-badge">${step} / 5</span>` : '<span class="onboarding-top-spacer"></span>'}
    </div>
    ${step ? `<div class="progress"><i style="width:${step * 20}%"></i></div>` : ''}
    ${title ? `<div class="auth-fade"><h1>${title}</h1><p>${description}</p></div>` : ''}
  `;
}

function hideSplash() {
  const splash = document.querySelector('#app-splash');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      if (splash.parentNode) splash.style.display = 'none';
    }, 400);
  }
}

function onboardingFooter(back = true) {
  return `
    <footer class="onboarding-footer auth-fade">
      ${back ? '<button class="text-button" data-onboarding-back>← Atrás</button>' : '<span></span>'}
      <button class="primary" data-onboarding-next>Continuar <span>→</span></button>
    </footer>
  `;
}

function renderOnboarding(step = 0, authMode = 'register') {
  closeModal();
  document.body.classList.add('onboarding-mode');
  const ws = document.querySelector('#workspace');
  if (ws) ws.style.display = 'flex';
  hideSplash();
  app.innerHTML = '';
  if (step === 0) {
    app.innerHTML = `
      <section class="onboarding welcome auth-fade">
        ${onboardingHeader()}
        <div class="welcome-brand">
          <span class="brand-mark">t</span>
          <strong>tatudin</strong>
        </div>
        <div class="welcome-copy">
          <h1>Enfócate en tu arte.<br />Nosotros nos ocupamos del resto.</h1>
          <p>El espacio operativo para tatuadores y estudios profesionales.</p>
        </div>
        <img class="welcome-art" src="/assets/muneco-fondo-azul.png" alt="Tatuador en su espacio creativo" />
        <div class="social-buttons">
          <button class="outline-button">Continuar con Google</button>
          <button class="outline-button">Continuar con Apple</button>
          <button class="primary" data-onboarding-step="1" data-auth-mode="register">Crear cuenta con email</button>
          <button class="secondary" data-onboarding-step="1" data-auth-mode="login">Iniciar sesión con tu cuenta</button>
        </div>
        <p class="terms">Al continuar aceptas los <button type="button" class="text-link-btn" data-action="open-terms" data-from-step="0" data-auth-mode="${authMode}">Términos y la Política de Privacidad</button>.</p>
      </section>
    `;
    return;
  }
  if (step === 1) {
    const isLogin = authMode === 'login';
    app.innerHTML = `
      <section class="onboarding auth-view-section" data-step="1">
        ${onboardingHeader(1, isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta', isLogin ? 'Ingresa tus credenciales para acceder a tu estudio.' : 'Únete al espacio para tatuadores profesionales.', isLogin)}
        
        <div class="auth-tabs">
          <button type="button" class="auth-tab ${!isLogin ? 'active' : ''}" data-switch-auth="register">Crear cuenta</button>
          <button type="button" class="auth-tab ${isLogin ? 'active' : ''}" data-switch-auth="login">Iniciar sesión</button>
        </div>

        ${isLogin ? `
          <form class="onboarding-card auth-fade" data-onboarding-form="login">
            <label>Email<input name="email" type="email" value="${onboarding.email || ''}" placeholder="artist@studio.com" autocomplete="email" required /></label>
            <label>Contraseña<input name="password" type="password" placeholder="Tu contraseña" autocomplete="current-password" required /></label>
            <button class="primary" type="submit" style="margin-top: 6px;">Iniciar sesión <span>→</span></button>
            <p class="form-error"></p>

            <div class="auth-switch-prompt">
              ¿No tienes una cuenta? <button type="button" class="text-button" data-switch-auth="register">Regístrate gratis</button>
            </div>
          </form>
        ` : `
          <form class="onboarding-card auth-fade" data-onboarding-form="register">
            <label>Nombre completo<input name="fullName" value="${onboarding.fullName || ''}" placeholder="Tu nombre completo" required /></label>
            <label>Email<input name="email" type="email" value="${onboarding.email || ''}" placeholder="artist@studio.com" required /></label>
            <label>Crea una contraseña<input name="password" type="password" placeholder="Mínimo 8 caracteres" minlength="8" required /></label>
            <button class="primary" type="submit" style="margin-top: 6px;">Crear cuenta <span>→</span></button>
            <p class="form-error"></p>
            <div class="auth-switch-prompt">
              ¿Ya tienes cuenta? <button type="button" class="text-button" data-switch-auth="login">Inicia sesión</button>
            </div>
          </form>
        `}
        <p class="terms" style="margin-top: 14px; text-align: center;">Plataforma profesional regulada por la <button type="button" class="text-link-btn" data-action="open-terms" data-from-step="1" data-auth-mode="${authMode}">Ley N° 19.628 de Protección de la Vida Privada</button>.</p>

        <!-- Live Debug / Diagnostics Panel -->
        <div id="tatudin-debug-panel" class="debug-panel-container">
          <div class="debug-panel-header">
            <strong>🛠️ MODO DEBUG / DIAGNÓSTICO EN VIVO</strong>
            <span id="debug-status-pill" class="debug-status-pill">Verificando...</span>
          </div>
          <div class="debug-panel-body">
            <div class="debug-grid">
              <div class="debug-card">
                <span class="debug-label">ESTADO BASE DE DATOS</span>
                <div id="debug-db-status" class="debug-val">Consultando...</div>
              </div>
              <div class="debug-card">
                <span class="debug-label">SUPERADMIN (ROOT)</span>
                <div id="debug-root-status" class="debug-val">Consultando...</div>
              </div>
              <div class="debug-card">
                <span class="debug-label">TABLAS ENCONTRADAS</span>
                <div id="debug-tables-status" class="debug-val">Consultando...</div>
              </div>
            </div>

            <div class="debug-actions-row">
              <button type="button" class="debug-btn" id="btn-debug-refresh">🔄 Refrescar</button>
              <button type="button" class="debug-btn" id="btn-debug-reset-root">👑 Crear / Resetear Root</button>
              <button type="button" class="debug-btn" id="btn-debug-init-db">🌱 Inicializar BD</button>
              <button type="button" class="debug-btn debug-btn-primary" id="btn-debug-autologin-root">⚡ Auto-Login Superadmin</button>
            </div>

            <div class="debug-console-log">
              <div class="debug-log-header">
                <span>Consola de Peticiones y Diagnóstico en Vivo:</span>
                <button type="button" class="debug-clear-btn" id="btn-debug-clear-logs">Limpiar</button>
              </div>
              <pre id="debug-log-output" class="debug-log-text">Iniciando diagnóstico...</pre>
            </div>
          </div>
        </div>
      </section>
    `;
    setTimeout(() => initDebugMode(), 0);
    return;
  }
  if (step === 2) {
    const roles = [
      ['independent', '◉', 'Artista independiente', 'Gestiona tu agenda, clientes y finanzas con facilidad.'],
      ['studio_owner', '▦', 'Studio owner', 'Coordina artistas residentes, nómades y el crecimiento del estudio.'],
      ['apprentice', '◇', 'Aprendiz', 'Organiza tus referencias y lleva el registro de tus horas de aprendizaje.']
    ];
    app.innerHTML = `
      <section class="onboarding" data-step="2">
        ${onboardingHeader(2, 'Cuéntanos sobre ti.', 'Personalizaremos tu espacio según tu rol.')}
        <div class="role-list">
          ${roles.map(([value, ic, title, text]) => `
            <button class="role-card ${onboarding.role === value ? 'selected' : ''}" data-role="${value}">
              <span class="role-icon">${ic}</span>
              <strong>${title}</strong>
              <p>${text}</p>
            </button>
          `).join('')}
        </div>
        ${onboardingFooter()}
      </section>
    `;
    return;
  }
  if (step === 3) {
    const studio = onboarding.role === 'studio_owner';
    app.innerHTML = `
      <section class="onboarding" data-step="3">
        ${onboardingHeader(3, studio ? 'Identidad del estudio' : 'Tu perfil de artista', studio ? 'Define el tono de la experiencia de tu estudio.' : 'Así te verán tus clientes en Tatudin.')}
        <form class="onboarding-card" data-onboarding-form="profile">
          ${studio ? `
            <label>Nombre del estudio<input name="studioName" value="${onboarding.studioName || ''}" placeholder="Ej. Sacred Geometry Tattoo" required /></label>
            <div class="form-grid">
              <label>Número de artistas
                <select name="artistCount">
                  <option value="1">1 (estudio privado)</option>
                  <option value="2">2 a 5 artistas</option>
                  <option value="6">6 o más artistas</option>
                </select>
              </label>
              <label>Tipo de negocio
                <select name="businessType">
                  <option value="street">Street</option>
                  <option value="private">Privado</option>
                </select>
              </label>
            </div>
            <label>Ubicación del estudio<input name="studioLocation" value="${onboarding.studioLocation || ''}" placeholder="Dirección del estudio" /></label>
          ` : `
            <label>Nombre profesional<input name="professionalName" value="${onboarding.professionalName || ''}" placeholder="Ej. Alex Ink" required /></label>
            <label>Especialidad<input name="specialization" value="${onboarding.specialization || ''}" placeholder="Fine line, tradicional, blackwork..." required /></label>
            <label>Bio del artista<textarea name="bio" rows="3" placeholder="Cuéntales a tus clientes sobre tu enfoque...">${onboarding.bio || ''}</textarea></label>
          `}
          <button class="primary" type="submit">Continuar <span>→</span></button>
        </form>
        ${onboardingFooter()}
      </section>
    `;
    return;
  }
  if (step === 4) {
    const sources = ['Instagram', 'Buscador', 'Recomendación', 'Evento', 'Otro'];
    app.innerHTML = `
      <section class="onboarding" data-step="4">
        ${onboardingHeader(4, '¿Cómo nos encontraste?', 'Así podemos mejorar tu experiencia.')}
        <div class="choice-list">
          ${sources.map((source) => `
            <button class="choice ${onboarding.acquisitionSource === source ? 'selected' : ''}" data-source="${source}">
              <span>${source}</span>
              <span class="choice-arrow">›</span>
            </button>
          `).join('')}
        </div>
        ${onboardingFooter()}
      </section>
    `;
    return;
  }
  const goals = ['Organizar mi agenda', 'Gestionar mis clientes', 'Controlar mis finanzas', 'Hacer crecer mi estudio'];
  app.innerHTML = `
    <section class="onboarding" data-step="5">
      ${onboardingHeader(5, '¿Qué quieres lograr?', 'Elige todo lo que te ayude a trabajar mejor.')}
      <div class="choice-list multi">
        ${goals.map((goal) => `
          <button class="choice ${onboarding.goals?.includes(goal) ? 'selected' : ''}" data-goal="${goal}">
            <span>${goal}</span>
            <span class="choice-check">${onboarding.goals?.includes(goal) ? '✓' : '+'}</span>
          </button>
        `).join('')}
      </div>
      <button class="primary finish" data-finish>Finalizar configuración <span>→</span></button>
    </section>
  `;
}

function updateStudioSidebarUI() {
  const container = document.querySelector('.sidebar');
  if (!container) return;
  const nameEl = container.querySelector('#studio-name');
  if (userStudios && userStudios.length > 1) {
    nameEl.innerHTML = `
      <select id="studio-selector" class="studio-selector-dropdown">
        ${userStudios.map((s) => `<option value="${s.id}" ${s.is_active ? 'selected' : ''}>${s.name}</option>`).join('')}
      </select>
    `;
    document.querySelector('#studio-selector')?.addEventListener('change', async (e) => {
      await api('/api/auth/switch-studio', { method: 'POST', body: JSON.stringify({ studioId: Number(e.target.value) }) });
      await startApp();
    });
  } else if (nameEl && activeStudio?.name) {
    nameEl.textContent = activeStudio.name;
  }
}

function updateUserMenuUI() {
  if (!currentUser) return;
  const name = currentUser.full_name || currentUser.fullName || 'Usuario';
  const email = currentUser.email || '';
  const initials = ((name).split(' ').map((p) => p[0]).slice(0, 2).join('')).toUpperCase();
  
  const avatarEl = document.querySelector('#user-avatar') || document.querySelector('.avatar');
  if (avatarEl) avatarEl.textContent = initials;
  
  const menuAvatarEl = document.querySelector('#user-menu-avatar');
  if (menuAvatarEl) menuAvatarEl.textContent = initials;

  const menuNameEl = document.querySelector('#user-menu-name');
  if (menuNameEl) menuNameEl.textContent = name;

  const menuEmailEl = document.querySelector('#user-menu-email');
  if (menuEmailEl) menuEmailEl.textContent = email;
}

async function startApp() {
  const ws = document.querySelector('#workspace');
  document.body.classList.remove('onboarding-mode');
  const healthEl = document.querySelector('#health');
  if (healthEl) healthEl.textContent = 'conectada';

  try {
    const [meData, stData, memData, spData, catData, stList] = await Promise.all([
      api('/api/auth/me').catch(() => null),
      api('/api/studio').catch(() => null),
      api('/api/members').catch(() => []),
      api('/api/spaces').catch(() => []),
      api('/api/categories').catch(() => []),
      api('/api/auth/studios').catch(() => [])
    ]);

    if (!meData?.user) {
      if (ws) ws.style.display = 'none';
      hideSplash();
      return renderOnboarding(1, 'login');
    }

    currentUser = meData.user;
    updateUserMenuUI();

    const isSuper = Boolean(currentUser.is_superadmin || currentUser.isSuperAdmin || currentUser.email === 'soyelroot@tatudin.cl');
    const rootBadge = document.querySelector('#superadmin-top-badge');
    if (rootBadge) rootBadge.style.display = isSuper ? 'flex' : 'none';
    document.querySelectorAll('.root-nav-item, .root-dropdown-item').forEach((el) => {
      el.style.display = isSuper ? 'flex' : 'none';
    });

    activeStudio = stData;
    members = memData;
    spaces = spData;
    categories = catData;
    userStudios = stList;
    updateStudioSidebarUI();
  } catch (e) {
    console.warn('Sync app dependencies:', e);
    if (ws) ws.style.display = 'none';
    hideSplash();
    return renderOnboarding(1, 'login');
  }

  if (ws) ws.style.display = 'flex';
  hideSplash();

  if (currentUser.email === 'soyelroot@tatudin.cl' || currentUser.is_superadmin) {
    await render('backoffice');
  } else {
    await render('dashboard');
  }
}

function appointmentCard(item) {
  const statusInfo = STATUS_MAP[item.status] || { label: item.status?.replace('_', ' ') || 'Confirmado', class: 'status-default' };
  const roleInfo = ROLE_MAP[item.artist_role] || { label: 'Artista', class: 'role-resident' };
  const timeFormatted = formatTime(item.starts_at);
  const isCompleted = item.status === 'completed';
  const cleanPhone = (item.client_phone || '').replace(/[^0-9+]/g, '');
  const catColor = item.category_color || '#7C3AED';
  const catName = item.category_name || 'Compromiso';

  const primaryTitle = item.client_name ? item.client_name : item.title;
  const secondaryTitle = item.client_name
    ? `${item.title} · ${item.duration_minutes || 60} min`
    : `${item.notes ? item.notes + ' · ' : ''}${item.duration_minutes || 60} min`;

  return `
    <article class="appointment-card">
      <div class="appointment-time-badge">
        <span class="time-main">${timeFormatted}</span>
        <span class="time-sub">HRS</span>
      </div>
      <div class="appointment-details">
        <div class="appointment-title-row">
          <h3 class="client-name">${primaryTitle}</h3>
        </div>
        <div class="appointment-chips-row">
          <span class="category-chip" style="--cat-color: ${catColor}">
            <span class="cat-dot" style="background: ${catColor}"></span>
            ${catName}
          </span>
          <span class="status-chip ${statusInfo.class}">${statusInfo.label}</span>
          ${item.artist_name ? `<span class="artist-chip ${roleInfo.class}">${(item.artist_name || '').split(' ')[0]}</span>` : ''}
          ${item.space_name ? `<span class="space-chip">${icon('box')} ${item.space_name}</span>` : ''}
        </div>
        <p class="service-title">${secondaryTitle}</p>
      </div>
      <div class="appointment-actions">
        ${cleanPhone ? `
          <button class="whatsapp-btn" data-action="whatsapp-reminder"
            data-phone="${cleanPhone}"
            data-client-name="${item.client_name || 'Cliente'}"
            data-title="${item.title || 'Sesión'}"
            data-starts-at="${item.starts_at}"
            data-artist-name="${item.artist_name || ''}"
            data-space-name="${item.space_name || ''}"
            title="Enviar recordatorio por WhatsApp">
            ${icon('whatsapp')}
          </button>
        ` : ''}
        <button class="status-action-btn ${isCompleted ? 'is-completed' : ''}" data-status-id="${item.id}" aria-label="Marcar completada" title="${isCompleted ? 'Completada' : 'Marcar como completada'}">
          ${icon('check')}
        </button>
      </div>
    </article>
  `;
}

function emptyState(title, text) {
  return `<div class="empty"><h3>${title}</h3><p>${text}</p></div>`;
}

let currentAppView = 'dashboard';

async function render(view = 'dashboard') {
  currentAppView = view;
  document.querySelectorAll('[data-view]').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === view);
  });

  try {
    if (view === 'agenda') return await renderAgenda();
    if (view === 'clientes') return await renderClients();
    if (view === 'finanzas') return await renderFinances();
    if (view === 'ajustes') return await renderSettings();
    if (view === 'portafolio') return await renderPortfolio();
    if (view === 'terminos') return renderTermsAndConditions(false);
    if (view === 'backoffice') return await renderBackoffice();

    const data = await api('/api/dashboard');
    activeStudio = data.studio || activeStudio;
    updateStudioSidebarUI();

    const todayStr = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()).toUpperCase();

    app.innerHTML = `
      <section class="intro">
        <p class="eyebrow">${todayStr}</p>
        <h1>Todo listo para hoy<span class="dot">.</span></h1>
        <p class="lead">Una mirada clara a tu estudio, sin ruido.</p>
      </section>

      <section class="actions">
        <button class="primary" data-action="new-booking">
          ${icon('plus')} <span>Nuevo compromiso</span>
        </button>
        <button class="secondary" data-view="agenda">
          ${icon('calendar')} <span>Ver agenda</span>
        </button>
      </section>

      <section class="today panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">PRÓXIMOS COMPROMISOS</p>
            <h2>Tu agenda de hoy</h2>
          </div>
          <span class="count">${(data.appointments || []).length} ${(data.appointments || []).length === 1 ? 'compromiso' : 'compromisos'}</span>
        </div>
        <div class="appointment-list">
          ${(data.appointments || []).slice(0, 4).map(appointmentCard).join('') || emptyState('No hay compromisos próximos', 'Crea el primer compromiso de tu agenda.')}
        </div>
      </section>

      <section class="stats">
        <article class="stat-card">
          <div class="stat-card-header">
            <span class="stat-icon-bubble purple">${icon('clock')}</span>
            <p class="eyebrow">TRABAJOS DEL MES</p>
          </div>
          <strong>${data.stats?.completed_appointments || 0}</strong>
          <small>Citas completadas</small>
        </article>

        <article class="stat-card">
          <div class="stat-card-header">
            <span class="stat-icon-bubble green">${icon('finances')}</span>
            <p class="eyebrow">INGRESOS</p>
          </div>
          <strong>${money(data.stats?.income || 0)}</strong>
          <small>Registrados este mes</small>
        </article>

        <article class="stat-card">
          <div class="stat-card-header">
            <span class="stat-icon-bubble red">${icon('clients')}</span>
            <p class="eyebrow">CLIENTES</p>
          </div>
          <strong>${data.stats?.clients || 0}</strong>
          <small>Base de datos activa</small>
        </article>
      </section>

      <section class="next panel">
        <div>
          <p class="eyebrow">OPERACIÓN</p>
          <h2>Tu espacio crece contigo</h2>
          <p>Artistas residentes, nómades, boxes y finanzas en un solo lugar.</p>
        </div>
        <span class="arrow">${icon('arrowRight')}</span>
      </section>
    `;
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    app.innerHTML = `
      <section class="empty panel">
        <h2>No pudimos cargar Tatudin</h2>
        <p>${error.message}</p>
        <button class="primary" data-retry>Reintentar</button>
      </section>
    `;
  }
}

async function renderAgenda() {
  const queryParams = new URLSearchParams();
  if (agendaFilter.artistId !== 'all') queryParams.append('artistId', agendaFilter.artistId);
  if (agendaFilter.spaceId !== 'all') queryParams.append('spaceId', agendaFilter.spaceId);
  if (agendaFilter.categoryId !== 'all') queryParams.append('categoryId', agendaFilter.categoryId);
  if (agendaFilter.date) queryParams.append('date', agendaFilter.date);

  const [appointmentsList, membersList, spacesList, categoriesList] = await Promise.all([
    api(`/api/appointments?${queryParams.toString()}`).catch(() => []),
    api('/api/members').catch(() => []),
    api('/api/spaces').catch(() => []),
    api('/api/categories').catch(() => [])
  ]);
  members = membersList;
  spaces = spacesList;
  categories = categoriesList;

  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const dateISO = formatDateISO(date);
    return {
      weekday: date.toLocaleDateString('es-CL', { weekday: 'short' }),
      day: date.getDate(),
      dateISO,
      isSelected: agendaFilter.date === dateISO
    };
  });

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">AGENDA & CALENDARIO</p>
        <h1>Tu calendario<span class="dot">.</span></h1>
        <p class="lead">Filtra por categorías de compromiso, artistas o boxes para coordinar tu día.</p>
      </div>
      <button class="primary" data-action="new-booking">${icon('plus')} <span>Nuevo compromiso</span></button>
    </section>

    <!-- Category Filter Chips -->
    <section class="agenda-category-chips">
      <button class="cat-filter-btn ${agendaFilter.categoryId === 'all' ? 'active' : ''}" data-select-category="all">
        Todos <span class="badge">${appointmentsList.length}</span>
      </button>
      ${categories.map((c) => `
        <button class="cat-filter-btn ${String(agendaFilter.categoryId) === String(c.id) ? 'active' : ''}" data-select-category="${c.id}" style="--cat-color: ${c.color}">
          <span class="cat-color-dot" style="background: ${c.color}"></span>
          <span>${c.name}</span>
          <span class="badge">${c.appointment_count || 0}</span>
        </button>
      `).join('')}
      <button class="text-button" data-view="ajustes" style="margin-left: auto; font-size: 12px; white-space: nowrap; color: var(--muted);">
        ${icon('edit')} Gestionar categorías
      </button>
    </section>

    <!-- Interactive Week Filter -->
    <section class="week panel">
      <div class="week-header">
        <span class="week-title">${agendaFilter.date ? `Filtrando día: ${agendaFilter.date}` : 'Próximos 7 días'}</span>
        ${agendaFilter.date ? `<button class="text-button" data-clear-date>Mostrar toda la semana</button>` : ''}
      </div>
      <div class="week-days">
        ${daysOfWeek.map((d) => `
          <button class="day ${d.isSelected ? 'selected' : ''}" data-select-date="${d.dateISO}">
            <span>${d.weekday}</span>
            <strong>${d.day}</strong>
          </button>
        `).join('')}
      </div>
    </section>

    <!-- Filters Bar (Artist, Space & Count) -->
    <section class="agenda-filter-bar">
      <div class="filter-group">
        <label>Artista / Responsable:</label>
        <select id="agenda-artist-filter">
          <option value="all" ${agendaFilter.artistId === 'all' ? 'selected' : ''}>Todos (${members.length})</option>
          ${members.map((m) => `<option value="${m.id}" ${String(agendaFilter.artistId) === String(m.id) ? 'selected' : ''}>${m.full_name}</option>`).join('')}
        </select>
      </div>

      <div class="filter-group">
        <label>Box / Espacio:</label>
        <select id="agenda-space-filter">
          <option value="all" ${agendaFilter.spaceId === 'all' ? 'selected' : ''}>Todos los boxes</option>
          ${spaces.map((s) => `<option value="${s.id}" ${String(agendaFilter.spaceId) === String(s.id) ? 'selected' : ''}>${s.name}</option>`).join('')}
        </select>
      </div>

      <span class="count">${appointmentsList.length} ${appointmentsList.length === 1 ? 'compromiso' : 'compromisos'}</span>
    </section>

    <section class="agenda-list">
      ${appointmentsList.map(appointmentCard).join('') || emptyState('Agenda despejada', 'No hay compromisos registrados para los filtros seleccionados.')}
    </section>
  `;

  document.querySelector('#agenda-artist-filter')?.addEventListener('change', (e) => {
    agendaFilter.artistId = e.target.value;
    renderAgenda();
  });
  document.querySelector('#agenda-space-filter')?.addEventListener('change', (e) => {
    agendaFilter.spaceId = e.target.value;
    renderAgenda();
  });
}

async function renderClients(search = '') {
  clients = await api(`/api/clients?search=${encodeURIComponent(search)}`).catch(() => []);
  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">CLIENTES</p>
        <h1>Personas, no fichas<span class="dot">.</span></h1>
        <p class="lead">Haz clic en cualquier cliente para ver su historial clínico y de sesiones.</p>
      </div>
      <button class="primary" data-action="new-client">${icon('plus')} <span>Nuevo cliente</span></button>
    </section>

    <section class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">${icon('search')}</span>
        <input id="client-search" type="search" placeholder="Buscar por nombre, email o teléfono..." value="${search}" />
      </div>
      <span class="count">${clients.length} ${clients.length === 1 ? 'cliente' : 'clientes'}</span>
    </section>

    <section class="client-list panel">
      ${clients.map((client) => {
        const initials = (client.name || 'C').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
        return `
          <article class="client-row cursor-pointer" data-view-client-id="${client.id}">
            <div class="initials">${initials}</div>
            <div class="client-info">
              <h3>${client.name}</h3>
              <p>${client.email || 'Sin email'} · ${client.phone || 'Sin teléfono'}</p>
            </div>
            <span class="client-sessions">${client.appointment_count || 0} ${client.appointment_count === 1 ? 'sesión' : 'sesiones'}</span>
          </article>
        `;
      }).join('') || emptyState('Aún no hay clientes', 'Crea un perfil para comenzar a organizar su historia.')}
    </section>
  `;

  document.querySelector('#client-search')?.addEventListener('input', (event) => renderClients(event.target.value));
}

async function clientDetailModal(clientId) {
  try {
    const client = await api(`/api/clients/${clientId}`);
    const initials = (client.name || 'C').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
    openModal(`
      <div class="client-detail-header">
        <div class="initials large">${initials}</div>
        <div>
          <p class="eyebrow">FICHA DE CLIENTE</p>
          <h2>${client.name}</h2>
          <p class="client-contact-lead">${client.email || 'Sin email'} · ${client.phone || 'Sin teléfono'}</p>
        </div>
      </div>

      <div class="client-stats-row">
        <div class="client-mini-stat">
          <small>SESIONES</small>
          <strong>${(client.appointments || []).length}</strong>
        </div>
        <div class="client-mini-stat">
          <small>TOTAL INVERTIDO</small>
          <strong>${money(client.total_spent || 0)}</strong>
        </div>
      </div>

      <div class="client-notes-box">
        <div class="client-notes-title">
          <span>Notas y consideraciones</span>
          <button class="text-button" data-edit-client-id="${client.id}">${icon('edit')} Editar</button>
        </div>
        <p>${client.notes || 'Sin notas registradas aún.'}</p>
      </div>

      <div class="client-sessions-section">
        <div class="section-heading">
          <h3>Historial de sesiones</h3>
          <button class="primary small-btn" data-action="new-booking-for" data-client-id="${client.id}" data-client-name="${client.name}">+ Agendar cita</button>
        </div>
        <div class="appointment-list">
          ${(client.appointments || []).map(appointmentCard).join('') || '<p class="empty-note">No hay citas registradas para este cliente.</p>'}
        </div>
      </div>
    `);
  } catch (err) {
    console.error('Error opening client detail modal:', err);
    alert('Error al abrir la ficha del cliente: ' + err.message);
  }
}

function editClientModal(clientId) {
  api(`/api/clients/${clientId}`).then((client) => {
    openModal(`
      <p class="eyebrow">EDITAR CLIENTE</p>
      <h2 id="modal-title">${client.name}</h2>
      <form data-form="edit-client" data-id="${client.id}">
        <label>Nombre completo<input name="name" value="${client.name}" required /></label>
        <div class="form-grid">
          <label>Email<input name="email" type="email" value="${client.email || ''}" /></label>
          <label>Teléfono<input name="phone" value="${client.phone || ''}" /></label>
        </div>
        <label>Notas del cliente<textarea name="notes" rows="4">${client.notes || ''}</textarea></label>
        <button class="primary" type="submit">${icon('check')} Guardar cambios</button>
        <p class="form-error"></p>
      </form>
    `);
  }).catch((err) => alert(err.message));
}

async function renderFinances() {
  const [transactions, artistSummary] = await Promise.all([
    api('/api/transactions').catch(() => []),
    api('/api/finances/summary').catch(() => [])
  ]);

  const income = transactions.filter((item) => item.kind === 'income').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenses = transactions.filter((item) => item.kind === 'expense').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = income - expenses;

  const totalCommissions = artistSummary.reduce((sum, a) => sum + Number(a.artist_payout || 0), 0);
  const totalPending = artistSummary.reduce((sum, a) => sum + Number(a.pending_settlement || 0), 0);
  const totalStudioMargin = artistSummary.reduce((sum, a) => sum + Number(a.studio_margin || 0), 0);

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">FINANZAS & LIQUIDACIONES</p>
        <h1>Lo que realmente te queda<span class="dot">.</span></h1>
        <p class="lead">Control consolidado de ingresos, comisiones de artistas y margen neto del estudio.</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="secondary" data-action="export-finances-csv">${icon('download')} <span>Exportar CSV</span></button>
        <button class="primary" data-action="new-transaction">${icon('plus')} <span>Registrar movimiento</span></button>
      </div>
    </section>

    <section class="stats" style="margin-bottom: 24px;">
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Saldo Neto Disponible</span>
          <div class="stat-icon-bubble">${icon('finances')}</div>
        </div>
        <strong class="stat-value" style="color: ${balance >= 0 ? 'var(--green-text)' : 'var(--red)'};">${money(balance)}</strong>
        <p class="stat-trend">Ingresos menos gastos totales</p>
      </article>

      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Ingresos Registrados</span>
          <div class="stat-icon-bubble">${icon('income')}</div>
        </div>
        <strong class="stat-value">${money(income)}</strong>
        <p class="stat-trend">Total cobrado por sesiones y señas</p>
      </article>

      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Comisiones Artistas</span>
          <div class="stat-icon-bubble">${icon('percent')}</div>
        </div>
        <strong class="stat-value">${money(totalCommissions)}</strong>
        <p class="stat-trend" style="color: ${totalPending > 0 ? 'var(--red)' : 'var(--muted)'};">${totalPending > 0 ? `${money(totalPending)} por liquidar` : 'Todas liquidadas'}</p>
      </article>

      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Margen Neto Estudio</span>
          <div class="stat-icon-bubble">${icon('box')}</div>
        </div>
        <strong class="stat-value">${money(totalStudioMargin)}</strong>
        <p class="stat-trend">Retención del estudio tras comisiones</p>
      </article>
    </section>

    <!-- Artist Performance & Settlements Table -->
    <section class="panel" style="margin-bottom: 20px;">
      <div class="section-heading">
        <div>
          <p class="eyebrow">EQUIPO Y COMISIONES</p>
          <h2>Liquidaciones por artista</h2>
        </div>
      </div>
      <div class="artist-performance-list">
        ${artistSummary.map((a) => {
          const rInfo = ROLE_MAP[a.artist_role] || { label: a.artist_role, class: 'role-resident' };
          const initials = (a.artist_name || 'A').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
          const pending = Number(a.pending_settlement || 0);
          return `
            <article class="artist-performance-row">
              <div class="initials">${initials}</div>
              <div class="artist-perf-info">
                <div class="member-header">
                  <h3>${a.artist_name}</h3>
                  <span class="artist-chip ${rInfo.class}">${rInfo.label}</span>
                  <span class="commission-badge">${a.commission_percent || 70}% comisión</span>
                </div>
                <div class="perf-metric-grid">
                  <span>Facturado: <strong>${money(a.total_generated)}</strong></span>
                  <span>Comisión: <strong>${money(a.artist_payout)}</strong></span>
                  <span>Liquidado: <strong>${money(a.settled_amount)}</strong></span>
                  <span style="color: ${pending > 0 ? 'var(--red)' : 'var(--green-text)'}; font-weight: 700;">
                    Pendiente: ${money(pending)}
                  </span>
                </div>
              </div>
              <div class="perf-actions">
                ${pending > 0 ? `
                  <button class="primary small settle-btn" data-action="settle-artist"
                    data-artist-id="${a.artist_id}"
                    data-artist-name="${a.artist_name}"
                    data-pending="${pending}">
                    ${icon('check')} Liquidar
                  </button>
                ` : '<span class="settle-badge paid">Al día</span>'}
              </div>
            </article>
          `;
        }).join('') || '<p class="empty-note">Sin actividad de artistas registrada en este período.</p>'}
      </div>
    </section>

    <section class="transaction-list panel">
      <div class="section-heading">
        <h2>Historial de movimientos</h2>
        <span class="count">${transactions.length} ${transactions.length === 1 ? 'movimiento' : 'movimientos'}</span>
      </div>
      ${transactions.map((item) => `
        <article class="transaction">
          <span class="transaction-kind ${item.kind}">${item.kind === 'income' ? '+' : '−'}</span>
          <div class="transaction-info">
            <h3>${item.description}</h3>
            <p>${item.occurred_on}${item.artist_name ? ` · ${item.artist_name}` : ''}</p>
          </div>
          <strong class="transaction-amount ${item.kind}">${item.kind === 'income' ? '+' : '−'}${money(item.amount)}</strong>
        </article>
      `).join('') || emptyState('Sin movimientos', 'Registra tu primer ingreso o gasto.')}
    </section>
  `;
}

async function renderSettings() {
  const [stData, memList, spList, guestList, catList] = await Promise.all([
    api('/api/studio').catch(() => ({ name: 'Mi Estudio', currency: 'CLP', timezone: 'America/Santiago', account_type: 'independent' })),
    api('/api/members').catch(() => []),
    api('/api/spaces').catch(() => []),
    api('/api/guest-spots').catch(() => []),
    api('/api/categories').catch(() => [])
  ]);
  activeStudio = stData;
  members = memList;
  spaces = spList;
  categories = catList;

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">AJUSTES Y GESTIÓN</p>
        <h1>Tu estudio, a tu manera<span class="dot">.</span></h1>
        <p class="lead">Administra tu equipo, categorías de agenda, boxes de arriendo y solicitudes de nómades.</p>
      </div>
    </section>

    <div class="settings-stack">
      <!-- Artist Portfolio & Landing Page Section -->
      <section class="panel portfolio-highlight-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">WEB & PORTAFOLIO PÚBLICO</p>
            <h2>Landing Page y Portafolio de Artista</h2>
          </div>
          <button class="primary small-btn" data-view="portafolio">
            ${icon('eye')} <span>Editar mi Portafolio</span>
          </button>
        </div>
        <div class="portfolio-banner-card">
          <div class="portfolio-banner-info">
            <p class="lead" style="margin: 0 0 10px 0; font-size: 13.5px;">Configura tu página web de artista, enlaces directos de WhatsApp y agendamiento, paleta de colores de marca y galería de trabajos sincronizada con Instagram.</p>
            <div class="portfolio-banner-actions">
              <button class="primary small-btn" data-view="portafolio">
                ${icon('edit')} <span>Configurar Portafolio</span>
              </button>
              <button class="secondary small-btn" data-action="preview-portfolio">
                ${icon('eye')} <span>Ver mi Landing pública</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Team / Members Panel -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">EQUIPO Y ARTISTAS</p>
            <h2>Artistas y acuerdos de comisión</h2>
          </div>
          <button class="primary small-btn" data-action="new-member">${icon('plus')} <span>Agregar artista</span></button>
        </div>
        
        <div class="members-list">
          ${members.map((m) => {
            const rInfo = ROLE_MAP[m.role] || { label: m.role, class: 'role-resident' };
            const isOwner = m.role === 'owner';
            const initials = (m.full_name || 'A').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
            return `
              <article class="setting-item">
                <div class="setting-item-icon initials">${initials}</div>
                <div class="setting-item-body">
                  <div class="setting-item-top">
                    <div class="setting-item-title">
                      <h3>${m.full_name}</h3>
                      <span class="artist-chip ${rInfo.class}">${rInfo.label}</span>
                      <span class="member-status ${m.status}">${m.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    <div class="setting-item-action">
                      ${!isOwner ? `
                        <button class="member-toggle-btn" data-toggle-member-id="${m.membership_id}" data-current-status="${m.status}">
                          ${m.status === 'active' ? 'Desactivar' : 'Activar'}
                        </button>
                      ` : '<span class="tag-owner">Principal</span>'}
                    </div>
                  </div>
                  <div class="setting-item-sub">
                    <button class="edit-commission-tag" data-action="edit-commission" data-membership-id="${m.membership_id}" data-artist-name="${m.full_name}" data-commission="${m.commission_percent || 70}">
                      ${icon('percent')} ${m.commission_percent || 70}% comisión
                    </button>
                    <span class="member-meta">${m.email} · ${m.appointment_count || 0} citas</span>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Spaces & Boxes Panel -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">INFRAESTRUCTURA</p>
            <h2>Espacios y Boxes de trabajo</h2>
          </div>
          <button class="primary small-btn" data-action="new-space">${icon('plus')} <span>Crear Box</span></button>
        </div>
        
        <div class="members-list">
          ${spaces.map((sp) => `
            <article class="setting-item">
              <div class="setting-item-icon space-icon-bubble">${icon('box')}</div>
              <div class="setting-item-body">
                <div class="setting-item-top">
                  <div class="setting-item-title">
                    <h3>${sp.name}</h3>
                    <span class="member-status ${sp.is_active ? 'active' : 'inactive'}">${sp.is_active ? 'Disponible' : 'Fuera de servicio'}</span>
                  </div>
                  <div class="setting-item-action">
                    <button class="member-toggle-btn" data-toggle-space-id="${sp.id}" data-current-active="${sp.is_active}">
                      ${sp.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
                <div class="setting-item-sub">
                  <span class="price-chip">${money(sp.price_per_day)}/día</span>
                  <span class="member-meta">${sp.description || 'Puesto equipado'} · ${sp.appointment_count || 0} sesiones</span>
                </div>
              </div>
            </article>
          `).join('') || emptyState('Sin boxes registrados', 'Crea puestos de trabajo para organizarlos en las citas.')}
        </div>
      </section>

      <!-- Commitment Categories Panel -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">AGENDA & CALENDARIO</p>
            <h2>Categorías de compromiso</h2>
          </div>
          <button class="primary small-btn" data-action="new-category">${icon('plus')} <span>Nueva categoría</span></button>
        </div>
        <div class="members-list">
          ${categories.map((cat) => `
            <article class="setting-item">
              <div class="setting-item-icon cat-color-badge" style="background: ${cat.color}20; color: ${cat.color}; border: 1px solid ${cat.color}40;">
                <span class="cat-dot-lg" style="background: ${cat.color}"></span>
              </div>
              <div class="setting-item-body">
                <div class="setting-item-top">
                  <div class="setting-item-title">
                    <h3>${cat.name}</h3>
                    <span class="guest-spot-badge" style="background: ${cat.color}15; color: ${cat.color}; border: 1px solid ${cat.color}30;">${cat.kind}</span>
                    ${cat.is_system ? '<span class="status-chip status-default">Sistema</span>' : ''}
                  </div>
                  <div class="setting-item-action">
                    ${!cat.is_system ? `
                      <button class="icon-button-delete" data-delete-category-id="${cat.id}" title="Eliminar categoría" aria-label="Eliminar categoría">
                        ${icon('close')}
                      </button>
                    ` : ''}
                  </div>
                </div>
                <div class="setting-item-sub">
                  <span class="member-meta">${cat.requires_client ? 'Requiere cliente' : 'Sin cliente'} · ${cat.requires_space ? 'Ocupa Box' : 'Sin box'} · ${cat.appointment_count || 0} citas</span>
                </div>
              </div>
            </article>
          `).join('') || emptyState('Sin categorías', 'Crea categorías para organizar citas, marketing, reuniones y arriendos.')}
        </div>
      </section>

      <!-- Guest Spots / Nomad requests Panel -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">VISITAS Y NÓMADES</p>
            <h2>Solicitudes de Guest Spots</h2>
          </div>
          <div class="section-heading-actions">
            <button class="secondary small-btn" data-action="copy-guest-spot-link" title="Copiar enlace de postulación para nómades">
              ${icon('link')} <span>Copiar enlace</span>
            </button>
            <button class="primary small-btn" data-action="new-guest-spot">
              ${icon('plus')} <span>Nueva solicitud</span>
            </button>
          </div>
        </div>

        <div class="members-list">
          ${guestList.map((g) => {
            const isPending = g.status === 'pending';
            const statusLabel = g.status === 'approved' ? 'Aprobada' : g.status === 'rejected' ? 'Rechazada' : 'Pendiente';
            const statusClass = g.status === 'approved' ? 'tag-income' : g.status === 'rejected' ? 'tag-expense' : 'tag-pending';
            return `
              <article class="setting-item">
                <div class="setting-item-icon initials">${(g.artist_name || 'N').slice(0, 2).toUpperCase()}</div>
                <div class="setting-item-body">
                  <div class="setting-item-top">
                    <div class="setting-item-title">
                      <h3>${g.artist_name}</h3>
                      ${g.artist_instagram ? `<span class="artist-chip role-nomad">${g.artist_instagram}</span>` : ''}
                      <span class="guest-spot-badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="setting-item-action">
                      ${isPending ? `
                        <div style="display: flex; gap: 6px;">
                          <button class="primary small" data-action="approve-guest-spot" data-id="${g.id}">Aprobar</button>
                          <button class="secondary small" data-action="reject-guest-spot" data-id="${g.id}">Rechazar</button>
                        </div>
                      ` : `<span class="tag-status">${statusLabel}</span>`}
                    </div>
                  </div>
                  <div class="setting-item-sub">
                    <span class="member-meta">${g.artist_email} · ${g.space_name ? `Box: ${g.space_name} · ` : ''}Del ${g.start_date} al ${g.end_date}</span>
                    ${g.notes ? `<p class="guest-notes">"${g.notes}"</p>` : ''}
                  </div>
                </div>
              </article>
            `;
          }).join('') || emptyState('Sin solicitudes de nómades', 'Comparte tu enlace de estudio para que artistas nómades postulen a tus boxes.')}
        </div>
      </section>

      <!-- Studio Config Panel -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CONFIGURACIÓN GENERAL</p>
            <h2>Datos de la cuenta y estudio</h2>
          </div>
        </div>
        <form data-form="studio-settings" class="studio-settings-form">
          <label>Nombre del estudio o perfil
            <input name="name" value="${activeStudio?.name || ''}" required />
          </label>
          <label>Tipo de Cuenta y Operación
            <select name="accountType">
              <option value="independent" ${activeStudio?.account_type === 'independent' ? 'selected' : ''}>Artista Independiente (Usuario Único — agenda personal, marketing y citas)</option>
              <option value="studio" ${activeStudio?.account_type === 'studio' ? 'selected' : ''}>Estudio de Tatuajes (Gestión de equipo, boxes, arriendos y residentes)</option>
            </select>
          </label>
          <div class="form-grid">
            <label>Moneda
              <select name="currency">
                <option value="CLP" ${activeStudio?.currency === 'CLP' ? 'selected' : ''}>CLP ($)</option>
                <option value="USD" ${activeStudio?.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                <option value="EUR" ${activeStudio?.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                <option value="ARS" ${activeStudio?.currency === 'ARS' ? 'selected' : ''}>ARS ($)</option>
                <option value="MXN" ${activeStudio?.currency === 'MXN' ? 'selected' : ''}>MXN ($)</option>
              </select>
            </label>
            <label>Zona horaria
              <select name="timezone">
                <option value="America/Santiago" ${activeStudio?.timezone === 'America/Santiago' ? 'selected' : ''}>America/Santiago</option>
                <option value="America/Buenos_Aires" ${activeStudio?.timezone === 'America/Buenos_Aires' ? 'selected' : ''}>America/Buenos_Aires</option>
                <option value="America/Bogota" ${activeStudio?.timezone === 'America/Bogota' ? 'selected' : ''}>America/Bogota</option>
                <option value="America/Mexico_City" ${activeStudio?.timezone === 'America/Mexico_City' ? 'selected' : ''}>America/Mexico_City</option>
                <option value="Europe/Madrid" ${activeStudio?.timezone === 'Europe/Madrid' ? 'selected' : ''}>Europe/Madrid</option>
              </select>
            </label>
          </div>
          <button class="primary" type="submit">${icon('edit')} Guardar cambios</button>
          <p class="form-error"></p>
        </form>
      </section>

      <!-- Legal & Privacy Policy Panel for Platform Users -->
      <section class="panel legal-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">MARCO LEGAL & PRIVACIDAD</p>
            <h2>Términos de Uso y Tratamiento de Datos</h2>
          </div>
          <button class="secondary small-btn" data-action="open-terms">
            ${icon('eye')} <span>Ver Documento Completo</span>
          </button>
        </div>
        <div class="legal-summary-card">
          <div class="legal-badges">
            <span class="legal-badge">🇨🇱 Ley N° 19.628 Chile</span>
            <span class="legal-badge">🔒 Cero Remarketing</span>
            <span class="legal-badge">🛡️ Derechos ARCO Garantizados</span>
            <span class="legal-badge">✉️ soyelroot@tatudin.cl</span>
          </div>
          <p class="legal-lead">Tatudin protege estrictamente la confidencialidad de los profesionales y sus agendas. Los datos jamás son comercializados ni usados con fines publicitarios.</p>
          <button type="button" class="text-button" data-action="open-terms" style="color: var(--red); font-weight: 700; align-self: flex-start; margin-top: 4px;">
            Leer Términos y Condiciones y Política de Privacidad →
          </button>
        </div>
      </section>
    </div>
  `;
}

// ---------------- TERMS & CONDITIONS LEGAL LANDING ----------------
let termsReturnState = { fromOnboarding: false, step: 0, authMode: 'login', prevView: 'dashboard' };

function renderTermsAndConditions(fromOnboarding = false, step = 0, authMode = 'login') {
  termsReturnState = {
    fromOnboarding,
    step,
    authMode,
    prevView: currentAppView || 'dashboard'
  };

  closeModal();
  document.body.classList.toggle('onboarding-mode', fromOnboarding);
  const ws = document.querySelector('#workspace');
  if (ws) ws.style.display = 'flex';
  hideSplash();

  app.innerHTML = `
    <section class="terms-page-container">
      <div class="terms-header-bar">
        <button type="button" class="terms-back-btn" data-action="${fromOnboarding ? 'terms-back-onboarding' : 'terms-back-dashboard'}">
          ← ${fromOnboarding ? 'Volver al acceso' : 'Volver a mi espacio'}
        </button>
        <div class="terms-brand">
          <span class="brand-mark small">t</span>
          <strong>tatudin</strong>
        </div>
        <span class="terms-pill">Ley N° 19.628 Chile</span>
      </div>

      <article class="terms-card-content">
        <div class="terms-title-block">
          <span class="terms-kicker">DOCUMENTO LEGAL Y DE PRIVACIDAD</span>
          <h1>Términos y Condiciones de Uso y Política de Privacidad</h1>
          <p class="terms-subtitle">Aplicación "Tatudin" · Gestión, organización y agendamiento de citas y consultas</p>
          <div class="terms-meta-strip">
            <span>📅 Última actualización: Agosto de 2026</span>
            <span>⚖️ Jurisdicción: República de Chile</span>
            <span>📬 Contacto: <a href="mailto:soyelroot@tatudin.cl">soyelroot@tatudin.cl</a></span>
          </div>
        </div>

        <div class="terms-intro-box">
          <p>El presente documento establece los Términos y Condiciones de Uso y las Políticas de Privacidad de la aplicación <strong>Tatudin</strong> (en adelante, la "Aplicación" o "Tatudin"). Al descargar, instalar, acceder o utilizar la Aplicación, usted (en adelante, el "Usuario") acepta de manera expresa, informada e inequívoca todos los términos aquí contenidos. Si no está de acuerdo con estas condiciones, deberá abstenerse de utilizar la Aplicación. El tratamiento de datos personales realizado por Tatudin se rige estrictamente por la <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong> de la República de Chile.</p>
        </div>

        <div class="terms-grid-sections">
          <!-- 1 -->
          <div class="terms-section-card">
            <div class="terms-num">1</div>
            <div class="terms-body">
              <h3>1. Información General y Contacto</h3>
              <ul>
                <li><strong>Nombre de la plataforma:</strong> Tatudin</li>
                <li><strong>Finalidad:</strong> Gestión, organización y agendamiento de citas y consultas.</li>
                <li><strong>Administrador del sitio:</strong> Administrador General Tatudin</li>
                <li><strong>Correo electrónico de contacto y ejercicio de derechos:</strong> <a href="mailto:soyelroot@tatudin.cl">soyelroot@tatudin.cl</a></li>
              </ul>
            </div>
          </div>

          <!-- 2 -->
          <div class="terms-section-card">
            <div class="terms-num">2</div>
            <div class="terms-body">
              <h3>2. Objeto del Servicio</h3>
              <p>Tatudin es una herramienta tecnológica cuyo objeto exclusivo es <strong>facilitar la gestión de agendas, la programación de citas y la administración operativa de consultas</strong> entre proveedores de servicios/profesionales y sus respectivos clientes. La Aplicación actúa únicamente como un facilitador de la organización del tiempo y canales de comunicación operativa.</p>
            </div>
          </div>

          <!-- 3 -->
          <div class="terms-section-card highlight-card">
            <div class="terms-num">3</div>
            <div class="terms-body">
              <h3>3. Principio de Finalidad y Limitación en el Tratamiento de Datos</h3>
              <p>En estricto cumplimiento de la legislación chilena, Tatudin adopta un compromiso de máxima transparencia respecto al uso de la información:</p>
              <div class="terms-points">
                <div class="terms-point-item">
                  <span class="point-icon">🛡️</span>
                  <div>
                    <strong>Exclusividad Operativa</strong>
                    <p>Los datos personales proporcionados por los Usuarios (como nombres, correos electrónicos, números de teléfono y registros de agenda) se utilizarán <strong>únicamente para la correcta prestación del servicio solicitado</strong> (envío de confirmaciones, recordatorios de citas, soporte técnico y gestión de la agenda).</p>
                  </div>
                </div>
                <div class="terms-point-item">
                  <span class="point-icon">🚫</span>
                  <div>
                    <strong>Prohibición Absoluta de Publicidad y Remarketing</strong>
                    <p>Tatudin <strong>no utilizará</strong> los datos personales de sus Usuarios para el envío de comunicaciones comerciales ajenas, ni campañas de marketing publicitario. Queda estrictamente prohibida la venta, cesión, transferencia o comunicación de datos a terceras empresas con fines de reorientación publicitaria (<em>remarketing</em>), perfiles comerciales o explotación publicitaria.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4 -->
          <div class="terms-section-card">
            <div class="terms-num">4</div>
            <div class="terms-body">
              <h3>4. Información Inferida, Datos Agregados y Mejora Continua</h3>
              <p>El Usuario autoriza expresamente a Tatudin para recopilar y procesar <strong>información inferida, datos estadísticos y metadatos agregados</strong> derivados del uso de la Aplicación (tasas de uso del sistema, horarios de mayor concurrencia, tiempos de respuesta de la interfaz o reportes de errores técnicos):</p>
              <ul>
                <li><strong>Anonimización estricta:</strong> Dicha información técnica se procesará siempre de forma <strong>disociada y anónima</strong>, de manera que no sea posible vincularla a un Usuario identificado o identificable.</li>
                <li><strong>Propósito:</strong> El tratamiento de estos datos inferidos tiene como único fin la <strong>mejora continua del desarrollo técnico, optimización de la experiencia de usuario (UX), estabilidad del sistema y diseño de nuevas funcionalidades</strong>.</li>
              </ul>
            </div>
          </div>

          <!-- 5 -->
          <div class="terms-section-card highlight-card">
            <div class="terms-num">5</div>
            <div class="terms-body">
              <h3>5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h3>
              <p>De acuerdo con la Ley N° 19.628, el Usuario conserva en todo momento la propiedad de sus datos personales y puede ejercer de forma gratuita sus derechos <strong>ARCO</strong>:</p>
              <div class="arco-grid">
                <div class="arco-pill"><strong>🔍 Acceso:</strong> Solicitar información sobre qué datos personales se mantienen en los registros.</div>
                <div class="arco-pill"><strong>✏️ Rectificación:</strong> Modificar o corregir datos que sean erróneos, inexactos, equívocos o incompletos.</div>
                <div class="arco-pill"><strong>🗑️ Cancelación:</strong> Solicitar la eliminación de sus datos cuando su almacenamiento carezca de fundamento legal o hayan caducado.</div>
                <div class="arco-pill"><strong>✋ Oposición:</strong> Oponerse al uso de sus datos para fines específicos que no sean los estrictamente necesarios.</div>
              </div>
              <p class="arco-contact">Para ejercer cualquiera de estos derechos, el Usuario debe enviar una solicitud formal por escrito al correo: <a href="mailto:soyelroot@tatudin.cl">soyelroot@tatudin.cl</a></p>
            </div>
          </div>

          <!-- 6 -->
          <div class="terms-section-card">
            <div class="terms-num">6</div>
            <div class="terms-body">
              <h3>6. Medidas de Seguridad y Resguardos para su Publicación</h3>
              <p>Tatudin adopta las medidas técnicas, organizativas y de seguridad necesarias para garantizar la integridad, disponibilidad y confidencialidad de los datos personales, evitando su alteración, pérdida o acceso no autorizado.</p>
              <ul>
                <li>Los datos se transmiten mediante canales cifrados con TLS/HTTPS y se almacenan en entornos servidores seguros.</li>
                <li><strong>Nota de Responsabilidad:</strong> El Usuario es el único responsable de mantener la estricta confidencialidad de sus credenciales de acceso (usuario y contraseña), eximiendo a Tatudin de responsabilidades por accesos indebidos causados por negligencia del propio Usuario.</li>
              </ul>
            </div>
          </div>

          <!-- 7 -->
          <div class="terms-section-card">
            <div class="terms-num">7</div>
            <div class="terms-body">
              <h3>7. Limitación de Responsabilidad</h3>
              <p>Tatudin provee la plataforma "tal como está" y no se responsabiliza por:</p>
              <ul>
                <li>Interrupciones temporales del servicio derivadas de labores de mantenimiento técnico, fallas de conectividad externas o casos de fuerza mayor.</li>
                <li>Los acuerdos, transacciones, cancelaciones, contenidos de las consultas o cualquier tipo de relación contractual o extracontractual que ocurra entre los profesionales y sus clientes finales.</li>
              </ul>
            </div>
          </div>

          <!-- 8 -->
          <div class="terms-section-card">
            <div class="terms-num">8</div>
            <div class="terms-body">
              <h3>8. Modificaciones a los Términos</h3>
              <p>El administrador de Tatudin se reserva el derecho de actualizar o modificar estos Términos y Condiciones cuando sea necesario por cambios legales o técnicos. Cualquier modificación sustancial será informada oportunamente a los Usuarios mediante la Aplicación o al correo registrado. El uso de la Aplicación posterior a la notificación se entenderá como aceptación de las modificaciones.</p>
            </div>
          </div>

          <!-- 9 -->
          <div class="terms-section-card">
            <div class="terms-num">9</div>
            <div class="terms-body">
              <h3>9. Legislación Aplicable y Jurisdicción</h3>
              <p>Estos Términos y Condiciones se rigen e interpretan en su totalidad por las <strong>leyes de la República de Chile</strong>. Cualquier controversia derivada del uso de la Aplicación o de la interpretación de este documento será sometida a la jurisdicción de los Tribunales Ordinarios de Justicia de Santiago de Chile.</p>
            </div>
          </div>
        </div>

        <div class="terms-footer-action">
          <button type="button" class="primary" data-action="${fromOnboarding ? 'terms-back-onboarding' : 'terms-back-dashboard'}">
            ← ${fromOnboarding ? 'Volver al acceso' : 'Regresar a mi espacio'}
          </button>
        </div>
      </article>
    </section>
  `;
}

// ---------------- SUPERADMIN ROOT BACKOFFICE MODULE ----------------
let currentBackofficeTab = 'stats';
let backofficeCache = { stats: null, users: null, studios: null, guestSpots: null };

async function renderBackoffice(tab = currentBackofficeTab) {
  currentBackofficeTab = tab;
  currentAppView = 'backoffice';
  document.querySelectorAll('[data-view]').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === 'backoffice');
  });

  app.innerHTML = `
    <div class="backoffice-container">
      <div class="backoffice-header-card">
        <div class="backoffice-header-title">
          <h1>⚡ Backoffice Superadministrador</h1>
          <p>Control maestro de la plataforma, estadísticas agregadas según Ley N° 19.628, gestión global y administración de datos.</p>
        </div>
        <div class="backoffice-header-badges">
          <span class="backoffice-tag-pill">👑 ${currentUser?.email || 'soyelroot@tatudin.cl'}</span>
          <span class="backoffice-tag-pill">🛡️ Acceso Root Absoluto</span>
          <span class="backoffice-tag-pill">🇨🇱 Ley 19.628 Chile</span>
        </div>
      </div>

      <nav class="backoffice-tabs" aria-label="Pestañas de Backoffice">
        <button type="button" class="bo-tab-btn ${tab === 'stats' ? 'active' : ''}" data-bo-tab="stats">
          📊 Estadísticas Globales (Ley 19.628)
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'users' ? 'active' : ''}" data-bo-tab="users">
          👥 Usuarios y Estudios
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'guest-spots' ? 'active' : ''}" data-bo-tab="guest-spots">
          📋 Solicitudes de Nómades
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'database' ? 'active' : ''}" data-bo-tab="database">
          🛠️ Operaciones de Base de Datos
        </button>
      </nav>

      <div id="bo-content-area" class="bo-content-container">
        <div style="text-align: center; padding: 40px; color: var(--muted);">Cargando módulo de Backoffice...</div>
      </div>
    </div>
  `;

  const container = document.querySelector('#bo-content-area');
  if (!container) return;

  try {
    if (tab === 'stats') {
      const statsData = await api('/api/backoffice/stats');
      backofficeCache.stats = statsData;
      container.innerHTML = renderBackofficeStatsTab(statsData);
    } else if (tab === 'users') {
      const [usersData, studiosData] = await Promise.all([
        api('/api/backoffice/users'),
        api('/api/backoffice/studios')
      ]);
      backofficeCache.users = usersData;
      backofficeCache.studios = studiosData;
      container.innerHTML = renderBackofficeUsersTab(usersData, studiosData);
    } else if (tab === 'guest-spots') {
      const gsData = await api('/api/backoffice/guest-spots');
      backofficeCache.guestSpots = gsData;
      container.innerHTML = renderBackofficeGuestSpotsTab(gsData);
    } else if (tab === 'database') {
      container.innerHTML = renderBackofficeDatabaseTab();
    }
  } catch (error) {
    container.innerHTML = `
      <div class="empty">
        <h3>Error al cargar Backoffice</h3>
        <p>${error.message}</p>
        <button type="button" class="primary small" data-bo-tab="${tab}" style="margin-top: 12px;">Reintentar</button>
      </div>
    `;
  }
}

function renderBackofficeStatsTab(data) {
  const m = data.metrics || {};
  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Law Compliance Info Notice -->
      <div class="terms-intro-box" style="border-left-color: var(--red);">
        <p><strong>📜 Cumplimiento de Privacidad y Telemetría:</strong> ${data.system?.lawCompliance}</p>
      </div>

      <!-- KPI Grid -->
      <div class="bo-kpi-grid">
        <div class="bo-kpi-card">
          <div class="bo-kpi-top">
            <span>Usuarios Registrados</span>
            <span>👤</span>
          </div>
          <p class="bo-kpi-num">${m.users?.total || 0}</p>
          <p class="bo-kpi-sub">+${m.users?.new_last_30_days || 0} en los últimos 30 días</p>
        </div>

        <div class="bo-kpi-card">
          <div class="bo-kpi-top">
            <span>Estudios & Espacios</span>
            <span>🏬</span>
          </div>
          <p class="bo-kpi-num">${m.studios?.total || 0}</p>
          <p class="bo-kpi-sub">${m.studios?.studios || 0} estudios · ${m.studios?.independents || 0} independientes</p>
        </div>

        <div class="bo-kpi-card">
          <div class="bo-kpi-top">
            <span>Artistas Activos</span>
            <span>🎨</span>
          </div>
          <p class="bo-kpi-num">${m.memberships?.total || 0}</p>
          <p class="bo-kpi-sub">${m.memberships?.residents || 0} residentes · ${m.memberships?.nomads || 0} nómades</p>
        </div>

        <div class="bo-kpi-card">
          <div class="bo-kpi-top">
            <span>Citas Agendadas</span>
            <span>📅</span>
          </div>
          <p class="bo-kpi-num">${m.appointments?.total || 0}</p>
          <p class="bo-kpi-sub">${m.appointments?.confirmed || 0} confirmadas · ${m.appointments?.completed || 0} listas</p>
        </div>

        <div class="bo-kpi-card">
          <div class="bo-kpi-top">
            <span>Volumen Transaccional</span>
            <span>💰</span>
          </div>
          <p class="bo-kpi-num">${money(m.finances?.total_income || 0)}</p>
          <p class="bo-kpi-sub">Egresos: ${money(m.finances?.total_expense || 0)}</p>
        </div>

        <div class="bo-kpi-card">
          <div class="bo-kpi-top">
            <span>Postulaciones Nómades</span>
            <span>✈️</span>
          </div>
          <p class="bo-kpi-num">${m.guestSpots?.total || 0}</p>
          <p class="bo-kpi-sub">${m.guestSpots?.pending || 0} pendientes · ${m.guestSpots?.approved || 0} aprobadas</p>
        </div>
      </div>

      <!-- Recent Users & System Feed -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 16px;">
        <section class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">ÚLTIMOS USUARIOS REGISTRADOS</p>
              <h2>Nuevas cuentas</h2>
            </div>
            <button type="button" class="secondary small-btn" data-bo-tab="users">Ver todos →</button>
          </div>
          <div class="appointment-list">
            ${(data.recentUsers || []).map((u) => `
              <article class="setting-item">
                <div class="setting-item-icon initials">${(u.full_name || 'U').slice(0, 2).toUpperCase()}</div>
                <div class="setting-item-body">
                  <div class="setting-item-top">
                    <div class="setting-item-title">
                      <h3>${u.full_name}</h3>
                      ${u.is_superadmin ? '<span class="bo-badge root">⚡ ROOT</span>' : '<span class="bo-badge independent">Usuario</span>'}
                    </div>
                  </div>
                  <div class="setting-item-sub">
                    <span class="member-meta">${u.email} · Registrado el ${new Date(u.created_at).toLocaleDateString('es-CL')}</span>
                  </div>
                </div>
              </article>
            `).join('') || emptyState('Sin usuarios recientes', '')}
          </div>
        </section>

        <section class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">SOLICITUDES DE NÓMADES</p>
              <h2>Últimas postulaciones</h2>
            </div>
            <button type="button" class="secondary small-btn" data-bo-tab="guest-spots">Ver todas →</button>
          </div>
          <div class="appointment-list">
            ${(data.recentGuestSpots || []).map((g) => {
              const statusClass = g.status === 'approved' ? 'tag-income' : g.status === 'rejected' ? 'tag-expense' : 'tag-pending';
              const statusLabel = g.status === 'approved' ? 'Aprobada' : g.status === 'rejected' ? 'Rechazada' : 'Pendiente';
              return `
                <article class="setting-item">
                  <div class="setting-item-icon initials">${(g.artist_name || 'N').slice(0, 2).toUpperCase()}</div>
                  <div class="setting-item-body">
                    <div class="setting-item-top">
                      <div class="setting-item-title">
                        <h3>${g.artist_name}</h3>
                        <span class="guest-spot-badge ${statusClass}">${statusLabel}</span>
                      </div>
                    </div>
                    <div class="setting-item-sub">
                      <span class="member-meta">Estudio: <strong>${g.studio_name}</strong> · ${g.start_date} al ${g.end_date}</span>
                    </div>
                  </div>
                </article>
              `;
            }).join('') || emptyState('Sin solicitudes recientes', '')}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderBackofficeUsersTab(users, studios) {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Users Table -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">ADMINISTRACIÓN DE USUARIOS (${users.length})</p>
            <h2>Cuentas registradas en Tatudin</h2>
          </div>
        </div>
        <div class="bo-table-wrap">
          <table class="bo-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Estudios / Roles</th>
                <th>Citas</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((u) => {
                const studiosHtml = (u.studios || []).map((s) => `
                  <div style="margin-bottom: 2px;">
                    <strong>${s.studio_name}</strong> <span class="artist-chip ${s.role === 'owner' ? 'role-owner' : 'role-resident'}">${s.role}</span>
                  </div>
                `).join('') || '<span style="color: var(--muted);">Sin estudio</span>';

                const firstStudio = (u.studios || [])[0];

                return `
                  <tr>
                    <td>
                      <strong>${u.full_name}</strong>
                      ${u.is_superadmin ? '<br/><span class="bo-badge root">⚡ Superadmin</span>' : ''}
                    </td>
                    <td><code>${u.email}</code></td>
                    <td>${studiosHtml}</td>
                    <td><strong>${u.appointment_count || 0}</strong></td>
                    <td>${new Date(u.created_at).toLocaleDateString('es-CL')}</td>
                    <td>
                      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        ${firstStudio ? `
                          <button type="button" class="secondary small" data-action="bo-impersonate" data-studio-id="${firstStudio.studio_id}" data-studio-name="${firstStudio.studio_name}" title="Ingresar y administrar este estudio">
                            👑 Entrar al Estudio
                          </button>
                        ` : ''}
                        <button type="button" class="outline-button small" data-action="bo-edit-user" data-user-id="${u.id}" data-user-name="${u.full_name}" data-user-email="${u.email}" data-is-root="${u.is_superadmin}">
                          ✏️ Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Studios Table -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">ESTUDIOS & PERFILES (${studios.length})</p>
            <h2>Estudios registrados en la plataforma</h2>
          </div>
        </div>
        <div class="bo-table-wrap">
          <table class="bo-table">
            <thead>
              <tr>
                <th>Estudio</th>
                <th>Tipo</th>
                <th>Propietario</th>
                <th>Boxes</th>
                <th>Miembros</th>
                <th>Citas</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              ${studios.map((s) => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td><span class="bo-badge ${s.account_type}">${s.account_type === 'studio' ? 'Estudio' : 'Independiente'}</span></td>
                  <td>${s.owner_name}</td>
                  <td>${s.space_count} boxes</td>
                  <td>${s.member_count} artistas</td>
                  <td>${s.appointment_count} citas</td>
                  <td>
                    <button type="button" class="primary small" data-action="bo-impersonate" data-studio-id="${s.id}" data-studio-name="${s.name}">
                      Administrar Estudio →
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function renderBackofficeGuestSpotsTab(requests) {
  return `
    <section class="panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">GESTIÓN DE SOLICITUDES DE NÓMADES (${requests.length})</p>
          <h2>Postulaciones de Artistas Visitantes en la Red</h2>
        </div>
      </div>
      <div class="bo-table-wrap">
        <table class="bo-table">
          <thead>
            <tr>
              <th>Artista</th>
              <th>Contacto</th>
              <th>Estudio Destino</th>
              <th>Box Asignado</th>
              <th>Fechas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map((r) => {
              const isPending = r.status === 'pending';
              const statusLabel = r.status === 'approved' ? 'Aprobada' : r.status === 'rejected' ? 'Rechazada' : 'Pendiente';
              const statusClass = r.status === 'approved' ? 'tag-income' : r.status === 'rejected' ? 'tag-expense' : 'tag-pending';
              return `
                <tr>
                  <td>
                    <strong>${r.artist_name}</strong>
                    ${r.artist_instagram ? `<br/><a href="https://instagram.com/${r.artist_instagram.replace('@', '')}" target="_blank" style="color: var(--red); font-size: 11.5px;">${r.artist_instagram}</a>` : ''}
                  </td>
                  <td><code>${r.artist_email}</code></td>
                  <td><strong>${r.studio_name}</strong></td>
                  <td>${r.space_name || '<span style="color: var(--muted);">Por asignar</span>'}</td>
                  <td>${r.start_date} al ${r.end_date}</td>
                  <td><span class="guest-spot-badge ${statusClass}">${statusLabel}</span></td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      ${isPending ? `
                        <button type="button" class="primary small" data-action="bo-resolve-gs" data-id="${r.id}" data-status="approved">Aprobar</button>
                        <button type="button" class="secondary small" data-action="bo-resolve-gs" data-id="${r.id}" data-status="rejected">Rechazar</button>
                      ` : `
                        <button type="button" class="outline-button small" data-action="bo-resolve-gs" data-id="${r.id}" data-status="${r.status === 'approved' ? 'rejected' : 'approved'}">
                          Cambiar a ${r.status === 'approved' ? 'Rechazada' : 'Aprobada'}
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `;
            }).join('') || '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--muted);">No hay solicitudes de nómades registradas en la plataforma.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderBackofficeDatabaseTab() {
  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div class="terms-intro-box" style="border-left-color: var(--red);">
        <p><strong>🛠️ Panel de Control de Datos del Sistema:</strong> Utiliza estas herramientas para inicializar entornos de prueba o para dejar la base de datos completamente limpia antes del lanzamiento a producción real.</p>
      </div>

      <div class="bo-db-actions-grid">
        <!-- Seed Demo Card -->
        <article class="bo-action-card seed-card">
          <div class="bo-action-title">
            <span style="font-size: 24px;">🌱</span>
            <h3>Poblar Sistema con Datos de Prueba</h3>
          </div>
          <p>Genera automáticamente el estudio demo <strong>Black Lotus Tattoo Studio</strong>, 5 boxes equipados, 4 artistas residentes con comisiones, 4 nómades, citas agendadas de la semana, transacciones de finanzas y portafolios de ejemplo.</p>
          <div style="margin-top: auto; padding-top: 14px;">
            <button type="button" class="primary" data-action="bo-trigger-seed" style="width: 100%; background: #10b981; border-color: #059669; font-weight: 800;">
              🚀 Poblar Datos Demo Ahora
            </button>
          </div>
        </article>

        <!-- Purge Production Card -->
        <article class="bo-action-card purge-card">
          <div class="bo-action-title">
            <span style="font-size: 24px;">🧹</span>
            <h3>Limpiar Sistema para Producción</h3>
          </div>
          <p><strong>Acción destructiva segura:</strong> Elimina todas las citas, clientes, transacciones, boxes, solicitudes y usuarios de prueba. Deja el sistema 100% limpio y listo para registrar estudios y clientes reales. <em>La cuenta soyelroot@tatudin.cl se conservará intacta.</em></p>
          <div style="margin-top: auto; padding-top: 14px;">
            <button type="button" class="secondary" data-action="bo-trigger-purge" style="width: 100%; color: #dc2626; border-color: #fca5a5; background: #fff1f2; font-weight: 800;">
              ⚠️ Limpiar Base de Datos para Producción
            </button>
          </div>
        </article>
      </div>
    </div>
  `;
}

// ---------------- PORTFOLIO MODULE ----------------
let portfolioData = null;
let portfolioCurrentTab = 'profile';

const SAMPLE_GALLERY_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80', title: 'Composición Floral Botánica', style: 'Fineline' },
  { url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80', title: 'Mariposa Microrealista', style: 'Microrealismo' },
  { url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80', title: 'Espalda Blackwork Geométrica', style: 'Blackwork' },
  { url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80', title: 'Trazo Línea Continua', style: 'Minimalista' },
  { url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80', title: 'Dragón y Peonías Orientales', style: 'Neotradicional' },
  { url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80', title: 'Retrato de Ojo con Sombras', style: 'Realismo' }
];

const SAMPLE_COVERS = [
  { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80', label: 'Arte Fluido Rosa & Violeta' },
  { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80', label: 'Mármol Oscuro & Textura' },
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', label: 'Gradiente Neón Cyberpunk' },
  { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80', label: 'Pintura al Óleo Abstracta' }
];

const SAMPLE_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', label: 'Retrato Artista Cabello Violeta' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', label: 'Retrato Artista Masculino' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', label: 'Retrato Artista Femenina' },
  { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', label: 'Retrato Artista Moderno' }
];

async function renderPortfolio() {
  try {
    const data = await api('/api/portfolio/me');
    portfolioData = data;
    const portfolio = data.portfolio;
    const gallery = data.gallery || [];
    const brandColor = portfolio.brand_color || '#E11D48';

    app.innerHTML = `
      <div class="portfolio-container" style="--brand-color: ${brandColor};">
        <!-- Top Action Bar matching Figma wireframe -->
        <header class="portfolio-topbar">
          <div class="portfolio-topbar-left">
            <button class="icon-button-back" data-view="ajustes" aria-label="Volver" title="Volver a Ajustes">
              ${icon('back')}
            </button>
            <div class="portfolio-title-group">
              <h1 class="portfolio-page-title">Mi Portafolio</h1>
              <p class="portfolio-page-sub">Crea y edita tu landing page pública de artista</p>
            </div>
          </div>

          <div class="portfolio-topbar-actions">
            <button class="portfolio-preview-btn" data-action="preview-portfolio" title="Ver cómo luce tu página pública">
              ${icon('eye')} <span class="hide-mobile">Vista previa</span>
            </button>
            
            <label class="portfolio-switch-pill" title="Cambiar estado entre borrador y publicado">
              <span class="switch-status-text ${portfolio.is_published ? 'is-published' : 'is-draft'}">
                ${portfolio.is_published ? 'Publicado' : 'Borrador'}
              </span>
              <input type="checkbox" id="portfolio-status-toggle" ${portfolio.is_published ? 'checked' : ''} />
              <span class="switch-toggle-slider"></span>
            </label>

            <button class="portfolio-save-main-btn" data-action="save-portfolio" title="Guardar todos los cambios">
              ${icon('check')} <span>Guardar</span>
            </button>
          </div>
        </header>

        <!-- Submenu Navigation (Pill dropdown / Desktop tabs) -->
        <div class="portfolio-nav-strip">
          <div class="portfolio-tab-dropdown-container">
            <button class="portfolio-tab-selector-btn" data-action="toggle-portfolio-tab-menu" id="portfolio-tab-selector-btn">
              <span id="portfolio-active-tab-text">${portfolioCurrentTab === 'profile' ? '👤 Perfil' : '🖼️ Galería'}</span>
              <svg class="chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <div class="portfolio-tab-dropdown-popover" id="portfolio-tab-popover" hidden>
              <button class="portfolio-tab-popover-item ${portfolioCurrentTab === 'profile' ? 'active' : ''}" data-select-tab="profile">
                <span>👤 Perfil</span>
                ${portfolioCurrentTab === 'profile' ? '<span class="tab-check">✓</span>' : ''}
              </button>
              <button class="portfolio-tab-popover-item ${portfolioCurrentTab === 'gallery' ? 'active' : ''}" data-select-tab="gallery">
                <span>🖼️ Galería</span>
                ${portfolioCurrentTab === 'gallery' ? '<span class="tab-check">✓</span>' : ''}
              </button>
            </div>
          </div>

          <div class="portfolio-desktop-tabs">
            <button class="portfolio-desktop-tab-btn ${portfolioCurrentTab === 'profile' ? 'active' : ''}" data-select-tab="profile">
              ${icon('user')} Perfil & Marca
            </button>
            <button class="portfolio-desktop-tab-btn ${portfolioCurrentTab === 'gallery' ? 'active' : ''}" data-select-tab="gallery">
              ${icon('box')} Galería (${gallery.length} fotos)
            </button>
          </div>

          <div class="portfolio-url-badge" title="Enlace público de tu perfil">
            <span>Landing:</span>
            <strong id="portfolio-handle-preview">tatudin.com/p/${portfolio.handle}</strong>
            <button class="copy-handle-btn" data-action="copy-portfolio-link" data-handle="${portfolio.handle}" title="Copiar enlace público">
              ${icon('copy')}
            </button>
          </div>
        </div>

        <!-- Dynamic Content Body -->
        <div id="portfolio-tab-view-container">
          ${portfolioCurrentTab === 'profile' ? renderPortfolioProfileTab(portfolio) : renderPortfolioGalleryTab(portfolio, gallery)}
        </div>
      </div>
    `;

    // Live color picker sync
    const colorNative = document.querySelector('#brand-color-native');
    const colorHex = document.querySelector('#brand-color-hex');
    const swatch = document.querySelector('.color-swatch-preview');
    if (colorNative && colorHex && swatch) {
      colorNative.addEventListener('input', (e) => {
        colorHex.value = e.target.value;
        swatch.style.backgroundColor = e.target.value;
        document.querySelector('.portfolio-container')?.style.setProperty('--brand-color', e.target.value);
      });
      colorHex.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          colorNative.value = e.target.value;
          swatch.style.backgroundColor = e.target.value;
          document.querySelector('.portfolio-container')?.style.setProperty('--brand-color', e.target.value);
        }
      });
    }

    // Live status toggle text update
    const statusToggle = document.querySelector('#portfolio-status-toggle');
    const statusText = document.querySelector('.switch-status-text');
    if (statusToggle && statusText) {
      statusToggle.addEventListener('change', (e) => {
        statusText.textContent = e.target.checked ? 'Publicado' : 'Borrador';
        statusText.className = `switch-status-text ${e.target.checked ? 'is-published' : 'is-draft'}`;
      });
    }
  } catch (error) {
    app.innerHTML = `<div class="empty"><h3>Error al cargar portafolio</h3><p>${error.message}</p></div>`;
  }
}

function renderPortfolioProfileTab(portfolio) {
  const brandColor = portfolio.brand_color || '#E11D48';
  return `
    <div class="portfolio-panel panel">
      <form data-form="portfolio-profile" class="portfolio-form">
        <!-- Titular / Tagline -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Titular / Tagline</label>
          <input name="tagline" value="${portfolio.tagline || ''}" placeholder="Ej: Especialista en Realismo y Blackwork" class="portfolio-input" required />
          <small class="field-hint">Aparece justo debajo de tu nombre en la landing pública.</small>
        </div>

        <!-- Biografía breve -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Biografía breve</label>
          <textarea name="bio" rows="3" placeholder="Cuéntale a tus clientes quién eres, tu experiencia, estilo..." class="portfolio-textarea">${portfolio.bio || ''}</textarea>
        </div>

        <!-- Color de marca -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Color de marca</label>
          <div class="brand-color-picker-row">
            <div class="color-swatch-box">
              <input type="color" id="brand-color-native" value="${brandColor}" class="color-picker-hidden" />
              <div class="color-swatch-preview" style="background-color: ${brandColor};" title="Haz clic para elegir color"></div>
            </div>
            <input type="text" name="brandColor" id="brand-color-hex" value="${brandColor}" class="brand-color-hex-input" maxlength="7" placeholder="#E11D48" />
            <div class="color-presets-strip">
              <button type="button" class="color-preset-dot" data-set-color="#E11D48" style="background:#E11D48" title="Rojo Carmesí"></button>
              <button type="button" class="color-preset-dot" data-set-color="#7C3AED" style="background:#7C3AED" title="Púrpura Eléctrico"></button>
              <button type="button" class="color-preset-dot" data-set-color="#2563EB" style="background:#2563EB" title="Azul Real"></button>
              <button type="button" class="color-preset-dot" data-set-color="#059669" style="background:#059669" title="Verde Esmeralda"></button>
              <button type="button" class="color-preset-dot" data-set-color="#D97706" style="background:#D97706" title="Ámbar Dorado"></button>
              <button type="button" class="color-preset-dot" data-set-color="#09041C" style="background:#09041C" title="Negro Obsidiana"></button>
            </div>
          </div>
        </div>

        <!-- Foto de portada -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Foto de portada</label>
          <div class="input-with-side-action">
            <input name="coverImage" id="portfolio-cover-input" value="${portfolio.cover_image || ''}" placeholder="URL de imagen o selecciona una muestra..." class="portfolio-input" />
            <button type="button" class="side-action-btn" data-action="pick-sample-cover" title="Seleccionar imagen sugerida">
              ${icon('image')} <span>Muestras</span>
            </button>
          </div>
          ${portfolio.cover_image ? `
            <div class="cover-thumbnail-preview" style="background-image: url('${portfolio.cover_image}');">
              <span>Vista previa de portada</span>
            </div>
          ` : ''}
        </div>

        <!-- Foto de perfil -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Foto de perfil</label>
          <div class="input-with-side-action">
            <input name="avatarImage" id="portfolio-avatar-input" value="${portfolio.avatar_image || ''}" placeholder="URL de imagen o selecciona una muestra..." class="portfolio-input" />
            <button type="button" class="side-action-btn" data-action="pick-sample-avatar" title="Seleccionar avatar sugerido">
              ${icon('user')} <span>Avatares</span>
            </button>
          </div>
          ${portfolio.avatar_image ? `
            <div class="avatar-thumbnail-row">
              <img src="${portfolio.avatar_image}" alt="Avatar" class="avatar-thumbnail" />
              <span class="field-hint">Foto de perfil activa</span>
            </div>
          ` : ''}
        </div>

        <!-- Enlace principal de reserva / WhatsApp -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Enlace principal de reserva / WhatsApp</label>
          <input name="bookingLink" value="${portfolio.booking_link || ''}" placeholder="https://wa.me/56912345678 o link directo de reserva" class="portfolio-input" />
        </div>

        <!-- WhatsApp, Instagram & Ubicación -->
        <div class="form-grid">
          <div class="portfolio-field-group">
            <label class="portfolio-field-label">Número de WhatsApp</label>
            <input name="whatsappNumber" value="${portfolio.whatsapp_number || ''}" placeholder="+56 9 8765 4321" class="portfolio-input" />
          </div>
          <div class="portfolio-field-group">
            <label class="portfolio-field-label">Instagram</label>
            <input name="instagramHandle" value="${portfolio.instagram_handle || ''}" placeholder="@mi_estudio" class="portfolio-input" />
          </div>
        </div>

        <div class="form-grid">
          <div class="portfolio-field-group">
            <label class="portfolio-field-label">Ubicación / Ciudad</label>
            <input name="location" value="${portfolio.location || 'Santiago, Chile'}" placeholder="Ej. Santiago, Chile" class="portfolio-input" />
          </div>
          <div class="portfolio-field-group">
            <label class="portfolio-field-label">Handle personalizado (URL)</label>
            <input name="handle" value="${portfolio.handle || ''}" placeholder="elena.ink" class="portfolio-input" required />
          </div>
        </div>

        <!-- Instrucciones de cuidado -->
        <div class="portfolio-field-group">
          <label class="portfolio-field-label">Instrucciones de cuidado post-tatuaje</label>
          <textarea name="careInstructions" rows="3" placeholder="Recomendaciones que verán tus clientes al tocar 'Cuidados del Tatuaje'..." class="portfolio-textarea">${portfolio.care_instructions || ''}</textarea>
        </div>

        <div class="portfolio-submit-row">
          <button class="primary portfolio-submit-btn" type="submit">
            ${icon('check')} Guardar datos de perfil
          </button>
          <p class="form-error"></p>
        </div>
      </form>
    </div>
  `;
}

function renderPortfolioGalleryTab(portfolio, gallery) {
  return `
    <div class="portfolio-panel panel gallery-upload-view-panel">
      <!-- Hidden Native File Input for Direct Device/Camera Upload -->
      <input type="file" id="gallery-native-file-input" accept="image/*" multiple style="display: none;" />

      <div class="gallery-tab-header">
        <p class="gallery-tab-lead">Selecciona y organiza las imágenes para tu galería pública. Mantén el estilo limpio y profesional de tu estudio.</p>
        <div class="gallery-tab-actions">
          <button class="secondary small-btn" data-action="sync-instagram" title="Importar o sincronizar fotos desde tu cuenta de Instagram">
            ${icon('instagram')} <span>Instagram</span>
          </button>
          <button class="secondary small-btn" data-action="open-url-gallery-modal" title="Añadir por URL o foto de muestra">
            ${icon('link')} <span>Por URL</span>
          </button>
        </div>
      </div>

      <!-- Dedicated Card Canvas matching Figma Screen 3 -->
      <div class="gallery-grid-canvas-card">
        <div class="gallery-upload-grid">
          ${gallery.map((img) => `
            <div class="gallery-card-item">
              <div class="gallery-img-container" data-action="open-lightbox" data-url="${img.image_url}" data-title="${img.title || 'Tatuaje'}" data-style="${img.style_tag || ''}">
                <img src="${img.image_url}" alt="${img.title || 'Trabajo'}" loading="lazy" />
                ${img.style_tag ? `<span class="gallery-style-badge">${img.style_tag}</span>` : ''}
                ${img.source === 'instagram' ? `<span class="gallery-ig-badge">${icon('instagram')}</span>` : ''}
                <button class="gallery-delete-btn" data-action="delete-gallery-item" data-id="${img.id}" title="Eliminar imagen" aria-label="Eliminar imagen">
                  ${icon('trash')}
                </button>
              </div>
            </div>
          `).join('')}

          <!-- Add More Slot with dashed purple border and plus circle -->
          <button class="gallery-add-slot-btn" data-action="trigger-file-upload" title="Subir fotos desde tu dispositivo">
            <div class="add-slot-circle-badge">
              <span class="plus-sign">+</span>
            </div>
            <span class="add-slot-text">Añadir más</span>
          </button>

          <!-- Aesthetic Empty Placeholder Slots (filling up to 9 slots like in wireframe) -->
          ${Array.from({ length: Math.max(0, 8 - gallery.length) }).map(() => `
            <div class="gallery-placeholder-slot" data-action="trigger-file-upload" title="Subir foto">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="gallery-bottom-bar">
        <button class="gallery-upload-main-btn" data-action="trigger-file-upload">
          ${icon('cloudUpload')} <span>Subir a la galería</span>
        </button>
      </div>
    </div>
  `;
}

async function handleGalleryFilesUpload(files) {
  if (!files || !files.length) return;
  const lead = document.querySelector('.gallery-tab-lead');
  if (lead) lead.textContent = `Procesando y subiendo ${files.length} imagen(es)...`;

  const imagesToUpload = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;
    try {
      const dataUrl = await readFileAsDataURL(file);
      imagesToUpload.push({
        imageUrl: dataUrl,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        styleTag: 'Portafolio',
        source: 'upload'
      });
    } catch (e) {
      console.warn('Error reading file:', e);
    }
  }

  if (imagesToUpload.length) {
    try {
      await api('/api/portfolio/gallery', {
        method: 'POST',
        body: JSON.stringify({ images: imagesToUpload })
      });
      portfolioData = await api('/api/portfolio/me');
      const content = document.querySelector('#portfolio-tab-view-container');
      if (content) content.innerHTML = renderPortfolioGalleryTab(portfolioData.portfolio, portfolioData.gallery);
    } catch (err) {
      alert('Error al subir imágenes: ' + err.message);
      if (lead) lead.textContent = 'Selecciona y organiza las imágenes para tu galería pública.';
    }
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function openAddGalleryPhotoModal() {
  openModal(`
    <p class="eyebrow">GALERÍA DE TRABAJOS</p>
    <h2 id="modal-title">Añadir foto al portafolio</h2>
    <form data-form="add-gallery-item">
      <label>URL de la imagen
        <input name="imageUrl" id="new-gallery-image-url" required placeholder="https://images.unsplash.com/..." />
      </label>

      <div class="sample-image-chips">
        <small class="field-hint" style="margin-bottom: 6px; display: block; font-weight: 700;">O elige una foto sugerida:</small>
        <div class="sample-presets-grid">
          ${SAMPLE_GALLERY_PRESETS.map((preset) => `
            <button type="button" class="sample-preset-btn" data-pick-url="${preset.url}" data-pick-title="${preset.title}" data-pick-style="${preset.style}">
              <img src="${preset.url}" alt="${preset.title}" />
              <span>${preset.style}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="form-grid" style="margin-top: 10px;">
        <label>Título o descripción
          <input name="title" id="new-gallery-title" placeholder="Ej. Composición Floral en antebrazo" />
        </label>
        <label>Estilo / Técnica
          <select name="styleTag" id="new-gallery-style">
            <option value="Fineline">Fineline</option>
            <option value="Microrealismo">Microrealismo</option>
            <option value="Blackwork">Blackwork</option>
            <option value="Neotradicional">Neotradicional</option>
            <option value="Realismo">Realismo</option>
            <option value="Minimalista">Minimalista</option>
            <option value="Dotwork">Dotwork</option>
            <option value="Full Color">Full Color</option>
            <option value="Cover-up">Cover-up</option>
          </select>
        </label>
      </div>

      <button class="primary" type="submit" style="margin-top: 12px;">${icon('plus')} Guardar en mi galería</button>
      <p class="form-error"></p>
    </form>
  `);
}

function openSampleCoverPicker() {
  openModal(`
    <p class="eyebrow">FOTO DE PORTADA</p>
    <h2 id="modal-title">Seleccionar foto de portada</h2>
    <p class="lead" style="margin-bottom: 14px;">Elige una de las imágenes de alta resolución sugeridas para tu encabezado:</p>
    <div class="sample-covers-grid">
      ${SAMPLE_COVERS.map((cov) => `
        <div class="sample-cover-card" data-pick-cover-url="${cov.url}">
          <div class="cover-img-box" style="background-image: url('${cov.url}');"></div>
          <strong>${cov.label}</strong>
        </div>
      `).join('')}
    </div>
  `);
}

function openSampleAvatarPicker() {
  openModal(`
    <p class="eyebrow">FOTO DE PERFIL</p>
    <h2 id="modal-title">Seleccionar avatar de muestra</h2>
    <p class="lead" style="margin-bottom: 14px;">Elige un avatar sugerido para tu perfil:</p>
    <div class="sample-avatars-grid">
      ${SAMPLE_AVATARS.map((av) => `
        <div class="sample-avatar-card" data-pick-avatar-url="${av.url}">
          <img src="${av.url}" alt="${av.label}" class="sample-avatar-img" />
          <strong>${av.label}</strong>
        </div>
      `).join('')}
    </div>
  `);
}

function openLightbox(imageUrl, title = '', styleTag = '') {
  openModal(`
    <div class="lightbox-modal-content">
      <div class="lightbox-img-wrapper">
        <img src="${imageUrl}" alt="${title || 'Trabajo'}" class="lightbox-img" />
      </div>
      <div class="lightbox-info">
        <h3>${title || 'Trabajo de Portafolio'}</h3>
        ${styleTag ? `<span class="lightbox-style-badge">${styleTag}</span>` : ''}
      </div>
    </div>
  `);
}

function openCareInstructionsModal(careText) {
  const lines = (careText || '').split('\n').filter(Boolean);
  openModal(`
    <p class="eyebrow">CUIDADOS POST-TATUAJE</p>
    <h2 id="modal-title">Instrucciones de cicatrización</h2>
    <div class="care-instructions-list">
      ${lines.length ? lines.map((line, i) => `
        <div class="care-step-item">
          <span class="care-step-num">${i + 1}</span>
          <p>${line.replace(/^[0-9]+[.\-)]\s*/, '')}</p>
        </div>
      `).join('') : `
        <p>Mantén la zona limpia e hidratada con crema cicatrizante en capa fina durante 15 días y evita la exposición al sol directo.</p>
      `}
    </div>
  `);
}

function openBookingConsultationModal(artistName, handle, brandColor) {
  openModal(`
    <p class="eyebrow" style="color: ${brandColor};">CONSULTA & RESERVA</p>
    <h2 id="modal-title">Agendar con ${artistName}</h2>
    <p class="lead" style="margin-bottom: 16px;">Completa tu solicitud para coordinar tu cita o cotización directamente con el artista.</p>
    <form data-form="public-consultation-request" style="--brand-color: ${brandColor};">
      <label>Tu nombre completo
        <input name="name" required placeholder="Ej. Camila Morales" />
      </label>
      <div class="form-grid">
        <label>Teléfono / WhatsApp
          <input name="phone" type="tel" required placeholder="+56 9 1234 5678" />
        </label>
        <label>Email de contacto
          <input name="email" type="email" required placeholder="camila@example.com" />
        </label>
      </div>
      <label>Idea del tatuaje y ubicación en el cuerpo
        <textarea name="idea" rows="3" required placeholder="Describe tu idea, estilo deseado y zona del cuerpo (ej. antebrazo, espalda)..."></textarea>
      </label>
      <button class="primary" type="submit" style="background: ${brandColor}; border-color: ${brandColor}; margin-top: 10px;">
        ${icon('check')} Enviar solicitud de reserva
      </button>
      <p class="form-error"></p>
    </form>
  `);
}

function openPublicPortfolioLanding(customData = null) {
  const data = customData || portfolioData || {};
  const portfolio = data.portfolio || {};
  const gallery = data.gallery || [];
  const artistName = data.user?.full_name || portfolio.artist_name || 'Elena Ink';
  const brandColor = portfolio.brand_color || '#E11D48';
  const cleanPhone = (portfolio.whatsapp_number || '+56987654321').replace(/[^0-9]/g, '');
  const coverUrl = portfolio.cover_image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80';
  const avatarUrl = portfolio.avatar_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  openModal(`
    <div class="public-landing-container" style="--brand-color: ${brandColor};">
      <!-- Floating Top Bar -->
      <div class="public-landing-nav">
        <span class="public-badge-preview">Vista Previa Pública</span>
        <button class="copy-landing-link-btn" data-action="copy-portfolio-link" data-handle="${portfolio.handle}" title="Copiar enlace">
          ${icon('copy')} <span>tatudin.com/p/${portfolio.handle}</span>
        </button>
      </div>

      <!-- Hero Header with Cover Image & Avatar -->
      <header class="public-hero-section" style="background-image: url('${coverUrl}');">
        <div class="public-hero-gradient"></div>
        <div class="public-avatar-holder">
          <img src="${avatarUrl}" alt="${artistName}" class="public-avatar-img" />
        </div>
      </header>

      <!-- Artist Info Content -->
      <main class="public-landing-body">
        <h1 class="public-artist-name">${artistName}</h1>
        <p class="public-artist-tagline">${portfolio.tagline || 'Fine Line & Micro-realism Specialist'}</p>
        <p class="public-artist-bio">${portfolio.bio || 'Transforming stories into permanent art. Especialista en piezas personalizadas con los más altos estándares de bioseguridad.'}</p>
        <p class="public-artist-location">${portfolio.location ? `📍 ${portfolio.location}` : '📍 Santiago, Chile'}</p>

        <!-- Public Action CTA Buttons matching Screen 4 from Figma -->
        <div class="public-cta-buttons-stack">
          <button class="public-action-btn primary-cta" data-action="open-public-consultation" data-artist="${artistName}" data-handle="${portfolio.handle}" data-color="${brandColor}">
            ${icon('calendar')} <span>Book a Consultation</span>
          </button>

          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`¡Hola ${artistName}! Vi tu portafolio en Tatudin y me gustaría consultar por una cita.`)}" target="_blank" rel="noopener" class="public-action-btn whatsapp-cta">
            ${icon('whatsapp')} <span>WhatsApp Direct</span>
          </a>

          <button class="public-action-btn secondary-cta" data-action="open-care-instructions" data-care="${encodeURIComponent(portfolio.care_instructions || '')}">
            ${icon('check')} <span>Care Instructions</span>
          </button>
        </div>

        <!-- Recent Work Gallery Grid -->
        <section class="public-recent-work-section">
          <h2 class="public-recent-work-heading">Recent Work</h2>
          <div class="public-gallery-grid">
            ${gallery.map((item) => `
              <div class="public-work-card" data-action="open-lightbox" data-url="${item.image_url}" data-title="${item.title || artistName}" data-style="${item.style_tag || ''}">
                <img src="${item.image_url}" alt="${item.title || 'Tatuaje'}" loading="lazy" />
                ${item.style_tag ? `<span class="work-card-tag">${item.style_tag}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Footer -->
        <footer class="public-landing-footer">
          <p>Powered by <strong>tatudin</strong> · Plataforma para estudios y artistas</p>
        </footer>
      </main>
    </div>
  `);
}

function openModal(content) {
  modalContent.innerHTML = content;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

function clientOptions(selectedId = null) {
  return clients && clients.length
    ? clients.map((client) => `<option value="${client.id}" ${Number(selectedId) === Number(client.id) ? 'selected' : ''}>${client.name}</option>`).join('')
    : '<option value="">Primero crea un cliente</option>';
}

function memberOptions() {
  return members && members.length
    ? `<option value="">Sin asignar / General</option>` + members.map((m) => `<option value="${m.id}">${m.full_name} (${ROLE_MAP[m.role]?.label || m.role})</option>`).join('')
    : '<option value="">Sin artistas registrados</option>';
}

function spaceOptions() {
  return spaces && spaces.length
    ? `<option value="">Sin box específico</option>` + spaces.filter((s) => s.is_active).map((s) => `<option value="${s.id}">${s.name} (${money(s.price_per_day)}/día)</option>`).join('')
    : '<option value="">Sin boxes creados</option>';
}

async function newBookingModal(preselectedClientId = null) {
  try {
    const [clData, memData, spData, catData] = await Promise.all([
      api('/api/clients').catch(() => []),
      api('/api/members').catch(() => []),
      api('/api/spaces').catch(() => []),
      api('/api/categories').catch(() => [])
    ]);
    clients = clData;
    members = memData;
    spaces = spData;
    categories = catData;

    const defaultDateTime = getNextDefaultDateTime();
    const defaultCat = categories[0] || { id: '', name: 'Compromiso', kind: 'tattoo', color: '#7C3AED', requires_client: true, requires_space: false };

    openModal(`
      <p class="eyebrow">AGENDA</p>
      <h2 id="modal-title">Nuevo compromiso</h2>
      
      <!-- Category selector pills in modal -->
      <div class="modal-category-picker">
        <label class="picker-label">Categoría:</label>
        <div class="category-radio-group">
          ${categories.map((c, i) => `
            <label class="category-pill-option ${i === 0 ? 'active' : ''}" style="--c-color: ${c.color}">
              <input type="radio" name="modalCategory" value="${c.id}" data-kind="${c.kind}" data-requires-client="${c.requires_client}" data-requires-space="${c.requires_space}" ${i === 0 ? 'checked' : ''} />
              <span class="cat-pill-circle" style="background:${c.color}"></span>
              <span>${c.name}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <form data-form="booking" class="booking-dynamic-form">
        <input type="hidden" name="categoryId" value="${defaultCat.id}" />

        <label>Título o motivo
          <input name="title" required placeholder="Ej. Tatuaje Floral, Sesión de Fotos, Arriendo Box 1..." />
        </label>

        <!-- Dynamic Client section -->
        <div id="booking-client-section" class="form-section ${defaultCat.requires_client ? '' : 'hidden'}">
          <label>Cliente
            <select name="clientId">
              <option value="">Sin cliente asociado</option>
              ${clientOptions(preselectedClientId)}
            </select>
          </label>
        </div>

        <div class="form-grid">
          <label id="booking-artist-label">Artista / Responsable
            <select name="artistId">${memberOptions()}</select>
          </label>
          <label id="booking-space-label">Box / Espacio
            <select name="spaceId">${spaceOptions()}</select>
          </label>
        </div>

        <label>Fecha y hora de inicio
          <input name="startsAt" type="datetime-local" value="${defaultDateTime}" required />
        </label>

        <div class="form-grid">
          <label>Duración (min)
            <input name="durationMinutes" type="number" value="120" min="15" step="15" />
          </label>
          <label id="booking-price-label">Precio / Cobro (CLP)
            <input name="price" type="number" value="0" min="0" />
          </label>
        </div>

        <div id="booking-deposit-section" class="form-section ${defaultCat.requires_client ? '' : 'hidden'}">
          <label>Abono / Seña recibida (CLP)
            <input name="deposit" type="number" value="0" min="0" />
          </label>
        </div>

        <label>Notas y consideraciones
          <textarea name="notes" rows="2" placeholder="Detalles de la sesión, acuerdos, requerimientos especiales..."></textarea>
        </label>

        <button class="primary" type="submit">${icon('plus')} Guardar en agenda</button>
        <p class="form-error"></p>
      </form>
    `);

    document.querySelectorAll('.category-pill-option input[name="modalCategory"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        document.querySelectorAll('.category-pill-option').forEach((p) => p.classList.remove('active'));
        e.target.closest('.category-pill-option')?.classList.add('active');

        const catId = e.target.value;
        const requiresClient = e.target.dataset.requiresClient === 'true';
        const kind = e.target.dataset.kind;

        const catIdInput = document.querySelector('form[data-form="booking"] input[name="categoryId"]');
        if (catIdInput) catIdInput.value = catId;

        const clientSec = document.querySelector('#booking-client-section');
        const depositSec = document.querySelector('#booking-deposit-section');

        if (clientSec) clientSec.classList.toggle('hidden', !requiresClient && kind !== 'tattoo');
        if (depositSec) depositSec.classList.toggle('hidden', !requiresClient && kind !== 'tattoo');
      });
    });
  } catch (err) {
    console.error('Error opening booking modal:', err);
    alert('Error al abrir formulario de agenda: ' + err.message);
  }
}

function newCategoryModal() {
  const defaultColors = ['#7C3AED', '#2563EB', '#0284C7', '#059669', '#10B981', '#D97706', '#DC2626', '#E11D48', '#8B5CF6', '#6B7280'];
  openModal(`
    <p class="eyebrow">AGENDA</p>
    <h2 id="modal-title">Nueva categoría de compromiso</h2>
    <form data-form="category">
      <label>Nombre de la categoría
        <input name="name" required placeholder="Ej. Marketing & Redes, Arriendo de Box, Grabación..." />
      </label>
      <label>Tipo base
        <select name="kind">
          <option value="custom">Personalizado</option>
          <option value="tattoo">Cita de Tatuaje</option>
          <option value="space_rental">Arriendo de Espacio / Box</option>
          <option value="marketing">Marketing & Contenido</option>
          <option value="meeting">Reunión de Trabajo</option>
          <option value="maintenance">Mantenimiento & Boxes</option>
          <option value="personal">Personal / Bloqueo</option>
        </select>
      </label>
      <label>Color identificador
        <div class="color-picker-grid">
          ${defaultColors.map((c, i) => `
            <label class="color-swatch-label">
              <input type="radio" name="color" value="${c}" ${i === 0 ? 'checked' : ''} />
              <span class="color-swatch" style="background: ${c}"></span>
            </label>
          `).join('')}
        </div>
      </label>
      <div style="margin: 14px 0; display: flex; flex-direction: column; gap: 8px;">
        <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer;">
          <input type="checkbox" name="requiresClient" value="true" />
          <span>Requiere asociar cliente de la base de datos</span>
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer;">
          <input type="checkbox" name="requiresSpace" value="true" />
          <span>Ocupa un Box / Espacio físico reservado</span>
        </label>
      </div>
      <button class="primary" type="submit">${icon('plus')} Crear categoría</button>
      <p class="form-error"></p>
    </form>
  `);
}

function newClientModal() {
  openModal(`
    <p class="eyebrow">CLIENTES</p>
    <h2 id="modal-title">Nuevo cliente</h2>
    <form data-form="client">
      <label>Nombre completo<input name="name" required placeholder="Nombre y apellido" /></label>
      <div class="form-grid">
        <label>Email<input name="email" type="email" placeholder="cliente@email.com" /></label>
        <label>Teléfono<input name="phone" placeholder="+56 9 1234 5678" /></label>
      </div>
      <label>Notas del cliente (alergias, consideraciones)<textarea name="notes" rows="3" placeholder="Detalles importantes..."></textarea></label>
      <button class="primary" type="submit">${icon('plus')} Crear cliente</button>
      <p class="form-error"></p>
    </form>
  `);
}

function newMemberModal() {
  openModal(`
    <p class="eyebrow">EQUIPO</p>
    <h2 id="modal-title">Agregar artista o colaborador</h2>
    <form data-form="member">
      <label>Nombre completo<input name="fullName" required placeholder="Ej. Alex Rivera" /></label>
      <label>Email<input name="email" type="email" required placeholder="alex@studio.com" /></label>
      <label>Tipo de relación con el estudio
        <select name="role">
          <option value="resident">Residente (permanente)</option>
          <option value="nomad">Nómade (visitante / temporal)</option>
          <option value="admin">Administrador del estudio</option>
        </select>
      </label>
      <button class="primary" type="submit">${icon('userCheck')} Incorporar al equipo</button>
      <p class="form-error"></p>
    </form>
  `);
}

function newSpaceModal() {
  openModal(`
    <p class="eyebrow">INFRAESTRUCTURA</p>
    <h2 id="modal-title">Nuevo Box / Espacio</h2>
    <form data-form="space">
      <label>Nombre del espacio<input name="name" required placeholder="Ej. Box 3 · Acústico" /></label>
      <label>Descripción / Equipamiento<input name="description" placeholder="Camilla hidráulica, luz neutra..." /></label>
      <div class="form-grid">
        <label>Tarifa por día (CLP)<input name="pricePerDay" type="number" value="45000" min="0" step="5000" /></label>
        <label>Tarifa por hora (CLP)<input name="pricePerHour" type="number" value="10000" min="0" step="1000" /></label>
      </div>
      <button class="primary" type="submit">${icon('box')} Crear espacio</button>
      <p class="form-error"></p>
    </form>
  `);
}

function newTransactionModal() {
  openModal(`
    <p class="eyebrow">FINANZAS</p>
    <h2 id="modal-title">Registrar movimiento</h2>
    <form data-form="transaction">
      <label>Tipo de movimiento
        <select name="kind">
          <option value="income">Ingreso (+)</option>
          <option value="expense">Gasto (−)</option>
        </select>
      </label>
      <label>Descripción<input name="description" required placeholder="Ej. Depósito seña o insumos" /></label>
      <div class="form-grid">
        <label>Monto (CLP)<input name="amount" type="number" min="0" required placeholder="50000" /></label>
        <label>Artista asociado (opcional)
          <select name="artistId">
            <option value="">General del estudio</option>
            ${(members || []).map((m) => `<option value="${m.id}">${m.full_name}</option>`).join('')}
          </select>
        </label>
      </div>
      <button class="primary" type="submit">${icon('plus')} Guardar movimiento</button>
      <p class="form-error"></p>
    </form>
  `);
}

function userProfileModal() {
  const initials = ((currentUser?.full_name || currentUser?.fullName || 'TU').split(' ').map((p) => p[0]).slice(0, 2).join('')).toUpperCase();
  openModal(`
    <div class="client-detail-header">
      <div class="initials large">${initials}</div>
      <div>
        <p class="eyebrow">MI CUENTA</p>
        <h2 id="modal-title">${currentUser?.full_name || currentUser?.fullName || 'Perfil de Usuario'}</h2>
        <p class="client-contact-lead">${currentUser?.email || ''} · ${ROLE_MAP[currentUser?.role]?.label || currentUser?.role || 'Miembro'}</p>
      </div>
    </div>

    <form data-form="user-profile" style="margin-top: 10px;">
      <label>Nombre completo
        <input name="fullName" value="${currentUser?.full_name || currentUser?.fullName || ''}" required />
      </label>
      <label>Email
        <input name="email" type="email" value="${currentUser?.email || ''}" required />
      </label>

      <div style="border-top: 1px solid var(--line); padding-top: 12px; margin-top: 4px;">
        <p class="eyebrow">CAMBIAR CONTRASEÑA (OPCIONAL)</p>
        <div class="form-grid">
          <label>Contraseña actual
            <input name="currentPassword" type="password" placeholder="Tu contraseña actual" />
          </label>
          <label>Nueva contraseña
            <input name="newPassword" type="password" placeholder="Mínimo 8 caracteres" minlength="8" />
          </label>
        </div>
      </div>

      <button class="primary" type="submit" style="margin-top: 6px;">${icon('check')} Guardar datos de usuario</button>
      <p class="form-error"></p>
    </form>

    <div style="border-top: 1px solid var(--line); margin-top: 20px; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="font-size: 13px; display: block;">Sesión de cuenta</strong>
        <span style="font-size: 11px; color: var(--muted);">Cerrar sesión en este dispositivo</span>
      </div>
      <button class="secondary" data-action="logout" style="color: var(--red); border-color: var(--red-soft);">
        Cerrar sesión
      </button>
    </div>
  `);
}

function settleArtistModal(artistId, artistName, pendingAmount) {
  openModal(`
    <p class="eyebrow">FINANZAS & LIQUIDACIÓN</p>
    <h2 id="modal-title">Liquidar a ${artistName}</h2>
    <p class="lead" style="margin-bottom: 16px;">Registra el pago de comisiones pendientes como egreso contable del estudio.</p>
    <form data-form="settle-artist">
      <input type="hidden" name="artistId" value="${artistId}" />
      <label>Monto a transferir / liquidar (CLP)
        <input name="amount" type="number" value="${pendingAmount}" min="1" required />
      </label>
      <label>Nota o comprobante (opcional)
        <input name="notes" placeholder="Ej. Transf. Banco Estado #83910" />
      </label>
      <button class="primary" type="submit">${icon('check')} Registrar pago de liquidación</button>
      <p class="form-error"></p>
    </form>
  `);
}

function editCommissionModal(membershipId, artistName, currentPercent) {
  openModal(`
    <p class="eyebrow">EQUIPO & COMISIONES</p>
    <h2 id="modal-title">Comisión de ${artistName}</h2>
    <p class="lead" style="margin-bottom: 16px;">Define el porcentaje que recibe el artista por cada sesión (el resto corresponde al estudio).</p>
    <form data-form="edit-commission" data-id="${membershipId}">
      <label>Porcentaje para el artista (%)
        <input name="commissionPercent" type="number" min="0" max="100" step="0.5" value="${currentPercent}" required />
      </label>
      <button class="primary" type="submit">${icon('check')} Guardar porcentaje</button>
      <p class="form-error"></p>
    </form>
  `);
}

function newGuestSpotModal() {
  openModal(`
    <p class="eyebrow">PORTAL DE NÓMADES</p>
    <h2 id="modal-title">Solicitud de Guest Spot</h2>
    <p class="lead" style="margin-bottom: 16px;">Postulación de artista nómade o visitante para arrendar un puesto en el estudio.</p>
    <form data-form="guest-spot-request">
      <label>Nombre del artista
        <input name="artistName" required placeholder="Ej. Valentina Ink" />
      </label>
      <div class="form-grid">
        <label>Email
          <input name="artistEmail" type="email" required placeholder="valentina@tattoo.com" />
        </label>
        <label>Instagram / Portafolio
          <input name="artistInstagram" placeholder="@valentina.tattoo" />
        </label>
      </div>
      <div class="form-grid">
        <label>Fecha de inicio
          <input name="startDate" type="date" value="${new Date().toISOString().slice(0, 10)}" required />
        </label>
        <label>Fecha de fin
          <input name="endDate" type="date" value="${new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10)}" required />
        </label>
      </div>
      <label>Box solicitado
        <select name="spaceId">${spaceOptions()}</select>
      </label>
      <label>Mensaje o requerimientos
        <textarea name="notes" rows="3" placeholder="Estilo, insumos necesarios o fechas alternativas..."></textarea>
      </label>
      <button class="primary" type="submit">${icon('plus')} Enviar solicitud</button>
      <p class="form-error"></p>
    </form>
  `);
}

function boEditUserModal(userId, userName, userEmail, isRoot) {
  openModal(`
    <p class="eyebrow">BACKOFFICE ROOT</p>
    <h2 id="modal-title">Editar Usuario #${userId}</h2>
    <p class="lead" style="margin-bottom: 16px;">Modifica los datos del usuario o restablece su contraseña de acceso.</p>
    <form data-form="bo-edit-user" data-id="${userId}">
      <label>Nombre completo
        <input name="fullName" value="${userName || ''}" required />
      </label>
      <label>Email
        <input name="email" type="email" value="${userEmail || ''}" required />
      </label>
      <label>Nueva contraseña (dejar en blanco para conservar la actual)
        <input name="newPassword" type="password" placeholder="Mínimo 8 caracteres" minlength="8" />
      </label>
      <div style="margin-top: 10px;">
        <label style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
          <input type="checkbox" name="isSuperAdmin" ${isRoot === 'true' || isRoot === true ? 'checked' : ''} style="width: auto;" />
          Privilegios de Superadministrador (Root)
        </label>
      </div>
      <button class="primary" type="submit" style="margin-top: 16px;">${icon('check')} Guardar Cambios</button>
      <p class="form-error"></p>
    </form>
  `);
}

function exportFinancesCSV(artistSummary, transactions) {
  let csv = '=== LIQUIDACIONES Y RENDIMIENTO POR ARTISTA ===\r\n';
  csv += 'Artista,Rol,% Comision,Sesiones,Total Generado,Comision Artista,Liquidado,Pendiente\r\n';
  (artistSummary || []).forEach((a) => {
    csv += `"${a.artist_name || ''}","${a.artist_role || ''}",${a.commission_percent || 70}%,${a.total_sessions || 0},${a.total_generated || 0},${a.artist_payout || 0},${a.settled_amount || 0},${a.pending_settlement || 0}\r\n`;
  });
  csv += '\r\n=== HISTORIAL DE MOVIMIENTOS ===\r\n';
  csv += 'ID,Fecha,Tipo,Descripcion,Monto,Artista\r\n';
  (transactions || []).forEach((t) => {
    csv += `${t.id},"${t.occurred_on}","${t.kind}","${(t.description || '').replace(/"/g, '""')}",${t.amount},"${t.artist_name || 'General'}"\r\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tatudin_finanzas_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Global Event Listeners
document.addEventListener('click', async (event) => {
  const switchAuth = event.target.closest('[data-switch-auth]');
  if (switchAuth) {
    return renderOnboarding(1, switchAuth.dataset.switchAuth);
  }
  const onboardingStepBtn = event.target.closest('[data-onboarding-step]');
  if (onboardingStepBtn) {
    const step = Number(onboardingStepBtn.dataset.onboardingStep);
    const authMode = onboardingStepBtn.dataset.authMode || 'register';
    return renderOnboarding(step, authMode);
  }
  if (event.target.closest('[data-onboarding-next]')) {
    const current = Number(document.querySelector('.onboarding')?.dataset.step || 0);
    return renderOnboarding(current + 1);
  }
  const role = event.target.closest('[data-role]');
  if (role) {
    onboarding.role = role.dataset.role;
    return renderOnboarding(2);
  }
  const source = event.target.closest('[data-source]');
  if (source) {
    onboarding.acquisitionSource = source.dataset.source;
    return renderOnboarding(4);
  }
  const goal = event.target.closest('[data-goal]');
  if (goal) {
    onboarding.goals = onboarding.goals || [];
    onboarding.goals = onboarding.goals.includes(goal.dataset.goal)
      ? onboarding.goals.filter((item) => item !== goal.dataset.goal)
      : [...onboarding.goals, goal.dataset.goal];
    return renderOnboarding(5);
  }
  if (event.target.closest('[data-finish]')) {
    await saveOnboarding({ completed: true });
    localStorage.setItem('tatudin_onboarding_complete', 'true');
    return startApp();
  }
  // Toggle user dropdown menu
  const toggleUserMenu = event.target.closest('[data-action="toggle-user-menu"]');
  const userMenu = document.querySelector('#user-menu');
  if (toggleUserMenu) {
    event.stopPropagation();
    if (userMenu) {
      userMenu.hidden = !userMenu.hidden;
      updateUserMenuUI();
    }
    return;
  }

  // Open user profile modal from dropdown or button
  if (event.target.closest('[data-action="open-user-profile"]') || event.target.closest('[data-action="user-profile"]')) {
    if (userMenu) userMenu.hidden = true;
    return userProfileModal();
  }

  // Open Terms & Conditions Legal Landing
  const termsBtn = event.target.closest('[data-action="open-terms"]');
  if (termsBtn) {
    if (userMenu) userMenu.hidden = true;
    const isOb = document.body.classList.contains('onboarding-mode');
    const step = Number(termsBtn.dataset.fromStep || 0);
    const authMode = termsBtn.dataset.authMode || 'login';
    return renderTermsAndConditions(isOb, step, authMode);
  }

  // Back from terms in onboarding mode
  if (event.target.closest('[data-action="terms-back-onboarding"]')) {
    return renderOnboarding(termsReturnState.step || 0, termsReturnState.authMode || 'login');
  }

  // Back from terms in workspace mode
  if (event.target.closest('[data-action="terms-back-dashboard"]')) {
    return render(termsReturnState.prevView || 'ajustes');
  }

  // Close user dropdown if clicking outside
  if (userMenu && !userMenu.hidden && !event.target.closest('#user-menu')) {
    userMenu.hidden = true;
  }

  // Open Backoffice
  if (event.target.closest('[data-action="open-backoffice"]')) {
    if (userMenu) userMenu.hidden = true;
    return await render('backoffice');
  }

  // Backoffice tab navigation
  const boTabBtn = event.target.closest('[data-bo-tab]');
  if (boTabBtn) {
    return await renderBackoffice(boTabBtn.dataset.boTab);
  }

  // Backoffice impersonate
  const impBtn = event.target.closest('[data-action="bo-impersonate"]');
  if (impBtn) {
    const { studioId, studioName } = impBtn.dataset;
    await api('/api/backoffice/switch-studio-master', {
      method: 'POST',
      body: JSON.stringify({ studioId })
    });
    activeStudio = await api('/api/studio');
    updateStudioSidebarUI();
    alert(`Ahora estás administrando el estudio: ${studioName}`);
    return await render('dashboard');
  }

  // Backoffice edit user
  const boEditUserBtn = event.target.closest('[data-action="bo-edit-user"]');
  if (boEditUserBtn) {
    const { userId, userName, userEmail, isRoot } = boEditUserBtn.dataset;
    return boEditUserModal(userId, userName, userEmail, isRoot);
  }

  // Backoffice resolve guest spot
  const boResolveGsBtn = event.target.closest('[data-action="bo-resolve-gs"]');
  if (boResolveGsBtn) {
    const { id, status } = boResolveGsBtn.dataset;
    await api(`/api/backoffice/guest-spots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return await renderBackoffice('guest-spots');
  }

  // Backoffice trigger seed demo
  const boSeedBtn = event.target.closest('[data-action="bo-trigger-seed"]');
  if (boSeedBtn) {
    if (!confirm('¿Deseas poblar el sistema con los datos de prueba de Black Lotus Tattoo Studio?')) return;
    const originalText = boSeedBtn.textContent;
    boSeedBtn.textContent = 'Sembrando datos demo...';
    boSeedBtn.disabled = true;
    try {
      await api('/api/backoffice/seed-demo', { method: 'POST' });
      alert('¡Datos de prueba sembrados exitosamente!');
      return await renderBackoffice('stats');
    } catch (err) {
      alert('Error: ' + err.message);
      boSeedBtn.textContent = originalText;
      boSeedBtn.disabled = false;
    }
    return;
  }

  // Backoffice trigger purge production
  const boPurgeBtn = event.target.closest('[data-action="bo-trigger-purge"]');
  if (boPurgeBtn) {
    const confirmInput = prompt('⚠️ ADVERTENCIA CRÍTICA:\nEsta acción eliminará permanentemente todas las citas, clientes, transacciones, boxes y usuarios de prueba, dejando la base de datos limpia para PRODUCCIÓN.\n\nEscribe exactamente "LIMPIAR" para confirmar:');
    if (confirmInput !== 'LIMPIAR') {
      alert('Operación cancelada. No se modificó ningún dato.');
      return;
    }
    try {
      const res = await api('/api/backoffice/purge-production', { method: 'POST' });
      alert(res.message || 'Base de datos purgada exitosamente.');
      activeStudio = await api('/api/studio').catch(() => null);
      updateStudioSidebarUI();
      return await renderBackoffice('stats');
    } catch (err) {
      alert('Error al purgar la base de datos: ' + err.message);
    }
    return;
  }

  if (event.target.closest('[data-action="logout"]')) {
    if (userMenu) userMenu.hidden = true;
    closeModal();
    currentUser = null;
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.clear();
    return renderOnboarding(0);
  }

  // WhatsApp reminder
  const whatsappBtn = event.target.closest('[data-action="whatsapp-reminder"]');
  if (whatsappBtn) {
    const { phone, clientName, title, startsAt, artistName, spaceName } = whatsappBtn.dataset;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const dateFormatted = new Date(startsAt).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeFormatted = formatTime(startsAt);
    const studio = activeStudio?.name || 'nuestro estudio';
    const text = `¡Hola ${clientName}! 👋 Te recordamos tu cita de tatuaje "${title}" en ${studio} agendada para el ${dateFormatted} a las ${timeFormatted} hrs${artistName ? ` con ${artistName}` : ''}${spaceName ? ` en ${spaceName}` : ''}. ¡Nos vemos pronto! Por favor confirma tu asistencia. ✨`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    return;
  }

  // Settle artist
  const settleBtn = event.target.closest('[data-action="settle-artist"]');
  if (settleBtn) {
    const { artistId, artistName, pending } = settleBtn.dataset;
    return settleArtistModal(artistId, artistName, pending);
  }

  // Edit commission
  const editCommBtn = event.target.closest('[data-action="edit-commission"]');
  if (editCommBtn) {
    const { membershipId, artistName, commission } = editCommBtn.dataset;
    return editCommissionModal(membershipId, artistName, commission);
  }

  // Export CSV
  if (event.target.closest('[data-action="export-finances-csv"]')) {
    const [txs, sum] = await Promise.all([
      api('/api/transactions').catch(() => []),
      api('/api/finances/summary').catch(() => [])
    ]);
    return exportFinancesCSV(sum, txs);
  }

  // Guest spots actions
  if (event.target.closest('[data-action="new-guest-spot"]')) {
    return newGuestSpotModal();
  }
  if (event.target.closest('[data-action="copy-guest-spot-link"]')) {
    const url = `${window.location.origin}/#guest-spot-${activeStudio?.id || 1}`;
    navigator.clipboard?.writeText(url);
    alert(`Enlace copiado al portapapeles:\n${url}`);
    return;
  }
  const approveGuestBtn = event.target.closest('[data-action="approve-guest-spot"]');
  if (approveGuestBtn) {
    await api(`/api/guest-spots/${approveGuestBtn.dataset.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' })
    });
    return await renderSettings();
  }
  const rejectGuestBtn = event.target.closest('[data-action="reject-guest-spot"]');
  if (rejectGuestBtn) {
    await api(`/api/guest-spots/${rejectGuestBtn.dataset.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'rejected' })
    });
    return await renderSettings();
  }

  // Views navigation
  const viewLink = event.target.closest('[data-view]');
  if (viewLink) {
    event.preventDefault();
    return await render(viewLink.dataset.view);
  }

  // View client detail
  const clientRow = event.target.closest('[data-view-client-id]');
  if (clientRow) {
    return await clientDetailModal(clientRow.dataset.viewClientId);
  }
  const editClientBtn = event.target.closest('[data-edit-client-id]');
  if (editClientBtn) {
    return editClientModal(editClientBtn.dataset.editClientId);
  }
  const bookingForClientBtn = event.target.closest('[data-action="new-booking-for"]');
  if (bookingForClientBtn) {
    return await newBookingModal(bookingForClientBtn.dataset.clientId);
  }

  // Open user portfolio from dropdown or settings
  if (event.target.closest('[data-action="open-portfolio"]')) {
    if (userMenu) userMenu.hidden = true;
    return await render('portafolio');
  }

  // Portfolio tab dropdown toggle
  if (event.target.closest('[data-action="toggle-portfolio-tab-menu"]')) {
    const popover = document.querySelector('#portfolio-tab-popover');
    if (popover) popover.hidden = !popover.hidden;
    return;
  }

  // Portfolio tab switch
  const selectTabBtn = event.target.closest('[data-select-tab]');
  if (selectTabBtn) {
    portfolioCurrentTab = selectTabBtn.dataset.selectTab;
    const popover = document.querySelector('#portfolio-tab-popover');
    if (popover) popover.hidden = true;
    const activeText = document.querySelector('#portfolio-active-tab-text');
    if (activeText) activeText.textContent = portfolioCurrentTab === 'profile' ? '👤 Perfil' : '🖼️ Galería';
    document.querySelectorAll('.portfolio-desktop-tab-btn, .portfolio-tab-popover-item').forEach((b) => {
      b.classList.toggle('active', b.dataset.selectTab === portfolioCurrentTab);
    });
    const content = document.querySelector('#portfolio-tab-view-container');
    if (content && portfolioData) {
      content.innerHTML = portfolioCurrentTab === 'profile' 
        ? renderPortfolioProfileTab(portfolioData.portfolio) 
        : renderPortfolioGalleryTab(portfolioData.portfolio, portfolioData.gallery);
    }
    return;
  }

  // Portfolio preview
  if (event.target.closest('[data-action="preview-portfolio"]')) {
    return openPublicPortfolioLanding();
  }

  // Portfolio save main button
  if (event.target.closest('[data-action="save-portfolio"]')) {
    const profileForm = document.querySelector('form[data-form="portfolio-profile"]');
    if (profileForm) {
      profileForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else if (portfolioData) {
      const isPublished = document.querySelector('#portfolio-status-toggle')?.checked ?? portfolioData.portfolio.is_published;
      await api('/api/portfolio/me', {
        method: 'PUT',
        body: JSON.stringify({ isPublished })
      });
      alert('¡Estado del portafolio actualizado!');
    }
    return;
  }

  // Color preset chip select
  const colorPresetBtn = event.target.closest('[data-set-color]');
  if (colorPresetBtn) {
    const hex = colorPresetBtn.dataset.setColor;
    const nativeInput = document.querySelector('#brand-color-native');
    const hexInput = document.querySelector('#brand-color-hex');
    const swatch = document.querySelector('.color-swatch-preview');
    if (nativeInput) nativeInput.value = hex;
    if (hexInput) hexInput.value = hex;
    if (swatch) swatch.style.backgroundColor = hex;
    document.querySelector('.portfolio-container')?.style.setProperty('--brand-color', hex);
    return;
  }

  // Cover sample picker
  if (event.target.closest('[data-action="pick-sample-cover"]')) {
    return openSampleCoverPicker();
  }
  const pickCover = event.target.closest('[data-pick-cover-url]');
  if (pickCover) {
    const input = document.querySelector('#portfolio-cover-input');
    if (input) input.value = pickCover.dataset.pickCoverUrl;
    closeModal();
    return;
  }

  // Avatar sample picker
  if (event.target.closest('[data-action="pick-sample-avatar"]')) {
    return openSampleAvatarPicker();
  }
  const pickAvatar = event.target.closest('[data-pick-avatar-url]');
  if (pickAvatar) {
    const input = document.querySelector('#portfolio-avatar-input');
    if (input) input.value = pickAvatar.dataset.pickAvatarUrl;
    closeModal();
    return;
  }

  // Gallery add / delete / sync / upload
  if (event.target.closest('[data-action="trigger-file-upload"]')) {
    const fileInput = document.querySelector('#gallery-native-file-input');
    if (fileInput) fileInput.click();
    return;
  }
  if (event.target.closest('[data-action="open-url-gallery-modal"]') || event.target.closest('[data-action="add-gallery-photo"]')) {
    return openAddGalleryPhotoModal();
  }
  const pickSample = event.target.closest('[data-pick-url]');
  if (pickSample) {
    const { pickUrl, pickTitle, pickStyle } = pickSample.dataset;
    const urlInput = document.querySelector('#new-gallery-image-url');
    const titleInput = document.querySelector('#new-gallery-title');
    const styleInput = document.querySelector('#new-gallery-style');
    if (urlInput) urlInput.value = pickUrl;
    if (titleInput && !titleInput.value) titleInput.value = pickTitle;
    if (styleInput && pickStyle) styleInput.value = pickStyle;
    return;
  }
  const deleteGalleryBtn = event.target.closest('[data-action="delete-gallery-item"]');
  if (deleteGalleryBtn) {
    event.stopPropagation();
    if (confirm('¿Eliminar esta imagen de tu galería?')) {
      const id = deleteGalleryBtn.dataset.id;
      await api(`/api/portfolio/gallery/${id}`, { method: 'DELETE' });
      portfolioData = await api('/api/portfolio/me');
      const content = document.querySelector('#portfolio-tab-view-container');
      if (content) content.innerHTML = renderPortfolioGalleryTab(portfolioData.portfolio, portfolioData.gallery);
    }
    return;
  }
  if (event.target.closest('[data-action="sync-instagram"]')) {
    const btn = event.target.closest('[data-action="sync-instagram"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `${icon('instagram')} <span>Sincronizando...</span>`;
    btn.disabled = true;
    try {
      const res = await api('/api/portfolio/sync-instagram', { method: 'POST' });
      portfolioData = await api('/api/portfolio/me');
      const content = document.querySelector('#portfolio-tab-view-container');
      if (content) content.innerHTML = renderPortfolioGalleryTab(portfolioData.portfolio, portfolioData.gallery);
      alert(`¡Sincronización con Instagram completada! (${res.syncedCount || 0} imágenes procesadas)`);
    } catch (err) {
      alert('Error al sincronizar con Instagram: ' + err.message);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
    return;
  }

  // Copy portfolio public link
  const copyLinkBtn = event.target.closest('[data-action="copy-portfolio-link"]');
  if (copyLinkBtn) {
    const handle = copyLinkBtn.dataset.handle || portfolioData?.portfolio?.handle || 'artista';
    const fullUrl = `${window.location.origin}/#portfolio-${handle}`;
    navigator.clipboard?.writeText(fullUrl);
    alert(`Enlace de landing copiado:\n${fullUrl}`);
    return;
  }

  // Lightbox & Public Actions
  const lightboxTrigger = event.target.closest('[data-action="open-lightbox"]');
  if (lightboxTrigger) {
    const { url, title, style } = lightboxTrigger.dataset;
    return openLightbox(url, title, style);
  }
  const careBtn = event.target.closest('[data-action="open-care-instructions"]');
  if (careBtn) {
    return openCareInstructionsModal(decodeURIComponent(careBtn.dataset.care || ''));
  }
  const consultBtn = event.target.closest('[data-action="open-public-consultation"]');
  if (consultBtn) {
    const { artist, handle, color } = consultBtn.dataset;
    return openBookingConsultationModal(artist, handle, color);
  }

  // Modals trigger buttons
  if (event.target.closest('[data-action="new-booking"]')) return await newBookingModal();
  if (event.target.closest('[data-action="new-category"]')) return newCategoryModal();
  if (event.target.closest('[data-action="new-client"]')) return newClientModal();
  if (event.target.closest('[data-action="new-member"]')) return newMemberModal();
  if (event.target.closest('[data-action="new-space"]')) return newSpaceModal();
  if (event.target.closest('[data-action="new-transaction"]')) return newTransactionModal();
  if (event.target.closest('[data-close-modal]') || event.target === modal) return closeModal();

  // Category filter in agenda
  const catBtn = event.target.closest('[data-select-category]');
  if (catBtn) {
    agendaFilter.categoryId = catBtn.dataset.selectCategory;
    return await renderAgenda();
  }

  // Delete custom category
  const deleteCatBtn = event.target.closest('[data-delete-category-id]');
  if (deleteCatBtn) {
    if (confirm('¿Eliminar esta categoría de tu agenda?')) {
      await api(`/api/categories/${deleteCatBtn.dataset.deleteCategoryId}`, { method: 'DELETE' });
      return await renderSettings();
    }
    return;
  }

  // Day filter in agenda
  const dateBtn = event.target.closest('[data-select-date]');
  if (dateBtn) {
    const selectedDate = dateBtn.dataset.selectDate;
    agendaFilter.date = agendaFilter.date === selectedDate ? null : selectedDate;
    return await renderAgenda();
  }
  if (event.target.closest('[data-clear-date]')) {
    agendaFilter.date = null;
    return await renderAgenda();
  }

  // Toggle member status
  const memberToggleBtn = event.target.closest('[data-toggle-member-id]');
  if (memberToggleBtn) {
    const membershipId = memberToggleBtn.dataset.toggleMemberId;
    const currentStatus = memberToggleBtn.dataset.currentStatus;
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await api(`/api/members/${membershipId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus })
    });
    return await renderSettings();
  }

  // Toggle space status
  const spaceToggleBtn = event.target.closest('[data-toggle-space-id]');
  if (spaceToggleBtn) {
    const spaceId = spaceToggleBtn.dataset.toggleSpaceId;
    const currentActive = spaceToggleBtn.dataset.currentActive === 'true';
    await api(`/api/spaces/${spaceId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !currentActive })
    });
    return await renderSettings();
  }

  // Complete appointment
  const completeBtn = event.target.closest('[data-status-id]');
  if (completeBtn) {
    await api(`/api/appointments/${completeBtn.dataset.statusId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' })
    });
    const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'dashboard';
    return await render(currentActiveView);
  }
  if (event.target.closest('[data-retry]')) return await render();
});

document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (form.dataset.onboardingForm) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const errorEl = form.querySelector('.form-error') || form.appendChild(document.createElement('p'));
    errorEl.className = 'form-error';
    errorEl.textContent = '';

    if (form.dataset.onboardingForm === 'login') {
      try {
        await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: values.email, password: values.password })
        });
        localStorage.setItem('tatudin_onboarding_complete', 'true');
        return await startApp();
      } catch (error) {
        errorEl.textContent = error.message;
        return;
      }
    }

    if (form.dataset.onboardingForm === 'register' || form.dataset.onboardingForm === 'account') {
      try {
        const authPayload = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          studioName: onboarding.studioName || `Estudio de ${values.fullName}`
        };
        await api('/api/auth/register', { method: 'POST', body: JSON.stringify(authPayload) });
        await saveOnboarding(values);
        return renderOnboarding(2);
      } catch (error) {
        if (error.message.includes('ya está registrado')) {
          errorEl.innerHTML = `Ese email ya está registrado. <button type="button" class="text-button" data-switch-auth="login" style="color: var(--red); font-weight: 700; text-decoration: underline;">Iniciar sesión</button>`;
          return;
        }
        errorEl.textContent = error.message;
        return;
      }
    }

    if (form.dataset.onboardingForm === 'profile') {
      try {
        await saveOnboarding(values);
        return renderOnboarding(4);
      } catch (error) {
        errorEl.textContent = error.message;
        return;
      }
    }
  }

  if (!form.dataset.form) return;
  event.preventDefault();
  const body = Object.fromEntries(new FormData(form));

  try {
    if (form.dataset.form === 'booking') {
      await api('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          categoryId: body.categoryId ? Number(body.categoryId) : null,
          clientId: body.clientId ? Number(body.clientId) : null,
          artistId: body.artistId ? Number(body.artistId) : null,
          spaceId: body.spaceId ? Number(body.spaceId) : null,
          durationMinutes: Number(body.durationMinutes || 60),
          price: Number(body.price || 0),
          deposit: Number(body.deposit || 0),
          notes: body.notes || ''
        })
      });
      closeModal();
      const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'dashboard';
      return await render(currentActiveView);
    }
    if (form.dataset.form === 'category') {
      await api('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: body.name,
          kind: body.kind || 'custom',
          color: body.color || '#7C3AED',
          requiresClient: body.requiresClient === 'true',
          requiresSpace: body.requiresSpace === 'true'
        })
      });
      closeModal();
      return await renderSettings();
    }
    if (form.dataset.form === 'client') {
      await api('/api/clients', { method: 'POST', body: JSON.stringify(body) });
      closeModal();
      return await render('clientes');
    }
    if (form.dataset.form === 'edit-client') {
      await api(`/api/clients/${form.dataset.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      closeModal();
      return await clientDetailModal(form.dataset.id);
    }
    if (form.dataset.form === 'member') {
      await api('/api/members', { method: 'POST', body: JSON.stringify(body) });
      closeModal();
      return await renderSettings();
    }
    if (form.dataset.form === 'edit-commission') {
      await api(`/api/members/${form.dataset.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ commissionPercent: Number(body.commissionPercent) })
      });
      closeModal();
      return await renderSettings();
    }
    if (form.dataset.form === 'space') {
      await api('/api/spaces', { method: 'POST', body: JSON.stringify(body) });
      closeModal();
      return await renderSettings();
    }
    if (form.dataset.form === 'settle-artist') {
      await api('/api/finances/settle', {
        method: 'POST',
        body: JSON.stringify({ artistId: Number(body.artistId), amount: Number(body.amount), notes: body.notes })
      });
      closeModal();
      return await render('finanzas');
    }
    if (form.dataset.form === 'guest-spot-request') {
      await api('/api/public/guest-spots', {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          studioId: activeStudio?.id || 1,
          spaceId: body.spaceId ? Number(body.spaceId) : null
        })
      });
      closeModal();
      alert('¡Solicitud de Guest Spot enviada con éxito!');
      return await renderSettings();
    }
    if (form.dataset.form === 'studio-settings') {
      const updated = await api('/api/studio', {
        method: 'PATCH',
        body: JSON.stringify({
          name: body.name,
          currency: body.currency,
          timezone: body.timezone,
          accountType: body.accountType
        })
      });
      activeStudio = updated;
      updateStudioSidebarUI();
      const successMsg = form.querySelector('.form-error');
      if (successMsg) {
        successMsg.style.color = 'var(--green-text)';
        successMsg.textContent = 'Configuración guardada con éxito.';
        setTimeout(() => { successMsg.textContent = ''; successMsg.style.color = ''; }, 3000);
      }
      return;
    }
    if (form.dataset.form === 'bo-edit-user') {
      const userId = form.dataset.id;
      const isSuper = Boolean(form.querySelector('[name="isSuperAdmin"]')?.checked);
      const payload = {
        fullName: body.fullName,
        email: body.email,
        isSuperAdmin: isSuper
      };
      if (body.newPassword) payload.newPassword = body.newPassword;
      await api(`/api/backoffice/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      closeModal();
      alert('Usuario actualizado con éxito');
      return await renderBackoffice('users');
    }
    if (form.dataset.form === 'user-profile') {
      const res = await api('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(body) });
      currentUser = { ...currentUser, ...res.user };
      updateUserMenuUI();
      const successMsg = form.querySelector('.form-error');
      if (successMsg) {
        successMsg.style.color = 'var(--green-text)';
        successMsg.textContent = 'Datos actualizados con éxito.';
        setTimeout(() => { closeModal(); }, 1200);
      }
      return;
    }
    if (form.dataset.form === 'portfolio-profile') {
      const isPublished = document.querySelector('#portfolio-status-toggle')?.checked ?? true;
      const res = await api('/api/portfolio/me', {
        method: 'PUT',
        body: JSON.stringify({ ...body, isPublished })
      });
      portfolioData = res;
      const errorEl = form.querySelector('.form-error');
      if (errorEl) {
        errorEl.style.color = 'var(--green-text)';
        errorEl.textContent = '¡Portafolio y datos guardados exitosamente!';
        setTimeout(() => { errorEl.textContent = ''; errorEl.style.color = ''; }, 3000);
      }
      return;
    }
    if (form.dataset.form === 'add-gallery-item') {
      await api('/api/portfolio/gallery', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      closeModal();
      portfolioData = await api('/api/portfolio/me');
      const content = document.querySelector('#portfolio-tab-view-container');
      if (content) content.innerHTML = renderPortfolioGalleryTab(portfolioData.portfolio, portfolioData.gallery);
      return;
    }
    if (form.dataset.form === 'public-consultation-request') {
      closeModal();
      alert('¡Solicitud de consulta enviada exitosamente! El artista se comunicará contigo a la brevedad.');
      return;
    }
    if (form.dataset.form === 'transaction') {
      await api('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({ ...body, amount: Number(body.amount), artistId: body.artistId ? Number(body.artistId) : null })
      });
      closeModal();
      return await render('finanzas');
    }
  } catch (error) {
    const errorEl = form.querySelector('.form-error');
    if (errorEl) {
      errorEl.style.color = 'var(--red)';
      errorEl.textContent = error.message;
    }
  }
});

// File input listener for direct gallery image upload
document.addEventListener('change', async (event) => {
  if (event.target.id === 'gallery-native-file-input') {
    const files = event.target.files;
    if (files && files.length) {
      await handleGalleryFilesUpload(files);
      event.target.value = '';
    }
  }
});

// ---------------- LIVE DEBUG MODE HELPERS ----------------
async function refreshDebugInfo() {
  const pill = document.getElementById('debug-status-pill');
  const dbStatusEl = document.getElementById('debug-db-status');
  const rootStatusEl = document.getElementById('debug-root-status');
  const tablesStatusEl = document.getElementById('debug-tables-status');

  logToDebugConsole('Consultando diagnóstico del servidor /api/debug/info...');
  try {
    const res = await fetch('/api/debug/info');
    const data = await res.json();
    logToDebugConsole(`Diagnóstico recibido (Node ${data.nodeVersion || 'N/A'}, Puerto ${data.port || '3000'})`);

    const db = data.database || {};
    if (db.connected) {
      if (pill) {
        pill.className = 'debug-status-pill online';
        pill.textContent = '🟢 BD Conectada';
      }
      if (dbStatusEl) {
        dbStatusEl.className = 'debug-val ok';
        dbStatusEl.textContent = `ONLINE (${db.dbName || 'Postgres'})`;
      }
      logToDebugConsole(`✓ PostgreSQL OK: DB "${db.dbName}", Usuario "${db.dbUser}", Hora servidor: ${db.dbTime}`);
    } else {
      if (pill) {
        pill.className = 'debug-status-pill offline';
        pill.textContent = '🔴 BD Desconectada';
      }
      if (dbStatusEl) {
        dbStatusEl.className = 'debug-val err';
        dbStatusEl.textContent = `ERROR: ${db.error || 'No conectada'}`;
      }
      logToDebugConsole(`❌ Error de conexión BD: ${db.error || 'Sin conexión'}`);
    }

    if (tablesStatusEl) {
      const tableCount = (db.tables || []).length;
      tablesStatusEl.className = tableCount >= 5 ? 'debug-val ok' : 'debug-val err';
      tablesStatusEl.textContent = `${tableCount} tablas (${(db.tables || []).slice(0, 4).join(', ')}...)`;
      logToDebugConsole(`Tablas detectadas (${tableCount}): ${(db.tables || []).join(', ') || 'Ninguna'}`);
    }

    if (rootStatusEl) {
      if (db.rootUser) {
        rootStatusEl.className = 'debug-val ok';
        rootStatusEl.textContent = `Configurado (ID #${db.rootUser.id})`;
        logToDebugConsole(`✓ Superadmin OK: ${db.rootUser.email} (is_superadmin: ${db.rootUser.is_superadmin})`);
      } else {
        rootStatusEl.className = 'debug-val err';
        rootStatusEl.textContent = 'No encontrado (Usa botón Crear Root)';
        logToDebugConsole('⚠️ Superadmin soyelroot@tatudin.cl NO existe aún en la BD.');
      }
    }

    if (Array.isArray(data.recentLogs) && data.recentLogs.length > 0) {
      data.recentLogs.slice(0, 5).forEach((l) => {
        logToDebugConsole(`[Server ${l.level}] ${l.message}`);
      });
    }
  } catch (err) {
    if (pill) {
      pill.className = 'debug-status-pill offline';
      pill.textContent = '🔴 Servidor Inaccesible';
    }
    logToDebugConsole(`❌ Error consultando /api/debug/info: ${err.message}`);
  }
}

async function initDebugMode() {
  const panel = document.getElementById('tatudin-debug-panel');
  if (!panel) return;

  const btnRefresh = document.getElementById('btn-debug-refresh');
  const btnResetRoot = document.getElementById('btn-debug-reset-root');
  const btnInitDb = document.getElementById('btn-debug-init-db');
  const btnAutoLogin = document.getElementById('btn-debug-autologin-root');
  const btnClearLogs = document.getElementById('btn-debug-clear-logs');

  if (btnRefresh) {
    btnRefresh.onclick = () => refreshDebugInfo();
  }

  if (btnClearLogs) {
    btnClearLogs.onclick = () => {
      debugLogsBuffer = [];
      const logEl = document.getElementById('debug-log-output');
      if (logEl) logEl.textContent = 'Consola limpiada.';
    };
  }

  if (btnResetRoot) {
    btnResetRoot.onclick = async () => {
      logToDebugConsole('Enviando solicitud POST /api/debug/reset-root...');
      try {
        const res = await fetch('/api/debug/reset-root', { method: 'POST' });
        const text = await res.text();
        logToDebugConsole(`Respuesta reset-root (HTTP ${res.status}): ${text}`);
        await refreshDebugInfo();
      } catch (err) {
        logToDebugConsole(`❌ Error en reset-root: ${err.message}`);
      }
    };
  }

  if (btnInitDb) {
    btnInitDb.onclick = async () => {
      logToDebugConsole('Enviando solicitud POST /api/debug/init-db...');
      try {
        const res = await fetch('/api/debug/init-db', { method: 'POST' });
        const text = await res.text();
        logToDebugConsole(`Respuesta init-db (HTTP ${res.status}): ${text}`);
        await refreshDebugInfo();
      } catch (err) {
        logToDebugConsole(`❌ Error en init-db: ${err.message}`);
      }
    };
  }

  if (btnAutoLogin) {
    btnAutoLogin.onclick = async () => {
      logToDebugConsole('⚡ Iniciando proceso de Auto-Login Superadmin...');
      try {
        logToDebugConsole('1. Asegurando usuario soyelroot@tatudin.cl en BD...');
        await fetch('/api/debug/reset-root', { method: 'POST' });
        
        logToDebugConsole('2. Ejecutando inicio de sesión...');
        const loginData = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'soyelroot@tatudin.cl', password: 'password123' })
        });
        logToDebugConsole('3. Sesión establecida con éxito. Redirigiendo...');
        localStorage.setItem('tatudin_onboarding_complete', 'true');
        await startApp();
      } catch (err) {
        logToDebugConsole(`❌ Error en Auto-Login: ${err.message}`);
      }
    };
  }

  await refreshDebugInfo();
}

// Session verification and bootstrap
api('/api/auth/me')
  .then((data) => {
    if (data?.user) {
      startApp();
    } else {
      renderOnboarding(0);
    }
  })
  .catch(() => {
    renderOnboarding(0);
  });
