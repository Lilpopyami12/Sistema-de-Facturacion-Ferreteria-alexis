import { useMemo, useState } from 'react'
import { ClipboardList, History, MapPin, ShieldCheck, UserRoundCog } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: '',
  status: 'activo',
}

function UserFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, users, createUser, updateUser } = useAuth()
  const editingUser = useMemo(() => users.find((user) => user.id === Number(id)), [id, users])
  const isEditing = Boolean(id)
  const initialForm = editingUser
    ? {
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password,
        role: editingUser.role,
        status: editingUser.status,
      }
    : emptyForm
  const [form, setForm] = useState(initialForm)
  const [alert, setAlert] = useState({ type: '', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const validateForm = () =>
    form.name.trim() && form.email.trim() && form.password.trim() && form.role && form.status

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Debe completar los campos obligatorios.' })
      return
    }

    const response = isEditing ? updateUser(id, form) : createUser(form)

    if (!response.ok) {
      setAlert({ type: 'error', message: response.message })
      return
    }

    setAlert({ type: 'success', message: response.message })
    window.setTimeout(() => navigate('/usuarios'), 650)
  }

  if (isEditing && !editingUser) {
    return (
      <div className="app-shell">
        <Sidebar role="admin" />
        <main className="content">
          <Header title="Usuario no encontrado" user={currentUser} />
          <section className="panel">
            <AlertMessage type="error" message="No se encontro el usuario solicitado." />
            <Link className="primary-button fit-button" to="/usuarios">
              Volver a usuarios
            </Link>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" />
      <main className="content">
        <Header title={isEditing ? 'Editar Perfil' : 'Ferreteria Alexis'} user={currentUser} />

        <section className="breadcrumb">
          <Link to="/usuarios">Usuarios</Link>
          <span>›</span>
          <strong>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</strong>
        </section>

        <section className="page-heading">
          <h2>{isEditing ? 'Informacion del Usuario' : 'Nuevo Usuario'}</h2>
          <p>
            {isEditing
              ? `Modifica los detalles de la cuenta de ${editingUser?.name}.`
              : 'Complete la informacion para registrar un nuevo miembro del equipo en el sistema administrativo.'}
          </p>
        </section>

        <AlertMessage type={alert.type} message={alert.message} />

        <section className="panel form-panel">
          {isEditing && (
            <div className="panel-header form-card-header">
              <div>
                <h2>Informacion del Usuario</h2>
                <p>Modifica los detalles de la cuenta seleccionada</p>
              </div>
              <span className="round-icon">
                <UserRoundCog size={34} />
              </span>
            </div>
          )}

          <form className="user-form" onSubmit={handleSubmit}>
            <label>
              Nombre completo
              <input
                name="name"
                onChange={handleChange}
                placeholder="Ej. Juan Perez"
                type="text"
                value={form.name}
              />
            </label>

            <label>
              Correo electronico
              <input
                name="email"
                onChange={handleChange}
                placeholder="usuario@ferreteriaalexis.com"
                type="email"
                value={form.email}
              />
            </label>

            <label>
              Contrasena
              <input
                name="password"
                onChange={handleChange}
                type="password"
                value={form.password}
              />
            </label>

            <label>
              Rol
              <select name="role" onChange={handleChange} value={form.role}>
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </label>

            <label>
              Estado
              <select name="status" onChange={handleChange} value={form.status}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>

            {isEditing && (
              <div className="account-status">
                <span className={`toggle-switch ${form.status === 'activo' ? 'on' : ''}`}>
                  <span />
                </span>
                <strong>Usuario Activo</strong>
                <b>ACCESO HABILITADO</b>
              </div>
            )}

            <div className="form-actions">
              <Link className="secondary-button" to="/usuarios">
                Cancelar
              </Link>
              <button className="primary-button" type="submit">
                {isEditing ? 'Guardar cambios' : 'Guardar usuario'}
              </button>
            </div>
          </form>
        </section>

        <section className="helper-grid">
          <article>
            <ShieldCheck size={26} />
            <h3>Seguridad</h3>
            <p>
              Las contrasenas deben contener al menos 8 caracteres, incluyendo una mayuscula y
              un numero.
            </p>
          </article>
          <article>
            <ClipboardList size={26} />
            <h3>Roles de Acceso</h3>
            <p>Asegurese de asignar el rol correcto para limitar el acceso a funciones criticas.</p>
          </article>
          <article>
            <History size={26} />
            <h3>{isEditing ? 'Ultima Modificacion' : 'Auditoria'}</h3>
            <p>
              {isEditing
                ? 'Hace 2 dias por Admin_Sosa'
                : 'Todos los cambios realizados quedaran registrados en el log de auditoria.'}
            </p>
          </article>
          {isEditing && (
            <article>
              <MapPin size={26} />
              <h3>Sucursal</h3>
              <p>Sede Central - Buenos Aires</p>
            </article>
          )}
        </section>
      </main>
    </div>
  )
}

export default UserFormPage
