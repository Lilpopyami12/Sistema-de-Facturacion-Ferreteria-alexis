import { useState } from 'react'
import { Eye, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [alert, setAlert] = useState({ type: '', message: '' })

  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if (currentUser?.role === 'vendedor') {
    return <Navigate to="/vendedor" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      setAlert({ type: 'error', message: 'Ingrese correo y contrasena para continuar.' })
      return
    }

    const response = login(form.email, form.password)

    if (!response.ok) {
      setAlert({ type: 'error', message: response.message })
      return
    }

    setAlert({ type: 'success', message: 'Inicio de sesion correcto.' })
    navigate(response.user.role === 'admin' ? '/admin' : '/vendedor', { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-brand">
            <span className="logo-mark">FA</span>
            <strong>Ferreteria<br />Alexis</strong>
          </div>

          <div className="login-title">
            <h1>Admin System</h1>
            <p>Gestion Centralizada</p>
          </div>

          <AlertMessage type={alert.type} message={alert.message} />

          <label>
            Correo electronico
            <span className="input-with-icon">
              <Mail size={23} />
              <input
                autoComplete="email"
                name="email"
                onChange={handleChange}
                placeholder="admin@ferreteriaalexis.com"
                type="email"
                value={form.email}
              />
            </span>
          </label>

          <label>
            <span className="label-row">
              Contrasena
              <a href="#soporte">¿Olvido su contrasena?</a>
            </span>
            <span className="input-with-icon">
              <LockKeyhole size={23} />
              <input
                autoComplete="current-password"
                name="password"
                onChange={handleChange}
                placeholder="Ingrese su contrasena"
                type="password"
                value={form.password}
              />
              <Eye size={23} />
            </span>
          </label>

          <button className="primary-button" type="submit">
            Iniciar sesion
          </button>

          <div className="login-help" id="soporte">
            <span>¿No tiene acceso?</span>
            <strong>Contacte a TI</strong>
          </div>
        </form>

        <p className="secure-note">
          <ShieldCheck size={16} />
          CONEXION SEGURA SSL
        </p>
      </section>
    </main>
  )
}

export default LoginPage
