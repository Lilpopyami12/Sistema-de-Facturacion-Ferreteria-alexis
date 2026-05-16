import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import { initDb, pool, toPublicUser } from './db.js'

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.use((req, res, next) => {
  const startedAt = Date.now()
  const loggedBody = sanitizeBody(req.body)

  res.on('finish', () => {
    const duration = Date.now() - startedAt
    const bodyInfo = loggedBody ? ` body=${JSON.stringify(loggedBody)}` : ''

    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms${bodyInfo}`,
    )
  })

  next()
})

app.get('/api/health', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS database_time')
    res.json({
      ok: true,
      service: 'ferreteria-alexis-api',
      databaseTime: rows[0].database_time,
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contrasena son obligatorios.' })
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Correo o contrasena incorrectos.' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Correo o contrasena incorrectos.' })
    }

    if (user.status !== 'activo') {
      return res.status(403).json({ message: 'El usuario esta inactivo.' })
    }

    res.json({ user: toPublicUser(user) })
  } catch (error) {
    next(error)
  }
})

app.get('/api/users', async (req, res, next) => {
  try {
    const role = req.query.role
    const status = req.query.status
    const params = []
    const filters = []

    if (role && role !== 'todos') {
      params.push(role)
      filters.push(`role = $${params.length}`)
    }

    if (status && status !== 'todos') {
      params.push(status)
      filters.push(`status = $${params.length}`)
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const { rows } = await pool.query(
      `
        SELECT id, name, email, role, status, created_at, updated_at
        FROM users
        ${where}
        ORDER BY id ASC
      `,
      params,
    )

    res.json({ users: rows.map(toPublicUser) })
  } catch (error) {
    next(error)
  }
})

app.post('/api/users', async (req, res, next) => {
  try {
    const user = validateUserPayload(req.body)

    if (!user.ok) {
      return res.status(400).json({ message: user.message })
    }

    const passwordHash = await bcrypt.hash(user.value.password, 10)
    const { rows } = await pool.query(
      `
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, role, status, created_at, updated_at
      `,
      [
        user.value.name,
        user.value.email,
        passwordHash,
        user.value.role,
        user.value.status,
      ],
    )

    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: toPublicUser(rows[0]),
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ya existe un usuario registrado con ese correo.' })
    }

    next(error)
  }
})

app.put('/api/users/:id', async (req, res, next) => {
  try {
    const user = validateUserPayload(req.body, { requirePassword: false })

    if (!user.ok) {
      return res.status(400).json({ message: user.message })
    }

    const currentUser = await pool.query('SELECT password_hash FROM users WHERE id = $1', [
      req.params.id,
    ])

    if (!currentUser.rows[0]) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    const passwordHash = user.value.password
      ? await bcrypt.hash(user.value.password, 10)
      : currentUser.rows[0].password_hash

    const { rows } = await pool.query(
      `
        UPDATE users
        SET name = $1, email = $2, password_hash = $3, role = $4, status = $5
        WHERE id = $6
        RETURNING id, name, email, role, status, created_at, updated_at
      `,
      [
        user.value.name,
        user.value.email,
        passwordHash,
        user.value.role,
        user.value.status,
        req.params.id,
      ],
    )

    res.json({
      message: 'Usuario actualizado correctamente.',
      user: toPublicUser(rows[0]),
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ya existe otro usuario con ese correo.' })
    }

    next(error)
  }
})

app.patch('/api/users/:id/status', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
        UPDATE users
        SET status = CASE WHEN status = 'activo' THEN 'inactivo' ELSE 'activo' END
        WHERE id = $1
        RETURNING id, name, email, role, status, created_at, updated_at
      `,
      [req.params.id],
    )

    if (!rows[0]) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    res.json({
      message:
        rows[0].status === 'activo'
          ? 'Usuario activado correctamente.'
          : 'Usuario desactivado correctamente.',
      user: toPublicUser(rows[0]),
    })
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, _next) => {
  void _next
  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

function validateUserPayload(payload, options = {}) {
  const requirePassword = options.requirePassword ?? true
  const name = String(payload.name || '').trim()
  const email = String(payload.email || '').trim().toLowerCase()
  const password = String(payload.password || '').trim()
  const role = String(payload.role || '')
  const status = String(payload.status || 'activo')

  if (!name || !email || (requirePassword && !password) || !role || !status) {
    return { ok: false, message: 'Debe completar los campos obligatorios.' }
  }

  if (!['admin', 'vendedor'].includes(role)) {
    return { ok: false, message: 'Rol invalido.' }
  }

  if (!['activo', 'inactivo'].includes(status)) {
    return { ok: false, message: 'Estado invalido.' }
  }

  return { ok: true, value: { name, email, password, role, status } }
}

function sanitizeBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
    return null
  }

  return {
    ...body,
    ...(body.password ? { password: '[oculta]' } : {}),
  }
}

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API lista en http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('No se pudo iniciar la base de datos:', error)
    process.exit(1)
  })
