# Tatudin — Documento de Contexto del Proyecto

> **Propósito:** Este documento describe el producto, la arquitectura Node.js/PostgreSQL y el plan incremental para continuar el desarrollo de Tatudin sin perder el contexto funcional ni visual.

---

## 1. ¿Qué es Tatudin?

Aplicación segura de gestión de **agenda, espacios y finanzas para tatuadores y estudios**. Tatudin permite que un estudio organice a sus residentes, reciba artistas nómades, arriende espacios y asigne agendas sin mezclar datos entre organizaciones.

**Insight de marca:** *"Quieren tatuar, no gestionar."*
**Voz:** mentor cercano, amigo creativo. Nunca corporativo ni frío.

**Referencias visuales:** los mockups de `stitch_*` y los documentos `DESIGN.md` definen la línea `Operational Calm`. En el repositorio actual, `public/` contiene la interfaz ejecutable y no se debe depender de rutas locales de otra máquina.

---

## 2. Modelo de negocio y usuarios

Tatudin es una aplicación segura con autenticación para organizar la operación de estudios y artistas de tatuaje. Un estudio no es solamente un perfil: es un espacio de trabajo que agrupa personas, administra recursos y decide cómo se agenda y se paga cada colaboración.

### Tipos de usuario y relación con el estudio

| Concepto | Definición | Gestión principal |
|---|---|---|
| Usuario estudio | Cuenta con permisos para operar uno o más estudios. | Configuración del estudio, equipo, espacios, agendas, clientes y finanzas. |
| Residente | Artista asociado permanentemente a un estudio. | Agenda estable, disponibilidad, citas asignadas y liquidación según el acuerdo permanente. |
| Nómade | Artista que visita un estudio por períodos o jornadas puntuales. | Solicitud o reserva de espacio, agenda temporal y pago según arriendo o acuerdo de visita. |

Una persona puede estar vinculada a más de un estudio. Cada vínculo debe registrar el estudio, tipo de relación (`residente` o `nomade`), estado, fechas de vigencia, permisos y condiciones de pago. La identidad, autenticación y datos personales pertenecen al usuario; la agenda, el espacio y la liquidación pertenecen al vínculo con el estudio.

### Operación del estudio

1. El usuario inicia sesión y selecciona el estudio que administrará o en el que trabajará.
2. El estudio configura sus espacios, horarios, reglas de disponibilidad y condiciones económicas.
3. Los residentes se incorporan como equipo permanente.
4. Los nómades solicitan o reciben una reserva de espacio para un período concreto.
5. El usuario estudio crea citas en el calendario y asigna cada agenda al artista correspondiente.
6. El sistema conserva la relación entre cita, artista, estudio, espacio y condición de pago para facilitar la liquidación.

### Agendas y calendarios

Los usuarios estudio disponen de calendarios operativos para:

- visualizar la disponibilidad del estudio, sus espacios y sus artistas;
- crear, mover y cancelar citas;
- asignar una cita a un residente o a un nómade;
- evitar conflictos de horario, artista y espacio;
- distinguir la condición de pago aplicable a cada asignación;
- consultar la agenda personal de cada artista sin mezclarla con la de otros estudios.

El calendario debe tratar al espacio como un recurso reservable. Una cita de un nómade solo puede confirmarse cuando existe disponibilidad del espacio y el período de visita está vigente.

### Seguridad mínima esperada

- Contraseñas almacenadas únicamente como hashes seguros.
- Sesiones autenticadas con expiración y cierre de sesión.
- Autorización por estudio y por rol, no solo por autenticación global.
- Separación de datos entre estudios, especialmente clientes, agendas y finanzas.
- Validación de disponibilidad y permisos en el servidor, además de los controles de interfaz.
- Registro de cambios relevantes en citas, membresías, reservas y condiciones de pago.

