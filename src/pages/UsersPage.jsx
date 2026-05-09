import { useMemo, useState } from 'react'
import { Pencil, UserRoundPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { roleLabels, statusLabels } from '../data/users'

function UsersPage() {
  const { currentUser, users, toggleUserStatus } = useAuth()
  const [filters, setFilters] = useState({ role: 'todos', status: 'todos' })
  const [message, setMessage] = useState('')

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const roleMatches = filters.role === 'todos' || user.role === filters.role
        const statusMatches = filters.status === 'todos' || user.status === filters.status
        return roleMatches && statusMatches
      }),
    [filters, users],
  )

  const handleFilter = (event) => {
    const { name, value } = event.target
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))
  }

  const handleToggleStatus = (user) => {
    toggleUserStatus(user.id)
    setMessage(
      user.status === 'activo'
        ? 'Usuario desactivado correctamente.'
        : 'Usuario activado correctamente.',
    )
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" />
      <main className="content">
        <Header title="Gestion de Usuarios" user={currentUser} />

        <section className="page-heading dashboard-heading">
          <div>
            <h2>Panel Administrativo</h2>
            <p>Control total sobre los accesos y permisos del sistema.</p>
          </div>
          <Link className="primary-button" to="/usuarios/nuevo">
            <UserRoundPlus size={24} />
            Registrar usuario
          </Link>
        </section>

        <section className="panel users-panel">
          <AlertMessage message={message} />

          <div className="filters admin-filters">
            <label>
              Filtrar por Rol:
              <select name="role" onChange={handleFilter} value={filters.role}>
                <option value="todos">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </label>
            <label>
              Estado:
              <select name="status" onChange={handleFilter} value={filters.status}>
                <option value="todos">Cualquier estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
            <button
              className="secondary-button"
              onClick={() => setFilters({ role: 'todos', status: 'todos' })}
              type="button"
            >
              Limpiar
            </button>
            <button className="soft-button" type="button">
              Aplicar filtros
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="name-cell">
                        <span className="initials">
                          {user.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                        {user.name}
                      </span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-pill">{roleLabels[user.role]}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${user.status}`}>
                        {statusLabels[user.status]}
                      </span>
                    </td>
                    <td className="actions">
                      <Link
                        aria-label={`Editar ${user.name}`}
                        className="icon-link"
                        to={`/usuarios/${user.id}/editar`}
                      >
                        <Pencil size={22} />
                      </Link>
                      <button
                        aria-label={
                          user.status === 'activo' ? 'Desactivar usuario' : 'Activar usuario'
                        }
                        className={`toggle-switch ${user.status === 'activo' ? 'on' : ''}`}
                        onClick={() => handleToggleStatus(user)}
                        type="button"
                      >
                        <span />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Mostrando 1 a {filteredUsers.length} de {users.length} usuarios
            </span>
            <div className="pagination">
              <button disabled type="button">
                ‹
              </button>
              <button className="active" type="button">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">›</button>
            </div>
          </div>
        </section>

        <section className="info-strip">
          <article className="image-card">
            <div>
              <h3>Optimizacion de Recursos</h3>
              <p>Visualice el rendimiento y acceso de su equipo en tiempo real.</p>
            </div>
          </article>
          <article className="security-card">
            <h3>Seguridad Garantizada</h3>
            <p>
              Protocolos de encriptacion de grado bancario para toda su data administrativa.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default UsersPage
