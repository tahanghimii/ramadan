import { useState } from 'react'

export default function UserTable({ users, onEdit, onDelete, isAdmin }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = users.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.schedule === filter
    return matchSearch && matchFilter
  })

  return (
    <>
      <input className="search-bar" placeholder="Search name, email, role, phone..."
        value={search} onChange={e => setSearch(e.target.value)} />
      <div className="filter-tabs">
        {[['all', 'All'], ['8-4', '08:00 → 16:00'], ['9-5', '09:00 → 17:00']].map(([val, label]) => (
          <button key={val} className={`filter-tab ${filter === val ? 'active' : ''}`}
            onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No employees found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Role</th>
              <th>Schedule</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td style={{ color: '#6b7280' }}>{user.email}</td>
                <td>{user.phone || <span style={{ color: '#d1d5db' }}>—</span>}</td>
                <td>
                  <span className={`badge ${user.department === 'Import' ? 'badge-blue' : user.department === 'Export' ? 'badge-orange' : user.department === 'NL' ? 'badge-blue' : 'badge-purple'}`}>
                    {user.department === 'Import' ? '📥' : user.department === 'Export' ? '📤' : user.department === 'NL' ? '🚢' : '🏢'} {user.department}
                  </span>
                </td>
                <td>{user.role || <span style={{ color: '#d1d5db' }}>—</span>}</td>
                <td>
                  <span className={`badge ${user.schedule === '8-4' ? 'badge-green' : 'badge-amber'}`}>
                    {user.schedule === '8-4' ? '🟢 08:00 → 16:00' : '🟡 09:00 → 17:00'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.status === 'break' ? 'badge-break' : 'badge-active'}`}>
                    {user.status === 'break' ? '🏖️ Congé' : '✅ Active'}
                  </span>
                </td>
                {isAdmin && (
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-sm btn-edit" onClick={() => onEdit(user)}>Edit</button>
                    <button className="btn-sm btn-delete" onClick={() => onDelete(user.id)}>Delete</button>
                    <a className="btn-sm btn-email" href={`mailto:${user.email}`}>📧</a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}