const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');

// Helper to format currency
const money = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value || 0));

const compactMoney = (value) => {
  const num = Number(value || 0);
  if (isNaN(num)) return '$0';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    const val = abs / 1_000_000_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',');
    return `${sign}$${formatted}B`;
  }
  if (abs >= 1_000_000) {
    const val = abs / 1_000_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',');
    return `${sign}$${formatted}M`;
  }
  if (abs >= 1_000) {
    const val = abs / 1_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace('.', ',');
    return `${sign}$${formatted}mil`;
  }
  return `${sign}$${abs.toLocaleString('es-CL')}`;
};

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
  cloudUpload: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><circle cx="8" cy="6" r="3" fill="#ffffff" stroke="currentColor"/><line x1="3" y1="12" x2="21" y2="12"/><circle cx="16" cy="12" r="3" fill="#ffffff" stroke="currentColor"/><line x1="3" y1="18" x2="21" y2="18"/><circle cx="11" cy="18" r="3" fill="#ffffff" stroke="currentColor"/></svg>'
};

const icon = (name) => ICONS[name] || '';

const STATUS_MAP = {
  inquiry: { label: 'Consulta', class: 'status-inquiry' },
  confirmed: { label: 'Confirmada', class: 'status-confirmed' },
  deposit_paid: { label: 'Seña pagada', class: 'status-deposit' },
  in_session: { label: 'En sesión', class: 'status-session' },
  completed: { label: 'Listo / Efectuada', class: 'status-completed' },
  rescheduled: { label: 'Reprogramada', class: 'status-rescheduled' },
  cancelled: { label: 'Cancelada / No llegó', class: 'status-cancelled' },
  no_show: { label: 'No llegó', class: 'status-cancelled' }
};

const ROLE_MAP = {
  owner: { label: 'Propietario', class: 'role-owner' },
  admin: { label: 'Administrador', class: 'role-admin' },
  resident: { label: 'Residente', class: 'role-resident' },
  nomad: { label: 'Nómade', class: 'role-nomad' }
};

