import { AlertCircle, CheckCircle2 } from 'lucide-react'

function AlertMessage({ message, type = 'success' }) {
  if (!message) {
    return null
  }

  const Icon = type === 'error' ? AlertCircle : CheckCircle2

  return (
    <div className={`alert alert-${type}`} role="alert">
      <Icon size={22} />
      {message}
    </div>
  )
}

export default AlertMessage
