import { CalendarDays, FileBadge, MoreVertical, PackageX, TrendingUp, UserRoundPlus } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { currentUser, users } = useAuth()

  return (
    <div className="app-shell">
      <Sidebar role="admin" />
      <main className="content">
        <Header title="Panel Principal" user={currentUser} />

        <section className="page-heading dashboard-heading">
          <div>
            <h2>Panel Principal</h2>
            <p>Bienvenido de nuevo, {currentUser?.name?.split(' ')[0]}. Aqui tienes el resumen de hoy.</p>
          </div>
          <div className="heading-actions">
            <button className="date-button" type="button">
              <CalendarDays size={24} />
              Hoy: 24 Oct, 2023
            </button>
            <button className="primary-button" type="button">+ Nueva Factura</button>
          </div>
        </section>

        <section className="summary-grid">
          <article className="summary-card">
            <div className="metric-icon blue"><UserRoundPlus size={28} /></div>
            <span>Usuarios registrados</span>
            <strong>{users.length}<small> activos hoy</small></strong>
            <p><TrendingUp size={16} /> +8% vs ayer</p>
          </article>
          <article className="summary-card">
            <div className="metric-icon soft"><FileBadge size={28} /></div>
            <span>Facturas del dia</span>
            <strong>45<small> completadas</small></strong>
            <p><TrendingUp size={16} /> +12% vs ayer</p>
          </article>
          <article className="summary-card">
            <div className="metric-icon danger"><PackageX size={28} /></div>
            <em>Accion requerida</em>
            <span>Productos pendientes</span>
            <strong className="danger-text">8<small> homologacion</small></strong>
          </article>
        </section>

        <section className="dashboard-lower">
          <article className="panel chart-panel">
            <div className="panel-header">
              <h2>Actividad de Ventas</h2>
              <MoreVertical size={24} />
            </div>
            <div className="bar-chart" aria-label="Grafico de tendencias temporales">
              {[36, 48, 63, 44, 72, 58, 40].map((height, index) => (
                <span key={height} className={index === 4 ? 'active-bar' : ''} style={{ height }} />
              ))}
            </div>
          </article>

          <article className="panel alerts-panel">
            <h2>Alertas del Sistema</h2>
            <div className="alert-list">
              <p><span className="dot red" /> <strong>Error en Homologacion</strong><br />Producto #9982 - SKU Invalido<br /><small>Hace 10 min</small></p>
              <p><span className="dot blue" /> <strong>Nueva Factura Emitida</strong><br />Cliente: Constructora Sur<br /><small>Hace 45 min</small></p>
              <p><span className="dot muted" /> <strong>Respaldo completado</strong><br />La base de datos se guardo con exito.<br /><small>Hoy, 08:30 AM</small></p>
            </div>
            <button className="secondary-button" type="button">Ver todas las alertas</button>
          </article>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
