/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { initialUsers } from '../data/users'

const USERS_KEY = 'ferreteria_alexis_users'
const SESSION_KEY = 'ferreteria_alexis_session'

const AuthContext = createContext(null)

const loadUsers = () => {
  const storedUsers = localStorage.getItem(USERS_KEY)
  if (!storedUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers))
    return initialUsers
  }

  return JSON.parse(storedUsers)
}

const loadSession = () => {
  const storedSession = localStorage.getItem(SESSION_KEY)
  return storedSession ? JSON.parse(storedSession) : null
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [currentUser, setCurrentUser] = useState(loadSession)

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  const login = useCallback(
    (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const user = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
    )

    if (!user) {
      return { ok: false, message: 'Correo o contrasena incorrectos.' }
    }

    if (user.status !== 'activo') {
      return { ok: false, message: 'El usuario esta inactivo. Contacte al administrador.' }
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    setCurrentUser(session)
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { ok: true, user: session }
    },
    [users],
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const createUser = useCallback(
    (newUser) => {
    const exists = users.some(
      (user) => user.email.toLowerCase() === newUser.email.trim().toLowerCase(),
    )

    if (exists) {
      return { ok: false, message: 'Ya existe un usuario registrado con ese correo.' }
    }

    const user = {
      ...newUser,
      id: Date.now(),
      email: newUser.email.trim().toLowerCase(),
      name: newUser.name.trim(),
    }

    setUsers((currentUsers) => [...currentUsers, user])
    return { ok: true, message: 'Usuario registrado correctamente.' }
    },
    [users],
  )

  const updateUser = useCallback(
    (id, updatedUser) => {
    const numericId = Number(id)
    const exists = users.some(
      (user) =>
        user.id !== numericId && user.email.toLowerCase() === updatedUser.email.trim().toLowerCase(),
    )

    if (exists) {
      return { ok: false, message: 'Ya existe otro usuario con ese correo.' }
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === numericId
          ? {
              ...user,
              ...updatedUser,
              email: updatedUser.email.trim().toLowerCase(),
              name: updatedUser.name.trim(),
            }
          : user,
      ),
    )

    if (currentUser?.id === numericId) {
      const nextSession = {
        id: numericId,
        name: updatedUser.name.trim(),
        email: updatedUser.email.trim().toLowerCase(),
        role: updatedUser.role,
      }
      setCurrentUser(nextSession)
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    }

    return { ok: true, message: 'Usuario actualizado correctamente.' }
    },
    [currentUser?.id, users],
  )

  const toggleUserStatus = useCallback((id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'activo' ? 'inactivo' : 'activo' }
        : user,
      ),
    )
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      users,
      login,
      logout,
      createUser,
      updateUser,
      toggleUserStatus,
    }),
    [createUser, currentUser, login, logout, toggleUserStatus, updateUser, users],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
