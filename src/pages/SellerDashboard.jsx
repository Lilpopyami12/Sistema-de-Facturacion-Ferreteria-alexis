import { FileText, History, Search, ShoppingCart } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

function SellerDashboard() {
  const { currentUser } = useAuth()

  return (
    <div className="app-shell">
      <Sidebar role="vendedor" />
      <main className="content">
        <Header title="Panel Principal" user={currentUser} />

        <section className="page-heading">
          <h2>¡Hola de nuevo, {currentUser?.name?.split(' ')[0] || 'Maria'}!</h2>
          <p>¿Que vamos a despachar hoy?</p>
        </section>

        <section className="seller-actions">
          <article className="quick-card featured">
            <div className="metric-icon blue"><FileText size={32} /></div>
            <ShoppingCart className="ghost-cart" size={132} />
            <h3>Crear factura</h3>
            <p>Iniciar una nueva venta desde el mostrador.</p>
          </article>
          <article className="quick-card">
            <div className="metric-icon soft"><Search size={34} /></div>
            <h3>Buscar producto</h3>
            <p>Consulta existencias y precios en tiempo real.</p>
          </article>
          <article className="quick-card">
            <div className="metric-icon pale"><History size={34} /></div>
            <h3>Ver historial</h3>
            <p>Revisa tus facturas emitidas hoy.</p>
          </article>
        </section>

        <section className="seller-lower">
          <article className="panel sales-table">
            <div className="panel-header">
              <h2>Ventas Recientes</h2>
              <a href="#ventas">Ver todas</a>
            </div>
            <table>
              <thead><tr><th>Factura</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>#FA-2041</td><td>Juan Perez</td><td>$1,240.00</td><td><span className="status-pill activo">Pagado</span></td></tr>
                <tr><td>#FA-2040</td><td>Construcciones S.A.</td><td>$4,500.50</td><td><span className="status-pill pending">Pendiente</span></td></tr>
                <tr><td>#FA-2039</td><td>Maria Garcia</td><td>$125.00</td><td><span className="status-pill activo">Pagado</span></td></tr>
              </tbody>
            </table>
          </article>

          <article className="panel promo-panel">
            <h2>Promociones del Mes</h2>
            <div className="promo-item"><span /> <div><strong>Taladro Percutor 20V</strong><b>15% DESCUENTO</b><p>Stock: 12 unidades</p></div></div>
            <div className="promo-item"><span /> <div><strong>Pintura Satinada 1GL</strong><b>LLEVA 3 PAGA 2</b><p>Stock: 45 unidades</p></div></div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default SellerDashboard
