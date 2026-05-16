import bcrypt from 'bcryptjs'
import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const defaultUsers = [
  {
    name: 'Administrador Alexis',
    email: 'admin@ferreteriaalexis.com',
    password: '123456',
    role: 'admin',
    status: 'activo',
  },
  {
    name: 'Vendedor Alexis',
    email: 'vendedor@ferreteriaalexis.com',
    password: '123456',
    role: 'vendedor',
    status: 'activo',
  },
]

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'vendedor')),
      status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await pool.query(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  await pool.query(`
    DROP TRIGGER IF EXISTS users_set_updated_at ON users;
    CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `)

  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM users')

  if (rows[0].total > 0) {
    return
  }

  for (const user of defaultUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    await pool.query(
      `
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [user.name, user.email, passwordHash, user.role, user.status],
    )
  }
}

export function toPublicUser(user) {
  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }
}
