import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AccessDeniedPage from './pages/AccessDeniedPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import SellerDashboard from './pages/SellerDashboard'
import UserFormPage from './pages/UserFormPage'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor"
        element={
          <ProtectedRoute allowedRoles={['vendedor']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios/nuevo"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios/:id/editar"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/acceso-denegado"
        element={
          <ProtectedRoute>
            <AccessDeniedPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
