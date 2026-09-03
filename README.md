# Tatudin

> **Plataforma web progresiva (PWA) para la gestión integral de agenda, operaciones, artistas y finanzas en estudios de tatuaje y artistas independientes.**

Tatudin simplifica y centraliza la administración operativa del tatuaje profesional: control de agendas y citas, coordinación de boxes o espacios de trabajo, gestión diferenciada de artistas (residentes y nómades), liquidación automática de comisiones, registro de clientes y finanzas con soporte offline nativo.

---

## Características Principales

- 📅 **Agenda Inteligente y Timeline:**
  - Calendario interactivo por día, semana y vista horizontal de horas.
  - Agendamiento directo mediante tap o clic en cualquier celda horaria disponible.
  - Bloqueo visual de horarios con achurado dinámico y gestión de disponibilidad por reglas.
  - Modal de resumen de compromisos con acceso rápido a WhatsApp, notas de voz y liquidación.
  - Sincronización e integración con calendarios externos mediante estándar RFC 5545 (.ics) y suscripción vía feed live.

- 👥 **Modelo Multidisciplinario de Artistas:**
  - **Residentes:** Artistas permanentes del estudio con acuerdos de porcentaje o tarifa fija, liquidaciones periódicas y acceso compartido.
  - **Nómades (Guest Spots):** Artistas visitantes que postulan a través de enlaces públicos para arrendar espacios en fechas definidas, con instrucciones de llegada, acceso y pago independientes.

- 🏢 **Gestión de Espacios y Boxes:**
  - Prevención automática de colisiones y sobreventa de camillas o estaciones de trabajo.
  - Asignación flexible por hora o por jornada completa.

- 💰 **Finanzas, Señas y Liquidaciones:**
  - Control de abonos/señas iniciales y saldos pendientes por cobrar.
  - Registro de ingresos y gastos operativos del estudio.
  - Cálculo automatizado de liquidaciones de artistas según comisiones pactadas.

- 📱 **PWA Offline-First y Alto Rendimiento:**
  - Funcionamiento fluido en dispositivos móviles (iOS / Android) y escritorio sin necesidad de tiendas de aplicaciones.
  - Estrategia *Stale-While-Revalidate* con Service Worker para arranque instantáneo.
  - Almacenamiento local mediante IndexedDB con cola de sincronización en segundo plano (*Background Sync*).
  - Compresión nativa en streaming y tiempos de respuesta ultra rápidos.

- 🔒 **Seguridad y Privacidad:**
  - Autenticación robusta con protección contra ataques de fuerza bruta (*Rate Limiting*).
  - Protección activa contra falsificación de peticiones en sitios cruzados (*CSRF Protection*).
  - Registro de auditoría (*Audit Logs*) para trazabilidad de acciones operativas sensibles.
  - Hashing seguro de contraseñas mediante `scrypt`.

---

## Requisitos del Sistema

- **Docker Engine y Docker Compose** (método recomendado para desarrollo rápido)
- O alternativamente: **Node.js 20+** y **PostgreSQL 15+**

---

## Puesta en Marcha

### 1. Opción con Docker Compose (Recomendada)

Clona el repositorio e inicia los servicios:

```bash
docker compose up --build
```

La aplicación estará disponible de inmediato en `http://localhost:3000`.

### 2. Opción Local (sin Docker)

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Configura tus variables de entorno a partir de la plantilla:
   ```bash
   cp .env.example .env
   ```
   *Edita el archivo `.env` con los datos de conexión de tu base de datos PostgreSQL local.*

3. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## Variables de Entorno

La configuración de la plataforma se gestiona a través de variables de entorno:

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto de escucha del servidor web | `3000` |
| `DATABASE_URL` | Cadena de conexión URI a PostgreSQL | — |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) | `development` |
| `RESEND_API_KEY` | *(Opcional)* Llave de API para envío de correos transaccionales | — |
| `SMTP_FROM` | *(Opcional)* Dirección de remitente para notificaciones por email | `Tatudin <no-reply@tatudin.cl>` |

> **Nota de Seguridad:** Nunca incluyas archivos `.env` con credenciales reales en el control de versiones. El repositorio incluye `.env` en `.gitignore` por defecto.

---

## Verificación y Calidad

Para ejecutar la suite de pruebas unitarias y de integración de la API:

```bash
npm test
```

---

## Licencia y Derechos

© Tatudin. Todos los derechos reservados.
