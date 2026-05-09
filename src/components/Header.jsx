import { Bell, Search, Settings } from 'lucide-react'
import { roleLabels } from '../data/users'

function Header({ title, user }) {
  return (
    <header className="topbar">
      <h1>{title}</h1>

      <div className="topbar-actions">
        <label className="search-box" aria-label="Buscar">
          <Search size={22} />
          <input placeholder="Buscar..." type="search" />
        </label>

        <button className="icon-button" type="button" aria-label="Notificaciones">
          <Bell size={24} />
        </button>
        <button className="icon-button" type="button" aria-label="Configuracion">
          <Settings size={24} />
        </button>

        <div className="user-chip">
          <div>
            <span>{user?.name}</span>
            <strong>{roleLabels[user?.role] || user?.role}</strong>
          </div>
          <span className="avatar">{user?.name?.slice(0, 1) || 'A'}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