function getCsrfCookie() {
  const match = document.cookie.match(new RegExp('(^| )tatudin_csrf=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

const api = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const csrfToken = getCsrfCookie();
  const headers = {
    'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...(options.headers || {})
  };

  if (!navigator.onLine && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (window.TatutinOffline?.enqueueOfflineRequest) {
      await window.TatutinOffline.enqueueOfflineRequest({
        url,
        method,
        body: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : null
      });
      return { ok: true, offlineQueued: true };
    }
  }

  try {
    const response = await fetch(url, { ...options, headers });
    let data = {};
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      throw new Error(text || `Error ${response.status}: No se pudo procesar la solicitud`);
    }
    if (!response.ok) throw new Error(data.error || 'No se pudo completar la operación');
    return data;
  } catch (err) {
    if (!navigator.onLine && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && window.TatutinOffline?.enqueueOfflineRequest) {
      await window.TatutinOffline.enqueueOfflineRequest({
        url,
        method,
        body: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : null
      });
      return { ok: true, offlineQueued: true };
    }
    throw err;
  }
};

let clients = [];
let members = [];
let spaces = [];
let categories = [];
let userStudios = [];
let activeStudio = null;
let currentUser = null;
let agendaFilter = {
  viewMode: 'week', // 'week' | 'month'
  currentDate: new Date(),
  date: null,
  artistId: 'all',
  spaceId: 'all',
  categoryId: 'all',
  status: 'all'
};
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

function getWeekRange(baseDate = new Date()) {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 is Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    days.push(cur);
  }
  const sunday = days[6];
  const startMonth = monday.toLocaleDateString('es-CL', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' });
  const label = startMonth === sunday.toLocaleDateString('es-CL', { month: 'short' })
    ? `${monday.getDate()} – ${sunday.getDate()} de ${endMonth}`
    : `${monday.getDate()} ${startMonth} – ${sunday.getDate()} ${endMonth}`;

  return {
    days,
    startDateISO: formatDateISO(monday),
    endDateISO: formatDateISO(sunday),
    label
  };
}

function getMonthMatrix(baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // days back to Monday

  const startDate = new Date(year, month, 1 - startOffset);
  const matrix = [];
  let cur = new Date(startDate);

  while (matrix.length < 35 || cur <= lastDay || cur.getDay() !== 1) {
    matrix.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
    if (matrix.length >= 42) break;
  }

  const endDay = new Date(cur);
  endDay.setDate(endDay.getDate() - 1);
  const monthName = firstDay.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

  return {
    matrix,
    year,
    month,
    startDateISO: formatDateISO(startDate),
    endDateISO: formatDateISO(endDay),
    label: monthName.charAt(0).toUpperCase() + monthName.slice(1)
  };
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
  return api('/api/onboarding', { method: 'PUT', body: JSON.stringify(safeOnboarding) }).catch((err) => {
    console.warn('[ONBOARDING SYNC]', err.message || err);
  });
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
            <div style="text-align: right; margin-top: -6px; margin-bottom: 10px;">
              <button type="button" class="text-button" data-action="open-forgot-password" style="font-size: 12px; color: #a78bfa;">¿Olvidaste tu contraseña?</button>
            </div>
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
      </section>
    `;
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

  updateDrawerUI();
}

function updateDrawerUI() {
  if (!currentUser) return;
  const name = currentUser.full_name || currentUser.fullName || 'Marcus';
  const initials = ((name).split(' ').map((p) => p[0]).slice(0, 2).join('')).toUpperCase();
  
  let roleLabel = 'Artist Owner';
  if (currentUser.role === 'resident') roleLabel = 'Residente';
  else if (currentUser.role === 'nomad') roleLabel = 'Nómade (Visitante)';
  else if (currentUser.role === 'admin') roleLabel = 'Manager / Administrador';
  else if (currentUser.role === 'owner') roleLabel = activeStudio?.account_type === 'independent' ? 'Artista Independiente' : `Artist Owner · ${activeStudio?.name || 'Estudio'}`;
  else if (activeStudio?.name) roleLabel = activeStudio.account_type === 'independent' ? 'Artista Independiente' : `Estudio · ${activeStudio.name}`;

  const drawerAvatarEl = document.querySelector('#drawer-avatar');
  if (drawerAvatarEl) {
    if (currentUser.avatar_url) {
      drawerAvatarEl.innerHTML = `<img src="${currentUser.avatar_url}" alt="${name}" />`;
    } else {
      drawerAvatarEl.textContent = initials;
    }
  }

  const drawerNameEl = document.querySelector('#drawer-user-name');
  if (drawerNameEl) drawerNameEl.textContent = name;

  const drawerRoleEl = document.querySelector('#drawer-user-role');
  if (drawerRoleEl) drawerRoleEl.textContent = roleLabel;

  const isSuper = Boolean(currentUser.is_superadmin || currentUser.isSuperAdmin || currentUser.email === 'soyelroot@tatudin.cl');
  document.querySelectorAll('.root-drawer-item').forEach((el) => {
    el.style.display = isSuper ? 'flex' : 'none';
  });
}

function openMobileDrawer() {
  updateDrawerUI();
  const drawer = document.querySelector('#mobile-drawer');
  const scrim = document.querySelector('#mobile-drawer-scrim');
  if (scrim) {
    scrim.hidden = false;
    setTimeout(() => scrim.classList.add('open'), 10);
  }
  if (drawer) {
    drawer.classList.add('open');
  }
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  const drawer = document.querySelector('#mobile-drawer');
  const scrim = document.querySelector('#mobile-drawer-scrim');
  if (drawer) drawer.classList.remove('open');
  if (scrim) {
    scrim.classList.remove('open');
    setTimeout(() => {
      if (!scrim.classList.contains('open')) scrim.hidden = true;
    }, 320);
  }
  document.body.style.overflow = '';
}

function toggleMobileDrawer() {
  const drawer = document.querySelector('#mobile-drawer');
  if (drawer?.classList.contains('open')) {
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
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
    updateDrawerUI();

    const isSuper = Boolean(currentUser.is_superadmin || currentUser.isSuperAdmin || currentUser.email === 'soyelroot@tatudin.cl');
    const rootBadge = document.querySelector('#superadmin-top-badge');
    if (rootBadge) rootBadge.style.display = isSuper ? 'flex' : 'none';
    document.querySelectorAll('.root-nav-item, .root-dropdown-item, .root-drawer-item').forEach((el) => {
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

  const path = window.location.pathname;
  const search = new URLSearchParams(window.location.search);
  const source = search.get('source');

  if (path === '/capture-receipt' || search.has('capture-receipt') || (source === 'shortcut' && (path.includes('receipt') || window.location.href.includes('receipt')))) {
    await render('inventario');
    openReceiptScannerModal('studio');
  } else if (path === '/inventory' || path === '/inventario' || search.has('inventory') || (source === 'shortcut' && (path.includes('inventory') || window.location.href.includes('inventory')))) {
    await render('inventario');
  } else if (currentUser.email === 'soyelroot@tatudin.cl' || currentUser.is_superadmin) {
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
  const isRescheduled = item.status === 'rescheduled';
  const isCancelled = item.status === 'cancelled' || item.status === 'no_show';
  const cleanPhone = (item.client_phone || '').replace(/[^0-9+]/g, '');
  const catColor = item.category_color || '#7C3AED';
  const catName = item.category_name || 'Compromiso';

  const primaryTitle = item.client_name ? item.client_name : item.title;
  const secondaryTitle = item.client_name
    ? `${item.title} · ${item.duration_minutes || 60} min`
    : `${item.notes ? item.notes + ' · ' : ''}${item.duration_minutes || 60} min`;

  let outcomeLabel = '¿Qué ocurrió?';
  let outcomeClass = '';
  if (isCompleted) {
    outcomeLabel = '✓ Listo';
    outcomeClass = 'is-completed';
  } else if (isRescheduled) {
    outcomeLabel = '📅 Reprog.';
    outcomeClass = 'is-rescheduled';
  } else if (isCancelled) {
    outcomeLabel = '✕ Cancelada';
    outcomeClass = 'is-cancelled';
  }

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
        <button type="button" class="voice-mic-btn"
          data-action="open-voice-modal"
          data-appt-id="${item.id}"
          data-title="${encodeURIComponent(item.title || 'Sesión')}"
          data-kind="${item.category_kind || 'custom'}"
          data-cat-name="${encodeURIComponent(catName)}"
          data-client-name="${encodeURIComponent(item.client_name || '')}"
          title="Tomar apuntes / dictado de voz de la sesión">
          <span>🎙️</span>
        </button>

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

        <div class="appointment-outcome-wrap">
          <button type="button" class="appointment-outcome-btn ${outcomeClass}"
            data-action="open-outcome-modal"
            data-appt-id="${item.id}"
            data-client-name="${item.client_name || ''}"
            data-title="${item.title || 'Sesión'}"
            data-starts-at="${item.starts_at}"
            data-price="${item.price || 0}"
            data-deposit="${item.deposit || 0}"
            data-status="${item.status}"
            title="Indicar estado: ¿Qué ocurrió con esta cita?">
            <span>${outcomeLabel}</span>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function emptyState(title, text) {
  return `<div class="empty"><h3>${title}</h3><p>${text}</p></div>`;
}

let currentAppView = 'dashboard';

async function render(view = 'dashboard') {
  closeMobileDrawer();
  currentAppView = view;
  document.querySelectorAll('[data-view]').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === view);
  });

  try {
    if (view === 'agenda') return await renderAgenda();
    if (view === 'clientes') return await renderClients();
    if (view === 'comunicaciones') return await renderCommunications();
    if (view === 'finanzas') return await renderFinances();
    if (view === 'inventario' || view === 'inventory') return await renderInventory();
    if (view === 'artistas' || view === 'artists') return await renderArtists();
    if (view === 'portafolio') return await renderPortfolio();
    if (view === 'integraciones') return await renderIntegrations();
    if (view === 'managers') return await renderManagers();
    if (view === 'ajustes') return await renderSettings();
    if (view === 'terminos') return renderTermsAndConditions(false);
    if (view === 'backoffice') return await renderBackoffice();

    const data = await api('/api/dashboard');
    activeStudio = data.studio || activeStudio;
    updateStudioSidebarUI();

    const todayStr = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()).toUpperCase();

      const pendingAmount = Math.max(0, Number(data.stats?.expected_income || 0) - Number(data.stats?.income || 0));

      app.innerHTML = `
        <section class="intro">
          <p class="eyebrow">LIENZO PRINCIPAL · ${todayStr}</p>
          <h1>Tu Lienzo de hoy<span class="dot">.</span></h1>
          <p class="lead">El espacio central donde ocurre todo en tu estudio, sin ruido.</p>
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

        <section class="stats dashboard-stats">
          <!-- 1. Trabajos del Mes (Tri-Grid: Agendadas | Completadas | Total Ingresos) -->
          <article class="stat-card dashboard-feature-card">
            <div class="stat-card-header">
              <span class="stat-icon-bubble purple">${icon('clock')}</span>
              <p class="eyebrow">TRABAJOS DEL MES</p>
            </div>
            <div class="dashboard-tri-grid">
              <div class="tri-grid-col">
                <div class="mini-bubble purple-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <strong class="tri-metric-val">${data.stats?.scheduled_appointments || 0}</strong>
                <span class="tri-metric-label">Agendadas</span>
                <small class="tri-metric-sub">Total</small>
              </div>

              <div class="tri-grid-divider"></div>

              <div class="tri-grid-col">
                <div class="mini-bubble green-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <strong class="tri-metric-val">${data.stats?.completed_appointments || 0}</strong>
                <span class="tri-metric-label">Completadas</span>
                <small class="tri-metric-sub">Finalizadas</small>
              </div>

              <div class="tri-grid-divider"></div>

              <div class="tri-grid-col" title="${money(data.stats?.income || 0)}">
                <div class="mini-bubble dark-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <strong class="tri-metric-val" title="${money(data.stats?.income || 0)}">${compactMoney(data.stats?.income || 0)}</strong>
                <small class="tri-metric-sub" style="margin-top: 2px;">Total Ingresos</small>
              </div>
            </div>
          </article>

          <!-- 2. Ingresos & Abonos (Quad-Grid: Ingresos | Abonos | Total Esperado | Pendiente) -->
          <article class="stat-card dashboard-feature-card">
            <div class="stat-card-header">
              <span class="stat-icon-bubble green">${icon('finances')}</span>
              <p class="eyebrow">INGRESOS & ABONOS</p>
            </div>
            <div class="dashboard-quad-grid">
              <div class="quad-item" title="${money(data.stats?.income || 0)}">
                <div class="quad-bubble gray-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div class="quad-content">
                  <span class="quad-eyebrow">INGRESOS</span>
                  <strong class="quad-val" title="${money(data.stats?.income || 0)}">${money(data.stats?.income || 0)}</strong>
                  <small class="quad-sub">Ingresos Totales</small>
                </div>
              </div>

              <div class="quad-item" title="${money(data.stats?.total_deposits || 0)}">
                <div class="quad-bubble yellow-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M9 10h6"/></svg>
                </div>
                <div class="quad-content">
                  <span class="quad-eyebrow">ABONOS</span>
                  <strong class="quad-val" title="${money(data.stats?.total_deposits || 0)}">${money(data.stats?.total_deposits || 0)}</strong>
                  <small class="quad-sub">En Abonos Actual</small>
                </div>
              </div>

              <div class="quad-item" title="${money(data.stats?.expected_income || 0)}">
                <div class="quad-bubble light-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/></svg>
                </div>
                <div class="quad-content">
                  <span class="quad-eyebrow">TOTAL ESPERADO</span>
                  <strong class="quad-val" title="${money(data.stats?.expected_income || 0)}">${money(data.stats?.expected_income || 0)}</strong>
                </div>
              </div>

              <div class="quad-item" title="${money(pendingAmount)}">
                <div class="quad-bubble slate-soft">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/></svg>
                </div>
                <div class="quad-content">
                  <span class="quad-eyebrow">PENDIENTE</span>
                  <strong class="quad-val" title="${money(pendingAmount)}">${money(pendingAmount)}</strong>
                </div>
              </div>
            </div>
          </article>

          <!-- 3. Clientes -->
          <article class="stat-card dashboard-feature-card">
            <div class="stat-card-header">
              <span class="stat-icon-bubble red">${icon('clients')}</span>
              <p class="eyebrow">CLIENTES</p>
            </div>
            <strong class="stat-value" style="font-size: clamp(24px, 3vw, 32px);">${data.stats?.clients || 0}</strong>
            <small class="stat-trend" style="margin-top: 4px;">Base de datos activa de clientes</small>
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
  const isWeekView = agendaFilter.viewMode !== 'month';
  const rangeInfo = isWeekView ? getWeekRange(agendaFilter.currentDate) : getMonthMatrix(agendaFilter.currentDate);

  // Range parameters to get all appointments within the visible calendar period for date badges
  const rangeParams = new URLSearchParams();
  rangeParams.append('startDate', rangeInfo.startDateISO);
  rangeParams.append('endDate', rangeInfo.endDateISO);
  if (agendaFilter.artistId !== 'all') rangeParams.append('artistId', agendaFilter.artistId);
  if (agendaFilter.spaceId !== 'all') rangeParams.append('spaceId', agendaFilter.spaceId);
  if (agendaFilter.categoryId !== 'all') rangeParams.append('categoryId', agendaFilter.categoryId);
  if (agendaFilter.status !== 'all') rangeParams.append('status', agendaFilter.status);

  // Active list parameters (if a specific day is selected, filter by that day)
  const listParams = new URLSearchParams(rangeParams.toString());
  if (agendaFilter.date) {
    listParams.delete('startDate');
    listParams.delete('endDate');
    listParams.append('date', agendaFilter.date);
  }

  const [rangeAppointments, appointmentsList, membersList, spacesList, categoriesList] = await Promise.all([
    api(`/api/appointments?${rangeParams.toString()}`).catch(() => []),
    api(`/api/appointments?${listParams.toString()}`).catch(() => []),
    api('/api/members').catch(() => []),
    api('/api/spaces').catch(() => []),
    api('/api/categories').catch(() => [])
  ]);
  members = membersList;
  spaces = spacesList;
  categories = categoriesList;

  // Build appointments count map per day for dots/badges
  const apptsPerDay = {};
  rangeAppointments.forEach((a) => {
    const dayISO = a.starts_at?.slice(0, 10);
    if (dayISO) apptsPerDay[dayISO] = (apptsPerDay[dayISO] || 0) + 1;
  });

  const todayISO = formatDateISO(new Date());
  const hasActiveFilters = agendaFilter.categoryId !== 'all' || agendaFilter.artistId !== 'all' || agendaFilter.spaceId !== 'all' || agendaFilter.status !== 'all';

  // Build active filter summary chips
  const activeFiltersLabels = [];
  if (agendaFilter.categoryId !== 'all') {
    const cat = categories.find((c) => String(c.id) === String(agendaFilter.categoryId));
    if (cat) activeFiltersLabels.push(`Categoría: ${cat.name}`);
  }
  if (agendaFilter.artistId !== 'all') {
    const art = members.find((m) => String(m.id) === String(agendaFilter.artistId));
    if (art) activeFiltersLabels.push(`Artista: ${art.full_name}`);
  }
  if (agendaFilter.spaceId !== 'all') {
    const sp = spaces.find((s) => String(s.id) === String(agendaFilter.spaceId));
    if (sp) activeFiltersLabels.push(`Box: ${sp.name}`);
  }
  if (agendaFilter.status !== 'all') {
    const statusObj = STATUS_MAP[agendaFilter.status];
    if (statusObj) activeFiltersLabels.push(`Estado: ${statusObj.label}`);
  }

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">AGENDA & CALENDARIO</p>
        <h1>Tu calendario<span class="dot">.</span></h1>
        <p class="lead">Navega por semanas o meses y gestiona tus compromisos con filtros avanzados.</p>
      </div>
      <button class="primary" data-action="new-booking">${icon('plus')} <span>Nuevo compromiso</span></button>
    </section>

    <!-- Calendar Card with View Toggle, Filter Button & Navigation -->
    <section class="panel calendar-card">
      <div class="calendar-header-bar">
        <!-- View Toggle (Semana vs Mes) & Filter Trigger Button -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="calendar-view-toggle">
            <button class="cal-view-btn ${isWeekView ? 'active' : ''}" data-cal-view="week">
              Semanal (7 días)
            </button>
            <button class="cal-view-btn ${!isWeekView ? 'active' : ''}" data-cal-view="month">
              Mensual
            </button>
          </div>

          <button type="button" class="cal-filter-trigger-btn ${hasActiveFilters ? 'has-active' : ''}" data-action="open-agenda-filter-modal" title="Filtrar agenda" aria-label="Filtrar agenda">
            ${icon('sliders')}
            ${hasActiveFilters ? `<span class="filter-badge-dot"></span>` : ''}
          </button>
        </div>

        <!-- Navigation Controls (<, Hoy, >) -->
        <div class="calendar-nav-controls">
          <button class="cal-nav-btn" data-action="cal-prev" title="Anterior" aria-label="Anterior">
            ${icon('back')}
          </button>
          <button class="cal-today-btn" data-action="cal-today">
            Hoy
          </button>
          <button class="cal-nav-btn" data-action="cal-next" title="Siguiente" aria-label="Siguiente">
            ${icon('arrowRight')}
          </button>
          <strong class="cal-current-label">${rangeInfo.label}</strong>
        </div>
      </div>

      ${agendaFilter.date ? `
        <div class="cal-selected-day-banner">
          <span>📅 Filtrando por día seleccionado: <strong>${agendaFilter.date}</strong></span>
          <button class="text-button" data-clear-date style="color: #6D28D9; font-size: 11.5px; font-weight: 800;">
            ✕ Ver todo el período (${isWeekView ? '7 días' : 'Mes'})
          </button>
        </div>
      ` : ''}

      ${isWeekView ? `
        <!-- Week Days Grid (7 days) -->
        <div class="week-days">
          ${rangeInfo.days.map((d) => {
            const dateISO = formatDateISO(d);
            const isSelected = agendaFilter.date === dateISO;
            const isToday = dateISO === todayISO;
            const count = apptsPerDay[dateISO] || 0;
            const weekday = d.toLocaleDateString('es-CL', { weekday: 'short' });
            return `
              <button class="day ${isSelected ? 'selected' : ''} ${isToday ? 'is-today' : ''}" data-select-date="${dateISO}" title="${d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}">
                <span class="day-name">${weekday}</span>
                <strong class="day-num">${d.getDate()}</strong>
                ${count > 0 ? `<span class="day-badge-dot" title="${count} ${count === 1 ? 'compromiso' : 'compromisos'}">${count}</span>` : '<span class="day-badge-placeholder"></span>'}
              </button>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- Month Calendar Grid -->
        <div class="month-calendar-grid">
          ${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(w => `<div class="month-weekday-header">${w}</div>`).join('')}
          ${rangeInfo.matrix.map((d) => {
            const dateISO = formatDateISO(d);
            const isSelected = agendaFilter.date === dateISO;
            const isToday = dateISO === todayISO;
            const isOtherMonth = d.getMonth() !== rangeInfo.month;
            const count = apptsPerDay[dateISO] || 0;
            return `
              <button class="month-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'selected' : ''}" data-select-date="${dateISO}" title="${d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}">
                <span class="month-day-num">${d.getDate()}</span>
                ${count > 0 ? `<span class="month-day-badge" title="${count} citas">${count}</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      `}

      ${hasActiveFilters ? `
        <div class="agenda-active-filters-pill">
          <div>
            <span style="color: var(--muted); font-weight: 700; margin-right: 6px;">Filtros activos:</span>
            <strong>${activeFiltersLabels.join(' · ')}</strong>
          </div>
          <button class="text-button" data-clear-all-filters style="color: var(--accent); font-size: 11.5px; font-weight: 800;">
            ✕ Quitar filtros
          </button>
        </div>
      ` : ''}
    </section>

    <!-- Appointment List Heading & Count -->
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; padding: 0 4px;">
      <h2 style="font-size: 17px; margin: 0; font-weight: 800;">
        ${agendaFilter.date ? `Compromisos del día (${agendaFilter.date})` : 'Compromisos programados'}
      </h2>
      <span class="count" style="font-weight: 700;">
        ${appointmentsList.length} ${appointmentsList.length === 1 ? 'compromiso' : 'compromisos'}
      </span>
    </div>

    <section class="agenda-list">
      ${appointmentsList.map(appointmentCard).join('') || emptyState('Agenda despejada', 'No hay compromisos registrados para los filtros o período seleccionado.')}
    </section>
  `;
}

function openAgendaFilterModal() {
  openModal(`
    <p class="eyebrow">FILTROS AVANZADOS</p>
    <h2 id="modal-title">Filtrar Agenda</h2>
    <p class="lead" style="margin-bottom: 16px;">Ajusta los filtros para visualizar compromisos específicos en tu calendario:</p>

    <form id="agenda-filter-form" style="display: grid; gap: 14px;">
      <div class="field">
        <label for="modal-agenda-category">Categoría:</label>
        <select id="modal-agenda-category" name="categoryId">
          <option value="all" ${agendaFilter.categoryId === 'all' ? 'selected' : ''}>Todas las categorías</option>
          ${categories.map((c) => `
            <option value="${c.id}" ${String(agendaFilter.categoryId) === String(c.id) ? 'selected' : ''}>
              ${c.name} (${c.appointment_count || 0})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="field">
        <label for="modal-agenda-artist">Artista / Responsable:</label>
        <select id="modal-agenda-artist" name="artistId">
          <option value="all" ${agendaFilter.artistId === 'all' ? 'selected' : ''}>Todos los artistas (${members.length})</option>
          ${members.map((m) => `
            <option value="${m.id}" ${String(agendaFilter.artistId) === String(m.id) ? 'selected' : ''}>
              ${m.full_name}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="field">
        <label for="modal-agenda-space">Box / Espacio:</label>
        <select id="modal-agenda-space" name="spaceId">
          <option value="all" ${agendaFilter.spaceId === 'all' ? 'selected' : ''}>Todos los boxes (${spaces.length})</option>
          ${spaces.map((s) => `
            <option value="${s.id}" ${String(agendaFilter.spaceId) === String(s.id) ? 'selected' : ''}>
              ${s.name}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="field">
        <label for="modal-agenda-status">Estado del compromiso:</label>
        <select id="modal-agenda-status" name="status">
          <option value="all" ${agendaFilter.status === 'all' ? 'selected' : ''}>Todos los estados</option>
          <option value="confirmed" ${agendaFilter.status === 'confirmed' ? 'selected' : ''}>Confirmadas</option>
          <option value="deposit_paid" ${agendaFilter.status === 'deposit_paid' ? 'selected' : ''}>Seña pagada</option>
          <option value="in_session" ${agendaFilter.status === 'in_session' ? 'selected' : ''}>En sesión</option>
          <option value="completed" ${agendaFilter.status === 'completed' ? 'selected' : ''}>Completadas</option>
          <option value="cancelled" ${agendaFilter.status === 'cancelled' ? 'selected' : ''}>Canceladas</option>
        </select>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
        <button type="button" class="text-button" data-action="reset-agenda-filter-form" style="color: var(--red); font-size: 13px; font-weight: 700;">
          ✕ Restablecer filtros
        </button>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="secondary" data-close-modal>Cerrar</button>
          <button type="submit" class="primary">Aplicar filtros</button>
        </div>
      </div>
    </form>
  `);

  const form = document.querySelector('#agenda-filter-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    agendaFilter.categoryId = formData.get('categoryId') || 'all';
    agendaFilter.artistId = formData.get('artistId') || 'all';
    agendaFilter.spaceId = formData.get('spaceId') || 'all';
    agendaFilter.status = formData.get('status') || 'all';
    closeModal();
    renderAgenda();
  });

  document.querySelector('[data-action="reset-agenda-filter-form"]')?.addEventListener('click', () => {
    agendaFilter.categoryId = 'all';
    agendaFilter.artistId = 'all';
    agendaFilter.spaceId = 'all';
    agendaFilter.status = 'all';
    closeModal();
    renderAgenda();
  });
}

function openAppointmentOutcomeModal(appt) {
  const currentStatus = appt.status || 'confirmed';
  const price = Number(appt.price) || 0;
  const deposit = Number(appt.deposit) || 0;
  const startsAt = appt.starts_at ? new Date(appt.starts_at) : new Date();

  // Format default for datetime-local (YYYY-MM-DDTHH:mm)
  const year = startsAt.getFullYear();
  const month = (startsAt.getMonth() + 1).toString().padStart(2, '0');
  const day = startsAt.getDate().toString().padStart(2, '0');
  const hours = startsAt.getHours().toString().padStart(2, '0');
  const minutes = startsAt.getMinutes().toString().padStart(2, '0');
  const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  openModal(`
    <p class="eyebrow">ESTADO DE LA CITA</p>
    <h2 id="modal-title">¿Qué ocurrió con esta cita?</h2>
    <div style="background: var(--surface-high); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 10px 14px; margin: 12px 0 16px;">
      <strong style="font-size: 14px; color: var(--ink);">${appt.client_name ? appt.client_name : appt.title}</strong>
      <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
        ${appt.title ? `${appt.title} · ` : ''}${formatDateISO(startsAt)} a las ${formatTime(appt.starts_at)} hrs
      </div>
      <div style="font-size: 12px; font-weight: 700; color: var(--ink); margin-top: 4px;">
        Valor: ${money(price)} ${deposit > 0 ? `· Abono pagado: ${money(deposit)}` : ''}
      </div>
    </div>

    <div style="margin-bottom: 14px;">
      <button type="button" class="voice-mic-btn" style="width: 100%; justify-content: center; padding: 9px 14px;"
        data-action="open-voice-modal"
        data-appt-id="${appt.id}"
        data-title="${encodeURIComponent(appt.title || 'Sesión')}"
        data-kind="${appt.category_kind || 'custom'}"
        data-cat-name="${encodeURIComponent(appt.category_name || 'Compromiso')}"
        data-client-name="${encodeURIComponent(appt.client_name || '')}">
        <span>🎙️</span> <span>Tomar / Grabar Apuntes de Voz de esta Sesión</span>
      </button>
    </div>

    <div class="outcome-options-list">
      <!-- Opción 1: Listo / Efectuada -->
      <div class="outcome-option-card card-completed ${currentStatus === 'completed' ? 'active' : ''}">
        <div class="outcome-option-header">
          <div class="outcome-option-title" style="color: #059669;">
            <span style="display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #d1fae5; color: #059669;">✓</span>
            Listo / Efectuada
          </div>
          ${currentStatus === 'completed' ? `<span class="badge" style="background: #10b981; color: #fff;">Actual</span>` : ''}
        </div>
        <p class="outcome-option-desc">
          La cita se realizó con éxito. <strong>Se reflejarán automáticamente en Billetera</strong> el ingreso total (${money(price)}) y el cálculo de comisiones correspondiente.
        </p>
        <button type="button" class="primary" data-apply-outcome="completed" style="background: #059669; align-self: flex-start; margin-top: 4px; padding: 6px 14px; font-size: 12px;">
          ${currentStatus === 'completed' ? 'Confirmar Efectuada' : 'Marcar como Efectuada'}
        </button>
      </div>

      <!-- Opción 2: Reprogramada -->
      <div class="outcome-option-card card-rescheduled ${currentStatus === 'rescheduled' ? 'active' : ''}">
        <div class="outcome-option-header">
          <div class="outcome-option-title" style="color: #0284c7;">
            <span style="display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #e0f2fe; color: #0284c7;">📅</span>
            Reprogramada
          </div>
          ${currentStatus === 'rescheduled' ? `<span class="badge" style="background: #0284c7; color: #fff;">Actual</span>` : ''}
        </div>
        <p class="outcome-option-desc">
          Se acordó una nueva fecha y horario para la sesión. Se actualizará en el calendario de la agenda.
        </p>
        <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px; flex-wrap: wrap;">
          <input type="datetime-local" id="outcome-reschedule-datetime" value="${defaultDateTime}" style="font-size: 12px; height: 34px; width: auto; flex: 1;" />
          <button type="button" class="primary" data-apply-outcome="rescheduled" style="background: #0284c7; padding: 6px 14px; font-size: 12px;">
            Guardar Reprogramación
          </button>
        </div>
      </div>

      <!-- Opción 3: Cancelada / No llegó -->
      <div class="outcome-option-card card-cancelled ${currentStatus === 'cancelled' || currentStatus === 'no_show' ? 'active' : ''}">
        <div class="outcome-option-header">
          <div class="outcome-option-title" style="color: #dc2626;">
            <span style="display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #fee2e2; color: #dc2626;">✕</span>
            Cancelada / No llegó
          </div>
          ${currentStatus === 'cancelled' || currentStatus === 'no_show' ? `<span class="badge" style="background: #ef4444; color: #fff;">Actual</span>` : ''}
        </div>
        <p class="outcome-option-desc">
          El cliente canceló la cita o no se presentó (no-show). Se registrará como <strong>pérdida estimada</strong> en Billetera y se liberará el horario.
        </p>
        <button type="button" class="secondary" data-apply-outcome="cancelled" style="color: #dc2626; border-color: #fca5a5; align-self: flex-start; margin-top: 4px; padding: 6px 14px; font-size: 12px;">
          Marcar como Cancelada / No llegó
        </button>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
      <button type="button" class="secondary" data-close-modal>Cerrar</button>
    </div>
  `);

  // Event handlers for each outcome
  document.querySelector('[data-apply-outcome="completed"]')?.addEventListener('click', async () => {
    await api(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' })
    });
    closeModal();
    const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'agenda';
    await render(currentActiveView);
  });

  document.querySelector('[data-apply-outcome="rescheduled"]')?.addEventListener('click', async () => {
    const newDateVal = document.querySelector('#outcome-reschedule-datetime')?.value;
    const body = { status: 'rescheduled' };
    if (newDateVal) {
      body.startsAt = new Date(newDateVal).toISOString();
    }
    await api(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
    closeModal();
    const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'agenda';
    await render(currentActiveView);
  });

  document.querySelector('[data-apply-outcome="cancelled"]')?.addEventListener('click', async () => {
    await api(`/api/appointments/${appt.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' })
    });
    closeModal();
    const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'agenda';
    await render(currentActiveView);
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
  const [transactions, artistSummary, overview, studio] = await Promise.all([
    api('/api/transactions').catch(() => []),
    api('/api/finances/summary').catch(() => []),
    api('/api/finances/overview').catch(() => ({})),
    api('/api/studio').catch(() => activeStudio)
  ]);
  activeStudio = studio || activeStudio;

  // 1. Ingresos Esperados (Expected Income): Proyección según el precio pactado de todas las citas agendadas
  const expectedIncome = Number(overview.expected_income ?? artistSummary.reduce((sum, a) => sum + Number(a.total_expected || a.total_generated || 0), 0));
  
  // 2. Abonos Recaudados (Deposits Collected): Total de señas/anticipos cobrados
  const totalDeposits = Number(overview.total_deposits ?? artistSummary.reduce((sum, a) => sum + Number(a.total_deposits || 0), 0));

  // 3. Total Facturado / Recaudado Efectivo en Caja (Abonos + Citas completadas + Otros ingresos manuales)
  const appointmentsRevenue = Number(overview.appointments_collected ?? artistSummary.reduce((sum, a) => sum + Number(a.total_generated || 0), 0));
  const manualIncome = Number(overview.manual_income ?? transactions.filter(t => t.kind === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0));
  const totalGrossIncome = appointmentsRevenue + manualIncome;

  // 4. Comisiones Artistas
  const totalCommissions = artistSummary.reduce((sum, a) => sum + Number(a.artist_payout || 0), 0);
  const settledCommissions = Number(overview.settled_commissions ?? artistSummary.reduce((sum, a) => sum + Number(a.settled_amount || 0), 0));
  const totalPending = artistSummary.reduce((sum, a) => sum + Number(a.pending_settlement || 0), 0);

  // 5. Margen Neto del Estudio y Gastos
  const totalStudioMargin = artistSummary.reduce((sum, a) => sum + Number(a.studio_margin || 0), 0);
  const operationalExpenses = Number(overview.operational_expenses ?? transactions.filter(t => t.kind === 'expense' && !(t.description || '').toLowerCase().includes('liquidación')).reduce((sum, t) => sum + Number(t.amount || 0), 0));
  const totalExpenses = settledCommissions + operationalExpenses;

  // Saldo Neto Disponible / Margen retenido en caja tras pagar comisiones y gastos
  const netBalance = totalGrossIncome - totalExpenses;

  // 6. Pérdidas Estimadas (Ingresos no percibidos por citas canceladas)
  const estimatedLosses = Number(overview.estimated_losses || 0);

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">BILLETERA & LIQUIDACIONES</p>
        <h1>Billetera<span class="dot">.</span></h1>
        <p class="lead">Control consolidado de saldo disponible en billetera, ingresos esperados, abonos, comisiones y margen neto del estudio.</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="secondary" data-action="open-upload-screenshot">${icon('image')} <span>Leer Boleta / Captura</span></button>
        <button class="secondary" data-action="export-finances-csv">${icon('download')} <span>Exportar CSV</span></button>
        <button class="primary" data-action="new-transaction">${icon('plus')} <span>Registrar movimiento</span></button>
      </div>
    </section>

    <!-- 6 Unified Financial Stat Cards -->
    <section class="stats" style="margin-bottom: 24px;">
      <!-- 1. Saldo Neto Disponible -->
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Saldo Neto Billetera</span>
          <div class="stat-icon-bubble green">${icon('finances')}</div>
        </div>
        <strong class="stat-value" style="color: ${netBalance >= 0 ? 'var(--green-text)' : 'var(--red)'};">${money(netBalance)}</strong>
        <p class="stat-trend">Margen real retenido tras comisiones y gastos</p>
      </article>

      <!-- 2. Ingresos Esperados (NUEVA CASILLA) -->
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Ingresos Esperados</span>
          <div class="stat-icon-bubble purple">${icon('calendar')}</div>
        </div>
        <strong class="stat-value">${money(expectedIncome)}</strong>
        <p class="stat-trend">Valor proyectado de citas agendadas</p>
      </article>

      <!-- 3. Abonos Recaudados (NUEVA CASILLA) -->
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Abonos Cobrados</span>
          <div class="stat-icon-bubble teal">${icon('income')}</div>
        </div>
        <strong class="stat-value">${money(totalDeposits)}</strong>
        <p class="stat-trend">Señas cobradas para asegurar citas</p>
      </article>

      <!-- 4. Total Recaudado en Caja -->
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Total Recaudado</span>
          <div class="stat-icon-bubble blue">${icon('income')}</div>
        </div>
        <strong class="stat-value">${money(totalGrossIncome)}</strong>
        <p class="stat-trend">Abonos + citas completadas + otros ingresos</p>
      </article>

      <!-- 5. Comisiones Artistas -->
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Comisiones Artistas</span>
          <div class="stat-icon-bubble orange">${icon('percent')}</div>
        </div>
        <strong class="stat-value">${money(totalCommissions)}</strong>
        <p class="stat-trend" style="color: ${totalPending > 0 ? 'var(--red)' : 'var(--green-text)'}; font-weight: 600;">
          ${totalPending > 0 ? `${money(totalPending)} por liquidar` : 'Todas liquidadas'}
        </p>
      </article>

      <!-- 6. Pérdidas Estimadas (NUEVA CASILLA) -->
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-label">Pérdidas Estimadas</span>
          <div class="stat-icon-bubble red">${icon('trash')}</div>
        </div>
        <strong class="stat-value" style="color: ${estimatedLosses > 0 ? 'var(--red)' : 'var(--muted)'};">${money(estimatedLosses)}</strong>
        <p class="stat-trend">Ingresos no percibidos por citas canceladas</p>
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
          const agreeType = a.agreement_type || 'commission';
          let agreeTag = `${a.commission_percent || 70}% comisión`;
          if (agreeType === 'fixed_daily') {
            agreeTag = `Fijo ${money(a.fixed_amount || 0)} / día`;
          } else if (agreeType === 'fixed_monthly') {
            agreeTag = `Fijo ${money(a.fixed_amount || 0)} / mes`;
          }
          return `
            <article class="artist-performance-row">
              <div class="initials">${initials}</div>
              <div class="artist-perf-info">
                <div class="member-header">
                  <h3>${a.artist_name}</h3>
                  <span class="artist-chip ${rInfo.class}">${rInfo.label}</span>
                  <span class="commission-badge">${agreeTag}</span>
                </div>
                <div class="perf-metric-grid">
                  <span>Facturado: <strong>${money(a.total_generated)}</strong></span>
                  <span>Abonos: <strong>${money(a.total_deposits || 0)}</strong></span>
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
  const [stData, memList, spList, guestList, catList, features] = await Promise.all([
    api('/api/studio').catch(() => ({ name: 'Mi Estudio', currency: 'CLP', timezone: 'America/Santiago', account_type: 'independent' })),
    api('/api/members').catch(() => []),
    api('/api/spaces').catch(() => []),
    api('/api/guest-spots').catch(() => []),
    api('/api/categories').catch(() => []),
    api('/api/system/features').catch(() => ({ feature_microsite_enabled: false }))
  ]);
  activeStudio = stData;
  members = memList;
  spaces = spList;
  categories = catList;
  const isMicrositeEnabled = Boolean(features?.feature_microsite_enabled) || Boolean(currentUser?.is_superadmin);

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">AJUSTES Y GESTIÓN</p>
        <h1>Tu estudio, a tu manera<span class="dot">.</span></h1>
        <p class="lead">Administra tu equipo, categorías de agenda, boxes de arriendo y solicitudes de nómades.</p>
      </div>
    </section>

    <div class="settings-stack">
      ${isMicrositeEnabled ? `
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
      ` : ''}

      <!-- Team / Members Panel -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">EQUIPO Y ARTISTAS</p>
            <h2>Artistas y acuerdos comerciales</h2>
          </div>
          <button class="primary small-btn" data-action="new-member">${icon('plus')} <span>Agregar artista / Guest</span></button>
        </div>
        
        <div class="members-list">
          ${members.map((m) => {
            const rInfo = ROLE_MAP[m.role] || { label: m.role, class: 'role-resident' };
            const isOwner = m.role === 'owner';
            const initials = (m.full_name || 'A').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
            const agreeType = m.agreement_type || 'commission';
            let agreementLabel = `${m.commission_percent || 70}% comisión`;
            let agreementIcon = icon('percent');
            if (agreeType === 'fixed_daily') {
              agreementLabel = `Fijo ${money(m.fixed_amount || 0)} / día`;
              agreementIcon = icon('clock');
            } else if (agreeType === 'fixed_monthly') {
              agreementLabel = `Fijo ${money(m.fixed_amount || 0)} / mes`;
              agreementIcon = icon('calendar');
            }

            return `
              <article class="setting-item">
                <div class="setting-item-icon initials">${initials}</div>
                <div class="setting-item-body">
                  <div class="setting-item-top">
                    <div class="setting-item-title" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <h3>${m.full_name}</h3>
                      <span class="artist-chip ${rInfo.class}">${rInfo.label}</span>
                      <span class="member-status ${m.status}">${m.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                      ${m.has_app_access ? '<span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 11px; font-weight: 700;">📱 Acceso App</span>' : '<span class="badge" style="background: rgba(107, 114, 128, 0.12); color: #4b5563; font-size: 11px; font-weight: 700;">🔒 Sin acceso app</span>'}
                    </div>
                    <div class="setting-item-action" style="display: flex; gap: 6px; align-items: center;">
                      ${m.role === 'nomad' ? `
                        <button type="button" class="secondary small-btn" data-action="open-guest-guide" data-membership-id="${m.membership_id}" title="Ver y enviar guía de onboarding por WhatsApp" style="padding: 4px 9px; font-size: 11.5px; border-color: #25D366; color: #059669; background: rgba(37, 211, 102, 0.08);">
                          ${icon('whatsapp')} Guía Guest
                        </button>
                      ` : ''}
                      ${!isOwner ? `
                        <button class="member-toggle-btn" data-toggle-member-id="${m.membership_id}" data-current-status="${m.status}">
                          ${m.status === 'active' ? 'Desactivar' : 'Activar'}
                        </button>
                      ` : '<span class="tag-owner">Principal</span>'}
                    </div>
                  </div>
                  <div class="setting-item-sub" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <button class="edit-commission-tag" data-action="edit-agreement" data-membership-id="${m.membership_id}" data-artist-name="${m.full_name}" data-agreement-type="${agreeType}" data-commission="${m.commission_percent || 70}" data-fixed-amount="${m.fixed_amount || 0}" data-has-app-access="${m.has_app_access !== false}" data-responsible-id="${m.responsible_user_id || ''}" title="Editar modalidad de acuerdo y permisos">
                      ${agreementIcon} ${agreementLabel}
                    </button>
                    ${m.responsible_name ? `<span class="member-meta" style="color: var(--ink); font-size: 11.5px;">👤 A cargo: <strong>${m.responsible_name}</strong></span>` : ''}
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

// ---------------- COMUNICACIONES & RECORDATORIOS ----------------
async function renderCommunications() {
  const [stData, apptsList, clientsList] = await Promise.all([
    api('/api/studio').catch(() => activeStudio),
    api('/api/appointments').catch(() => []),
    api('/api/clients').catch(() => [])
  ]);

  const studioName = stData?.name || activeStudio?.name || 'Tatudin Estudio';

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">MENSAJES & RECORDATORIOS</p>
        <h1>Mensajes<span class="dot">.</span></h1>
        <p class="lead">Envía confirmaciones y recordatorios por WhatsApp, administra cuestionarios de salud y consentimientos informados.</p>
      </div>
      <button class="primary" data-action="new-booking">${icon('plus')} <span>Nuevo compromiso</span></button>
    </section>

    <div class="settings-stack">
      <!-- Quick WhatsApp Message Sender -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">WHATSAPP DIRECTO</p>
            <h2>Recordatorios a Citas Próximas</h2>
          </div>
        </div>
        <p class="lead" style="margin-bottom: 16px; font-size: 13.5px;">Haz clic en "Enviar WhatsApp" para abrir directamente la conversación con el mensaje de confirmación y horarios precargados.</p>
        
        <div class="members-list">
          ${apptsList.slice(0, 5).map((apt) => {
            const dateFormatted = new Intl.DateTimeFormat('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(apt.starts_at));
            const phone = (apt.client_phone || '').replace(/[^0-9+]/g, '');
            const msg = encodeURIComponent(`¡Hola ${apt.client_name || 'Cliente'}! Te recordamos tu cita de tatuaje "${apt.title}" en ${studioName} para el ${dateFormatted}. Por favor ven bien descansado/a y con ropa cómoda. ¡Nos vemos!`);
            const waUrl = phone ? `https://wa.me/${phone.replace('+', '')}?text=${msg}` : `https://wa.me/?text=${msg}`;
            return `
              <article class="setting-item">
                <div class="setting-item-icon space-icon-bubble" style="background: #25D36620; color: #25D366;">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div class="setting-item-body">
                  <div class="setting-item-top">
                    <div class="setting-item-title">
                      <h3>${apt.client_name || 'Sin cliente asignado'} — ${apt.title}</h3>
                      <span class="status-chip status-${apt.status}">${STATUS_MAP[apt.status]?.label || apt.status}</span>
                    </div>
                    <div class="setting-item-action">
                      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="primary small-btn" style="background: #25D366; color: #ffffff; text-decoration: none;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>Enviar WhatsApp</span>
                      </a>
                    </div>
                  </div>
                  <div class="setting-item-sub">
                    <span class="member-meta">${dateFormatted} · ${apt.client_phone || 'Sin teléfono'}</span>
                  </div>
                </div>
              </article>
            `;
          }).join('') || emptyState('Sin citas próximas', 'Crea una cita en la agenda para activar el envío de recordatorios automáticos.')}
        </div>
      </section>

      <!-- Automated Message Templates -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">PLANTILLAS DE MENSAJES</p>
            <h2>Plantillas Rápidas para Clientes</h2>
          </div>
        </div>
        <div class="form-grid">
          <div class="portfolio-banner-card" style="margin-bottom: 0;">
            <strong style="color: var(--ink); font-size: 14.5px; display: block; margin-bottom: 6px;">📅 1. Confirmación de Cita & Seña</strong>
            <p class="lead" style="font-size: 12.5px; margin-bottom: 10px;">"¡Hola [Cliente]! Tu cita para [Servicio] en ${studioName} el [Fecha] ha sido confirmada. Recuerda que tu abono asegura tu bloque."</p>
            <button class="secondary small-btn" data-copy-text="¡Hola! Tu cita en ${studioName} ha sido confirmada. Te esperamos con la mejor energía para tu sesión.">
              ${icon('link')} <span>Copiar plantilla</span>
            </button>
          </div>

          <div class="portfolio-banner-card" style="margin-bottom: 0;">
            <strong style="color: var(--ink); font-size: 14.5px; display: block; margin-bottom: 6px;">⏰ 2. Recordatorio 24 Horas Antes</strong>
            <p class="lead" style="font-size: 12.5px; margin-bottom: 10px;">"¡Hola [Cliente]! Te recordamos que mañana es tu sesión de tatuaje. Recomendaciones: hidratarse bien, comer antes y no consumir alcohol."</p>
            <button class="secondary small-btn" data-copy-text="¡Hola! Te recordamos que mañana es tu cita de tatuaje en ${studioName}. Recuerda comer bien y descansar adecuadamente.">
              ${icon('link')} <span>Copiar plantilla</span>
            </button>
          </div>

          <div class="portfolio-banner-card" style="margin-bottom: 0;">
            <strong style="color: var(--ink); font-size: 14.5px; display: block; margin-bottom: 6px;">🩹 3. Cuidados Posteriores (Aftercare)</strong>
            <p class="lead" style="font-size: 12.5px; margin-bottom: 10px;">"¡Gracias por tatuarte con nosotros! Para curar tu pieza: lavar 3 veces al día con jabón neutro, aplicar crema cicatrizante y no exponer al sol."</p>
            <button class="secondary small-btn" data-copy-text="¡Gracias por tatuarte en ${studioName}! Cuida tu tatuaje lavando con jabón neutro y crema cicatrizante 3 veces al día.">
              ${icon('link')} <span>Copiar plantilla</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Health Consent Questionnaire -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SALUD Y CONSENTIMIENTO INFORMADO</p>
            <h2>Cuestionario Médico Pre-Tatuaje</h2>
          </div>
        </div>
        <p class="lead" style="margin-bottom: 16px; font-size: 13.5px;">Formulario digital estandarizado para verificación de salud de clientes antes de comenzar cada sesión, conforme a normas sanitarias vigentes.</p>
        
        <div class="members-list">
          <div class="setting-item">
            <div class="setting-item-icon space-icon-bubble">✓</div>
            <div class="setting-item-body">
              <div class="setting-item-top"><div class="setting-item-title"><h3>Alergias a pigmentos, tintas o látex</h3></div></div>
              <div class="setting-item-sub"><span class="member-meta">Identifica reactividad previa a tintas rojas o insumos médicos.</span></div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-item-icon space-icon-bubble">✓</div>
            <div class="setting-item-body">
              <div class="setting-item-top"><div class="setting-item-title"><h3>Trastornos de coagulación y medicamentos</h3></div></div>
              <div class="setting-item-sub"><span class="member-meta">Registro de consumo de anticoagulantes, aspirina o hemofilia.</span></div>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-item-icon space-icon-bubble">✓</div>
            <div class="setting-item-body">
              <div class="setting-item-top"><div class="setting-item-title"><h3>Condiciones de la piel y cicatrización</h3></div></div>
              <div class="setting-item-sub"><span class="member-meta">Historial de queloides, psoriasis, eczemas o dermatitis en la zona.</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

// ---------------- INTEGRACIONES ----------------
async function renderIntegrations() {
  const stData = await api('/api/studio').catch(() => activeStudio);
  const studioName = stData?.name || activeStudio?.name || 'Ink Sanctuary';

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">CONECTIVIDAD & PLATAFORMAS</p>
        <h1>Integraciones<span class="dot">.</span></h1>
        <p class="lead">Conecta tus calendarios personales, redes sociales y mensajería para automatizar tu flujo de trabajo.</p>
      </div>
    </section>

    <div class="settings-stack">
      <!-- Calendar Integrations -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CALENDARIOS EXTERNOS</p>
            <h2>Sincronización de Agenda</h2>
          </div>
        </div>
        <p class="lead" style="margin-bottom: 16px; font-size: 13.5px;">Conecta tus calendarios personales para bloquear horarios ocupados y evitar citas solapadas automáticamente.</p>

        <div class="members-list">
          <article class="setting-item">
            <div class="setting-item-icon" style="background: #4285F420; color: #4285F4; border-radius: 12px; display: grid; place-items: center; width: 44px; height: 44px; font-weight: 800; font-size: 16px;">G</div>
            <div class="setting-item-body">
              <div class="setting-item-top">
                <div class="setting-item-title">
                  <h3>Google Calendar</h3>
                  <span class="status-chip status-confirmed">Conectado</span>
                </div>
                <div class="setting-item-action">
                  <button class="member-toggle-btn" data-action="toggle-gcal-sync">Sincronizado</button>
                </div>
              </div>
              <div class="setting-item-sub">
                <span class="member-meta">Sincronización bidireccional activa con cuenta de estudio.</span>
              </div>
            </div>
          </article>

          <article class="setting-item">
            <div class="setting-item-icon" style="background: #221C3520; color: var(--ink); border-radius: 12px; display: grid; place-items: center; width: 44px; height: 44px; font-weight: 800; font-size: 16px;"></div>
            <div class="setting-item-body">
              <div class="setting-item-top">
                <div class="setting-item-title">
                  <h3>Apple Calendar (iCal)</h3>
                  <span class="status-chip status-inquiry">Disponible</span>
                </div>
                <div class="setting-item-action">
                  <button class="primary small-btn" data-action="connect-ical">Conectar</button>
                </div>
              </div>
              <div class="setting-item-sub">
                <span class="member-meta">Exporta tus eventos mediante URL segura de suscripción iCal.</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Messaging & Social Integrations -->
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CANALES DE COMUNICACIÓN</p>
            <h2>WhatsApp & Redes Sociales</h2>
          </div>
        </div>

        <div class="members-list">
          <article class="setting-item">
            <div class="setting-item-icon" style="background: #25D36620; color: #25D366; border-radius: 12px; display: grid; place-items: center; width: 44px; height: 44px; font-weight: 800; font-size: 14px;">WA</div>
            <div class="setting-item-body">
              <div class="setting-item-top">
                <div class="setting-item-title">
                  <h3>WhatsApp Direct Link</h3>
                  <span class="status-chip status-confirmed">Activo</span>
                </div>
                <div class="setting-item-action">
                  <span class="tag-owner">Habilitado</span>
                </div>
              </div>
              <div class="setting-item-sub">
                <span class="member-meta">Permite enviar confirmaciones con 1 clic desde la ficha de cita.</span>
              </div>
            </div>
          </article>

          <article class="setting-item">
            <div class="setting-item-icon" style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #ffffff; border-radius: 12px; display: grid; place-items: center; width: 44px; height: 44px; font-weight: 800; font-size: 14px;">IG</div>
            <div class="setting-item-body">
              <div class="setting-item-top">
                <div class="setting-item-title">
                  <h3>Instagram Portfolio Sync</h3>
                  <span class="status-chip status-confirmed">Activo</span>
                </div>
                <div class="setting-item-action">
                  <button class="secondary small-btn" data-view="portafolio">Ver Galería</button>
                </div>
              </div>
              <div class="setting-item-sub">
                <span class="member-meta">Sincroniza tus publicaciones y fotos recientes en tu landing pública.</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  `;
}

// ---------------- MANAGERS & EQUIPO ----------------
async function renderManagers() {
  const [memList, stData] = await Promise.all([
    api('/api/members').catch(() => []),
    api('/api/studio').catch(() => activeStudio)
  ]);
  members = memList;
  activeStudio = stData;

  const owners = members.filter(m => m.role === 'owner');
  const admins = members.filter(m => m.role === 'admin');
  const residents = members.filter(m => m.role === 'resident');
  const nomads = members.filter(m => m.role === 'nomad');

  app.innerHTML = `
    <section class="page-heading">
      <div>
        <p class="eyebrow">EQUIPO Y GESTIÓN DE ROLES</p>
        <h1>Managers & Equipo<span class="dot">.</span></h1>
        <p class="lead">Administra los accesos, administradores del estudio, artistas residentes y nómades.</p>
      </div>
      <button class="primary" data-action="new-member">${icon('plus')} <span>Agregar miembro</span></button>
    </section>

    <!-- Quick Stats -->
    <section class="client-stats-row" style="margin-bottom: 20px;">
      <div class="client-mini-stat panel">
        <span class="eyebrow">TOTAL EQUIPO</span>
        <strong>${members.length}</strong>
      </div>
      <div class="client-mini-stat panel">
        <span class="eyebrow">MANAGERS / ADMIN</span>
        <strong>${owners.length + admins.length}</strong>
      </div>
      <div class="client-mini-stat panel">
        <span class="eyebrow">RESIDENTES</span>
        <strong>${residents.length}</strong>
      </div>
      <div class="client-mini-stat panel">
        <span class="eyebrow">NÓMADES</span>
        <strong>${nomads.length}</strong>
      </div>
    </section>

    <div class="settings-stack">
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">LISTA DE INTEGRANTES</p>
            <h2>Miembros activos e inactivos</h2>
          </div>
          <button class="primary small-btn" data-action="new-member">${icon('plus')} <span>Nuevo miembro</span></button>
        </div>

        <div class="members-list">
          ${members.map((m) => {
            const rInfo = ROLE_MAP[m.role] || { label: m.role, class: 'role-resident' };
            const isOwner = m.role === 'owner';
            const initials = (m.full_name || 'A').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
            const agreeType = m.agreement_type || 'commission';
            let agreementLabel = `${m.commission_percent || 70}% comisión`;
            let agreementIcon = icon('percent');
            if (agreeType === 'fixed_daily') {
              agreementLabel = `Fijo ${money(m.fixed_amount || 0)} / día`;
              agreementIcon = icon('clock');
            } else if (agreeType === 'fixed_monthly') {
              agreementLabel = `Fijo ${money(m.fixed_amount || 0)} / mes`;
              agreementIcon = icon('calendar');
            }

            return `
              <article class="setting-item">
                <div class="setting-item-icon initials">${initials}</div>
                <div class="setting-item-body">
                  <div class="setting-item-top">
                    <div class="setting-item-title" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <h3>${m.full_name}</h3>
                      <span class="artist-chip ${rInfo.class}">${rInfo.label}</span>
                      <span class="member-status ${m.status}">${m.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                      ${m.has_app_access ? '<span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 11px; font-weight: 700;">📱 Acceso App</span>' : '<span class="badge" style="background: rgba(107, 114, 128, 0.12); color: #4b5563; font-size: 11px; font-weight: 700;">🔒 Sin acceso app</span>'}
                    </div>
                    <div class="setting-item-action" style="display: flex; gap: 6px; align-items: center;">
                      ${m.role === 'nomad' ? `
                        <button type="button" class="secondary small-btn" data-action="open-guest-guide" data-membership-id="${m.membership_id}" title="Ver y enviar guía de onboarding por WhatsApp" style="padding: 4px 9px; font-size: 11.5px; border-color: #25D366; color: #059669; background: rgba(37, 211, 102, 0.08);">
                          ${icon('whatsapp')} Guía Guest
                        </button>
                      ` : ''}
                      ${!isOwner ? `
                        <button class="member-toggle-btn" data-toggle-member-id="${m.membership_id}" data-current-status="${m.status}">
                          ${m.status === 'active' ? 'Desactivar' : 'Activar'}
                        </button>
                      ` : '<span class="tag-owner">Principal</span>'}
                    </div>
                  </div>
                  <div class="setting-item-sub" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <button class="edit-commission-tag" data-action="edit-agreement" data-membership-id="${m.membership_id}" data-artist-name="${m.full_name}" data-agreement-type="${agreeType}" data-commission="${m.commission_percent || 70}" data-fixed-amount="${m.fixed_amount || 0}" data-has-app-access="${m.has_app_access !== false}" data-responsible-id="${m.responsible_user_id || ''}" title="Editar modalidad de acuerdo y permisos">
                      ${agreementIcon} ${agreementLabel}
                    </button>
                    ${m.responsible_name ? `<span class="member-meta" style="color: var(--ink); font-size: 11.5px;">👤 A cargo: <strong>${m.responsible_name}</strong></span>` : ''}
                    <span class="member-meta">${m.email} · ${m.appointment_count || 0} citas registradas</span>
                  </div>
                </div>
              </article>
            `;
          }).join('') || emptyState('Sin integrantes registrados', 'Agrega miembros para colaborar en el estudio.')}
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

// ---------------- THEME & DESIGN SYSTEM ENGINE (UI KIT) ----------------
const TATUDIN_DEFAULT_THEME = {
  id: 'classic',
  name: 'Tatudin Classic (Obsidian & Ruby)',
  red: '#ff3552',
  ink: '#09041c',
  inkSurface: '#221c35',
  inkHover: '#322e40',
  canvas: '#fdf7ff',
  surface: '#ffffff',
  surfaceLow: '#f7f1ff',
  surfaceHigh: '#ece5fc',
  softPurple: '#e8ddff',
  radiusMd: '12px',
  radiusXl: '20px',
  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
};

const UIKIT_THEME_PRESETS = [
  {
    id: 'classic',
    name: 'Tatudin Classic (Obsidian & Ruby)',
    desc: 'La paleta oficial de Tatudin con acento carmesí y calma operativa.',
    tokens: {
      red: '#ff3552',
      ink: '#09041c',
      inkSurface: '#221c35',
      inkHover: '#322e40',
      canvas: '#fdf7ff',
      surface: '#ffffff',
      surfaceLow: '#f7f1ff',
      surfaceHigh: '#ece5fc',
      softPurple: '#e8ddff',
      radiusMd: '12px',
      radiusXl: '20px',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neo-Tokyo',
    desc: 'Contraste extremo, acento fucsia neón y noche profunda.',
    tokens: {
      red: '#ff007f',
      ink: '#080816',
      inkSurface: '#14142b',
      inkHover: '#222245',
      canvas: '#f0f4ff',
      surface: '#ffffff',
      surfaceLow: '#e4ecff',
      surfaceHigh: '#d2e0ff',
      softPurple: '#d8b4fe',
      radiusMd: '8px',
      radiusXl: '14px',
      fontFamily: "'Space Grotesk', -apple-system, sans-serif"
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Botanical Studio',
    desc: 'Bosque profundo y verde esmeralda para estudios botánicos e ilustrativos.',
    tokens: {
      red: '#059669',
      ink: '#061e18',
      inkSurface: '#0e332a',
      inkHover: '#14493c',
      canvas: '#f2fbf7',
      surface: '#ffffff',
      surfaceLow: '#e6f7ef',
      surfaceHigh: '#d1f2e3',
      softPurple: '#a7f3d0',
      radiusMd: '14px',
      radiusXl: '22px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }
  },
  {
    id: 'amethyst',
    name: 'Royal Velvet & Amethyst',
    desc: 'Violeta iris profundo y lavanda para estudios de alta gama y elegancia.',
    tokens: {
      red: '#8b5cf6',
      ink: '#130a24',
      inkSurface: '#231540',
      inkHover: '#352160',
      canvas: '#f8f6ff',
      surface: '#ffffff',
      surfaceLow: '#f1edff',
      surfaceHigh: '#e5deff',
      softPurple: '#ddd6fe',
      radiusMd: '16px',
      radiusXl: '24px',
      fontFamily: "'Outfit', -apple-system, sans-serif"
    }
  },
  {
    id: 'amber',
    name: 'Golden Amber Atelier',
    desc: 'Café tostado, ámbar dorado y lino cálido para ateliers tradicionales.',
    tokens: {
      red: '#d97706',
      ink: '#1c140d',
      inkSurface: '#2d2116',
      inkHover: '#403020',
      canvas: '#fffdfa',
      surface: '#ffffff',
      surfaceLow: '#fef8ee',
      surfaceHigh: '#fdefd9',
      softPurple: '#fde68a',
      radiusMd: '10px',
      radiusXl: '18px',
      fontFamily: "'Manrope', -apple-system, sans-serif"
    }
  },
  {
    id: 'monochrome',
    name: 'Nordic Minimalist (Monochrome)',
    desc: 'Negro puro, grafito y blancos pulcros con bordes compactos y sobrios.',
    tokens: {
      red: '#18181b',
      ink: '#18181b',
      inkSurface: '#27272a',
      inkHover: '#3f3f46',
      canvas: '#fafafa',
      surface: '#ffffff',
      surfaceLow: '#f4f4f5',
      surfaceHigh: '#e4e4e7',
      softPurple: '#e4e4e7',
      radiusMd: '6px',
      radiusXl: '10px',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }
  }
];

let activeThemeTokens = { ...TATUDIN_DEFAULT_THEME };

function applyThemeTokens(tokens, previewOnly = false) {
  const root = document.documentElement;
  if (!tokens) return;
  if (tokens.red) root.style.setProperty('--red', tokens.red);
  if (tokens.ink) root.style.setProperty('--ink', tokens.ink);
  if (tokens.inkSurface) root.style.setProperty('--ink-surface', tokens.inkSurface);
  if (tokens.inkHover) root.style.setProperty('--ink-hover', tokens.inkHover);
  if (tokens.canvas) root.style.setProperty('--canvas', tokens.canvas);
  if (tokens.surface) root.style.setProperty('--surface', tokens.surface);
  if (tokens.surfaceLow) root.style.setProperty('--surface-low', tokens.surfaceLow);
  if (tokens.surfaceHigh) root.style.setProperty('--surface-high', tokens.surfaceHigh);
  if (tokens.softPurple) root.style.setProperty('--soft-purple', tokens.softPurple);
  if (tokens.radiusMd) root.style.setProperty('--radius-md', tokens.radiusMd);
  if (tokens.radiusXl) root.style.setProperty('--radius-xl', tokens.radiusXl);
  if (tokens.fontFamily) root.style.setProperty('--font-sans', tokens.fontFamily);

  if (!previewOnly) {
    activeThemeTokens = { ...activeThemeTokens, ...tokens };
  }
}

async function loadPersistedTheme() {
  try {
    const local = localStorage.getItem('tatudin_theme_tokens');
    if (local) {
      const parsed = JSON.parse(local);
      applyThemeTokens(parsed);
    }
    const remote = await api('/api/system/theme').catch(() => null);
    if (remote && Object.keys(remote).length > 0) {
      applyThemeTokens(remote);
      localStorage.setItem('tatudin_theme_tokens', JSON.stringify(remote));
    }
  } catch (err) {
    console.debug('[Theme Engine] Using standard defaults');
  }
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
          <p>Control maestro de la plataforma, diseño e identidad visual, estadísticas agregadas, gestión global y administración.</p>
        </div>
        <div class="backoffice-header-badges">
          <span class="backoffice-tag-pill">👑 ${currentUser?.email || 'soyelroot@tatudin.cl'}</span>
          <span class="backoffice-tag-pill">🛡️ Acceso Root Absoluto</span>
          <span class="backoffice-tag-pill">🇨🇱 Ley 19.628 Chile</span>
        </div>
      </div>

      <nav class="backoffice-tabs" aria-label="Pestañas de Backoffice">
        <button type="button" class="bo-tab-btn ${tab === 'stats' ? 'active' : ''}" data-bo-tab="stats">
          📊 Estadísticas & Funciones
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'uikit' ? 'active' : ''}" data-bo-tab="uikit">
          🎨 UI Kit & Personalización
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'artists' ? 'active' : ''}" data-bo-tab="artists">
          🎨 Artistas Globales
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'users' ? 'active' : ''}" data-bo-tab="users">
          👥 Usuarios y Estudios
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'guest-spots' ? 'active' : ''}" data-bo-tab="guest-spots">
          📋 Solicitudes de Nómades
        </button>
        <button type="button" class="bo-tab-btn ${tab === 'audit' ? 'active' : ''}" data-bo-tab="audit">
          🛡️ Auditoría & Trazabilidad
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
    } else if (tab === 'uikit') {
      container.innerHTML = renderBackofficeUIKitTab();
      attachUIKitEventListeners();
    } else if (tab === 'artists') {
      const artistsData = await api('/api/backoffice/artists');
      backofficeCache.artists = artistsData;
      container.innerHTML = renderBackofficeArtistsTab(artistsData);
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
    } else if (tab === 'audit') {
      const auditData = await api('/api/backoffice/audit-logs');
      container.innerHTML = renderBackofficeAuditTab(auditData);
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

function renderBackofficeUIKitTab() {
  const currentTheme = activeThemeTokens;

  return `
    <div class="uikit-container">
      <!-- Toolbar with Actions -->
      <div class="uikit-toolbar">
        <div class="uikit-toolbar-info">
          <h3>🎨 Sistema de Diseño Maestro & UI Kit</h3>
          <p>Personaliza tokens CSS globales, paletas cromáticas, bordes y tipografías en tiempo real.</p>
        </div>
        <div class="uikit-toolbar-actions">
          <button type="button" class="secondary small-btn" id="btn-uikit-reset" title="Restaurar paleta original de fábrica">
            🔄 Restablecer Original
          </button>
          <button type="button" class="secondary small-btn" id="btn-uikit-export-css" title="Copiar código CSS al portapapeles">
            📋 Copiar CSS
          </button>
          <button type="button" class="primary small-btn" id="btn-uikit-save" style="background: #10b981; border-color: #10b981;">
            💾 Guardar Tema Global
          </button>
        </div>
      </div>

      <!-- Presets Grid -->
      <div class="uikit-section">
        <div class="uikit-section-header">
          <div>
            <h2><span>🎨</span> Paletas Predefinidas de Marca</h2>
            <p>Selecciona un tema curado para aplicar instantáneamente a todo el sistema.</p>
          </div>
        </div>
        <div class="uikit-presets-grid">
          ${UIKIT_THEME_PRESETS.map((p) => `
            <div class="uikit-preset-card ${currentTheme.id === p.id ? 'active' : ''}" data-preset-id="${p.id}">
              <div class="uikit-preset-title">
                <span>${p.name}</span>
                ${currentTheme.id === p.id ? '✓' : ''}
              </div>
              <p style="font-size: 11.5px; color: var(--muted); margin: 0; line-height: 1.35;">${p.desc}</p>
              <div class="uikit-swatch-row">
                <span class="uikit-swatch-circle" style="background: ${p.tokens.ink};" title="Sidebar / Dark: ${p.tokens.ink}"></span>
                <span class="uikit-swatch-circle" style="background: ${p.tokens.red};" title="Acento: ${p.tokens.red}"></span>
                <span class="uikit-swatch-circle" style="background: ${p.tokens.softPurple};" title="Tinte: ${p.tokens.softPurple}"></span>
                <span class="uikit-swatch-circle" style="background: ${p.tokens.canvas};" title="Canvas: ${p.tokens.canvas}"></span>
                <span class="uikit-swatch-circle" style="background: ${p.tokens.surface};" title="Superficie: ${p.tokens.surface}"></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Live Token Customizer -->
      <div class="uikit-section">
        <div class="uikit-section-header">
          <div>
            <h2><span>🎛️</span> Ajuste Fino de Tokens de Diseño</h2>
            <p>Modifica cualquier valor hexadecimal, radio de bordes o tipografía con vista previa instantánea.</p>
          </div>
        </div>

        <form id="uikit-tokens-form">
          <div class="uikit-tokens-grid">
            <!-- Acento Primario -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Color Acento Primario (--red)</label>
              <div class="uikit-color-input-row">
                <input type="color" class="uikit-color-picker" id="token-red-picker" value="${currentTheme.red || '#ff3552'}" />
                <input type="text" class="uikit-hex-input" id="token-red-hex" value="${currentTheme.red || '#ff3552'}" maxlength="7" />
              </div>
              <small style="font-size: 11px; color: var(--muted);">Botones primarios, llamadas a la acción, acentos.</small>
            </div>

            <!-- Fondo Sidebar / Ink -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Barra Lateral / Ink (--ink)</label>
              <div class="uikit-color-input-row">
                <input type="color" class="uikit-color-picker" id="token-ink-picker" value="${currentTheme.ink || '#09041c'}" />
                <input type="text" class="uikit-hex-input" id="token-ink-hex" value="${currentTheme.ink || '#09041c'}" maxlength="7" />
              </div>
              <small style="font-size: 11px; color: var(--muted);">Fondo oscuro de barra lateral y menú principal.</small>
            </div>

            <!-- Ink Surface / Dropdown -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Superficie Oscura (--ink-surface)</label>
              <div class="uikit-color-input-row">
                <input type="color" class="uikit-color-picker" id="token-inkSurface-picker" value="${currentTheme.inkSurface || '#221c35'}" />
                <input type="text" class="uikit-hex-input" id="token-inkSurface-hex" value="${currentTheme.inkSurface || '#221c35'}" maxlength="7" />
              </div>
              <small style="font-size: 11px; color: var(--muted);">Fondos de dropdowns y elementos activos oscuros.</small>
            </div>

            <!-- Canvas Background -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Lienzo / Canvas (--canvas)</label>
              <div class="uikit-color-input-row">
                <input type="color" class="uikit-color-picker" id="token-canvas-picker" value="${currentTheme.canvas || '#fdf7ff'}" />
                <input type="text" class="uikit-hex-input" id="token-canvas-hex" value="${currentTheme.canvas || '#fdf7ff'}" maxlength="7" />
              </div>
              <small style="font-size: 11px; color: var(--muted);">Fondo principal detrás de las tarjetas y paneles.</small>
            </div>

            <!-- Tarjetas / Surface -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Superficie de Tarjetas (--surface)</label>
              <div class="uikit-color-input-row">
                <input type="color" class="uikit-color-picker" id="token-surface-picker" value="${currentTheme.surface || '#ffffff'}" />
                <input type="text" class="uikit-hex-input" id="token-surface-hex" value="${currentTheme.surface || '#ffffff'}" maxlength="7" />
              </div>
              <small style="font-size: 11px; color: var(--muted);">Fondo de tarjetas, paneles y modales.</small>
            </div>

            <!-- Burbujas / Tinte Suave -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Tinte Suave / Burbujas (--soft-purple)</label>
              <div class="uikit-color-input-row">
                <input type="color" class="uikit-color-picker" id="token-softPurple-picker" value="${currentTheme.softPurple || '#e8ddff'}" />
                <input type="text" class="uikit-hex-input" id="token-softPurple-hex" value="${currentTheme.softPurple || '#e8ddff'}" maxlength="7" />
              </div>
              <small style="font-size: 11px; color: var(--muted);">Burbujas de iconos, chips secundarios y tintes.</small>
            </div>

            <!-- Radio de Bordes -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Bordes y Esquinas (--radius-md / xl)</label>
              <select id="token-radius-select" style="margin: 0; font-size: 13px; font-weight: 700;">
                <option value="12px|20px" ${currentTheme.radiusMd === '12px' ? 'selected' : ''}>Suave / Moderno (12px / 20px - Recomendado)</option>
                <option value="6px|10px" ${currentTheme.radiusMd === '6px' ? 'selected' : ''}>Compacto / Técnico (6px / 10px)</option>
                <option value="16px|26px" ${currentTheme.radiusMd === '16px' ? 'selected' : ''}>Redondeado / Playful (16px / 26px)</option>
                <option value="0px|0px" ${currentTheme.radiusMd === '0px' ? 'selected' : ''}>Brutalista / Recto (0px)</option>
              </select>
              <small style="font-size: 11px; color: var(--muted);">Curvatura de botones, tarjetas, inputs y modales.</small>
            </div>

            <!-- Tipografía Global -->
            <div class="uikit-token-card">
              <label class="uikit-token-label">Tipografía Global (--font-sans)</label>
              <select id="token-font-select" style="margin: 0; font-size: 13px; font-weight: 700;">
                <option value="'Manrope', -apple-system, sans-serif" ${(currentTheme.fontFamily || '').includes('Manrope') ? 'selected' : ''}>Manrope (Oficial Tatudin)</option>
                <option value="'Plus Jakarta Sans', -apple-system, sans-serif" ${(currentTheme.fontFamily || '').includes('Jakarta') ? 'selected' : ''}>Plus Jakarta Sans</option>
                <option value="'Outfit', -apple-system, sans-serif" ${(currentTheme.fontFamily || '').includes('Outfit') ? 'selected' : ''}>Outfit</option>
                <option value="'Inter', -apple-system, sans-serif" ${(currentTheme.fontFamily || '').includes('Inter') ? 'selected' : ''}>Inter (Minimalista)</option>
                <option value="'Space Grotesk', -apple-system, sans-serif" ${(currentTheme.fontFamily || '').includes('Space') ? 'selected' : ''}>Space Grotesk (Técnica / Cyber)</option>
              </select>
              <small style="font-size: 11px; color: var(--muted);">Fuente tipográfica principal para toda la interfaz.</small>
            </div>
          </div>
        </form>
      </div>

      <!-- Live Sandbox & Component Gallery -->
      <div class="uikit-section">
        <div class="uikit-section-header">
          <div>
            <h2><span>🧪</span> Sandbox de Componentes en Vivo</h2>
            <p>Prueba en tiempo real cómo lucen los botones, chips, métricas y controles con tus tokens.</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- 1. Buttons -->
          <div class="uikit-sandbox-block">
            <h4 class="uikit-sandbox-title">1. Botones & Acciones</h4>
            <div class="uikit-components-flow">
              <button type="button" class="primary">${icon('plus')} Botón Primario</button>
              <button type="button" class="secondary">${icon('calendar')} Botón Secundario</button>
              <button type="button" class="secondary small-btn">${icon('chat')} Botón Pequeño</button>
              <button type="button" class="primary" style="background: #059669; border-color: #059669;">${icon('check')} Éxito / Listo</button>
              <button type="button" class="primary" style="background: #dc2626; border-color: #dc2626;">${icon('trash')} Peligro / Eliminar</button>
              <button type="button" class="secondary" disabled>Deshabilitado</button>
            </div>
          </div>

          <!-- 2. Status Chips & Role Badges -->
          <div class="uikit-sandbox-block">
            <h4 class="uikit-sandbox-title">2. Chips de Estado & Badges de Roles</h4>
            <div class="uikit-components-flow">
              <span class="status-chip status-inquiry">Consulta</span>
              <span class="status-chip status-confirmed">Confirmada</span>
              <span class="status-chip status-deposit">Seña pagada</span>
              <span class="status-chip status-session">En sesión</span>
              <span class="status-chip status-completed">Listo / Efectuada</span>
              <span class="status-chip status-rescheduled">Reprogramada</span>
              <span class="status-chip status-cancelled">Cancelada / No llegó</span>
              <span class="role-badge role-owner">👑 Propietario</span>
              <span class="role-badge role-resident">🎨 Residente</span>
              <span class="role-badge role-guest">✈️ Nómade</span>
              <span class="role-badge role-superadmin">⚡ Root Master</span>
            </div>
          </div>

          <!-- 3. Stat Cards & Metrics Preview -->
          <div class="uikit-sandbox-block">
            <h4 class="uikit-sandbox-title">3. Tarjetas de Estadísticas & Métricas</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
              <article class="stat-card">
                <div class="stat-card-header">
                  <span class="stat-icon-bubble purple">${icon('package')}</span>
                  <p class="eyebrow">MÉTRICA ESTÁNDAR</p>
                </div>
                <strong>42 Insumos</strong>
                <small>Valoración total $1.250.000</small>
              </article>

              <article class="stat-card">
                <div class="stat-card-header">
                  <span class="stat-icon-bubble green">${icon('finances')}</span>
                  <p class="eyebrow">SALDO EN CAJA</p>
                </div>
                <strong style="color: var(--green-text);">$4.850.000</strong>
                <small>Margen retenido del estudio</small>
              </article>

              <article class="stat-card alert-card">
                <div class="stat-card-header">
                  <span class="stat-icon-bubble red">${icon('alert')}</span>
                  <p class="eyebrow">ALERTA REPOSICIÓN</p>
                </div>
                <strong>3 Insumos</strong>
                <small>Stock crítico por reponer</small>
              </article>
            </div>
          </div>

          <!-- 4. Form Controls -->
          <div class="uikit-sandbox-block">
            <h4 class="uikit-sandbox-title">4. Controles de Formulario & Inputs</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
              <label style="margin: 0; font-size: 12px; font-weight: 700;">Campo de Texto
                <input type="text" placeholder="Ej. Tatuaje Neotradicional" value="Tatuaje Dragon Sleeve" style="margin-top: 4px;" />
              </label>
              <label style="margin: 0; font-size: 12px; font-weight: 700;">Selector Dropdown
                <select style="margin-top: 4px;">
                  <option>Box 1 (Principal)</option>
                  <option>Box 2 (Secundario)</option>
                  <option>Box 3 (Privado)</option>
                </select>
              </label>
              <div style="display: flex; flex-direction: column; justify-content: center; gap: 8px;">
                <label class="form-checkbox-label" style="margin: 0;">
                  <input type="checkbox" checked />
                  <span>Casilla de verificación activa</span>
                </label>
                <label class="form-checkbox-label" style="margin: 0;">
                  <input type="checkbox" />
                  <span>Casilla sin marcar</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 5. Interactive Test Triggers -->
          <div class="uikit-sandbox-block">
            <h4 class="uikit-sandbox-title">5. Disparadores de Prueba</h4>
            <div class="uikit-components-flow">
              <button type="button" class="secondary" id="btn-uikit-test-modal">
                🪟 Probar Modal con Nuevo Tema
              </button>
              <button type="button" class="secondary" id="btn-uikit-test-alert">
                🔔 Probar Notificación / Alerta
              </button>
            </div>
          </div>

          <!-- 6. Icons Catalog -->
          <div class="uikit-sandbox-block">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 class="uikit-sandbox-title">6. Catálogo de Íconos SVG del Sistema</h4>
              <span style="font-size: 11px; color: var(--muted);">${Object.keys(ICONS).length} íconos disponibles</span>
            </div>
            <div class="uikit-icons-catalog">
              ${Object.keys(ICONS).map((iconKey) => `
                <div class="uikit-icon-item" data-icon-name="${iconKey}" title="Haz clic para copiar icon('${iconKey}')">
                  ${icon(iconKey)}
                  <span>${iconKey}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachUIKitEventListeners() {
  // 1. Preset Cards
  document.querySelectorAll('.uikit-preset-card').forEach((card) => {
    card.onclick = () => {
      const presetId = card.dataset.presetId;
      const found = UIKIT_THEME_PRESETS.find((p) => p.id === presetId);
      if (found) {
        activeThemeTokens = { id: found.id, name: found.name, ...found.tokens };
        applyThemeTokens(found.tokens);
        renderBackoffice('uikit');
      }
    };
  });

  // 2. Color Pickers <-> Hex Inputs Sync
  const colorMap = [
    { picker: 'token-red-picker', hex: 'token-red-hex', prop: 'red' },
    { picker: 'token-ink-picker', hex: 'token-ink-hex', prop: 'ink' },
    { picker: 'token-inkSurface-picker', hex: 'token-inkSurface-hex', prop: 'inkSurface' },
    { picker: 'token-canvas-picker', hex: 'token-canvas-hex', prop: 'canvas' },
    { picker: 'token-surface-picker', hex: 'token-surface-hex', prop: 'surface' },
    { picker: 'token-softPurple-picker', hex: 'token-softPurple-hex', prop: 'softPurple' }
  ];

  colorMap.forEach(({ picker, hex, prop }) => {
    const pEl = document.getElementById(picker);
    const hEl = document.getElementById(hex);
    if (pEl && hEl) {
      pEl.oninput = () => {
        hEl.value = pEl.value;
        activeThemeTokens[prop] = pEl.value;
        activeThemeTokens.id = 'custom';
        applyThemeTokens({ [prop]: pEl.value });
      };
      hEl.oninput = () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(hEl.value)) {
          pEl.value = hEl.value;
          activeThemeTokens[prop] = hEl.value;
          activeThemeTokens.id = 'custom';
          applyThemeTokens({ [prop]: hEl.value });
        }
      };
    }
  });

  // 3. Border Radius
  const radiusSelect = document.getElementById('token-radius-select');
  if (radiusSelect) {
    radiusSelect.onchange = () => {
      const [rMd, rXl] = radiusSelect.value.split('|');
      activeThemeTokens.radiusMd = rMd;
      activeThemeTokens.radiusXl = rXl;
      activeThemeTokens.id = 'custom';
      applyThemeTokens({ radiusMd: rMd, radiusXl: rXl });
    };
  }

  // 4. Font Family
  const fontSelect = document.getElementById('token-font-select');
  if (fontSelect) {
    fontSelect.onchange = () => {
      activeThemeTokens.fontFamily = fontSelect.value;
      activeThemeTokens.id = 'custom';
      applyThemeTokens({ fontFamily: fontSelect.value });
    };
  }

  // 5. Actions: Reset, Export CSS, Save
  const btnReset = document.getElementById('btn-uikit-reset');
  if (btnReset) {
    btnReset.onclick = () => {
      if (confirm('¿Restablecer el diseño a los valores oficiales de Tatudin?')) {
        activeThemeTokens = { ...TATUDIN_DEFAULT_THEME };
        applyThemeTokens(TATUDIN_DEFAULT_THEME);
        localStorage.removeItem('tatudin_theme_tokens');
        api('/api/backoffice/theme', {
          method: 'PATCH',
          body: JSON.stringify({ theme: TATUDIN_DEFAULT_THEME })
        }).catch(() => null);
        renderBackoffice('uikit');
      }
    };
  }

  const btnExport = document.getElementById('btn-uikit-export-css');
  if (btnExport) {
    btnExport.onclick = () => {
      const t = activeThemeTokens;
      const css = `:root {
  --red: ${t.red || '#ff3552'};
  --ink: ${t.ink || '#09041c'};
  --ink-surface: ${t.inkSurface || '#221c35'};
  --ink-hover: ${t.inkHover || '#322e40'};
  --canvas: ${t.canvas || '#fdf7ff'};
  --surface: ${t.surface || '#ffffff'};
  --surface-low: ${t.surfaceLow || '#f7f1ff'};
  --surface-high: ${t.surfaceHigh || '#ece5fc'};
  --soft-purple: ${t.softPurple || '#e8ddff'};
  --radius-md: ${t.radiusMd || '12px'};
  --radius-xl: ${t.radiusXl || '20px'};
  --font-sans: ${t.fontFamily || "'Manrope', sans-serif"};
}`;
      navigator.clipboard.writeText(css).then(() => {
        const orig = btnExport.textContent;
        btnExport.textContent = '✓ ¡CSS Copiado!';
        setTimeout(() => { btnExport.textContent = orig; }, 2000);
      });
    };
  }

  const btnSave = document.getElementById('btn-uikit-save');
  if (btnSave) {
    btnSave.onclick = async () => {
      try {
        localStorage.setItem('tatudin_theme_tokens', JSON.stringify(activeThemeTokens));
        await api('/api/backoffice/theme', {
          method: 'PATCH',
          body: JSON.stringify({ theme: activeThemeTokens })
        });
        alert('🎉 ¡Tema maestro guardado con éxito! Se aplicará de forma global en la plataforma.');
      } catch (err) {
        alert('Tema guardado localmente en este navegador (' + err.message + ')');
      }
    };
  }

  // 6. Interactive Sandbox Triggers
  const btnTestModal = document.getElementById('btn-uikit-test-modal');
  if (btnTestModal) {
    btnTestModal.onclick = () => {
      openModal(`
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p class="eyebrow">UI KIT MODAL PREVIEW</p>
          <h2 id="modal-title" style="margin: 0;">Prueba de Diálogo Modal</h2>
          <p style="font-size: 13.5px; color: var(--muted); margin: 0;">
            Este modal utiliza dinámicamente las variables de fondo (--surface), bordes (--radius-xl), tipografía (--font-sans) y colores de acento configurados.
          </p>
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
            <button type="button" class="secondary" data-close-modal>Cerrar</button>
            <button type="button" class="primary" data-close-modal>Entendido</button>
          </div>
        </div>
      `);
    };
  }

  const btnTestAlert = document.getElementById('btn-uikit-test-alert');
  if (btnTestAlert) {
    btnTestAlert.onclick = () => {
      alert('🔔 Notificación de prueba: El sistema de diseño se encuentra 100% reactivo.');
    };
  }

  // 7. Icon Copy Trigger
  document.querySelectorAll('.uikit-icon-item').forEach((item) => {
    item.onclick = () => {
      const iconName = item.dataset.iconName;
      navigator.clipboard.writeText(`icon('${iconName}')`);
      const span = item.querySelector('span');
      if (span) {
        const orig = span.textContent;
        span.textContent = '✓ Copiado';
        setTimeout(() => { span.textContent = orig; }, 1500);
      }
    };
  });
}


function renderBackofficeStatsTab(data) {
  const m = data.metrics || {};
  const isMicrositeOn = Boolean(data.features?.feature_microsite_enabled);

  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Feature Flags & Global Modules Control -->
      <div class="panel" style="border: 1.5px solid var(--line-soft); background: var(--surface); padding: 18px 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 20px;">🌐</span>
              <strong style="font-size: 15px; color: var(--ink);">Pequeño Sitio Web (Landing Pública de Artistas)</strong>
              <span class="badge" style="background: ${isMicrositeOn ? '#d1fae5' : '#fee2e2'}; color: ${isMicrositeOn ? '#065f46' : '#991b1b'}; font-size: 11.5px; font-weight: 800;">
                ${isMicrositeOn ? '🟢 ACTIVADO' : '🔴 DESACTIVADO TEMPORALMENTE'}
              </span>
            </div>
            <p style="font-size: 12.5px; color: var(--muted); margin: 0; max-width: 660px; line-height: 1.4;">
              ${isMicrositeOn ? 'El pequeño sitio web y los portafolios públicos están disponibles para su uso y publicación.' : 'El pequeño sitio web se encuentra oculto para los usuarios y los accesos públicos están desactivados.'}
            </p>
          </div>
          <button type="button" class="primary small" data-action="toggle-feature-microsite" data-current-state="${isMicrositeOn}" style="background: ${isMicrositeOn ? 'var(--red)' : '#10b981'}; border-color: transparent; font-weight: 700; padding: 8px 16px;">
            ${isMicrositeOn ? '⏸️ Desactivar Pequeño Sitio Web' : '⚡ Activar Pequeño Sitio Web'}
          </button>
        </div>
      </div>

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

function renderBackofficeArtistsTab(artists) {
  return `
    <section class="panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">DIRECTORIO GLOBAL DE ARTISTAS (${artists.length})</p>
          <h2>Artistas y Guests registrados en el sistema</h2>
        </div>
      </div>
      <div class="bo-table-wrap">
        <table class="bo-table">
          <thead>
            <tr>
              <th>Artista</th>
              <th>Email</th>
              <th>Estudio Asociado</th>
              <th>Rol</th>
              <th>Modalidad de Acuerdo</th>
              <th>Acceso App</th>
              <th>Persona a Cargo</th>
              <th>Citas</th>
            </tr>
          </thead>
          <tbody>
            ${artists.map((a) => {
              const rInfo = ROLE_MAP[a.role] || { label: a.role || 'Artista', class: 'role-resident' };
              const agreeType = a.agreement_type || 'commission';
              let agreementLabel = `${a.commission_percent || 70}% comisión`;
              if (agreeType === 'fixed_daily') agreementLabel = `Fijo ${money(a.fixed_amount || 0)} / día`;
              if (agreeType === 'fixed_monthly') agreementLabel = `Fijo ${money(a.fixed_amount || 0)} / mes`;

              return `
                <tr>
                  <td>
                    <strong>${a.full_name}</strong>
                  </td>
                  <td><code>${a.email}</code></td>
                  <td><strong>${a.studio_name || 'Sin estudio'}</strong></td>
                  <td><span class="artist-chip ${rInfo.class}">${rInfo.label}</span></td>
                  <td><span class="badge" style="background: var(--surface-high); border: 1px solid var(--line-soft); font-size: 11px;">${agreementLabel}</span></td>
                  <td>
                    ${a.has_app_access ? '<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 11px;">📱 Habilitado</span>' : '<span class="badge" style="background: rgba(107, 114, 128, 0.15); color: #4b5563; font-size: 11px;">🔒 Solo Registro</span>'}
                  </td>
                  <td>${a.responsible_name ? `👤 ${a.responsible_name}` : '<span style="color: var(--muted);">-</span>'}</td>
                  <td><strong>${a.total_appointments || 0}</strong></td>
                </tr>
              `;
            }).join('') || '<tr><td colspan="8" style="text-align: center; color: var(--muted);">Sin artistas registrados</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
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

function renderBackofficeAuditTab(data) {
  const logs = data.logs || [];
  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div class="terms-intro-box">
        <p><strong>🛡️ Trazabilidad y Registro de Auditoría:</strong> Historial inmutable de eventos sensibles del sistema (inicios de sesión, cambios de contraseña, transacciones financieras, modificaciones de artistas y purgas de base de datos), conforme a la Ley N° 19.628.</p>
      </div>

      <section class="panel" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #fff;">Eventos Registrados</h3>
            <span style="font-size: 12px; color: var(--muted);">Total acumulado: ${data.total || logs.length} eventos</span>
          </div>
          <button type="button" class="outline-button small" data-bo-tab="audit">
            🔄 Actualizar Registro
          </button>
        </div>

        <div style="overflow-x: auto; border: 1px solid var(--line-soft); border-radius: 12px;">
          <table class="bo-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--line-soft); text-align: left;">
                <th style="padding: 12px 14px;">Fecha y Hora</th>
                <th style="padding: 12px 14px;">Acción</th>
                <th style="padding: 12px 14px;">Usuario</th>
                <th style="padding: 12px 14px;">Estudio</th>
                <th style="padding: 12px 14px;">Detalles</th>
                <th style="padding: 12px 14px;">IP / Origen</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(l => {
                const isFail = l.action.includes('failed') || l.action.includes('purge');
                const isSuccess = l.action.includes('success');
                return `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <td style="padding: 10px 14px; white-space: nowrap; color: var(--muted); font-size: 12px;">
                      ${new Date(l.created_at).toLocaleString('es-CL')}
                    </td>
                    <td style="padding: 10px 14px;">
                      <span class="role-badge" style="background: ${isFail ? 'rgba(239, 68, 68, 0.2)' : isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)'}; color: ${isFail ? '#f87171' : isSuccess ? '#34d399' : '#a78bfa'}; font-weight: 700; font-size: 11px;">
                        ${l.action}
                      </span>
                    </td>
                    <td style="padding: 10px 14px;">
                      <strong>${l.user_email || l.user_name || 'Sistema / Anónimo'}</strong>
                    </td>
                    <td style="padding: 10px 14px; color: var(--muted);">
                      ${l.studio_name || '-'}
                    </td>
                    <td style="padding: 10px 14px; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; font-size: 11px; color: #cbd5e1;" title='${JSON.stringify(l.details || {})}'>
                      ${JSON.stringify(l.details || {})}
                    </td>
                    <td style="padding: 10px 14px; color: var(--muted); font-size: 12px;">
                      ${l.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                `;
              }).join('') || '<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--muted);">No hay eventos de auditoría registrados.</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

// ---------------- ARTISTS DIRECTORY & TEAM MANAGEMENT ----------------
let artistsFilterRole = 'all';
let artistsFilterModality = 'all';
let artistsSearchQuery = '';

async function renderArtists() {
  currentAppView = 'artistas';
  document.querySelectorAll('[data-view]').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === 'artistas');
  });

  try {
    const [fetchedMembers, features] = await Promise.all([
      api('/api/members').catch(() => members || []),
      api('/api/system/features').catch(() => ({ feature_microsite_enabled: false }))
    ]);
    members = fetchedMembers;
    const isMicrositeEnabled = Boolean(features.feature_microsite_enabled);

    const totalCount = members.length;
    const residentCount = members.filter((m) => m.role === 'resident' || m.role === 'owner').length;
    const nomadCount = members.filter((m) => m.role === 'nomad').length;
    const appAccessCount = members.filter((m) => m.has_app_access !== false).length;

    // Filter members
    const filtered = members.filter((m) => {
      if (artistsFilterRole !== 'all' && m.role !== artistsFilterRole) return false;
      if (artistsFilterModality !== 'all' && (m.agreement_type || 'commission') !== artistsFilterModality) return false;
      if (artistsSearchQuery.trim()) {
        const q = artistsSearchQuery.toLowerCase().trim();
        const nameMatch = (m.full_name || '').toLowerCase().includes(q);
        const emailMatch = (m.email || '').toLowerCase().includes(q);
        const respMatch = (m.responsible_name || '').toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !respMatch) return false;
      }
      return true;
    });

    app.innerHTML = `
      <section class="intro">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <p class="eyebrow">EQUIPO & ARTISTAS</p>
            <h1>Artistas del Estudio<span class="dot">.</span></h1>
            <p class="lead">Listado completo de artistas registrados en el sistema, modalidades comerciales y permisos de acceso.</p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="primary" data-action="new-member">
              ${icon('plus')} <span>Agregar artista / Guest</span>
            </button>
            ${isMicrositeEnabled ? `
              <button class="secondary" data-view="portafolio">
                🌐 Ver / Editar Sitio Web
              </button>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- KPI Summary Cards -->
      <section class="stats" style="margin: 18px 0 24px;">
        <article class="stat-card">
          <div class="stat-card-top">
            <p class="stat-card-title">Total Artistas</p>
            <span class="stat-card-icon">👥</span>
          </div>
          <p class="stat-card-value">${totalCount}</p>
          <p class="stat-card-change">Registrados en el estudio</p>
        </article>

        <article class="stat-card">
          <div class="stat-card-top">
            <p class="stat-card-title">Residentes</p>
            <span class="stat-card-icon">🏠</span>
          </div>
          <p class="stat-card-value">${residentCount}</p>
          <p class="stat-card-change">Permanentes en el equipo</p>
        </article>

        <article class="stat-card">
          <div class="stat-card-top">
            <p class="stat-card-title">Guests / Nómades</p>
            <span class="stat-card-icon">✈️</span>
          </div>
          <p class="stat-card-value">${nomadCount}</p>
          <p class="stat-card-change">Invitados y visitantes</p>
        </article>

        <article class="stat-card">
          <div class="stat-card-top">
            <p class="stat-card-title">Con Acceso a la App</p>
            <span class="stat-card-icon">📱</span>
          </div>
          <p class="stat-card-value">${appAccessCount} <span style="font-size: 13px; color: var(--muted); font-weight: 500;">/ ${totalCount}</span></p>
          <p class="stat-card-change">${totalCount - appAccessCount} solo para registro/agenda</p>
        </article>
      </section>

      <!-- Filters & Search Toolbar -->
      <section class="panel" style="margin-bottom: 20px; padding: 14px 16px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; align-items: center;">
          <div style="position: relative;">
            <input type="text" id="artists-search-input" value="${artistsSearchQuery}" placeholder="🔍 Buscar por nombre o email..." style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid var(--line-soft); border-radius: var(--radius-md); background: var(--surface);" />
          </div>

          <div>
            <select id="artists-role-filter" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid var(--line-soft); border-radius: var(--radius-md); background: var(--surface);">
              <option value="all" ${artistsFilterRole === 'all' ? 'selected' : ''}>Todos los roles</option>
              <option value="resident" ${artistsFilterRole === 'resident' ? 'selected' : ''}>Residentes</option>
              <option value="nomad" ${artistsFilterRole === 'nomad' ? 'selected' : ''}>Guests / Nómades</option>
              <option value="admin" ${artistsFilterRole === 'admin' ? 'selected' : ''}>Administradores</option>
            </select>
          </div>

          <div>
            <select id="artists-agreement-filter" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid var(--line-soft); border-radius: var(--radius-md); background: var(--surface);">
              <option value="all" ${artistsFilterModality === 'all' ? 'selected' : ''}>Todas las modalidades</option>
              <option value="commission" ${artistsFilterModality === 'commission' ? 'selected' : ''}>Porcentaje de Comisión (%)</option>
              <option value="fixed_daily" ${artistsFilterModality === 'fixed_daily' ? 'selected' : ''}>Pago Fijo por Día ($ / día)</option>
              <option value="fixed_monthly" ${artistsFilterModality === 'fixed_monthly' ? 'selected' : ''}>Pago Fijo Mensual ($ / mes)</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Artists Cards Grid -->
      <section class="artists-grid-container" style="display: grid; gap: 14px;">
        ${filtered.length ? filtered.map((m) => {
          const rInfo = ROLE_MAP[m.role] || { label: m.role, class: 'role-resident' };
          const isOwner = m.role === 'owner';
          const initials = (m.full_name || 'A').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
          const agreeType = m.agreement_type || 'commission';
          let agreementLabel = `${m.commission_percent || 70}% comisión`;
          let agreementIcon = icon('percent');
          if (agreeType === 'fixed_daily') {
            agreementLabel = `Fijo ${money(m.fixed_amount || 0)} / día`;
            agreementIcon = icon('clock');
          } else if (agreeType === 'fixed_monthly') {
            agreementLabel = `Fijo ${money(m.fixed_amount || 0)} / mes`;
            agreementIcon = icon('calendar');
          }

          return `
            <article class="panel" style="display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border: 1.5px solid var(--line-soft); transition: all var(--transition-fast);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div class="initials large" style="width: 48px; height: 48px; font-size: 16px;">${initials}</div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 3px;">
                      <h3 style="font-size: 16px; margin: 0; color: var(--ink); font-weight: 800;">${m.full_name}</h3>
                      <span class="artist-chip ${rInfo.class}">${rInfo.label}</span>
                      <span class="member-status ${m.status}">${m.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                      ${m.has_app_access ? '<span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 11px; font-weight: 700;">📱 Acceso App</span>' : '<span class="badge" style="background: rgba(107, 114, 128, 0.12); color: #4b5563; font-size: 11px; font-weight: 700;">🔒 Sin acceso app</span>'}
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 12.5px; color: var(--muted);">
                      <span>📧 ${m.email}</span>
                      <span>📅 ${m.appointment_count || 0} citas registradas</span>
                      ${m.responsible_name ? `<span style="color: var(--ink);">👤 A cargo: <strong>${m.responsible_name}</strong></span>` : ''}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  ${m.role === 'nomad' ? `
                    <button type="button" class="secondary small-btn" data-action="open-guest-guide" data-membership-id="${m.membership_id}" title="Ver y enviar ficha de onboarding del Guest" style="border-color: #25D366; color: #059669; background: rgba(37, 211, 102, 0.08);">
                      ${icon('whatsapp')} <span>Guía Onboarding</span>
                    </button>
                  ` : ''}
                  <button class="edit-commission-tag" data-action="edit-agreement" data-membership-id="${m.membership_id}" data-artist-name="${m.full_name}" data-agreement-type="${agreeType}" data-commission="${m.commission_percent || 70}" data-fixed-amount="${m.fixed_amount || 0}" data-has-app-access="${m.has_app_access !== false}" data-responsible-id="${m.responsible_user_id || ''}" title="Editar modalidad de acuerdo y permisos" style="font-weight: 700;">
                    ${agreementIcon} <span>${agreementLabel}</span>
                  </button>
                  ${!isOwner ? `
                    <button class="member-toggle-btn" data-toggle-member-id="${m.membership_id}" data-current-status="${m.status}">
                      ${m.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                  ` : '<span class="tag-owner">Dueño Principal</span>'}
                </div>
              </div>

              ${m.supplies_included ? `
                <div style="font-size: 11.5px; color: var(--muted); background: var(--surface-high); padding: 6px 12px; border-radius: var(--radius-sm); border: 1px dashed var(--line-soft);">
                  🧴 <strong>Insumos incluidos:</strong> ${m.supplies_included}
                </div>
              ` : ''}
            </article>
          `;
        }).join('') : emptyState('No se encontraron artistas', 'Ajusta los filtros de búsqueda o agrega un nuevo artista / Guest al equipo.')}
      </section>
    `;

    // Attach search & filter listeners
    const searchInput = document.querySelector('#artists-search-input');
    const roleFilter = document.querySelector('#artists-role-filter');
    const agreeFilter = document.querySelector('#artists-agreement-filter');

    searchInput?.addEventListener('input', (e) => {
      artistsSearchQuery = e.target.value;
      renderArtists();
    });
    roleFilter?.addEventListener('change', (e) => {
      artistsFilterRole = e.target.value;
      renderArtists();
    });
    agreeFilter?.addEventListener('change', (e) => {
      artistsFilterModality = e.target.value;
      renderArtists();
    });

  } catch (error) {
    app.innerHTML = `
      <div class="empty">
        <h3>Error al cargar artistas</h3>
        <p>${error.message}</p>
        <button class="primary small" data-view="dashboard">Volver al inicio</button>
      </div>
    `;
  }
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
    const [data, features] = await Promise.all([
      api('/api/portfolio/me'),
      api('/api/system/features').catch(() => ({ feature_microsite_enabled: false }))
    ]);

    if (!features.feature_microsite_enabled && !currentUser?.is_superadmin) {
      app.innerHTML = `
        <div class="empty" style="max-width: 520px; margin: 60px auto; text-align: center; padding: 40px 24px; background: var(--surface); border: 1px solid var(--line-soft); border-radius: var(--radius-lg);">
          <div style="font-size: 44px; margin-bottom: 12px;">🌐</div>
          <p class="eyebrow">FUNCIONALIDAD DESACTIVADA</p>
          <h2 style="margin: 8px 0 12px; font-size: 22px;">Pequeño Sitio Web Desactivado</h2>
          <p class="lead" style="font-size: 14px; line-height: 1.5; color: var(--muted); margin-bottom: 24px;">
            El módulo de pequeño sitio web y landing pública de artistas se encuentra temporalmente fuera de servicio. Puedes gestionar y consultar tu lista de artistas en la sección correspondiente.
          </p>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <button class="primary" data-view="artistas">
              👥 Ver Listado de Artistas
            </button>
            <button class="secondary" data-view="dashboard">
              Volver al Inicio
            </button>
          </div>
        </div>
      `;
      return;
    }

    portfolioData = data;
    const portfolio = data.portfolio;
    const gallery = data.gallery || [];
    const brandColor = portfolio.brand_color || '#E11D48';

    app.innerHTML = `
      <div class="portfolio-container" style="--brand-color: ${brandColor};">
        <!-- Top Action Bar matching Figma wireframe -->
        <header class="portfolio-topbar">
          <div class="portfolio-topbar-left">
            <button class="icon-button-back" data-view="artistas" aria-label="Volver" title="Volver a Artistas">
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

// ==========================================
// INVENTORY & RECEIPT OCR CAMERA MODULE
// ==========================================

const INVENTORY_CATEGORIES = {
  needles: { label: 'Agujas & Cartuchos', icon: '💉', color: '#7C3AED' },
  inks: { label: 'Tintas & Pigmentos', icon: '🎨', color: '#0284C7' },
  hygiene: { label: 'Higiene & Bioseguridad', icon: '🧼', color: '#059669' },
  aftercare: { label: 'Cuidado & Aftercare', icon: '🧴', color: '#E11D48' },
  equipment: { label: 'Máquinas & Equipamiento', icon: '⚡', color: '#D97706' },
  merch: { label: 'Merchandising & Arte', icon: '👕', color: '#6366F1' },
  other: { label: 'Otros Insumos', icon: '📦', color: '#64748B' }
};

const INVENTORY_UNITS = {
  units: 'Unidades (u)',
  boxes: 'Cajas',
  bottles: 'Botellas / Frascos',
  packs: 'Paquetes',
  rolls: 'Rollos',
  ml: 'Mililitros (ml)'
};

const MOVEMENT_TYPES = {
  purchase: { label: 'Compra de Stock', icon: '🛒', class: 'mov-purchase', badge: 'Entrada / Compra' },
  consumption: { label: 'Consumo en Sesión', icon: '💉', class: 'mov-consumption', badge: 'Salida / Consumo' },
  sale_external: { label: 'Venta a Cliente', icon: '🛍️', class: 'mov-sale', badge: 'Salida / Venta Cliente' },
  transfer_internal: { label: 'Facilitación a Artista', icon: '🔄', class: 'mov-transfer', badge: 'Transferencia Interna' },
  sale_internal: { label: 'Venta a Artista', icon: '🏷️', class: 'mov-sale-internal', badge: 'Venta Interna' },
  adjustment: { label: 'Ajuste de Inventario', icon: '⚖️', class: 'mov-adjustment', badge: 'Ajuste / Conteo' }
};

let inventoryData = null;
let inventoryMovements = [];
let inventoryCurrentTab = 'studio'; // 'studio' | 'personal' | 'movements' | 'alerts'
let inventoryCategoryFilter = 'all';
let scannerMediaStream = null;
let scannerCurrentFacingMode = 'environment';

function stopCameraStream() {
  if (scannerMediaStream) {
    try {
      scannerMediaStream.getTracks().forEach((track) => track.stop());
    } catch (e) {}
    scannerMediaStream = null;
  }
  const videoEl = document.getElementById('scanner-camera-video');
  if (videoEl) {
    videoEl.srcObject = null;
  }
}

async function renderInventory() {
  try {
    const [inv, movs] = await Promise.all([
      api('/api/inventory').catch(() => ({ studioItems: [], personalItems: [], members: [], stats: {} })),
      api('/api/inventory/movements').catch(() => ({ movements: [] }))
    ]);
    inventoryData = inv;
    inventoryMovements = movs.movements || [];
  } catch (err) {
    console.error('Error loading inventory:', err);
    inventoryData = { studioItems: [], personalItems: [], members: [], stats: {} };
    inventoryMovements = [];
  }

  const { studioItems = [], personalItems = [], members = [], stats = {} } = inventoryData;
  const lowStockItems = [...studioItems, ...personalItems].filter(i => Number(i.quantity) <= Number(i.min_stock_alert));

  let itemsToDisplay = [];
  if (inventoryCurrentTab === 'studio') {
    itemsToDisplay = studioItems;
  } else if (inventoryCurrentTab === 'personal') {
    itemsToDisplay = personalItems;
  } else if (inventoryCurrentTab === 'alerts') {
    itemsToDisplay = lowStockItems;
  }

  if (inventoryCategoryFilter !== 'all') {
    itemsToDisplay = itemsToDisplay.filter(i => i.category === inventoryCategoryFilter);
  }

  app.innerHTML = `
    <section class="intro">
      <div class="intro-header-row">
        <div>
          <p class="eyebrow">CONTROL DE INSUMOS & STOCK</p>
          <h1>Inventario & Insumos<span class="dot">.</span></h1>
          <p class="lead">Gestión de stock del estudio, insumos personales, transferencias entre artistas y compras con boleta OCR.</p>
        </div>
      </div>
    </section>

    <!-- Top Action Bar -->
    <section class="actions inventory-top-actions">
      <button class="primary" data-action="open-upload-screenshot">
        ${icon('image')} <span>Subir Foto / Captura</span>
      </button>
      <button class="secondary" data-action="open-receipt-scanner">
        ${icon('camera')} <span>Usar Cámara (OCR)</span>
      </button>
      <button class="secondary" data-action="open-new-item-modal">
        ${icon('plus')} <span>Nuevo insumo</span>
      </button>
      <button class="secondary" data-action="open-new-movement-modal">
        ${icon('sync')} <span>Registrar movimiento</span>
      </button>
    </section>

    <!-- Metrics Cards -->
    <section class="stats inventory-stats-grid">
      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-icon-bubble purple">${icon('package')}</span>
          <p class="eyebrow">STOCK ESTUDIO</p>
        </div>
        <strong>${stats.totalStudioItems || studioItems.length}</strong>
        <small>Insumos compartidos (${money(stats.studioValuation || 0)})</small>
      </article>

      <article class="stat-card">
        <div class="stat-card-header">
          <span class="stat-icon-bubble green">${icon('artist')}</span>
          <p class="eyebrow">MI STOCK PERSONAL</p>
        </div>
        <strong>${stats.totalPersonalItems || personalItems.length}</strong>
        <small>Tus insumos propios (${money(stats.personalValuation || 0)})</small>
      </article>

      <article class="stat-card ${lowStockItems.length > 0 ? 'alert-card' : ''}">
        <div class="stat-card-header">
          <span class="stat-icon-bubble ${lowStockItems.length > 0 ? 'red' : 'green'}">${icon('alert')}</span>
          <p class="eyebrow">STOCK BAJO</p>
        </div>
        <strong>${lowStockItems.length}</strong>
        <small>${lowStockItems.length > 0 ? 'Insumos requieren reposición' : 'Todos los insumos con buen stock'}</small>
      </article>
    </section>

    <!-- Inventory Context Tabs -->
    <div class="inventory-tabs-container">
      <div class="inventory-tabs-nav">
        <button class="inv-tab-btn ${inventoryCurrentTab === 'studio' ? 'active' : ''}" data-inv-tab="studio">
          🏢 Insumos del Estudio <span class="inv-tab-badge">${studioItems.length}</span>
        </button>
        <button class="inv-tab-btn ${inventoryCurrentTab === 'personal' ? 'active' : ''}" data-inv-tab="personal">
          🎨 Mi Inventario Personal <span class="inv-tab-badge">${personalItems.length}</span>
        </button>
        <button class="inv-tab-btn ${inventoryCurrentTab === 'movements' ? 'active' : ''}" data-inv-tab="movements">
          🔄 Movimientos & Ventas <span class="inv-tab-badge">${inventoryMovements.length}</span>
        </button>
        <button class="inv-tab-btn ${inventoryCurrentTab === 'alerts' ? 'active' : ''}" data-inv-tab="alerts">
          ⚠️ Alertas Reposición <span class="inv-tab-badge ${lowStockItems.length > 0 ? 'badge-alert' : ''}">${lowStockItems.length}</span>
        </button>
      </div>

      <!-- Category Filter Pills (Shown on stock tabs) -->
      ${inventoryCurrentTab !== 'movements' ? `
        <div class="inventory-category-filters">
          <button class="cat-filter-btn ${inventoryCategoryFilter === 'all' ? 'active' : ''}" data-inv-cat-filter="all">
            Todos (${inventoryCurrentTab === 'studio' ? studioItems.length : (inventoryCurrentTab === 'personal' ? personalItems.length : lowStockItems.length)})
          </button>
          ${Object.entries(INVENTORY_CATEGORIES).map(([catKey, catMeta]) => {
            const count = (inventoryCurrentTab === 'studio' ? studioItems : (inventoryCurrentTab === 'personal' ? personalItems : lowStockItems)).filter(i => i.category === catKey).length;
            if (count === 0 && inventoryCategoryFilter !== catKey) return '';
            return `
              <button class="cat-filter-btn ${inventoryCategoryFilter === catKey ? 'active' : ''}" data-inv-cat-filter="${catKey}">
                ${catMeta.icon} ${catMeta.label} <span class="cat-filter-count">${count}</span>
              </button>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Tab Contents -->
    <section class="inventory-content-section">
      ${inventoryCurrentTab === 'movements' 
        ? renderInventoryMovementsTab(inventoryMovements) 
        : renderInventoryItemsGrid(itemsToDisplay, inventoryCurrentTab)}
    </section>
  `;
}

function renderInventoryItemsGrid(items, currentTab) {
  if (!items || !items.length) {
    return emptyState(
      currentTab === 'alerts' ? '¡Excelente! Sin insumos con stock crítico' : 'No hay insumos registrados',
      currentTab === 'alerts' 
        ? 'Todos los insumos superan el umbral de alerta mínima.' 
        : 'Agrega tu primer insumo o escanea una boleta de compra con la cámara.'
    );
  }

  return `
    <div class="inventory-items-grid">
      ${items.map((item) => {
        const cat = INVENTORY_CATEGORIES[item.category] || INVENTORY_CATEGORIES.other;
        const unitLabel = INVENTORY_UNITS[item.unit] || item.unit;
        const qty = Number(item.quantity);
        const minAlert = Number(item.min_stock_alert || 5);
        const isLow = qty <= minAlert;
        const isOutOfStock = qty <= 0;

        const stockStatusClass = isOutOfStock ? 'stock-empty' : (isLow ? 'stock-warning' : 'stock-ok');
        const stockStatusLabel = isOutOfStock ? 'AGOTADO' : (isLow ? 'STOCK BAJO' : 'STOCK ÓPTIMO');

        return `
          <article class="inventory-card ${stockStatusClass}" data-item-id="${item.id}">
            <div class="inv-card-header">
              <div class="inv-card-category" style="--c-color: ${cat.color}">
                <span class="inv-cat-icon">${cat.icon}</span>
                <span class="inv-cat-name">${cat.label}</span>
              </div>
              <span class="inv-status-pill ${stockStatusClass}">${stockStatusLabel}</span>
            </div>

            <div class="inv-card-body">
              <h3 class="inv-item-name">${item.name}</h3>
              ${item.sku ? `<p class="inv-item-sku">SKU: <code>${item.sku}</code></p>` : ''}

              <div class="inv-stock-level-box">
                <div class="inv-stock-numbers">
                  <span class="inv-current-qty">${qty}</span>
                  <span class="inv-unit-name">${unitLabel}</span>
                </div>
                <small class="inv-min-alert-text">Mínimo sugerido: ${minAlert} ${unitLabel}</small>
              </div>

              <div class="inv-prices-row">
                <div class="inv-price-col">
                  <span class="price-label">Costo unitario:</span>
                  <strong class="price-val">${money(item.cost_price || 0)}</strong>
                </div>
                ${Number(item.sale_price) > 0 ? `
                  <div class="inv-price-col">
                    <span class="price-label">Precio venta:</span>
                    <strong class="price-val sale">${money(item.sale_price)}</strong>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="inv-card-actions">
              <button type="button" class="inv-action-btn primary" data-action="consume-item" data-id="${item.id}" data-name="${item.name}" title="Registrar consumo en sesión">
                💉 Consumir
              </button>
              ${currentTab === 'studio' ? `
                <button type="button" class="inv-action-btn secondary" data-action="transfer-item" data-id="${item.id}" data-name="${item.name}" title="Facilitar o vender a un artista residente/nómade">
                  🔄 Transferir/Vender
                </button>
              ` : `
                <button type="button" class="inv-action-btn secondary" data-action="sell-item" data-id="${item.id}" data-name="${item.name}" title="Vender a cliente final">
                  🛍️ Venta
                </button>
              `}
              <button type="button" class="inv-action-btn icon-only" data-action="edit-item" data-id="${item.id}" title="Editar insumo">
                ✏️
              </button>
              <button type="button" class="inv-action-btn icon-only danger" data-action="delete-item" data-id="${item.id}" data-name="${item.name}" title="Eliminar insumo">
                🗑️
              </button>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderInventoryMovementsTab(movements) {
  if (!movements || !movements.length) {
    return emptyState('Sin movimientos registrados', 'Los consumos, compras con boleta OCR y transferencias aparecerán aquí.');
  }

  return `
    <div class="inventory-movements-wrapper panel">
      <div class="table-responsive">
        <table class="inventory-movements-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Insumo</th>
              <th>Cantidad</th>
              <th>Emisor / Receptor</th>
              <th>Monto ($)</th>
              <th>Notas / Cita</th>
            </tr>
          </thead>
          <tbody>
            ${movements.map((m) => {
              const typeMeta = MOVEMENT_TYPES[m.movement_type] || { label: m.movement_type, icon: '📦', class: 'mov-default', badge: m.movement_type };
              const dateFormatted = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(m.created_at));
              const unit = INVENTORY_UNITS[m.item_unit] || m.item_unit || 'u';

              let partyDesc = '—';
              if (m.from_user_name && m.to_user_name) {
                partyDesc = `${m.from_user_name} ➔ ${m.to_user_name}`;
              } else if (m.from_user_name) {
                partyDesc = `Por: ${m.from_user_name}`;
              } else if (m.to_user_name) {
                partyDesc = `Para: ${m.to_user_name}`;
              }

              return `
                <tr>
                  <td class="cell-date">${dateFormatted}</td>
                  <td>
                    <span class="movement-pill ${typeMeta.class}">
                      <span>${typeMeta.icon}</span>
                      <span>${typeMeta.badge}</span>
                    </span>
                  </td>
                  <td class="cell-item-name">
                    <strong>${m.item_name}</strong>
                    <small class="cat-sub">${INVENTORY_CATEGORIES[m.item_category]?.label || m.item_category}</small>
                  </td>
                  <td class="cell-qty">
                    <strong>${m.quantity}</strong> <small>${unit}</small>
                  </td>
                  <td class="cell-party">${partyDesc}</td>
                  <td class="cell-amount">${Number(m.total_amount) > 0 ? money(m.total_amount) : '—'}</td>
                  <td class="cell-notes">
                    ${m.appointment_title ? `<span class="appointment-tag">📅 ${m.appointment_title}</span>` : ''}
                    ${m.notes ? `<span>${m.notes}</span>` : ''}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------- INVENTORY MODALS ----------------

function openItemModal(item = null, isPersonal = false) {
  const isEdit = Boolean(item && item.id);
  const selectedCat = item?.category || 'needles';
  const selectedUnit = item?.unit || 'units';

  openModal(`
    <p class="eyebrow">${isEdit ? 'EDITAR INSUMO' : 'NUEVO INSUMO'}</p>
    <h2 id="modal-title">${isEdit ? item.name : 'Crear Insumo de Inventario'}</h2>

    <form data-form="inventory-item">
      ${isEdit ? `<input type="hidden" name="id" value="${item.id}" />` : ''}

      <label>Nombre del insumo / producto *
        <input name="name" required placeholder="Ej. Cartuchos Kwadron 03RL, Crema Cicatrizante 50g..." value="${item?.name || ''}" />
      </label>

      <div class="grid two">
        <label>Categoría
          <select name="category">
            ${Object.entries(INVENTORY_CATEGORIES).map(([key, cat]) => `
              <option value="${key}" ${key === selectedCat ? 'selected' : ''}>${cat.icon} ${cat.label}</option>
            `).join('')}
          </select>
        </label>

        <label>Unidad de medida
          <select name="unit">
            ${Object.entries(INVENTORY_UNITS).map(([key, label]) => `
              <option value="${key}" ${key === selectedUnit ? 'selected' : ''}>${label}</option>
            `).join('')}
          </select>
        </label>
      </div>

      <div class="grid two">
        <label>Stock actual disponible *
          <input type="number" name="quantity" min="0" step="any" required placeholder="0" value="${item?.quantity !== undefined ? item.quantity : 1}" />
        </label>

        <label>Alerta de stock mínimo
          <input type="number" name="minStockAlert" min="0" step="any" placeholder="5" value="${item?.min_stock_alert !== undefined ? item.min_stock_alert : 5}" />
        </label>
      </div>

      <div class="grid two">
        <label>Costo unitario de compra ($)
          <input type="number" name="costPrice" min="0" step="any" placeholder="0" value="${item?.cost_price || 0}" />
        </label>

        <label>Precio de venta a clientes / artistas ($)
          <input type="number" name="salePrice" min="0" step="any" placeholder="0 (opcional)" value="${item?.sale_price || 0}" />
        </label>
      </div>

      <label>Código SKU / Referencia (opcional)
        <input name="sku" placeholder="Ej. KW-03RL, DYN-BLK8..." value="${item?.sku || ''}" />
      </label>

      ${!isEdit ? `
        <label class="form-checkbox-label">
          <input type="checkbox" name="isPersonal" ${isPersonal ? 'checked' : ''} />
          <span>Guardar en mi <strong>Inventario Personal</strong> (en lugar del inventario compartido del estudio)</span>
        </label>
      ` : ''}

      <p class="form-error"></p>

      <div class="modal-actions">
        <button type="button" class="secondary" data-close-modal>Cancelar</button>
        <button type="submit" class="primary">
          ${isEdit ? 'Guardar Cambios' : 'Crear Insumo'}
        </button>
      </div>
    </form>
  `);
}

function openMovementModal(preselectedItemId = null, preselectedType = 'consumption') {
  const allItems = [...(inventoryData?.studioItems || []), ...(inventoryData?.personalItems || [])];
  const members = inventoryData?.members || [];

  openModal(`
    <p class="eyebrow">MOVIMIENTO DE INVENTARIO</p>
    <h2 id="modal-title">Registrar Consumo, Venta o Transferencia</h2>

    <form data-form="inventory-movement">
      <label>Insumo *
        <select name="itemId" id="mov-item-select" required>
          <option value="">Selecciona un insumo...</option>
          ${allItems.map((i) => `
            <option value="${i.id}" data-qty="${i.quantity}" data-unit="${i.unit}" data-cost="${i.cost_price}" data-sale="${i.sale_price}" ${Number(preselectedItemId) === Number(i.id) ? 'selected' : ''}>
              ${i.owner_user_id ? '🎨 [Personal] ' : '🏢 [Estudio] '} ${i.name} (Stock: ${i.quantity} ${INVENTORY_UNITS[i.unit] || i.unit})
            </option>
          `).join('')}
        </select>
      </label>

      <label>Tipo de movimiento *
        <select name="movementType" id="mov-type-select" required>
          <option value="consumption" ${preselectedType === 'consumption' ? 'selected' : ''}>💉 Consumo en sesión / cita de tatuaje</option>
          <option value="purchase" ${preselectedType === 'purchase' ? 'selected' : ''}>🛒 Compra externa (Ingreso de stock)</option>
          <option value="sale_external" ${preselectedType === 'sale_external' ? 'selected' : ''}>🛍️ Venta a cliente final (Aftercare / Merch)</option>
          <option value="transfer_internal" ${preselectedType === 'transfer_internal' ? 'selected' : ''}>🔄 Facilitación / Préstamo de estudio a residente o nómade</option>
          <option value="sale_internal" ${preselectedType === 'sale_internal' ? 'selected' : ''}>🏷️ Venta interna a artista residente o nómade</option>
          <option value="adjustment" ${preselectedType === 'adjustment' ? 'selected' : ''}>⚖️ Ajuste manual de stock / Conteo físico</option>
        </select>
      </label>

      <div class="grid two">
        <label>Cantidad *
          <input type="number" name="quantity" min="0.01" step="any" required placeholder="1" value="1" />
        </label>

        <label id="mov-price-field">Precio / Monto total ($)
          <input type="number" name="totalAmount" min="0" step="any" placeholder="0" value="0" />
        </label>
      </div>

      <!-- Target Artist Selector (For transfer or internal sale) -->
      <div id="mov-target-user-field" class="form-section ${['transfer_internal', 'sale_internal'].includes(preselectedType) ? '' : 'hidden'}">
        <label>Artista receptor (Residente o Nómade) *
          <select name="toUserId">
            <option value="">Selecciona al artista...</option>
            ${members.map((m) => `
              <option value="${m.id}">${m.full_name} (${ROLE_MAP[m.role]?.label || m.role})</option>
            `).join('')}
          </select>
        </label>
      </div>

      <label class="form-checkbox-label" id="mov-financial-record-wrap">
        <input type="checkbox" name="createFinancialRecord" value="true" checked />
        <span>Registrar automáticamente en <strong>Billetera</strong> (como Ingreso o Egreso)</span>
      </label>

      <label>Notas u observación
        <input name="notes" placeholder="Ej. Sesión brazo completo, compra proveedor ChileTattoo..." />
      </label>

      <p class="form-error"></p>

      <div class="modal-actions">
        <button type="button" class="secondary" data-close-modal>Cancelar</button>
        <button type="submit" class="primary">Registrar Movimiento</button>
      </div>
    </form>
  `);

  // Dynamically toggle target artist field on type change
  setTimeout(() => {
    const typeSelect = document.getElementById('mov-type-select');
    const targetUserField = document.getElementById('mov-target-user-field');
    const finWrap = document.getElementById('mov-financial-record-wrap');

    if (typeSelect) {
      typeSelect.onchange = () => {
        const val = typeSelect.value;
        if (targetUserField) {
          targetUserField.classList.toggle('hidden', !['transfer_internal', 'sale_internal'].includes(val));
        }
        if (finWrap) {
          finWrap.classList.toggle('hidden', ['consumption', 'transfer_internal'].includes(val));
        }
      };
    }
  }, 30);
}

// ---------------- CAMERA SCANNER & OCR MODULE ----------------

async function openCamera(facingMode = 'environment') {
  stopCameraStream();
  scannerCurrentFacingMode = facingMode;
  const videoEl = document.getElementById('scanner-camera-video');
  const errorEl = document.getElementById('scanner-camera-error');
  const overlayEl = document.getElementById('scanner-viewfinder-overlay');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (errorEl) {
      errorEl.innerHTML = `
        <div class="camera-fallback-msg">
          <p>⚠️ Tu navegador o dispositivo no soporta acceso directo a la cámara por WebRTC.</p>
          <label class="primary camera-file-upload-btn">
            📁 Seleccionar o tomar foto de boleta
            <input type="file" accept="image/*" capture="environment" id="scanner-file-fallback" style="display:none;" />
          </label>
        </div>
      `;
      errorEl.hidden = false;
    }
    if (overlayEl) overlayEl.hidden = true;
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });
    scannerMediaStream = stream;
    if (videoEl) {
      videoEl.srcObject = stream;
      videoEl.play();
      if (overlayEl) overlayEl.hidden = false;
      if (errorEl) errorEl.hidden = true;
    }
  } catch (err) {
    console.warn('[CAMERA] getUserMedia error:', err);
    if (errorEl) {
      errorEl.innerHTML = `
        <div class="camera-fallback-msg">
          <p>⚠️ No se pudo acceder a la cámara (${err.message || 'Permiso denegado'}).</p>
          <label class="primary camera-file-upload-btn">
            📁 Cargar foto desde tu galería o cámara
            <input type="file" accept="image/*" capture="environment" id="scanner-file-fallback" style="display:none;" />
          </label>
        </div>
      `;
      errorEl.hidden = false;
    }
    if (overlayEl) overlayEl.hidden = true;
  }
}

function openUploadScreenshotModal(defaultTarget = 'studio') {
  openModal(`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <p class="eyebrow">LECTURA DE BOLETAS Y COMPROBANTES</p>
          <h2 id="modal-title" style="margin: 0; font-size: 20px;">Cargar Foto o Captura de Pantalla</h2>
          <p style="font-size: 13px; color: var(--muted); margin: 4px 0 0 0;">
            Sube o pega una imagen de tu boleta, factura o comprobante de transferencia para leer los montos con OCR.
          </p>
        </div>
        <button type="button" class="scanner-close-btn" data-close-modal title="Cerrar">✕</button>
      </div>

      <!-- Drag & Drop / File Pick / Paste Area -->
      <div class="screenshot-dropzone" id="screenshot-dropzone">
        <div class="screenshot-dropzone-icon">🖼️</div>
        <h3 class="screenshot-dropzone-title">Haz clic para elegir foto o arrastra tu archivo aquí</h3>
        <p class="screenshot-dropzone-sub">
          Formatos compatibles: JPG, PNG, WEBP, capturas de pantalla de celular o computador.
        </p>
        <div class="paste-badge-hint">
          <span>📋 También puedes presionar <strong>Ctrl + V</strong> para pegar una captura</span>
        </div>
        <input type="file" accept="image/*" id="screenshot-dropzone-file-input" style="display: none;" />
      </div>

      <!-- Alternative options -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--line-soft); flex-wrap: wrap; gap: 10px;">
        <button type="button" class="secondary small-btn" data-action="open-receipt-scanner">
          ${icon('camera')} <span>Prefiero usar la cámara en vivo</span>
        </button>
        <button type="button" class="secondary small-btn" data-close-modal>
          Cancelar
        </button>
      </div>
    </div>
  `);

  const dropzone = document.getElementById('screenshot-dropzone');
  const fileInput = document.getElementById('screenshot-dropzone-file-input');

  if (dropzone && fileInput) {
    dropzone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      if (e.target.files && e.target.files.length) {
        handleFileInputOcr(e.target.files, defaultTarget);
      }
    };

    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    };

    dropzone.ondragleave = () => {
      dropzone.classList.remove('dragover');
    };

    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        handleFileInputOcr(e.dataTransfer.files, defaultTarget);
      }
    };
  }
}

function openReceiptScannerModal(defaultTarget = 'studio') {
  openModal(`
    <div class="receipt-scanner-container">
      <div class="scanner-modal-header">
        <div>
          <p class="eyebrow">ESCÁNER OCR DE BOLETAS</p>
          <h2 id="modal-title" style="margin: 0; font-size: 18px;">Tomar foto de boleta</h2>
        </div>
        <button type="button" class="scanner-close-btn" data-close-modal title="Cerrar">✕</button>
      </div>

      <div class="scanner-viewport-box">
        <video id="scanner-camera-video" playsinline autoplay muted></video>
        <div class="scanner-viewfinder-overlay" id="scanner-viewfinder-overlay">
          <div class="scanner-frame-corner top-left"></div>
          <div class="scanner-frame-corner top-right"></div>
          <div class="scanner-frame-corner bottom-left"></div>
          <div class="scanner-frame-corner bottom-right"></div>
          <div class="scanner-scan-line"></div>
          <p class="scanner-guideline-text">Encuadra la boleta o ticket de compra aquí</p>
        </div>
        <div id="scanner-camera-error" class="scanner-error-overlay" style="display: none;"></div>
        <canvas id="scanner-capture-canvas" style="display:none;"></canvas>
      </div>

      <!-- OCR Progress Bar Overlay (Hidden by default until shutter is clicked) -->
      <div id="ocr-processing-overlay" class="ocr-processing-overlay" style="display: none;">
        <div class="ocr-progress-box">
          <div class="ocr-spinner"></div>
          <strong id="ocr-status-title">Analizando boleta con OCR...</strong>
          <p id="ocr-status-subtitle">Extrayendo texto, montos y productos</p>
          <div class="ocr-progress-bar-wrap">
            <div id="ocr-progress-bar-fill" class="ocr-progress-bar-fill" style="width: 0%;"></div>
          </div>
          <span id="ocr-progress-percent">0%</span>
          <button type="button" id="btn-cancel-ocr" class="secondary small-btn" style="margin-top: 8px; color: #fff; border-color: rgba(255,255,255,0.4);">
            Ingresar manualmente
          </button>
        </div>
      </div>

      <div class="scanner-control-bar">
        <label class="secondary scanner-btn-icon" title="Cargar desde galería o archivos">
          📁 <span>Subir Archivo</span>
          <input type="file" accept="image/*" capture="environment" id="scanner-direct-file-input" style="display: none;" />
        </label>
        <button type="button" class="scanner-shutter-btn" id="btn-scanner-capture" title="Capturar Foto y Leer Boleta">
          <span class="shutter-inner-circle"></span>
        </button>
        <button type="button" class="secondary scanner-btn-icon" id="btn-scanner-flip" title="Cambiar Cámara Frontal / Trasera">
          🔄 <span>Voltear</span>
        </button>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--line-soft);">
        <button type="button" class="secondary small-btn" data-close-modal>
          Cancelar
        </button>
        <span style="font-size: 11px; color: var(--muted);">Presiona el botón blanco central para capturar</span>
      </div>
    </div>
  `);

  setTimeout(() => {
    openCamera('environment');

    const captureBtn = document.getElementById('btn-scanner-capture');
    const flipBtn = document.getElementById('btn-scanner-flip');
    const fileInput = document.getElementById('scanner-direct-file-input');
    const fallbackInput = document.getElementById('scanner-file-fallback');

    if (captureBtn) {
      captureBtn.onclick = () => captureFrameAndProcess(defaultTarget);
    }
    if (flipBtn) {
      flipBtn.onclick = () => {
        const nextMode = scannerCurrentFacingMode === 'environment' ? 'user' : 'environment';
        openCamera(nextMode);
      };
    }
    if (fileInput) {
      fileInput.onchange = (e) => handleFileInputOcr(e.target.files, defaultTarget);
    }
    if (fallbackInput) {
      fallbackInput.onchange = (e) => handleFileInputOcr(e.target.files, defaultTarget);
    }
  }, 50);
}

function captureFrameAndProcess(defaultTarget) {
  const videoEl = document.getElementById('scanner-camera-video');
  const canvasEl = document.getElementById('scanner-capture-canvas');
  if (!videoEl || !canvasEl) return;

  canvasEl.width = videoEl.videoWidth || 1280;
  canvasEl.height = videoEl.videoHeight || 720;
  const ctx = canvasEl.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
  const imageDataUrl = canvasEl.toDataURL('image/jpeg', 0.92);

  stopCameraStream();
  processReceiptWithOcr(imageDataUrl, defaultTarget);
}

function handleFileInputOcr(files, defaultTarget) {
  if (!files || !files.length) return;
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    stopCameraStream();
    processReceiptWithOcr(e.target.result, defaultTarget);
  };
  reader.readAsDataURL(file);
}

async function processReceiptWithOcr(imageSource, defaultTarget) {
  const ocrOverlay = document.getElementById('ocr-processing-overlay');
  const progressFill = document.getElementById('ocr-progress-bar-fill');
  const progressText = document.getElementById('ocr-progress-percent');
  const statusTitle = document.getElementById('ocr-status-title');
  const cancelOcrBtn = document.getElementById('btn-cancel-ocr');

  if (ocrOverlay) {
    ocrOverlay.style.display = 'flex';
    ocrOverlay.hidden = false;
  }

  let cancelled = false;
  if (cancelOcrBtn) {
    cancelOcrBtn.onclick = () => {
      cancelled = true;
      if (ocrOverlay) ocrOverlay.style.display = 'none';
      showReceiptConfirmationModal({
        text: '',
        detectedTotal: 0,
        detectedVendor: 'Compra de Insumos',
        detectedItems: [],
        imageSource,
        defaultTarget
      });
    };
  }

  try {
    if (typeof Tesseract === 'undefined') {
      if (statusTitle) statusTitle.textContent = 'Cargando motor de OCR...';
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('No se pudo cargar la librería Tesseract.js'));
        document.head.appendChild(script);
      });
    }

    if (cancelled) return;
    if (statusTitle) statusTitle.textContent = 'Escaneando texto y montos...';

    const result = await Tesseract.recognize(imageSource, 'spa+eng', {
      logger: (m) => {
        if (cancelled) return;
        if (m.status === 'recognizing text' && m.progress !== undefined) {
          const pct = Math.round(m.progress * 100);
          if (progressFill) progressFill.style.width = `${pct}%`;
          if (progressText) progressText.textContent = `${pct}%`;
        }
      }
    });

    if (cancelled) return;
    const extractedText = result.data.text || '';
    console.log('[OCR RECEIPT RESULT TEXT]:\n', extractedText);

    const parsedData = parseReceiptText(extractedText);
    parsedData.imageSource = imageSource;
    parsedData.defaultTarget = defaultTarget;

    showReceiptConfirmationModal(parsedData);
  } catch (err) {
    if (cancelled) return;
    console.error('[OCR ERROR]:', err);
    alert('No se pudo extraer el texto de la boleta automáticamente (' + err.message + '). Podrás ingresar los datos manualmente.');
    showReceiptConfirmationModal({
      text: '',
      detectedTotal: 0,
      detectedVendor: 'Compra de Insumos',
      detectedItems: [],
      imageSource,
      defaultTarget
    });
  }
}

function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  let detectedTotal = 0;
  let detectedVendor = '';
  const detectedItems = [];

  if (lines.length > 0) {
    detectedVendor = lines[0].replace(/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñ&.-]/g, '').slice(0, 40);
  }

  const totalRegexes = [
    /total\s*[:$]?\s*([0-9.,]+)/i,
    /total\s*venta\s*[:$]?\s*([0-9.,]+)/i,
    /monto\s*total\s*[:$]?\s*([0-9.,]+)/i,
    /pagado\s*[:$]?\s*([0-9.,]+)/i,
    /\$\s*([0-9]{2,3}(?:\.[0-9]{3})+)/,
    /\$\s*([0-9]{4,8})/
  ];

  for (const line of lines) {
    for (const reg of totalRegexes) {
      const match = line.match(reg);
      if (match && match[1]) {
        const rawNum = match[1].replace(/\./g, '').replace(/,/g, '.');
        const num = parseFloat(rawNum);
        if (num > 0 && num > detectedTotal && num < 100000000) {
          detectedTotal = Math.round(num);
        }
      }
    }
  }

  lines.forEach(l => {
    if (l.length > 4 && !/total|subtotal|iva|rut|boleta|factura|fecha|hora|caja|vendedor/i.test(l)) {
      if (detectedItems.length < 6) {
        detectedItems.push(l.slice(0, 50));
      }
    }
  });

  return {
    text,
    detectedTotal,
    detectedVendor: detectedVendor || 'Compra Insumos Tatuaje',
    detectedItems
  };
}

function showReceiptConfirmationModal(data) {
  const existingItems = [...(inventoryData?.studioItems || []), ...(inventoryData?.personalItems || [])];

  openModal(`
    <p class="eyebrow">OCR COMPLETADO</p>
    <h2 id="modal-title">Confirmar Compra de Insumos</h2>

    <div class="receipt-preview-banner">
      <div class="receipt-thumb-wrap">
        <img src="${data.imageSource}" alt="Boleta escaneada" class="receipt-thumb-img" />
      </div>
      <div class="receipt-preview-summary">
        <p class="summary-label">Monto detectado por OCR:</p>
        <strong class="summary-total">${data.detectedTotal > 0 ? money(data.detectedTotal) : 'Ingresar monto'}</strong>
        <small class="summary-vendor">${data.detectedVendor || 'Ticket de compra'}</small>
      </div>
    </div>

    <form data-form="receipt-ocr-confirm">
      <label>Destino del inventario *
        <select name="targetInventory" id="ocr-target-inventory">
          <option value="studio" ${data.defaultTarget === 'studio' ? 'selected' : ''}>🏢 Inventario del Estudio (Compartido)</option>
          <option value="personal" ${data.defaultTarget === 'personal' ? 'selected' : ''}>🎨 Mi Inventario Personal</option>
        </select>
      </label>

      <label>Vincular a insumo existente (o crear uno nuevo)
        <select name="existingItemId" id="ocr-existing-item">
          <option value="">➕ Crear nuevo insumo con esta compra</option>
          ${existingItems.map(i => `
            <option value="${i.id}" data-cat="${i.category}" data-unit="${i.unit}" data-cost="${i.cost_price}">
              ${i.owner_user_id ? '🎨 [Personal] ' : '🏢 [Estudio] '} ${i.name} (Stock actual: ${i.quantity})
            </option>
          `).join('')}
        </select>
      </label>

      <label>Nombre / Descripción de la compra *
        <input name="itemName" required placeholder="Ej. Cartuchos Kwadron 03RL, Tintas Eternal..." value="${data.detectedItems[0] || data.detectedVendor || 'Compra de Insumos'}" />
      </label>

      <div class="grid two">
        <label>Categoría
          <select name="category">
            ${Object.entries(INVENTORY_CATEGORIES).map(([key, cat]) => `
              <option value="${key}">${cat.icon} ${cat.label}</option>
            `).join('')}
          </select>
        </label>

        <label>Unidad de medida
          <select name="unit">
            ${Object.entries(INVENTORY_UNITS).map(([key, label]) => `
              <option value="${key}">${label}</option>
            `).join('')}
          </select>
        </label>
      </div>

      <div class="grid two">
        <label>Cantidad comprada *
          <input type="number" name="quantity" min="0.01" step="any" required placeholder="1" value="1" />
        </label>

        <label>Monto total pagado ($) *
          <input type="number" name="totalAmount" min="0" step="any" required placeholder="0" value="${data.detectedTotal || 0}" />
        </label>
      </div>

      <label class="form-checkbox-label">
        <input type="checkbox" name="createExpense" value="true" checked />
        <span>Registrar automáticamente como <strong>Egreso en Billetera</strong></span>
      </label>

      <p class="form-error"></p>

      <div class="modal-actions">
        <button type="button" class="secondary" data-close-modal>Descartar</button>
        <button type="submit" class="primary">💾 Guardar en Inventario & Billetera</button>
      </div>
    </form>
  `);
}

function openModal(content) {
  modalContent.innerHTML = content;
  modal.hidden = false;
}

function closeModal() {
  stopCameraStream();
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
  const eligibleManagers = (members || []).filter((m) => m.role === 'owner' || m.role === 'admin' || m.role === 'resident');

  openModal(`
    <p class="eyebrow">EQUIPO & ARTISTAS</p>
    <h2 id="modal-title">Agregar artista o Guest</h2>
    <form data-form="member">
      <label>Nombre completo<input name="fullName" required placeholder="Ej. Alex Rivera" /></label>
      <label>Email<input name="email" type="email" required placeholder="alex@studio.com" /></label>
      
      <div class="form-grid">
        <label>Tipo de relación / Rol
          <select name="role" id="new-member-role">
            <option value="resident">Residente (permanente)</option>
            <option value="nomad" selected>Nómade / Guest (visitante)</option>
            <option value="admin">Administrador del estudio</option>
          </select>
        </label>
        <label>Modalidad de acuerdo
          <select name="agreementType" id="new-member-agreement-type">
            <option value="commission">Comisión por cita (%)</option>
            <option value="fixed_daily" selected>Pago fijo por día ($ / día)</option>
            <option value="fixed_monthly">Pago fijo mensual ($ / mes)</option>
          </select>
        </label>
      </div>

      <div class="form-grid">
        <label>Persona a cargo del Guest / Artista
          <select name="responsibleUserId">
            <option value="">Dueño / General del estudio</option>
            ${eligibleManagers.map((m) => `<option value="${m.id}">${m.full_name} (${ROLE_MAP[m.role]?.label || m.role})</option>`).join('')}
          </select>
        </label>
        <div style="display: flex; flex-direction: column; justify-content: center; padding-top: 6px;">
          <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; margin: 0;">
            <input type="checkbox" name="hasAppAccess" id="new-member-has-access" style="width: 18px; height: 18px; cursor: pointer;" />
            <span>Habilitar acceso a la plataforma (App)</span>
          </label>
          <span id="access-note" style="font-size: 11px; color: var(--muted); margin-top: 4px;">
            🔒 Desactivado para Guests por defecto. Queda registrado en el sistema sin acceso a la interfaz.
          </span>
        </div>
      </div>

      <div id="new-member-commission-field" style="display: none;">
        <label>Porcentaje para el artista (%)
          <input name="commissionPercent" type="number" min="0" max="100" step="0.5" value="70" />
          <span class="field-hint" style="font-size: 11.5px; color: var(--muted); margin-top: 4px; display: block;">El artista recibe el 70% del valor de la cita y el estudio el 30%.</span>
        </label>
      </div>

      <div id="new-member-fixed-field">
        <label id="new-member-fixed-label">Monto fijo por día (CLP)
          <input name="fixedAmount" type="number" min="0" step="1000" value="25000" />
          <span id="new-member-fixed-hint" class="field-hint" style="font-size: 11.5px; color: var(--muted); margin-top: 4px; display: block;">Tarifa diaria fija de arriendo de box. El artista conserva el 100% del valor de sus citas.</span>
        </label>
      </div>

      <details style="background: var(--surface-high); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 10px 14px; margin-top: 10px;">
        <summary style="font-size: 12.5px; font-weight: 700; cursor: pointer; color: var(--ink);">
          ⚙️ Automatizaciones & Guía de Onboarding para el Guest (Opcional)
        </summary>
        <div style="display: grid; gap: 10px; margin-top: 10px;">
          <label style="font-size: 12px;">Insumos incluidos en el arriendo
            <input name="suppliesIncluded" placeholder="Camilla, apoyabrazos, toallas, papel film, jabón, biológico..." />
          </label>
          <label style="font-size: 12px;">Instrucciones de pago / datos de transferencia
            <input name="paymentInstructions" placeholder="Transferir a Cta Cte Banco Estado..." />
          </label>
          <label style="font-size: 12px;">Cómo llegar al estudio (dirección, metro, referencias)
            <input name="arrivalInstructions" placeholder="Metro Los Leones, Salida B, Edificio Panorámico..." />
          </label>
          <label style="font-size: 12px;">Apertura, cierre y normas del estudio
            <input name="accessInstructions" placeholder="Horario 10:00 a 20:00 hrs. Retirar llave en recepción..." />
          </label>
        </div>
      </details>

      <button class="primary" type="submit" style="margin-top: 14px;">${icon('userCheck')} Incorporar al equipo</button>
      <p class="form-error"></p>
    </form>
  `);

  const roleSelect = document.querySelector('#new-member-role');
  const accessCheck = document.querySelector('#new-member-has-access');
  const accessNote = document.querySelector('#access-note');
  const agreeSelect = document.querySelector('#new-member-agreement-type');
  const commField = document.querySelector('#new-member-commission-field');
  const fixedField = document.querySelector('#new-member-fixed-field');
  const fixedLabel = document.querySelector('#new-member-fixed-label');
  const fixedHint = document.querySelector('#new-member-fixed-hint');

  roleSelect?.addEventListener('change', (e) => {
    if (e.target.value === 'nomad') {
      accessCheck.checked = false;
      accessNote.textContent = '🔒 Desactivado para Guests por defecto. Queda registrado en el sistema sin acceso a la interfaz.';
      agreeSelect.value = 'fixed_daily';
      commField.style.display = 'none';
      fixedField.style.display = 'block';
      if (fixedLabel?.firstChild) fixedLabel.firstChild.textContent = 'Monto fijo por día (CLP)';
    } else {
      accessCheck.checked = true;
      accessNote.textContent = '📱 Acceso completo a la plataforma Tatudin habilitado.';
      if (e.target.value === 'resident') {
        agreeSelect.value = 'commission';
        commField.style.display = 'block';
        fixedField.style.display = 'none';
      }
    }
  });

  agreeSelect?.addEventListener('change', (e) => {
    const type = e.target.value;
    if (type === 'commission') {
      commField.style.display = 'block';
      fixedField.style.display = 'none';
    } else if (type === 'fixed_daily') {
      commField.style.display = 'none';
      fixedField.style.display = 'block';
      if (fixedLabel?.firstChild) fixedLabel.firstChild.textContent = 'Monto fijo por día (CLP)';
      if (fixedHint) fixedHint.textContent = 'Tarifa diaria fija de arriendo de box para el guest. El artista conserva el 100% de sus citas.';
      const amtInput = fixedField.querySelector('input[name="fixedAmount"]');
      if (amtInput && (amtInput.value === '0' || amtInput.value === '250000')) amtInput.value = '25000';
    } else if (type === 'fixed_monthly') {
      commField.style.display = 'none';
      fixedField.style.display = 'block';
      if (fixedLabel?.firstChild) fixedLabel.firstChild.textContent = 'Monto fijo mensual (CLP)';
      if (fixedHint) fixedHint.textContent = 'Tarifa mensual fija de arriendo para el residente. El artista conserva el 100% de sus citas.';
      const amtInput = fixedField.querySelector('input[name="fixedAmount"]');
      if (amtInput && (amtInput.value === '0' || amtInput.value === '25000')) amtInput.value = '250000';
    }
  });
}

function editAgreementModal(membershipId, artistName, currentAgreementType = 'commission', currentCommission = 70, currentFixed = 0, currentHasAppAccess = true, currentResponsibleId = '') {
  const m = (members || []).find((mem) => String(mem.membership_id) === String(membershipId)) || {};
  const agreeType = currentAgreementType || m.agreement_type || 'commission';
  const comm = currentCommission !== undefined ? currentCommission : (m.commission_percent || 70);
  const fixed = currentFixed !== undefined ? currentFixed : (m.fixed_amount || 0);
  const hasAccess = currentHasAppAccess !== undefined ? Boolean(currentHasAppAccess) : (m.has_app_access !== false);
  const respId = currentResponsibleId || m.responsible_user_id || '';
  const eligibleManagers = (members || []).filter((mem) => mem.role === 'owner' || mem.role === 'admin' || mem.role === 'resident');

  openModal(`
    <p class="eyebrow">EQUIPO & ACUERDOS</p>
    <h2 id="modal-title">Acuerdo comercial con ${artistName}</h2>
    <p class="lead" style="margin-bottom: 16px;">Configura la modalidad de arriendo, persona a cargo y permisos de acceso:</p>
    <form data-form="edit-agreement" data-id="${membershipId}">
      <div class="form-grid">
        <label>Modalidad de acuerdo
          <select name="agreementType" id="edit-agreement-type">
            <option value="commission" ${agreeType === 'commission' ? 'selected' : ''}>Comisión por cita (%)</option>
            <option value="fixed_daily" ${agreeType === 'fixed_daily' ? 'selected' : ''}>Pago fijo por día ($ / día)</option>
            <option value="fixed_monthly" ${agreeType === 'fixed_monthly' ? 'selected' : ''}>Pago fijo mensual ($ / mes)</option>
          </select>
        </label>
        <label>Persona a cargo (Responsable)
          <select name="responsibleUserId">
            <option value="">Dueño / General del estudio</option>
            ${eligibleManagers.map((mgr) => `<option value="${mgr.id}" ${String(mgr.id) === String(respId) ? 'selected' : ''}>${mgr.full_name} (${ROLE_MAP[mgr.role]?.label || mgr.role})</option>`).join('')}
          </select>
        </label>
      </div>

      <div style="background: var(--surface-high); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 12px;">
        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; margin: 0;">
          <input type="checkbox" name="hasAppAccess" ${hasAccess ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" />
          <span>Habilitar acceso a la plataforma (App / Login)</span>
        </label>
        <span style="font-size: 11px; color: var(--muted); display: block; margin-top: 4px;">
          Si está desactivado, el artista queda registrado en el sistema pero no puede iniciar sesión en la interfaz.
        </span>
      </div>

      <div id="edit-commission-field" style="${agreeType === 'commission' ? 'display: block;' : 'display: none;'}">
        <label>Porcentaje para el artista (%)
          <input name="commissionPercent" type="number" min="0" max="100" step="0.5" value="${comm}" />
          <span class="field-hint" style="font-size: 11.5px; color: var(--muted); margin-top: 4px; display: block;">El artista recibe el ${comm}% de cada cita y el estudio el resto.</span>
        </label>
      </div>

      <div id="edit-fixed-field" style="${agreeType !== 'commission' ? 'display: block;' : 'display: none;'}">
        <label id="edit-fixed-label">Monto fijo (CLP)
          <input name="fixedAmount" type="number" min="0" step="1000" value="${fixed || (agreeType === 'fixed_monthly' ? 250000 : 25000)}" />
          <span id="edit-fixed-hint" class="field-hint" style="font-size: 11.5px; color: var(--muted); margin-top: 4px; display: block;">
            ${agreeType === 'fixed_monthly' ? 'Tarifa mensual fija de arriendo.' : 'Tarifa diaria fija de arriendo.'}
          </span>
        </label>
      </div>

      <details style="background: var(--surface-high); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 10px 14px; margin-top: 10px;">
        <summary style="font-size: 12.5px; font-weight: 700; cursor: pointer; color: var(--ink);">
          📋 Instrucciones de Onboarding y Guía de Guest
        </summary>
        <div style="display: grid; gap: 10px; margin-top: 10px;">
          <label style="font-size: 12px;">Insumos incluidos en el arriendo
            <input name="suppliesIncluded" value="${m.supplies_included || ''}" placeholder="Camilla, apoyabrazos, toallas, papel film..." />
          </label>
          <label style="font-size: 12px;">Instrucciones de pago / datos de transferencia
            <input name="paymentInstructions" value="${m.payment_instructions || ''}" placeholder="Transferir a Cta Cte..." />
          </label>
          <label style="font-size: 12px;">Cómo llegar al estudio (dirección, metro, referencias)
            <input name="arrivalInstructions" value="${m.arrival_instructions || ''}" placeholder="Dirección y referencias..." />
          </label>
          <label style="font-size: 12px;">Apertura, cierre y normas del estudio
            <input name="accessInstructions" value="${m.access_instructions || ''}" placeholder="Horarios de apertura y llaves..." />
          </label>
        </div>
      </details>

      <button class="primary" type="submit" style="margin-top: 14px;">${icon('check')} Guardar acuerdo y permisos</button>
      <p class="form-error"></p>
    </form>
  `);

  const agreeSelect = document.querySelector('#edit-agreement-type');
  const commField = document.querySelector('#edit-commission-field');
  const fixedField = document.querySelector('#edit-fixed-field');
  const fixedLabel = document.querySelector('#edit-fixed-label');
  const fixedHint = document.querySelector('#edit-fixed-hint');

  agreeSelect?.addEventListener('change', (e) => {
    const type = e.target.value;
    if (type === 'commission') {
      commField.style.display = 'block';
      fixedField.style.display = 'none';
    } else if (type === 'fixed_daily') {
      commField.style.display = 'none';
      fixedField.style.display = 'block';
      if (fixedLabel?.firstChild) fixedLabel.firstChild.textContent = 'Monto fijo por día (CLP)';
      if (fixedHint) fixedHint.textContent = 'Tarifa diaria fija de arriendo de box para el guest.';
    } else if (type === 'fixed_monthly') {
      commField.style.display = 'none';
      fixedField.style.display = 'block';
      if (fixedLabel?.firstChild) fixedLabel.firstChild.textContent = 'Monto fijo mensual (CLP)';
      if (fixedHint) fixedHint.textContent = 'Tarifa mensual fija de arriendo para el residente.';
    }
  });
}

async function openGuestGuideModal(membershipId) {
  openModal(`
    <p class="eyebrow">AUTOMATIZACIÓN & ONBOARDING</p>
    <h2 id="modal-title">Cargando guía de Guest...</h2>
    <p class="lead">Obteniendo información del estudio y acuerdo...</p>
  `);

  try {
    const guide = await api(`/api/members/${membershipId}/guest-guide`);
    openModal(`
      <p class="eyebrow">AUTOMATIZACIÓN & ONBOARDING DE GUEST</p>
      <h2 id="modal-title">Guía para ${guide.artist_name}</h2>
      <div style="background: var(--surface-high); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 16px; margin: 12px 0 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <strong style="font-size: 14px; color: var(--ink); display: block;">${guide.artist_name} (${guide.artist_email})</strong>
            <span style="font-size: 12px; color: var(--muted);">${guide.studio_name} · ${guide.agreement_text}</span>
          </div>
          <span class="badge" style="background: ${guide.has_app_access ? '#d1fae5' : '#f3f4f6'}; color: ${guide.has_app_access ? '#065f46' : '#4b5563'}; font-size: 11px;">
            ${guide.has_app_access ? '📱 Acceso App Habilitado' : '🔒 Sin acceso app (Solo registro)'}
          </span>
        </div>
      </div>

      <div class="guest-guide-sections" style="display: grid; gap: 12px; margin-bottom: 18px;">
        <div class="guide-item" style="border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 14px; background: var(--surface);">
          <strong style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink); margin-bottom: 4px;">
            📍 1. Cómo llegar al estudio
          </strong>
          <p style="font-size: 12px; color: var(--muted); margin: 0; line-height: 1.45;">${guide.arrival_info}</p>
        </div>

        <div class="guide-item" style="border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 14px; background: var(--surface);">
          <strong style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink); margin-bottom: 4px;">
            💼 2. Modalidad y forma de pago
          </strong>
          <p style="font-size: 12px; color: var(--muted); margin: 0; line-height: 1.45;">${guide.payment_info}</p>
        </div>

        <div class="guide-item" style="border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 14px; background: var(--surface);">
          <strong style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink); margin-bottom: 4px;">
            🧴 3. Insumos incluidos en el arriendo
          </strong>
          <p style="font-size: 12px; color: var(--muted); margin: 0; line-height: 1.45;">${guide.supplies_info}</p>
        </div>

        <div class="guide-item" style="border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 14px; background: var(--surface);">
          <strong style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink); margin-bottom: 4px;">
            🔐 4. Apertura y cierre del estudio
          </strong>
          <p style="font-size: 12px; color: var(--muted); margin: 0; line-height: 1.45;">${guide.access_info}</p>
        </div>

        <div class="guide-item" style="border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 14px; background: var(--surface);">
          <strong style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink); margin-bottom: 4px;">
            👤 5. Persona responsable del Guest
          </strong>
          <p style="font-size: 12px; color: var(--muted); margin: 0; line-height: 1.45;">
            <strong>${guide.responsible_name}</strong> (${guide.responsible_role}) ${guide.responsible_contact ? `· ${guide.responsible_contact}` : ''}
          </p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <button type="button" class="secondary" data-action="copy-guest-guide-text" data-text="${encodeURIComponent(guide.whatsapp_message)}">
          📋 Copiar Guía completa
        </button>
        <div style="display: flex; gap: 8px;">
          <a href="${guide.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="primary" style="background: #25D366; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-md); font-weight: 700; font-size: 13px;">
            ${icon('whatsapp')} Enviar por WhatsApp
          </a>
          <button type="button" class="secondary" data-close-modal>Cerrar</button>
        </div>
      </div>
    `);
  } catch (err) {
    openModal(`
      <p class="eyebrow">ERROR</p>
      <h2>No se pudo cargar la guía</h2>
      <p class="lead">${err.message}</p>
      <button class="secondary" data-close-modal>Cerrar</button>
    `);
  }
}

function editCommissionModal(membershipId, artistName, currentPercent) {
  return editAgreementModal(membershipId, artistName, 'commission', currentPercent, 0);
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

function exportFinancesCSV(artistSummary, transactions, overview = {}) {
  let csv = '=== RESUMEN FINANCIERO GENERAL ===\r\n';
  csv += `Ingresos Esperados (Proyección Citas),${overview.expected_income || 0}\r\n`;
  csv += `Abonos Cobrados,${overview.total_deposits || 0}\r\n`;
  csv += `Total Recaudado Efectivo,${overview.total_gross_income || 0}\r\n`;
  csv += `Comisiones Pagadas a Artistas,${overview.settled_commissions || 0}\r\n`;
  csv += `Comisiones Pendientes por Liquidar,${overview.total_pending || 0}\r\n`;
  csv += `Gastos Operacionales,${overview.operational_expenses || 0}\r\n`;
  csv += `Saldo Neto Disponible,${overview.net_balance || 0}\r\n`;
  csv += `Pérdidas Estimadas (Citas Canceladas),${overview.estimated_losses || 0}\r\n\r\n`;

  csv += '=== LIQUIDACIONES Y RENDIMIENTO POR ARTISTA ===\r\n';
  csv += 'Artista,Rol,% Comisión,Sesiones,Total Generado,Abonos,Valor Citas,Comisión Artista,Liquidado,Pendiente\r\n';
  (artistSummary || []).forEach((a) => {
    csv += `"${a.artist_name || ''}","${a.artist_role || ''}",${a.commission_percent || 70}%,${a.total_sessions || 0},${a.total_generated || 0},${a.total_deposits || 0},${a.total_expected || 0},${a.artist_payout || 0},${a.settled_amount || 0},${a.pending_settlement || 0}\r\n`;
  });
  csv += '\r\n=== HISTORIAL DE MOVIMIENTOS ===\r\n';
  csv += 'ID,Fecha,Tipo,Descripción,Monto,Artista\r\n';
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

async function userProfileModal() {
  const initials = ((currentUser?.full_name || currentUser?.fullName || 'TU').split(' ').map((p) => p[0]).slice(0, 2).join('')).toUpperCase();
  
  // Fetch active studio agreements for this artist account (if subscribed/guest in studios)
  const guestAgreements = await api('/api/my-guest-agreements').catch(() => []);

  openModal(`
    <div class="client-detail-header">
      <div class="initials large">${initials}</div>
      <div>
        <p class="eyebrow">MI CUENTA</p>
        <h2 id="modal-title">${currentUser?.full_name || currentUser?.fullName || 'Perfil de Usuario'}</h2>
        <p class="client-contact-lead">${currentUser?.email || ''} · ${ROLE_MAP[currentUser?.role]?.label || currentUser?.role || 'Miembro'}</p>
      </div>
    </div>

    <!-- Active Guest Agreements section if subscribed/registered -->
    ${guestAgreements.length > 0 ? `
      <div style="background: var(--surface-high); border: 1.5px solid var(--line-soft); border-radius: var(--radius-md); padding: 12px 14px; margin: 12px 0 16px;">
        <p class="eyebrow" style="margin-bottom: 6px; color: var(--ink);">💼 MIS PACTOS Y ACUERDOS CON ESTUDIOS</p>
        <div style="display: grid; gap: 10px;">
          ${guestAgreements.map((ag) => {
            let agreeBadge = '';
            if (ag.agreement_type === 'commission') {
              agreeBadge = `${ag.commission_percent}% Comisión (${100 - ag.commission_percent}% estudio)`;
            } else if (ag.agreement_type === 'fixed_daily') {
              agreeBadge = `Pago Fijo: ${money(ag.fixed_amount)} / día`;
            } else if (ag.agreement_type === 'fixed_monthly') {
              agreeBadge = `Pago Fijo: ${money(ag.fixed_amount)} / mes`;
            }

            return `
              <div style="background: var(--surface); border: 1px solid var(--line-soft); border-radius: var(--radius-md); padding: 10px 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <strong style="font-size: 13px; color: var(--ink);">${ag.studio_name}</strong>
                  <span class="badge" style="background: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 700;">
                    ${agreeBadge}
                  </span>
                </div>
                <div style="font-size: 11.5px; color: var(--muted); margin-top: 4px;">
                  Rol: <strong>${ROLE_MAP[ag.role]?.label || ag.role}</strong>
                  ${ag.responsible_name ? ` · Persona a cargo: <strong>${ag.responsible_name}</strong>` : ''}
                </div>
                ${ag.supplies_included ? `
                  <div style="font-size: 11px; color: var(--muted); margin-top: 4px; border-top: 1px dashed var(--line-soft); padding-top: 4px;">
                    🧴 Insumos incluidos: ${ag.supplies_included}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}

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

function openForgotPasswordModal() {
  openModal(`
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="text-align: center; margin-bottom: 8px;">
        <span style="font-size: 32px;">🔑</span>
        <h3 style="margin: 8px 0 4px 0; font-size: 18px;">Recuperar contraseña</h3>
        <p style="font-size: 13px; color: var(--muted); margin: 0;">Ingresa tu correo electrónico registrado y te enviaremos las instrucciones para restablecer tu clave.</p>
      </div>
      <form id="form-forgot-pass" style="display: flex; flex-direction: column; gap: 12px;">
        <label style="font-size: 13px; font-weight: 600;">Email
          <input type="email" name="email" placeholder="artist@studio.com" required style="margin-top: 4px;" />
        </label>
        <p id="forgot-pass-msg" style="font-size: 13px; margin: 0; min-height: 20px;"></p>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px;">
          <button type="button" class="secondary" data-action="close-modal">Cancelar</button>
          <button type="submit" class="primary">Enviar enlace</button>
        </div>
      </form>
    </div>
  `);

  const form = document.querySelector('#form-forgot-pass');
  const msg = document.querySelector('#forgot-pass-msg');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      try {
        const res = await api('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        msg.style.color = '#34d399';
        msg.textContent = res.message || 'Enlace enviado si el correo existe.';
        setTimeout(() => closeModal(), 3500);
      } catch (err) {
        msg.style.color = '#f87171';
        msg.textContent = err.message || 'Error al solicitar recuperación';
        btn.disabled = false;
        btn.textContent = 'Enviar enlace';
      }
    };
  }
}

function openResetPasswordModal(token) {
  openModal(`
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="text-align: center; margin-bottom: 8px;">
        <span style="font-size: 32px;">🔐</span>
        <h3 style="margin: 8px 0 4px 0; font-size: 18px;">Crea tu nueva contraseña</h3>
        <p style="font-size: 13px; color: var(--muted); margin: 0;">Ingresa tu nueva clave de acceso de al menos 8 caracteres.</p>
      </div>
      <form id="form-reset-pass" style="display: flex; flex-direction: column; gap: 12px;">
        <label style="font-size: 13px; font-weight: 600;">Nueva Contraseña
          <input type="password" name="newPassword" placeholder="Mínimo 8 caracteres" minlength="8" required style="margin-top: 4px;" />
        </label>
        <label style="font-size: 13px; font-weight: 600;">Confirmar Contraseña
          <input type="password" name="confirmPassword" placeholder="Repite tu nueva contraseña" minlength="8" required style="margin-top: 4px;" />
        </label>
        <p id="reset-pass-msg" style="font-size: 13px; margin: 0; min-height: 20px;"></p>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px;">
          <button type="submit" class="primary" style="width: 100%;">Restablecer Contraseña</button>
        </div>
      </form>
    </div>
  `);

  const form = document.querySelector('#form-reset-pass');
  const msg = document.querySelector('#reset-pass-msg');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const p1 = form.newPassword.value;
      const p2 = form.confirmPassword.value;
      if (p1 !== p2) {
        msg.style.color = '#f87171';
        msg.textContent = 'Las contraseñas no coinciden';
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Actualizando...';
      try {
        const res = await api('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, newPassword: p1 })
        });
        msg.style.color = '#34d399';
        msg.textContent = res.message || 'Contraseña actualizada.';
        setTimeout(() => {
          closeModal();
          window.location.hash = '';
          renderOnboarding(1, 'login');
        }, 2000);
      } catch (err) {
        msg.style.color = '#f87171';
        msg.textContent = err.message || 'Error al actualizar contraseña';
        btn.disabled = false;
        btn.textContent = 'Restablecer Contraseña';
      }
    };
  }
}

let activeSpeechTranscriber = null;

async function openVoiceTranscriptModal({ apptId, title, kind, catName, clientName }) {
  const decodedTitle = decodeURIComponent(title || 'Sesión');
  const decodedCatName = decodeURIComponent(catName || 'Compromiso');
  const decodedClientName = decodeURIComponent(clientName || '');
  const sessionKind = kind || 'custom';

  // Fetch past transcripts for this appointment
  let pastTranscripts = [];
  try {
    pastTranscripts = await api(`/api/appointments/${apptId}/transcripts`);
  } catch (e) {
    console.warn('Could not fetch past transcripts:', e);
  }

  const isSupported = Boolean(window.TatutinSpeech?.SpeechTranscriber?.isSupported?.());

  openModal(`
    <div class="voice-session-container">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
        <div>
          <p class="eyebrow">DICTADO & MINUTAS DE VOZ</p>
          <h2 id="modal-title" style="margin: 0 0 4px 0; font-size: 20px;">Apuntes: ${decodedTitle}</h2>
          <p style="font-size: 13px; color: var(--muted); margin: 0;">
            ${decodedCatName} ${decodedClientName ? `· Cliente: <strong>${decodedClientName}</strong>` : ''}
          </p>
        </div>
      </div>

      <!-- Live Recording Control Bar -->
      <div class="voice-recording-bar">
        <div class="voice-status-pill">
          <span class="voice-status-dot" id="voice-status-dot"></span>
          <span id="voice-status-label" style="font-size: 13px;">Listo para grabar</span>
        </div>

        <div class="voice-timer" id="voice-timer">00:00</div>

        <div class="voice-controls-group">
          ${isSupported ? `
            <button type="button" class="primary small-btn" id="btn-voice-start" style="background: #ef4444; border-color: #ef4444;">
              <span>🎙️ Iniciar Dictado</span>
            </button>
            <button type="button" class="secondary small-btn" id="btn-voice-pause" style="display: none;">
              <span>⏸️ Pausar</span>
            </button>
            <button type="button" class="secondary small-btn" id="btn-voice-stop" style="display: none; color: #dc2626;">
              <span>⏹️ Detener</span>
            </button>
          ` : `
            <span style="font-size: 12px; color: #f59e0b;">(Web Speech no soportado en este navegador; puedes escribir apuntes directamente)</span>
          `}
        </div>
      </div>

      <!-- Real-time Text Area -->
      <div class="transcript-textarea-wrap">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label style="font-size: 12px; font-weight: 700; color: var(--muted); margin: 0;">
            Texto de la Sesión / Minuta
          </label>
          <span class="interim-live-badge" id="interim-live-badge"></span>
        </div>
        <textarea id="voice-transcript-input" class="transcript-textarea" placeholder="Presiona 'Iniciar Dictado' y habla con naturalidad sobre el diseño, cambios, acuerdos o tareas... o escribe tus apuntes directamente aquí."></textarea>
      </div>

      <!-- Quick Actions Row -->
      <div class="voice-tools-row">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="secondary small-btn" id="btn-structure-notes" title="Formatear como minuta con temas, acuerdos y tareas">
            <span>⚡ Estructurar en Minuta</span>
          </button>
          <button type="button" class="secondary small-btn" id="btn-copy-transcript" title="Copiar texto al portapapeles">
            <span>📋 Copiar</span>
          </button>
          <button type="button" class="secondary small-btn" id="btn-clear-transcript" style="color: var(--muted);" title="Limpiar texto">
            <span>🗑️ Limpiar</span>
          </button>
        </div>

        <button type="button" class="primary small-btn" id="btn-save-transcript" style="font-weight: 700;">
          <span>💾 Guardar Apuntes</span>
        </button>
      </div>

      <!-- Past Transcripts History for this appointment -->
      <div style="margin-top: 14px; border-top: 1px solid var(--line-soft); padding-top: 14px;">
        <h3 style="font-size: 14px; margin: 0 0 10px 0; color: var(--ink);">📜 Historial de Apuntes de esta Cita</h3>
        <div id="past-transcripts-list">
          ${pastTranscripts.length > 0 ? pastTranscripts.map((t) => `
            <article class="transcript-history-card">
              <div class="transcript-history-header">
                <h4 class="transcript-history-title">${t.title || 'Apuntes de Sesión'}</h4>
                <span class="transcript-history-date">${new Date(t.created_at).toLocaleString('es-CL')} ${t.author_name ? `· Por ${t.author_name}` : ''}</span>
              </div>
              <div class="transcript-history-content">${t.structured_notes || t.raw_transcript}</div>
              <div style="display: flex; justify-content: flex-end; gap: 6px; margin-top: 4px;">
                <button type="button" class="secondary small" data-action="load-past-transcript" data-content="${encodeURIComponent(t.structured_notes || t.raw_transcript)}">Cargar en editor</button>
                <button type="button" class="secondary small" data-action="delete-past-transcript" data-id="${t.id}" style="color: #dc2626;">Eliminar</button>
              </div>
            </article>
          `).join('') : '<p style="font-size: 13px; color: var(--muted); margin: 0;">No hay apuntes o minutas guardadas previamente para este compromiso.</p>'}
        </div>
      </div>
    </div>
  `);

  const textarea = document.querySelector('#voice-transcript-input');
  const interimBadge = document.querySelector('#interim-live-badge');
  const statusDot = document.querySelector('#voice-status-dot');
  const statusLabel = document.querySelector('#voice-status-label');
  const timerEl = document.querySelector('#voice-timer');
  const btnStart = document.querySelector('#btn-voice-start');
  const btnPause = document.querySelector('#btn-voice-pause');
  const btnStop = document.querySelector('#btn-voice-stop');

  // Initialize Speech Transcriber instance
  if (isSupported && window.TatutinSpeech?.SpeechTranscriber) {
    if (activeSpeechTranscriber) {
      activeSpeechTranscriber.stop();
    }
    activeSpeechTranscriber = new window.TatutinSpeech.SpeechTranscriber();

    btnStart?.addEventListener('click', () => {
      activeSpeechTranscriber.start({
        initialText: textarea.value,
        onResult: (finalText) => {
          textarea.value = finalText;
          if (interimBadge) interimBadge.textContent = '';
        },
        onInterim: (interimText) => {
          if (interimBadge) interimBadge.textContent = interimText ? `Escuchando: "${interimText}..."` : '';
        },
        onTimerTick: (secs, formatted) => {
          if (timerEl) timerEl.textContent = formatted;
        },
        onStatusChange: (status) => {
          if (status === 'recording') {
            statusDot.className = 'voice-status-dot active';
            statusLabel.textContent = '🔴 Grabando / Dictando...';
            btnStart.style.display = 'none';
            btnPause.style.display = 'inline-flex';
            btnStop.style.display = 'inline-flex';
          } else if (status === 'paused') {
            statusDot.className = 'voice-status-dot paused';
            statusLabel.textContent = '⏸️ En pausa';
            btnPause.textContent = '▶️ Reanudar';
          } else {
            statusDot.className = 'voice-status-dot';
            statusLabel.textContent = 'Listo para grabar';
            btnStart.style.display = 'inline-flex';
            btnPause.style.display = 'none';
            btnStop.style.display = 'none';
            btnPause.textContent = '⏸️ Pausar';
            if (interimBadge) interimBadge.textContent = '';
          }
        },
        onError: (err) => {
          statusLabel.textContent = `Aviso: ${err}`;
        }
      });
    });

    btnPause?.addEventListener('click', () => {
      if (activeSpeechTranscriber.isPaused) {
        activeSpeechTranscriber.resume();
      } else {
        activeSpeechTranscriber.pause();
      }
    });

    btnStop?.addEventListener('click', () => {
      activeSpeechTranscriber.stop();
    });
  }

  // Structuring button
  document.querySelector('#btn-structure-notes')?.addEventListener('click', () => {
    const raw = textarea.value.trim();
    if (!raw) return;
    const structured = window.TatutinSpeech?.structureMeetingTranscript
      ? window.TatutinSpeech.structureMeetingTranscript(raw, sessionKind)
      : raw;
    textarea.value = structured;
  });

  // Copy button
  document.querySelector('#btn-copy-transcript')?.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.querySelector('#btn-copy-transcript');
      if (btn) {
        const prev = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copiado</span>';
        setTimeout(() => { btn.innerHTML = prev; }, 2000);
      }
    } catch (e) {
      alert('Texto copiado');
    }
  });

  // Clear button
  document.querySelector('#btn-clear-transcript')?.addEventListener('click', () => {
    if (confirm('¿Limpiar el texto actual?')) {
      textarea.value = '';
      if (activeSpeechTranscriber) activeSpeechTranscriber.setText('');
    }
  });

  // Save button
  document.querySelector('#btn-save-transcript')?.addEventListener('click', async () => {
    const content = textarea.value.trim();
    if (!content) {
      alert('Por favor ingresa o dicta apuntes antes de guardar.');
      return;
    }

    if (activeSpeechTranscriber?.isRecording) {
      activeSpeechTranscriber.stop();
    }

    const saveBtn = document.querySelector('#btn-save-transcript');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    try {
      await api(`/api/appointments/${apptId}/transcripts`, {
        method: 'POST',
        body: JSON.stringify({
          title: `Minuta de ${decodedTitle}`,
          rawTranscript: content,
          structuredNotes: content,
          durationSeconds: activeSpeechTranscriber?.elapsedSeconds || 0,
          sessionKind
        })
      });

      // Update past transcripts UI
      openVoiceTranscriptModal({ apptId, title, kind, catName, clientName });
    } catch (err) {
      alert('Error al guardar apuntes: ' + err.message);
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 Guardar Apuntes';
    }
  });

  // Past transcripts action handlers
  document.querySelectorAll('[data-action="load-past-transcript"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pastContent = decodeURIComponent(btn.dataset.content || '');
      textarea.value = pastContent;
      if (activeSpeechTranscriber) activeSpeechTranscriber.setText(pastContent);
    });
  });

  document.querySelectorAll('[data-action="delete-past-transcript"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const transcriptId = btn.dataset.id;
      if (confirm('¿Eliminar este apunte guardado?')) {
        await api(`/api/transcripts/${transcriptId}`, { method: 'DELETE' });
        openVoiceTranscriptModal({ apptId, title, kind, catName, clientName });
      }
    });
  });
}

// Global Event Listeners
document.addEventListener('click', async (event) => {
  const voiceBtn = event.target.closest('[data-action="open-voice-modal"]');
  if (voiceBtn) {
    const { apptId, title, kind, catName, clientName } = voiceBtn.dataset;
    return openVoiceTranscriptModal({
      apptId,
      title,
      kind,
      catName,
      clientName
    });
  }
  const forgotBtn = event.target.closest('[data-action="open-forgot-password"]');
  if (forgotBtn) {
    return openForgotPasswordModal();
  }
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

  // Backoffice toggle feature microsite
  const toggleMicrositeBtn = event.target.closest('[data-action="toggle-feature-microsite"]');
  if (toggleMicrositeBtn) {
    const currentState = toggleMicrositeBtn.dataset.currentState === 'true';
    const newState = !currentState;
    try {
      await api('/api/backoffice/features', {
        method: 'PATCH',
        body: JSON.stringify({ feature_microsite_enabled: newState })
      });
      alert(newState ? '¡Pequeño sitio web activado exitosamente!' : '¡Pequeño sitio web desactivado temporalmente!');
      return await renderBackoffice('stats');
    } catch (err) {
      alert('Error al actualizar estado del sitio web: ' + err.message);
    }
    return;
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

  // Open Guest Guide Modal
  const guestGuideBtn = event.target.closest('[data-action="open-guest-guide"]');
  if (guestGuideBtn) {
    return openGuestGuideModal(guestGuideBtn.dataset.membershipId);
  }

  // Copy Guest Guide Text
  const copyGuideBtn = event.target.closest('[data-action="copy-guest-guide-text"]');
  if (copyGuideBtn) {
    const text = decodeURIComponent(copyGuideBtn.dataset.text || '');
    navigator.clipboard?.writeText(text);
    const orig = copyGuideBtn.innerHTML;
    copyGuideBtn.innerHTML = '✓ ¡Copiado!';
    setTimeout(() => { copyGuideBtn.innerHTML = orig; }, 2000);
    return;
  }

  // Edit agreement & commission
  const editAgreeBtn = event.target.closest('[data-action="edit-agreement"], [data-action="edit-commission"]');
  if (editAgreeBtn) {
    const { membershipId, artistName, agreementType, commission, fixedAmount, hasAppAccess, responsibleId } = editAgreeBtn.dataset;
    return editAgreementModal(
      membershipId,
      artistName,
      agreementType || 'commission',
      Number(commission || 70),
      Number(fixedAmount || 0),
      hasAppAccess !== 'false',
      responsibleId || ''
    );
  }

  // Export CSV
  if (event.target.closest('[data-action="export-finances-csv"]')) {
    const [txs, sum, overview] = await Promise.all([
      api('/api/transactions').catch(() => []),
      api('/api/finances/summary').catch(() => []),
      api('/api/finances/overview').catch(() => ({}))
    ]);
    return exportFinancesCSV(sum, txs, overview);
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

  // Mobile drawer actions
  if (event.target.closest('[data-action="toggle-mobile-drawer"]')) {
    event.preventDefault();
    toggleMobileDrawer();
    return;
  }
  if (event.target.closest('[data-action="close-mobile-drawer"]')) {
    event.preventDefault();
    closeMobileDrawer();
    return;
  }
  if (event.target.closest('[data-action="open-mobile-drawer"]')) {
    event.preventDefault();
    openMobileDrawer();
    return;
  }

  // Copy template text
  const copyTextBtn = event.target.closest('[data-copy-text]');
  if (copyTextBtn) {
    const textToCopy = copyTextBtn.dataset.copyText;
    navigator.clipboard?.writeText(textToCopy);
    alert(`Texto copiado al portapapeles:\n\n"${textToCopy}"`);
    return;
  }

  // Toggle GCal sync simulation
  if (event.target.closest('[data-action="toggle-gcal-sync"]')) {
    alert('Sincronización con Google Calendar actualizada.');
    return;
  }

  // Connect iCal simulation
  if (event.target.closest('[data-action="connect-ical"]')) {
    const icalUrl = `webcal://${window.location.host}/api/public/calendar/${activeStudio?.id || 1}.ics`;
    navigator.clipboard?.writeText(icalUrl);
    alert(`URL de suscripción Apple Calendar copiada:\n\n${icalUrl}`);
    return;
  }

  // Test consent form modal
  if (event.target.closest('[data-action="test-consent-form"]')) {
    openModal(`
      <div class="client-detail-header">
        <div class="initials large">📋</div>
        <div>
          <p class="eyebrow">CONSENTIMIENTO INFORMADO</p>
          <h2>Cuestionario de Salud</h2>
          <p class="client-contact-lead">Verificación previa al procedimiento</p>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
        <label style="display: flex; gap: 10px; align-items: center; font-size: 13.5px;">
          <input type="checkbox" checked /> No tengo alergias conocidas a tintas ni látex
        </label>
        <label style="display: flex; gap: 10px; align-items: center; font-size: 13.5px;">
          <input type="checkbox" checked /> No consumo medicamentos anticoagulantes
        </label>
        <label style="display: flex; gap: 10px; align-items: center; font-size: 13.5px;">
          <input type="checkbox" checked /> No presento infecciones cutáneas en la zona
        </label>
        <label style="display: flex; gap: 10px; align-items: center; font-size: 13.5px;">
          <input type="checkbox" checked /> Declaro ser mayor de edad y aceptar el diseño
        </label>
        <button class="primary" data-close-modal style="margin-top: 10px;">Comprendido</button>
      </div>
    `);
    return;
  }

  // Views navigation
  const viewLink = event.target.closest('[data-view]');
  if (viewLink) {
    event.preventDefault();
    closeMobileDrawer();
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
  if (event.target.closest('[data-action="open-agenda-filter-modal"]')) return openAgendaFilterModal();
  if (event.target.closest('[data-close-modal]') || event.target === modal) return closeModal();

  // Calendar View mode toggle (week / month)
  const calViewBtn = event.target.closest('[data-cal-view]');
  if (calViewBtn) {
    agendaFilter.viewMode = calViewBtn.dataset.calView;
    agendaFilter.date = null;
    return await renderAgenda();
  }

  // Calendar Navigation controls
  if (event.target.closest('[data-action="cal-prev"]')) {
    if (agendaFilter.viewMode === 'month') {
      agendaFilter.currentDate = new Date(agendaFilter.currentDate.getFullYear(), agendaFilter.currentDate.getMonth() - 1, 1);
    } else {
      const d = new Date(agendaFilter.currentDate);
      d.setDate(d.getDate() - 7);
      agendaFilter.currentDate = d;
    }
    agendaFilter.date = null;
    return await renderAgenda();
  }
  if (event.target.closest('[data-action="cal-next"]')) {
    if (agendaFilter.viewMode === 'month') {
      agendaFilter.currentDate = new Date(agendaFilter.currentDate.getFullYear(), agendaFilter.currentDate.getMonth() + 1, 1);
    } else {
      const d = new Date(agendaFilter.currentDate);
      d.setDate(d.getDate() + 7);
      agendaFilter.currentDate = d;
    }
    agendaFilter.date = null;
    return await renderAgenda();
  }
  if (event.target.closest('[data-action="cal-today"]')) {
    agendaFilter.currentDate = new Date();
    agendaFilter.date = formatDateISO(new Date());
    return await renderAgenda();
  }

  // Category filter in agenda (if any legacy trigger is used)
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
  if (event.target.closest('[data-clear-all-filters]')) {
    agendaFilter.artistId = 'all';
    agendaFilter.spaceId = 'all';
    agendaFilter.categoryId = 'all';
    agendaFilter.status = 'all';
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

  // Open Appointment Outcome Modal (3 options: Listo / Efectuada, Reprogramada, Cancelada / No llegó)
  const outcomeBtn = event.target.closest('[data-action="open-outcome-modal"]');
  if (outcomeBtn) {
    const { apptId, clientName, title, startsAt, price, deposit, status } = outcomeBtn.dataset;
    return openAppointmentOutcomeModal({
      id: apptId,
      client_name: clientName,
      title,
      starts_at: startsAt,
      price: Number(price),
      deposit: Number(deposit),
      status
    });
  }

  // Complete appointment fallback
  const completeBtn = event.target.closest('[data-status-id]');
  if (completeBtn) {
    await api(`/api/appointments/${completeBtn.dataset.statusId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' })
    });
    const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'agenda';
    return await render(currentActiveView);
  }
  // Inventory & Finances receipt action buttons
  if (event.target.closest('[data-action="open-upload-screenshot"]')) {
    return openUploadScreenshotModal(inventoryCurrentTab === 'personal' ? 'personal' : 'studio');
  }
  if (event.target.closest('[data-action="open-receipt-scanner"]')) {
    return openReceiptScannerModal(inventoryCurrentTab === 'personal' ? 'personal' : 'studio');
  }
  if (event.target.closest('[data-action="open-new-item-modal"]')) {
    return openItemModal(null, inventoryCurrentTab === 'personal');
  }
  if (event.target.closest('[data-action="open-new-movement-modal"]')) {
    return openMovementModal(null, 'consumption');
  }

  // Inventory tab switcher
  const invTabBtn = event.target.closest('[data-inv-tab]');
  if (invTabBtn) {
    inventoryCurrentTab = invTabBtn.dataset.invTab;
    return renderInventory();
  }

  // Inventory category filter
  const invCatBtn = event.target.closest('[data-inv-cat-filter]');
  if (invCatBtn) {
    inventoryCategoryFilter = invCatBtn.dataset.invCatFilter;
    return renderInventory();
  }

  // Quick item action buttons
  const consumeBtn = event.target.closest('[data-action="consume-item"]');
  if (consumeBtn) {
    return openMovementModal(consumeBtn.dataset.id, 'consumption');
  }
  const sellBtn = event.target.closest('[data-action="sell-item"]');
  if (sellBtn) {
    return openMovementModal(sellBtn.dataset.id, 'sale_external');
  }
  const transferBtn = event.target.closest('[data-action="transfer-item"]');
  if (transferBtn) {
    return openMovementModal(transferBtn.dataset.id, 'transfer_internal');
  }
  const editItemBtn = event.target.closest('[data-action="edit-item"]');
  if (editItemBtn) {
    const allItems = [...(inventoryData?.studioItems || []), ...(inventoryData?.personalItems || [])];
    const targetItem = allItems.find((i) => Number(i.id) === Number(editItemBtn.dataset.id));
    if (targetItem) return openItemModal(targetItem, Boolean(targetItem.owner_user_id));
  }
  const deleteItemBtn = event.target.closest('[data-action="delete-item"]');
  if (deleteItemBtn) {
    if (confirm(`¿Estás seguro de que deseas eliminar el insumo "${deleteItemBtn.dataset.name}"?`)) {
      await api(`/api/inventory/items/${deleteItemBtn.dataset.id}`, { method: 'DELETE' });
      return renderInventory();
    }
    return;
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
      const hasAppAccess = Boolean(form.querySelector('[name="hasAppAccess"]')?.checked);
      await api('/api/members', {
        method: 'POST',
        body: JSON.stringify({
          fullName: body.fullName,
          email: body.email,
          role: body.role,
          agreementType: body.agreementType || 'commission',
          commissionPercent: Number(body.commissionPercent || 70),
          fixedAmount: Number(body.fixedAmount || 0),
          hasAppAccess,
          responsibleUserId: body.responsibleUserId ? Number(body.responsibleUserId) : null,
          suppliesIncluded: body.suppliesIncluded || '',
          paymentInstructions: body.paymentInstructions || '',
          arrivalInstructions: body.arrivalInstructions || '',
          accessInstructions: body.accessInstructions || ''
        })
      });
      members = await api('/api/members').catch(() => []);
      closeModal();
      const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'ajustes';
      return await render(currentActiveView);
    }
    if (form.dataset.form === 'edit-agreement' || form.dataset.form === 'edit-commission') {
      const hasAppAccess = Boolean(form.querySelector('[name="hasAppAccess"]')?.checked);
      await api(`/api/members/${form.dataset.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          agreementType: body.agreementType || 'commission',
          commissionPercent: Number(body.commissionPercent || 70),
          fixedAmount: Number(body.fixedAmount || 0),
          hasAppAccess,
          responsibleUserId: body.responsibleUserId ? Number(body.responsibleUserId) : null,
          suppliesIncluded: body.suppliesIncluded !== undefined ? body.suppliesIncluded : '',
          paymentInstructions: body.paymentInstructions !== undefined ? body.paymentInstructions : '',
          arrivalInstructions: body.arrivalInstructions !== undefined ? body.arrivalInstructions : '',
          accessInstructions: body.accessInstructions !== undefined ? body.accessInstructions : ''
        })
      });
      members = await api('/api/members').catch(() => []);
      closeModal();
      const currentActiveView = document.querySelector('.mobile-nav a.active, .sidebar nav a.active')?.dataset.view || 'ajustes';
      return await render(currentActiveView);
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
    if (form.dataset.form === 'inventory-item') {
      const isPersonal = Boolean(form.querySelector('[name="isPersonal"]')?.checked);
      await api('/api/inventory/items', {
        method: 'POST',
        body: JSON.stringify({
          id: body.id ? Number(body.id) : null,
          name: body.name,
          category: body.category,
          unit: body.unit,
          quantity: Number(body.quantity) || 0,
          minStockAlert: Number(body.minStockAlert) || 0,
          costPrice: Number(body.costPrice) || 0,
          salePrice: Number(body.salePrice) || 0,
          sku: body.sku,
          isPersonal
        })
      });
      closeModal();
      return await renderInventory();
    }
    if (form.dataset.form === 'inventory-movement') {
      const createFinancialRecord = Boolean(form.querySelector('[name="createFinancialRecord"]')?.checked);
      await api('/api/inventory/movements', {
        method: 'POST',
        body: JSON.stringify({
          itemId: Number(body.itemId),
          movementType: body.movementType,
          quantity: Number(body.quantity),
          totalAmount: Number(body.totalAmount) || 0,
          toUserId: body.toUserId ? Number(body.toUserId) : null,
          notes: body.notes || '',
          createFinancialRecord
        })
      });
      closeModal();
      return await renderInventory();
    }
    if (form.dataset.form === 'receipt-ocr-confirm') {
      const existingItemId = body.existingItemId ? Number(body.existingItemId) : null;
      let targetItemId = existingItemId;
      const isPersonal = body.targetInventory === 'personal';
      const qty = Number(body.quantity) || 1;
      const totalAmount = Number(body.totalAmount) || 0;
      const unitPrice = qty > 0 ? Math.round(totalAmount / qty) : totalAmount;

      if (!targetItemId) {
        const newItemRes = await api('/api/inventory/items', {
          method: 'POST',
          body: JSON.stringify({
            name: body.itemName,
            category: body.category,
            unit: body.unit,
            quantity: 0,
            costPrice: unitPrice,
            salePrice: Math.round(unitPrice * 1.3),
            isPersonal
          })
        });
        targetItemId = newItemRes.item.id;
      }

      const createExpense = Boolean(form.querySelector('[name="createExpense"]')?.checked);
      await api('/api/inventory/movements', {
        method: 'POST',
        body: JSON.stringify({
          itemId: targetItemId,
          movementType: 'purchase',
          quantity: qty,
          unitPrice: unitPrice,
          totalAmount: totalAmount,
          notes: 'Compra procesada con OCR de Boleta',
          createFinancialRecord: createExpense
        })
      });

      closeModal();
      alert('¡Compra de insumo registrada con éxito en Inventario' + (createExpense ? ' y Billetera!' : '!'));
      return await render('inventario');
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

// Global ESC listener to close modal and mobile drawer
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeMobileDrawer();
  }
});

// ---------------- DYNAMIC SPIRAL FAVICON FADE ANIMATION ----------------
function initDynamicFavicon() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let iconLink = document.querySelector('link[rel="icon"][type="image/png"]') || document.querySelector('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }

    const imgBlue = new Image();
    const imgGrey = new Image();
    let loadedCount = 0;

    const onLoaded = () => {
      loadedCount++;
      if (loadedCount < 2) return;

      const totalSteps = 40; // Smooth 3.2s loop
      let currentStep = 0;

      setInterval(() => {
        currentStep = (currentStep + 1) % totalSteps;
        // Sinusoidal easing between 0 (blue) and 1 (grey)
        const t = currentStep / totalSteps;
        const alpha = 0.5 * (1 + Math.sin(t * 2 * Math.PI - Math.PI / 2));

        ctx.clearRect(0, 0, 64, 64);
        ctx.globalAlpha = 1 - alpha;
        ctx.drawImage(imgBlue, 0, 0, 64, 64);
        ctx.globalAlpha = alpha;
        ctx.drawImage(imgGrey, 0, 0, 64, 64);

        iconLink.href = canvas.toDataURL('image/png');
      }, 80);
    };

    imgBlue.crossOrigin = 'anonymous';
    imgGrey.crossOrigin = 'anonymous';
    imgBlue.onload = onLoaded;
    imgGrey.onload = onLoaded;
    imgBlue.src = '/favicon-blue-64.png';
    imgGrey.src = '/favicon-grey-64.png';
  } catch (err) {
    console.debug('[Favicon] Native SVG/GIF fallback active');
  }
}

// Initialize dynamic animated favicon
initDynamicFavicon();

function checkUrlHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#reset-password')) {
    const params = new URLSearchParams(hash.replace('#reset-password?', ''));
    const token = params.get('token');
    if (token) {
      hideSplash();
      renderOnboarding(1, 'login');
      openResetPasswordModal(token);
      return true;
    }
  }
  return false;
}

window.addEventListener('hashchange', checkUrlHash);

// Service Worker message listener for Background Sync
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'TRIGGER_OFFLINE_SYNC' && window.TatutinOffline?.syncPendingOfflineRequests) {
      window.TatutinOffline.syncPendingOfflineRequests(api);
    }
  });
}

// Global Clipboard Paste Listener (Ctrl+V screenshot / photo recognition)
document.addEventListener('paste', (event) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type && items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      if (file) {
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
          stopCameraStream();
          processReceiptWithOcr(e.target.result, inventoryCurrentTab === 'personal' ? 'personal' : 'studio');
        };
        reader.readAsDataURL(file);
      }
      break;
    }
  }
});

// Initialize persisted custom theme immediately
loadPersistedTheme();

// Session verification and bootstrap
if (!checkUrlHash()) {
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
}

