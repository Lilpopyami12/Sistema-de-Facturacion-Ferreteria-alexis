import {
  ArrowLeftRight,
  BarChart3,
  FileText,
  Grid2X2,
  History,
  LogOut,
  ReceiptText,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { icon: Grid2X2, label: 'Inicio', to: '/admin' },
  { icon: UsersRound, label: 'Usuarios', to: '/usuarios' },
  { icon: ReceiptText, label: 'Facturacion', to: '/admin' },
  { icon: ArrowLeftRight, label: 'Homologacion', to: '/admin' },
  { icon: BarChart3, label: 'Reportes', to: '/admin' },
]

const sellerLinks = [
  { icon: Grid2X2, label: 'Inicio', to: '/vendedor' },
  { icon: FileText, label: 'Nueva factura', to: '/vendedor' },
  { icon: History, label: 'Historial', to: '/vendedor' },
]

function Sidebar({ role }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const links = role === 'admin' ? adminLinks : sellerLinks

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        {role === 'vendedor' && (
          <span className="brand-icon">
            <UserRoundPlus size={18} />
          </span>
        )}
        <div>
          <strong>Ferreteria Alexis</strong>
          <small>Admin System</small>
        </div>
      </div>

      <nav className="nav-menu">
        {links.map(({ icon: Icon, ...link }) => (
          <NavLink key={`${link.label}-${link.to}`} to={link.to} end>
            <Icon size={24} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-button" type="button" onClick={handleLogout}>
        <LogOut size={24} />
        <span>Cerrar sesion</span>
      </button>
    </aside>
  )
}

export default Sidebar
