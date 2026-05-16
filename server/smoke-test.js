const baseUrl = process.env.API_BASE_URL || 'http://localhost:4000'

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options)
  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(`${options?.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`)
  }

  return body
}

await request('/api/health')

const login = await request('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@ferreteriaalexis.com',
    password: '123456',
  }),
})

if (login.user?.role !== 'admin') {
  throw new Error('Login smoke test did not return the admin user.')
}

const users = await request('/api/users')

if (!Array.isArray(users.users)) {
  throw new Error('Users smoke test did not return a users array.')
}

console.log('Smoke tests OK')
