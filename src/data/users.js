export const initialUsers = [
  {
    id: 1,
    name: 'Administrador Alexis',
    email: 'admin@ferreteriaalexis.com',
    password: '123456',
    role: 'admin',
    status: 'activo',
  },
  {
    id: 2,
    name: 'Vendedor Alexis',
    email: 'vendedor@ferreteriaalexis.com',
    password: '123456',
    role: 'vendedor',
    status: 'activo',
  },
]

export const roleLabels = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
}

export const statusLabels = {
  activo: 'Activo',
  inactivo: 'Inactivo',
}