## 3. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Lenguaje backend | Node.js 22+ (ES modules) |
| Framework HTTP | Express 5 |
| Base de datos | PostgreSQL 16 |
| Acceso a datos | `pg` con consultas parametrizadas |
| Frontend | Vanilla HTML + CSS + JavaScript |
| Iconos | [Lucide Icons](https://lucide.dev) via CDN (`unpkg.com/lucide@latest`) |
| Tipografía | Plus Jakarta Sans + Caveat Brush (Google Fonts) |
| PWA | `manifest.json` + Service Worker (`sw.js`) |
| Desarrollo local | `npm run dev` |
| Producción local | `npm start` |
| Contenedores | Docker Compose (`app` + `db`) |

---

## 4. Arquitectura del Proyecto

```
tatudin/
├── database/
│   └── init.sql                   # Esquema y datos demo de PostgreSQL
├── public/
│   ├── index.html                 # Shell de la PWA
│   ├── app.js                     # Cliente: dashboard, agenda, clientes y finanzas
│   ├── styles.css                 # Estilos de la aplicación
│   ├── manifest.webmanifest       # Metadatos de instalación PWA
│   └── sw.js                      # Service worker
├── src/
│   └── server.js                  # Express, pool pg, APIs y archivos estáticos
├── stitch_*/                     # Mockups de referencia visual, sin ejecutar
├── Dockerfile
├── docker-compose.yml             # Servicios app y db
└── package.json                   # Scripts y dependencias Node.js
```

### Arquitectura objetivo ágil

El MVP mantiene un monolito modular: Express sirve la PWA y las APIs; PostgreSQL es la fuente de verdad; Docker Compose reproduce el entorno completo. Para avanzar rápido, cada módulo debe conservar tres límites simples: rutas HTTP, consultas/repositorios y componentes de interfaz. Se evitarán microservicios hasta que exista una necesidad operativa real.

---

## 5. API HTTP actual y objetivo

| Método | Ruta | Estado | Acción |
|---|---|---|---|
| GET | `/` | Implementada | Shell de la PWA |
| GET | `/api/health` | Implementada | Estado de PostgreSQL |
| POST | `/api/auth/register` | Implementada | Registro seguro con hash scrypt y creación de estudio/membresía |
| POST | `/api/auth/login` | Implementada | Inicio de sesión con cookie HTTP-only `tatudin_session` |
| POST | `/api/auth/logout` | Implementada | Cierre de sesión y revocación en base de datos |
| GET | `/api/auth/me` | Implementada | Obtener usuario, rol y estudio activo autenticado |
| GET/PUT | `/api/onboarding` | Implementada | Lectura y actualización de perfil de onboarding |
| GET | `/api/dashboard` | Implementada | Agenda próxima y métricas del estudio activo |
| GET/POST/PATCH | `/api/appointments` | Implementadas | Listar, crear y actualizar estado de citas (aislado por estudio) |
| GET/POST | `/api/clients` | Implementadas | Buscar/listar y crear clientes (aislado por estudio) |
| GET/POST | `/api/transactions` | Implementadas | Listar y registrar ingresos/gastos (aislado por estudio) |
| POST | `/api/auth/recover-password` | Objetivo | Recuperación de contraseña por email |
| GET/PATCH | `/api/studios/:studioId` | Objetivo | Configuración y cambio de perfil de estudio |
| GET/POST | `/api/studios/:studioId/members` | Objetivo | Invitar y gestionar miembros (residentes / nómades) |
| GET/POST | `/api/spaces` | Objetivo | Gestión de espacios arrendables y disponibilidad |

Las rutas operativas aplican el middleware `requireAuth`, garantizando aislamiento de datos mediante `studio_id` resuelto desde la sesión del usuario.

---

## 6. Base de Datos (PostgreSQL)

### Tablas actuales

El archivo `database/init.sql` y `src/server.js` mantienen las tablas:
- `studios`: información básica y configuración regional del estudio.
- `users`: cuentas de usuario con email único y contraseñas hasheadas (`scrypt`).
- `sessions`: tokens de sesión activos con fecha de expiración.
- `studio_memberships`: vínculos de usuarios a estudios con roles (`owner`, `admin`, `resident`, `nomad`) y estados (`active`, `inactive`).
- `clients`: directorio de clientes con notas y datos de contacto por estudio.
- `appointments`: citas programadas, estados (`inquiry`, `confirmed`, `deposit_paid`, `in_session`, `completed`, `cancelled`), precios y señas.
- `transactions`: ingresos y gastos asociados al estudio con fechas e importes.
- `onboarding_profiles`: persistencia del perfil y metas de onboarding inicial.

### Tablas objetivo

Agregar mediante migraciones versionadas:
1. `audit_logs` para trazabilidad de cambios sensibles.
2. `spaces`, `availability_rules` y `space_reservations` para recursos y arriendo de boxes.
3. `payment_terms` para porcentajes, montos fijos, arriendos por bloque o jornada.
4. `artist_profiles` y `appointment_artists` para asignar citas a artistas específicos (residentes o nómades).
5. Extensiones de `transactions` para liquidaciones automáticas de residentes y nómades.

---

## 7. Flujo de autenticación y configuración inicial

```
Registro/login → sesión autenticada → selección o creación de estudio
    └─ propietario/admin → configuración del estudio y del equipo
    └─ residente → perfil profesional y disponibilidad
    └─ nómade → invitación, período de visita y condiciones de arriendo

Configuración inicial → roles, espacios, horarios y condiciones de pago
    └─ → dashboard del estudio activo
```

El frontend actual es una PWA servida como archivos estáticos. La autenticación y el onboarding descritos aquí son objetivos del producto; el MVP actual todavía usa un estudio demo fijo.

---

## 8. Layout de la aplicación

La PWA usa `public/index.html`, `public/app.js` y `public/styles.css`. Su estructura visual objetivo es:

```
body (background: azul-700 en desktop)
└── .app-shell (flex-row en desktop)
    ├── aside.app-sidebar        [desktop; navegación del estudio activo]
    │   ├── identidad Tatudin y estudio activo
    │   └── navegación: dashboard, calendario, clientes, finanzas, equipo, espacios
    └── .app-main               [flex: 1, height: 100vh, scroll]
        ├── header.app-header   (botón atrás, wordmark, spacer)
        ├── .progress-bar-container  (info + barra)
        └── main.app-content    (≤ 960px, padding 48–64px en desktop)
            └── [vista del módulo activo]
```

---

## 9. Sistema de Diseño

### Tokens CSS
Fuente de referencia: los documentos `DESIGN.md` y las pantallas `stitch_*`. Los tokens deben vivir en `public/styles.css` o en módulos CSS del frontend, sin rutas locales externas.

**Colores principales:**
| Token | Valor | Uso |
|---|---|---|
| `--azul-700` | `#221C35` | Color primario, botones, texto |
| `--lav-100` | `#F2F0F8` | Background de app |
| `--lav-300` | `#DCDAE9` | Borders suaves, backgrounds |
| `--rojo-500` | `#D50037` | CTA final, alertas, acentos |
| `--neutral-0` | `#FFFFFF` | Blanco puro |

**Fuentes:**
- UI: `Plus Jakarta Sans` (400, 500, 600, 700, 800)
- Brand: `Caveat Brush` (wordmark "tatudin")

**Radios:** `--r-md: 12px` / `--r-lg: 16px` / `--r-xl: 20px` / `--r-pill: 999px`

### Componentes visuales clave (`styles.css`)

| Clase | Descripción |
|---|---|
| `.app-sidebar` | Navegación persistente del estudio activo |
| `.app-main` | Área de trabajo responsive |
| `.calendar-grid` | Calendario y asignación de agendas |
| `.status-chip` | Estados de citas, reservas y pagos |
| `.btn-primary` | Acción principal contextual |
| `.empty-state` | Estado vacío con acción siguiente |

---

## 10. Cliente (`public/app.js`)

Funcionalidades implementadas:

1. Carga del dashboard, agenda, clientes y movimientos financieros mediante `fetch`.
2. Renderizado de métricas, citas, clientes y transacciones.
3. Creación de citas, clientes y movimientos desde la interfaz.
4. Actualización de estados de citas.

Responsabilidades objetivo: gestión de sesión, estudio activo, permisos, filtros de calendario, reservas de nómades y estados de carga/error sin duplicar reglas de negocio del servidor.

---

## 11. Bugs Conocidos / Deuda Técnica

| # | Descripción | Estado |
|---|---|---|
| 1 | Autenticación básica y sesiones por cookie HTTP-only | **Resuelto:** implementado en `/api/auth/*` con middleware `requireAuth` |
| 2 | Aislamiento por `studioId` | **Resuelto:** extraído del usuario autenticado en sesión (`request.studioId`) |
| 3 | Esquema relacional base en DB (`users`, `sessions`, `studio_memberships`) | **Resuelto:** creado en `database/init.sql` y `src/server.js` |
| 4 | Gestión de miembros y equipo del estudio | **Resuelto:** implementado en `/api/members` y vista de Ajustes |
| 5 | Esquema y reglas de espacios arrendables y reservas | **Pendiente:** Fase 3 |
| 6 | Asignación de citas a artistas y filtros de agenda | **Resuelto:** implementado en `/api/appointments` y vista de Agenda |
| 7 | Manejo de errores enriquecido y suite de pruebas automatizadas | **Pendiente:** Fase 10 |

---

## 12. Cómo Levantar el Servidor

```bash
# Desde la carpeta del proyecto:
docker compose up --build
```

Luego abrir `http://localhost:3000`. Para desarrollo sin Docker, ejecutar `npm install` y `npm run dev` con `DATABASE_URL` apuntando a PostgreSQL.

---

## 13. Backlog de implementación

La siguiente lista representa el estado actual de avance del proyecto clasificado por fases operativas.

### Fase 0 — Base técnica y decisiones de alcance

- [x] Adoptar Node.js, Express, PostgreSQL y Docker Compose como stack oficial.
- [x] Definir los roles iniciales en esquema relacional (`owner`, `admin`, `resident`, `nomad`) y perfiles de onboarding (`independent`, `studio_owner`, `apprentice`).
- [x] Definir estados de membresía (`active`, `inactive`) y estados de cita (`inquiry`, `confirmed`, `deposit_paid`, `in_session`, `completed`, `cancelled`).
- [x] Crear esquema y datos demo en `database/init.sql`.
- [ ] Definir matriz completa de permisos por rol y por estudio.
- [ ] Preparar migraciones versionadas y scripts de respaldo.

### Fase 1 — Autenticación y seguridad

- [x] Implementar registro de cuenta con creación de estudio y membresía (`POST /api/auth/register`).
- [x] Implementar inicio de sesión (`POST /api/auth/login`) y cierre de sesión (`POST /api/auth/logout`).
- [x] Almacenar contraseñas con hashes seguros (`scrypt` con salt aleatorio).
- [x] Implementar sesiones persistentes en base de datos con cookie segura HTTP-only `tatudin_session`.
- [x] Implementar middleware `requireAuth` para autorización y resolución de `studio_id`.
- [x] Endpoint de verificación de sesión activa (`GET /api/auth/me`).
- [ ] Recuperación de contraseñas por email (`POST /api/auth/recover-password`).
- [ ] Protección CSRF estricta y limitación de tasa (rate limiting).
- [ ] Registro de auditoría para acciones sensibles (`audit_logs`).
- [ ] Pruebas automatizadas de autenticación, aislamiento por estudio y autorización.

### Fase 2 — Estudios, usuarios y membresías

- [x] Estructura base relacional `studios` y `studio_memberships`.
- [x] Endpoint y UI para editar perfil del estudio (nombre, dirección, zona horaria, moneda) (`GET /api/studio`, `PATCH /api/studio`).
- [x] Módulo e incorporación de miembros (administradores, residentes, nómades) (`POST /api/members`).
- [x] Vistas de equipo y control de estado de membresías (`active`/`inactive`) (`GET /api/members`, `PATCH /api/members/:id`).
- [x] Selector de estudio activo para usuarios vinculados a múltiples organizaciones (`GET /api/auth/studios`, `POST /api/auth/switch-studio`).

### Fase 3 — Espacios, disponibilidad y condiciones económicas

- [x] Crear tabla `spaces` vinculada a estudios y citas (`space_id` en `appointments`).
- [x] CRUD y activación/desactivación de espacios arrendables (boxes/puestos) (`GET /api/spaces`, `POST /api/spaces`, `PATCH /api/spaces/:id`).
- [x] Configurar precios base y tarifas por día/hora por espacio.
- [x] Asignación de Box/Espacio a citas en agenda.

### Fase 4 — Clientes y fichas de trabajo

- [x] Búsqueda y listado de clientes por estudio (`GET /api/clients?search=`).
- [x] Creación de clientes (`POST /api/clients`).
- [x] Conteo de sesiones y total invertido por cliente.
- [x] Ficha de cliente detallada e interactiva con historial cronológico de sesiones (`GET /api/clients/:id`).
- [x] Edición de datos y notas médicas/preferencias de cliente (`PATCH /api/clients/:id`).

### Fase 5 — Calendario, agendas y compromisos multicategoría

- [x] Listado de citas y compromisos por estudio (`GET /api/appointments`).
- [x] Creación de compromisos con o sin cliente (`POST /api/appointments`).
- [x] Soporte multicategoría de agenda: Citas de tatuaje, marketing & redes, reuniones de trabajo, arriendos de box, diseño y personal.
- [x] CRUD y administración de categorías personalizadas con colores identificadores (`GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/:id`, `DELETE /api/categories/:id`).
- [x] Asignación explícita de citas a residentes o nómades (`artist_id` en `appointments`).
- [x] Barra interactiva de chips de filtrado por categoría de compromiso con conteo dinámico.
- [x] Filtro de calendario combinado por categoría, por artista, por box/espacio y por día seleccionado.
- [x] Actualización de estado de citas (`PATCH /api/appointments/:id`).
- [x] Validación y prevención de solapamientos de horario, artista y espacio (Motor de detección con código HTTP 409 Conflict).
- [ ] Vistas de calendario ampliadas (mensual/semanal por grilla de horarios).

### Fase 6 — Reservas de nómades y arriendo de espacios

- [x] Puestos y boxes de arriendo para artistas nómades o residentes con tarifas diarias/horarias.
- [x] Asignación de boxes y arriendos en compromisos de agenda (`space_rental`).
- [x] Solicitud de visita externa / portal de guest spots para nómades (`POST /api/public/guest-spots`).
- [x] Aprobación/rechazo de postulaciones nómades en Ajustes con incorporación automática al equipo (`PATCH /api/guest-spots/:id`).

### Fase 7 — Finanzas y liquidaciones

- [x] Registro de transacciones de ingresos y gastos (`POST /api/transactions`).
- [x] Listado histórico de transacciones con artista asociado (`GET /api/transactions`).
- [x] Balance financiero en tiempo real (ingresos, gastos, saldo neto) en Dashboard y Finanzas.
- [x] Desglose de rendimiento y comisiones por artista (`GET /api/finances/summary`).
- [x] Módulo de liquidaciones de artistas (`POST /api/finances/settle`) con registro contable de egresos.
- [x] Exportación de reportes contables en formato CSV.

### Fase 8 — Dashboard, comunicación y experiencia PWA

- [x] Dashboard interactivo con saludo dinámico, próximos compromisos y métricas.
- [x] Flujo de onboarding de 5 pasos con persistencia en DB y `localStorage`.
- [x] PWA con `manifest.webmanifest`, service worker (`sw.js`) e iconos de marca.
- [x] Diseño responsivo líquido (sidebar desktop + bottom nav móvil) bajo sistema *Operational Calm*.
- [x] Integración de pantalla de ajustes con selector de modo de cuenta (Artista Independiente vs Estudio), categorías de agenda, boxes, comisiones y nómades.
- [x] Recordatorio directo por WhatsApp en tarjetas de citas (`wa.me`).
- [ ] Sincronización y manejo robusto offline/reintento de peticiones.

### Fase 9 — Integraciones y operación avanzada (opcional)

- [x] Recordatorios rápidos por WhatsApp con plantilla contextual de cita.
- [ ] Sincronización con Google Calendar.
- [ ] Integración de pagos online y señas.
- [ ] Métricas de uso y observabilidad avanzada.

### Fase 10 — Calidad y lanzamiento

- [x] Suite de 15 pruebas de integración automatizadas (`node:test` y `node:assert` en `tests/api.test.js`).
- [x] Pruebas automáticas de Auth, Solapamientos, Finanzas/Liquidaciones, Guest Spots y Multicategorías (100% pasando).
- [ ] Pruebas E2E de interfaz de usuario con Playwright/Puppeteer.
- [ ] Pipeline CI/CD y despliegue productivo.

---

### Alcance del MVP y Funcionalidades Avanzadas: Estado de Cumplimiento

| Requisito | Estado |
|---|---|
| Registro, login y cierre de sesión de usuarios con hashes `scrypt` | **Completado** |
| Aislamiento multi-estudio por `studio_id` y sesiones seguras HttpOnly | **Completado** |
| Selector de Tipo de Cuenta (Artista Independiente / Estudio de Tatuajes) | **Completado** |
| Sistema multicategoría de agenda (tatuajes, marketing, reuniones, arriendos, personal) | **Completado** |
| Gestión y personalización de categorías con paleta de colores y reglas | **Completado** |
| Barra de filtrado reactivo por categorías de compromiso con badges | **Completado** |
| Gestión completa de clientes y ficha de historial de sesiones | **Completado** |
| Creación, filtro y cambio de estado de compromisos en agenda | **Completado** |
| Motor de detección y prevención de solapamientos (409 Conflict) | **Completado** |
| Acuerdos y porcentajes de comisión por artista configurables | **Completado** |
| Módulo de liquidaciones de artistas y exportación a CSV | **Completado** |
| Portal y gestión de Guest Spots para artistas nómades | **Completado** |
| Botón de recordatorios inmediatos por WhatsApp | **Completado** |
| Modal de perfil de usuario con edición de datos y logout | **Completado** |
| Suite de 15 pruebas de integración automatizadas (`npm test`) | **Completado** |

---

## 14. Historial del proyecto

- **Base actual:** PWA funcional con dashboard, agenda, clientes y finanzas demo en Node.js/Express/PostgreSQL.
- **Referencia visual:** mockups `stitch_*` y documentos `DESIGN.md`, conservados como guía y no como código ejecutable.
- **Decisión vigente:** desarrollar incrementalmente sobre el monolito Node/Express y separar módulos solo cuando el crecimiento lo justifique.

---

## 15. Referencia Rápida de Archivos Clave

| Archivo | Responsabilidad |
|---|---|
| Servidor y APIs | `src/server.js` |
| Cliente PWA | `public/index.html`, `public/app.js` |
| Estilos y diseño | `public/styles.css`, `DESIGN.md` y `stitch_*/` |
| Esquema y datos demo | `database/init.sql` |
| Dependencias y scripts | `package.json` |
| Entorno local | `Dockerfile` y `docker-compose.yml` |
