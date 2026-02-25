import * as XLSX from 'xlsx'

export function exportToExcel(users) {
  const rows = users.map(u => ({
    'Name':        u.name,
    'Email':       u.email,
    'Phone':       u.phone || '',
    'Department':  u.department,
    'Role':        u.role || '',
    'Schedule':    u.schedule === '8-4' ? '08:00 → 16:00' : '09:00 → 17:00',
    'Status':      u.status === 'break' ? 'On Break' : 'Active',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 25 }, // Name
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 15 }, // Department
    { wch: 20 }, // Role
    { wch: 18 }, // Schedule
    { wch: 12 }, // Status
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Ramadan Schedule')
  XLSX.writeFile(wb, `ramadan-schedule-${new Date().toISOString().slice(0,10)}.xlsx`)
}