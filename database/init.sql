CREATE TABLE IF NOT EXISTS studios (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'independent' CHECK (account_type IN ('independent', 'studio')),
  currency CHAR(3) NOT NULL DEFAULT 'CLP',
  timezone TEXT NOT NULL DEFAULT 'America/Santiago',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  active_studio_id INTEGER REFERENCES studios(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS studio_memberships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'resident', 'nomad')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 70.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, studio_id)
);

CREATE TABLE IF NOT EXISTS spaces (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_per_day NUMERIC(12, 2) NOT NULL DEFAULT 0,
  price_per_hour NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guest_spot_requests (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  artist_email TEXT NOT NULL,
  artist_instagram TEXT DEFAULT '',
  space_id INTEGER REFERENCES spaces(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commitment_categories (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'custom' CHECK (kind IN ('tattoo', 'marketing', 'meeting', 'space_rental', 'maintenance', 'personal', 'custom')),
  color TEXT NOT NULL DEFAULT '#7C3AED',
  icon TEXT NOT NULL DEFAULT 'calendar',
  requires_client BOOLEAN NOT NULL DEFAULT FALSE,
  requires_space BOOLEAN NOT NULL DEFAULT FALSE,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES commitment_categories(id) ON DELETE SET NULL,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  artist_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  space_id INTEGER REFERENCES spaces(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 180 CHECK (duration_minutes > 0),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('inquiry', 'confirmed', 'deposit_paid', 'in_session', 'completed', 'cancelled')),
  price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  deposit NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (deposit >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  artist_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id INTEGER PRIMARY KEY DEFAULT 1,
  role TEXT CHECK (role IN ('independent', 'studio_owner', 'apprentice')),
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  professional_name TEXT NOT NULL DEFAULT '',
  specialization TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  studio_name TEXT NOT NULL DEFAULT '',
  artist_count INTEGER,
  business_type TEXT,
  has_manager BOOLEAN NOT NULL DEFAULT FALSE,
  manager_name TEXT NOT NULL DEFAULT '',
  studio_location TEXT NOT NULL DEFAULT '',
  acquisition_source TEXT NOT NULL DEFAULT '',
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  studio_id INTEGER REFERENCES studios(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  details JSONB,
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Demo studio
INSERT INTO studios (id, name)
VALUES (1, 'Ink Sanctuary')
ON CONFLICT (id) DO NOTHING;

INSERT INTO onboarding_profiles (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Demo spaces
INSERT INTO spaces (id, studio_id, name, description, price_per_day, price_per_hour, is_active)
VALUES 
  (1, 1, 'Box 1 · Luz Natural', 'Camilla ergonómica, lámpara de alta potencia y luz natural directa.', 45000, 10000, TRUE),
  (2, 1, 'Box 2 · Privado', 'Cabina cerrada acústicamente para piezas grandes o clientes reservados.', 55000, 12000, TRUE),
  (3, 1, 'Puesto Nómade A', 'Estación flexible equipada para artistas visitantes.', 40000, 9000, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Demo users
INSERT INTO users (id, email, password_hash, full_name)
VALUES 
  (1, 'owner@inksanctuary.com', 'a1b2c3d4e5f60718293a4b5c6d7e8f90:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'Marcus Creator'),
  (2, 'alex@inksanctuary.com', 'a1b2c3d4e5f60718293a4b5c6d7e8f90:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'Alex Rivera (Residente)'),
  (3, 'dani@nomadtattoo.com', 'a1b2c3d4e5f60718293a4b5c6d7e8f90:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'Dani Nomad (Visitante)')
ON CONFLICT (id) DO NOTHING;

-- Demo Memberships
INSERT INTO studio_memberships (user_id, studio_id, role, status)
VALUES 
  (1, 1, 'owner', 'active'),
  (2, 1, 'resident', 'active'),
  (3, 1, 'nomad', 'active')
ON CONFLICT (user_id, studio_id) DO NOTHING;

-- Demo Clients
INSERT INTO clients (id, studio_id, name, email, phone, notes)
VALUES 
  (1, 1, 'Julianne V.', 'julianne@example.com', '+56 9 5555 0101', 'Piel sensible en antebrazo. Prefiere tintas veganas sin níquel.'),
  (2, 1, 'Marcus R.', 'marcus@example.com', '+56 9 5555 0102', 'En proceso de manga completa estilo blackwork.')
ON CONFLICT (id) DO NOTHING;

-- Demo Appointments
INSERT INTO appointments (studio_id, client_id, artist_id, space_id, title, starts_at, duration_minutes, status, price, deposit)
SELECT 1, 1, 2, 1, 'Neo-traditional Rose', CURRENT_DATE + TIME '10:00', 180, 'deposit_paid', 180000, 60000
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE studio_id = 1 AND title = 'Neo-traditional Rose');

INSERT INTO appointments (studio_id, client_id, artist_id, space_id, title, starts_at, duration_minutes, status, price, deposit)
SELECT 1, 2, 3, 3, 'Fine Line Floral', CURRENT_DATE + TIME '15:30', 120, 'confirmed', 120000, 40000
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE studio_id = 1 AND title = 'Fine Line Floral');

-- Demo Transactions
INSERT INTO transactions (studio_id, kind, description, amount, occurred_on, artist_id)
SELECT 1, 'income', 'Seña - Neo-traditional Rose (Julianne V.)', 60000, CURRENT_DATE, 2
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE studio_id = 1 AND description LIKE 'Seña - Neo-traditional Rose%');

INSERT INTO transactions (studio_id, kind, description, amount, occurred_on, artist_id)
SELECT 1, 'income', 'Seña - Fine Line Floral (Marcus R.)', 40000, CURRENT_DATE, 3
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE studio_id = 1 AND description LIKE 'Seña - Fine Line Floral%');

INSERT INTO transactions (studio_id, kind, description, amount, occurred_on)
SELECT 1, 'expense', 'Insumos agujas y tintas', 35000, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE studio_id = 1 AND description = 'Insumos agujas y tintas');
