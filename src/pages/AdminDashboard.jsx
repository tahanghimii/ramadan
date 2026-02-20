import { useState, useEffect } from 'react'
import { getUsers, deleteUser, getAdmins, deleteAdmin } from '../sheets'
import Stats from '../components/Stats'
import UserForm from '../components/UserForm'
import UserTable from '../components/UserTable'
import AdminForm from '../components/AdminForm'
import AdminTable from '../components/AdminTable'

export default function AdminDashboard({ session, onLogout }) {
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [view, setView] = useState('dashboard')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [u, a] = await Promise.all([getUsers(), getAdmins()])
    setUsers(u)
    setAdmins(a)
    setLoading(false)
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this employee?')) return
    await deleteUser(id)
    showMessage('Employee deleted')
    fetchAll()
  }

  const handleDeleteAdmin = async (id) => {
    if (id === session.id) return showMessage('Cannot delete yourself', 'error')
    if (!confirm('Delete this admin?')) return
    const result = await deleteAdmin(id)
    if (result.error) return showMessage(result.error, 'error')
    showMessage('Admin deleted')
    fetchAll()
  }

  const importUsers = users.filter(u => u.department === 'Import')
  const exportUsers = users.filter(u => u.department === 'Export')
  const nlUsers = users.filter(u => u.department === 'NL')
  const administrationUsers = users.filter(u => u.department === 'Administration')

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="moon">🌙</div>
          <h2>Ramadan</h2>
          <span>Admin Portal</span>
        </div>
        <nav className="sidebar-nav">
          <a className={view === 'dashboard'      ? 'active' : ''} onClick={() => setView('dashboard')}>📊 Dashboard</a>
          <a className={view === 'users'          ? 'active' : ''} onClick={() => setView('users')}>👥 All Employees</a>
          <a className={view === 'import'         ? 'active' : ''} onClick={() => setView('import')}>📥 Import Team</a>
          <a className={view === 'export'         ? 'active' : ''} onClick={() => setView('export')}>📤 Export Team</a>
          <a className={view === 'nl'             ? 'active' : ''} onClick={() => setView('nl')}>🚢 NL Team</a>
          <a className={view === 'administration' ? 'active' : ''} onClick={() => setView('administration')}>🏢 Administration</a>
          <a className={view === 'admins'         ? 'active' : ''} onClick={() => setView('admins')}>🔐 Admins</a>

        </nav>
        <div className="sidebar-bottom">
          <div className="admin-tag">
            <div className="admin-avatar">{session.username[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{session.username}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Administrator</div>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout}>🚪 Sign Out</button>
        </div>
      </aside>

      <main className="main">
        {loading && <div className="loading">Loading...</div>}

        {!loading && message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}
            style={{ marginBottom: 20 }}>{message.text}</div>
        )}

        {!loading && view === 'dashboard' && (
  <>
    <div className="page-header">
      <h1>Dashboard</h1>
      <p>Ramadan schedule overview</p>
    </div>
    <Stats users={users} />
    <div className="team-overview">

      <div className="team-card import-card">
        <div className="team-card-header">
          <span className="team-icon">📥</span>
          <div><h3>Import Team</h3><p>{importUsers.length} employees</p></div>
        </div>
        <div className="team-schedule-breakdown">
          <div className="breakdown-item">
            <span className="badge badge-green">08:00 → 16:00</span>
            <span>{importUsers.filter(u => u.schedule === '8-4').length} people</span>
          </div>
          <div className="breakdown-item">
            <span className="badge badge-amber">09:00 → 17:00</span>
            <span>{importUsers.filter(u => u.schedule === '9-5').length} people</span>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }}
          onClick={() => setView('import')}>View Import Team →</button>
      </div>

      <div className="team-card export-card">
        <div className="team-card-header">
          <span className="team-icon">📤</span>
          <div><h3>Export Team</h3><p>{exportUsers.length} employees</p></div>
        </div>
        <div className="team-schedule-breakdown">
          <div className="breakdown-item">
            <span className="badge badge-green">08:00 → 16:00</span>
            <span>{exportUsers.filter(u => u.schedule === '8-4').length} people</span>
          </div>
          <div className="breakdown-item">
            <span className="badge badge-amber">09:00 → 17:00</span>
            <span>{exportUsers.filter(u => u.schedule === '9-5').length} people</span>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }}
          onClick={() => setView('export')}>View Export Team →</button>
      </div>

      <div className="team-card nl-card">
        <div className="team-card-header">
          <span className="team-icon">🚢</span>
          <div><h3>NL Team</h3><p>{nlUsers.length} employees</p></div>
        </div>
        <div className="team-schedule-breakdown">
          <div className="breakdown-item">
            <span className="badge badge-green">08:00 → 16:00</span>
            <span>{nlUsers.filter(u => u.schedule === '8-4').length} people</span>
          </div>
          <div className="breakdown-item">
            <span className="badge badge-amber">09:00 → 17:00</span>
            <span>{nlUsers.filter(u => u.schedule === '9-5').length} people</span>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }}
          onClick={() => setView('nl')}>View NL Team →</button>
      </div>

      <div className="team-card admin-card">
        <div className="team-card-header">
          <span className="team-icon">🏢</span>
          <div><h3>Administration</h3><p>{administrationUsers.length} employees</p></div>
        </div>
        <div className="team-schedule-breakdown">
          <div className="breakdown-item">
            <span className="badge badge-green">08:00 → 16:00</span>
            <span>{administrationUsers.filter(u => u.schedule === '8-4').length} people</span>
          </div>
          <div className="breakdown-item">
            <span className="badge badge-amber">09:00 → 17:00</span>
            <span>{administrationUsers.filter(u => u.schedule === '9-5').length} people</span>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }}
          onClick={() => setView('administration')}>View Administration →</button>
      </div>

    </div>
  </>
)}

        {!loading && view === 'users' && (
          <>
            <div className="page-header"><h1>All Employees</h1></div>
            <UserForm editingUser={editingUser}
              onSave={() => { fetchAll(); setEditingUser(null); showMessage(editingUser ? 'Updated!' : 'Added!') }}
              onError={msg => showMessage(msg, 'error')}
              onCancel={() => setEditingUser(null)} />
            <div className="card">
              <div className="card-header"><h2>Employee List ({users.length})</h2></div>
              <UserTable users={users} onEdit={setEditingUser} onDelete={handleDeleteUser} isAdmin />
            </div>
          </>
        )}

        {!loading && view === 'import' && (
          <>
            <div className="page-header"><h1>📥 Import Team</h1><p>{importUsers.length} employees</p></div>
            <Stats users={importUsers} label="Import" />
            <div className="card">
              <div className="card-header"><h2>Import Team Members</h2></div>
              <UserTable users={importUsers}
                onEdit={u => { setEditingUser(u); setView('users') }}
                onDelete={handleDeleteUser} isAdmin />
            </div>
          </>
        )}

        {!loading && view === 'export' && (
          <>
            <div className="page-header"><h1>📤 Export Team</h1><p>{exportUsers.length} employees</p></div>
            <Stats users={exportUsers} label="Export" />
            <div className="card">
              <div className="card-header"><h2>Export Team Members</h2></div>
              <UserTable users={exportUsers}
                onEdit={u => { setEditingUser(u); setView('users') }}
                onDelete={handleDeleteUser} isAdmin />
            </div>
          </>
        )}
        {!loading && view === 'nl' && (
  <>
    <div className="page-header"><h1>🚢 NL Team</h1><p>{nlUsers.length} employees</p></div>
    <Stats users={nlUsers} label="NL" />
    <div className="card">
      <div className="card-header"><h2>NL Team Members</h2></div>
      <UserTable users={nlUsers}
        onEdit={u => { setEditingUser(u); setView('users') }}
        onDelete={handleDeleteUser} isAdmin />
    </div>
  </>
)}

{!loading && view === 'administration' && (
  <>
    <div className="page-header"><h1>🏢 Administration</h1><p>{administrationUsers.length} employees</p></div>
    <Stats users={administrationUsers} label="Administration" />
    <div className="card">
      <div className="card-header"><h2>Administration Members</h2></div>
      <UserTable users={administrationUsers}
        onEdit={u => { setEditingUser(u); setView('users') }}
        onDelete={handleDeleteUser} isAdmin />
    </div>
  </>
)}

        {!loading && view === 'admins' && (
          <>
            <div className="page-header"><h1>🔐 Admins</h1></div>
            <AdminForm editingAdmin={editingAdmin}
              onSave={() => { fetchAll(); setEditingAdmin(null); showMessage(editingAdmin ? 'Admin updated!' : 'Admin added!') }}
              onError={msg => showMessage(msg, 'error')}
              onCancel={() => setEditingAdmin(null)} />
            <div className="card">
              <div className="card-header"><h2>Admin List ({admins.length})</h2></div>
              <AdminTable admins={admins} currentId={session.id}
                onEdit={setEditingAdmin} onDelete={handleDeleteAdmin} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}