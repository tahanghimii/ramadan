const API = import.meta.env.VITE_SHEETS_API

async function call(params) {
  const url = new URL(API)
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
  const res = await fetch(url.toString())
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { error: text } }
}

// ── Auth ──────────────────────────────────────────────────────
export async function loginAdmin(username, password) {
  const records = await call({ action: 'getWhere', sheet: 'Admins', field: 'username', value: username })
  if (!Array.isArray(records) || records.length === 0)
    return { error: 'Invalid credentials' }
  if (records[0].password !== password)
    return { error: 'Invalid credentials' }
  const admin = records[0]
  sessionStorage.setItem('session', JSON.stringify({
    id: admin.id, username: admin.username, role: 'admin'
  }))
  return { success: true }
}

export async function loginUser(email, password) {
  const records = await call({ action: 'getWhere', sheet: 'Users', field: 'email', value: email })
  if (!Array.isArray(records) || records.length === 0)
    return { error: 'Invalid credentials' }
  if (records[0].password !== password)
    return { error: 'Invalid credentials' }
  const user = records[0]
  sessionStorage.setItem('session', JSON.stringify({
    id: user.id, name: user.name, email: user.email,
    department: user.department, role: 'user'
  }))
  return { success: true }
}

// ── Users ─────────────────────────────────────────────────────
export async function getUsers(department = null) {
  let users
  if (department) {
    users = await call({ action: 'getWhere', sheet: 'Users', field: 'department', value: department })
  } else {
    users = await call({ action: 'getAll', sheet: 'Users' })
  }
  if (!Array.isArray(users)) return []
  return users.map(({ password, ...u }) => u)
}

export async function addUser(data) {
  const existing = await call({ action: 'getWhere', sheet: 'Users', field: 'email', value: data.email })
  if (Array.isArray(existing) && existing.length > 0)
    return { error: 'Email already exists' }
  const result = await call({ action: 'create', sheet: 'Users', data: JSON.stringify(data) })
  if (result.error) return result
  return { success: true }
}

export async function updateUser(id, data) {
  const result = await call({ action: 'update', sheet: 'Users', id, data: JSON.stringify(data) })
  if (result.error) return result
  return { success: true }
}

export async function deleteUser(id) {
  await call({ action: 'delete', sheet: 'Users', id })
  return { success: true }
}

// ── Admins ────────────────────────────────────────────────────
export async function getAdmins() {
  const admins = await call({ action: 'getAll', sheet: 'Admins' })
  if (!Array.isArray(admins)) return []
  return admins.map(({ password, ...a }) => a)
}

export async function addAdmin(data) {
  const existing = await call({ action: 'getWhere', sheet: 'Admins', field: 'username', value: data.username })
  if (Array.isArray(existing) && existing.length > 0)
    return { error: 'Username already exists' }
  const result = await call({ action: 'create', sheet: 'Admins', data: JSON.stringify(data) })
  if (result.error) return result
  return { success: true }
}

export async function updateAdmin(id, data) {
  const result = await call({ action: 'update', sheet: 'Admins', id, data: JSON.stringify(data) })
  if (result.error) return result
  return { success: true }
}

export async function deleteAdmin(id) {
  const admins = await getAdmins()
  if (admins.length <= 1) return { error: 'Cannot delete last admin' }
  await call({ action: 'delete', sheet: 'Admins', id })
  return { success: true }
}