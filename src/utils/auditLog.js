const API = import.meta.env.VITE_SHEETS_API

async function call(params) {
  const url = new URL(API)
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
  const res = await fetch(url.toString())
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { error: text } }
}

export async function logAction(adminUsername, action, details) {
  await call({
    action: 'create',
    sheet: 'AuditLog',
    data: JSON.stringify({
      admin:   adminUsername,
      action,
      details,
      date:    new Date().toLocaleString('en-GB')
    })
  })
}

export async function getAuditLog() {
  const rows = await call({ action: 'getAll', sheet: 'AuditLog' })
  if (!Array.isArray(rows)) return []
  return rows.reverse()
}
