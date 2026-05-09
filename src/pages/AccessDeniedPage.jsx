import { CircleHelp, LockKeyhole, MessageCircleQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AccessDeniedPage() {
  const { currentUser } = useAuth()
  const homePath = currentUser?.role === 'admin' ? '/admin' : '/vendedor'

  return (
    <main className="access-page">
      <section className="access-card">
        <span className="access-icon">
          <LockKeyhole size={52} />
        </span>
        <h1>Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta seccion.</p>
        <Link className="primary-button" to={homePath}>
          Volver al inicio
        </Link>
        <button className="secondary-button" type="button">
          Solicitar acceso
        </button>
        <footer>
          <strong>Ferreteria Alexis</strong>
          <span>•</span>
          Admin System
        </footer>
      </section>

      <section className="support-cards">
        <article>
          <CircleHelp size={24} />
          <div>
            <strong>Centro de Ayuda</strong>
            <p>¿Necesitas asistencia?</p>
          </div>
        </article>
        <article>
          <MessageCircleQuestion size={24} />
          <div>
            <strong>Contactar Soporte</strong>
            <p>Habla con un administrador</p>
          </div>
        </article>
      </section>
    </main>
  )
}

export default AccessDeniedPage
