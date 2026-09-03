# Tatudin

Primer entorno funcional de Tatudin: PWA web para agenda y operaciones de tatuadores y estudios.

## Requisitos

- Docker Engine con Compose

## Levantar el entorno

```bash
docker compose up --build
```

Abrir `http://localhost:3000`.

La aplicación expone `GET /api/health` para comprobar la conexión con PostgreSQL. La base usa un volumen Docker llamado `tatudin-postgres` y se inicializa con `database/init.sql`. El entorno actual incluye onboarding, autenticación, dashboard, agenda, horarios públicos, clientes, miembros, espacios, finanzas, portfolio, inventario, transcripciones y backoffice.

Al abrir por primera vez se muestra el onboarding: cuenta, rol, perfil, fuente de adquisición y metas. El progreso se guarda en PostgreSQL y el navegador conserva la sesión de desarrollo en `localStorage`.

Si ya existía un volumen de una versión anterior y necesitas cargar el esquema actual, detén el entorno y elimina solo ese volumen de desarrollo antes de levantarlo nuevamente:

```bash
docker compose down -v
docker compose up --build
```

## Desarrollo local sin Docker

```bash
npm install
DATABASE_URL=postgres://tatudin:tatudin@localhost:5432/tatudin npm run dev
```

## Modelo de producto

Tatudin es una aplicación segura de gestión para artistas y estudios de tatuaje. El acceso requiere autenticación y cada usuario opera según el contexto al que pertenece.

- **Estudio:** organización que administra artistas, espacios, agendas, clientes y finanzas.
- **Usuario estudio:** cuenta que representa al estudio y puede gestionar su operación y sus calendarios.
- **Residente:** artista asociado de forma permanente a un estudio. Su agenda, condiciones de trabajo y liquidación se administran dentro de ese estudio.
- **Nómade:** artista visitante que puede trabajar temporalmente en uno o más estudios. El estudio puede arrendarle un espacio y definir condiciones de pago distintas a las de un residente.
- **Espacio arrendable:** recurso del estudio que puede asignarse a un nómade durante un período determinado, con precio, disponibilidad y condiciones de pago.
- **Agenda:** calendario del estudio donde se crean citas y se asigna cada bloque de trabajo a un artista, residente o nómade, respetando su disponibilidad y el espacio utilizado.

La relación con un estudio debe conservar su tipo (`residente` o `nomade`), estado, fechas de vigencia y condiciones económicas. Esto permite que una misma persona visite distintos estudios sin perder su identidad ni mezclar sus agendas o liquidaciones.

## Referencia PHP/SQLite3

Las pantallas y el flujo inicial de autenticación/onboarding de la versión PHP con SQLite3 se conservan en el documento [tatudin_contexto_proyecto.md](tatudin_contexto_proyecto.md). Esa versión sirve como referencia funcional y visual junto con las pantallas de `stitch_*`; el entorno ejecutable actual de este repositorio es Node.js con PostgreSQL y Docker Compose.

## Estructura inicial

- `src/server.js`: servidor Express, autenticación, endpoints operativos, APIs públicas y backoffice.
- `public/`: shell de la PWA, estilos, manifest y service worker.
- `public/offline-store.js`: almacenamiento IndexedDB y cola de mutaciones offline.
- `src/middlewares/` y `src/services/`: protección CSRF, rate limiting, correo y auditoría.
- `tests/` y `playwright.config.js`: pruebas API y E2E.
- `public/assets/`: gráfica local seleccionada desde `imagen/` para continuidad de marca.
- `database/init.sql`: esquema y datos demo de PostgreSQL.
- `docker-compose.yml`: servicios `app` y `db`.
- `stitch_*`: mockups de referencia visual, conservados sin modificar.
