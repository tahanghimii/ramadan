import { useState, useEffect, useRef } from 'react'
import { getUsers, deleteUser, getAdmins, deleteAdmin } from '../sheets'
import { logAction, getAuditLog } from '../utils/auditLog'
import { exportToExcel } from '../utils/exportExcel'
import Stats from '../components/Stats'
import UserForm from '../components/UserForm'
import UserTable from '../components/UserTable'
import AdminForm from '../components/AdminForm'
import AdminTable from '../components/AdminTable'
import EmailComposer from '../components/EmailComposer'
import ConfirmModal from '../components/ConfirmModal'
import SidebarSearch from '../components/SidebarSearch'
import RamadanCountdown from '../components/RamadanCountdown'
import StatsChart from '../components/StatsChart'

export default function AdminDashboard({ session, onLogout }) {
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [view, setView] = useState('dashboard')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [auditLog, setAuditLog] = useState([])
  const printRef = useRef()

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const fetchAll = async () => {
    setLoading(true)
    const [u, a, log] = await Promise.all([getUsers(), getAdmins(), getAuditLog()])
    setUsers(u)
    setAdmins(a)
    setAuditLog(log)
    setLoading(false)
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleDeleteUser = (id) => {
    const user = users.find(u => u.id === id)
    setConfirm({
      message: `Delete ${user?.name}? This cannot be undone.`,
      onConfirm: async () => {
        await deleteUser(id)
        await logAction(session.username, 'DELETE', `Deleted employee: ${user?.name} (${user?.email})`)
        setConfirm(null)
        showMessage('Employee deleted')
        fetchAll()
      }
    })
  }

  const handleDeleteAdmin = (id) => {
    if (id === session.id) return showMessage('Cannot delete yourself', 'error')
    setConfirm({
      message: 'This admin account will be permanently deleted.',
      onConfirm: async () => {
        const result = await deleteAdmin(id)
        setConfirm(null)
        if (result.error) return showMessage(result.error, 'error')
        showMessage('Admin deleted')
        fetchAll()
      }
    })
  }

  const handlePrint = () => window.print()

  const handleSidebarSelect = (user) => {
    setEditingUser(user)
    setView('users')
  }

  const importUsers         = users.filter(u => u.department === 'Import')
  const exportUsers         = users.filter(u => u.department === 'Export')
  const nlUsers             = users.filter(u => u.department === 'NL')
  const administrationUsers = users.filter(u => u.department === 'Administration')
  const activeUsers         = users.filter(u => u.status !== 'break')
  const breakUsers          = users.filter(u => u.status === 'break')

  const TeamCard = ({ icon, title, list, viewName, cardClass }) => (
    <div className={`team-card ${cardClass}`}>
      <div className="team-card-header">
        <span className="team-icon">{icon}</span>
        <div><h3>{title}</h3><p>{list.length} employees</p></div>
      </div>
      <div className="team-schedule-breakdown">
        <div className="breakdown-item">
          <span className="badge badge-green">08:00 → 16:00</span>
          <span>{list.filter(u => u.schedule === '8-4').length} people</span>
        </div>
        <div className="breakdown-item">
          <span className="badge badge-amber">09:00 → 17:00</span>
          <span>{list.filter(u => u.schedule === '9-5').length} people</span>
        </div>
      </div>
      <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }}
        onClick={() => setView(viewName)}>View {title} →</button>
    </div>
  )

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="moon">🌙</div>
          <h2>Ramadan</h2>
          <span>Admin Portal</span>
        </div>

        <div style={{ padding: '12px 12px 0' }}>
          <SidebarSearch users={users} onSelect={handleSidebarSelect} />
        </div>

        <nav className="sidebar-nav">
          <a className={view === 'dashboard'      ? 'active' : ''} onClick={() => setView('dashboard')}>📊 Dashboard</a>
          <a className={view === 'users'          ? 'active' : ''} onClick={() => setView('users')}>👥 All Employees</a>
          <a className={view === 'import'         ? 'active' : ''} onClick={() => setView('import')}>📥 Import Team</a>
          <a className={view === 'export'         ? 'active' : ''} onClick={() => setView('export')}>📤 Export Team</a>
          <a className={view === 'nl'             ? 'active' : ''} onClick={() => setView('nl')}>🚢 NL Team</a>
          <a className={view === 'administration' ? 'active' : ''} onClick={() => setView('administration')}>🏢 Administration</a>
          <a className={view === 'admins'         ? 'active' : ''} onClick={() => setView('admins')}>🔐 Admins</a>
          <a className={view === 'auditlog'       ? 'active' : ''} onClick={() => setView('auditlog')}>🕓 Audit Log</a>
          <a onClick={() => exportToExcel(users)}>📥 Export Excel</a>
          <a onClick={() => setShowEmail(true)}>📧 Send Email</a>
          <a onClick={handlePrint}>🖨️ Print Schedule</a>
        </nav>

        <div className="sidebar-bottom">
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
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

      <main className="main" ref={printRef}>

        {loading && <div className="loading">Loading...</div>}

        {!loading && message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}
            style={{ marginBottom: 20 }}>{message.text}
          </div>
        )}

        {/* ── Dashboard ── */}
        {!loading && view === 'dashboard' && (
          <>
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>Ramadan schedule overview</p>
            </div>

            <RamadanCountdown />
            <Stats users={users} />
            <StatsChart users={users} />

            {breakUsers.length > 0 && (
              <div className="card card-break" style={{ marginBottom: 24 }}>
                <div className="card-header">
                  <h2>🏖️ Currently on Break ({breakUsers.length})</h2>
                  <span className="badge badge-break">Congé</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {breakUsers.map(u => (
                    <span key={u.id} className="break-chip">
                      {u.name} · {u.department}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="team-overview">
              <TeamCard icon="📥" title="Import Team"    list={importUsers}         viewName="import"         cardClass="import-card" />
              <TeamCard icon="📤" title="Export Team"    list={exportUsers}         viewName="export"         cardClass="export-card" />
              <TeamCard icon="🚢" title="NL Team"        list={nlUsers}             viewName="nl"             cardClass="nl-card" />
              <TeamCard icon="🏢" title="Administration" list={administrationUsers} viewName="administration" cardClass="admin-card" />
            </div>
          </>
        )}

        {/* ── All Employees ── */}
        {!loading && view === 'users' && (
          <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><h1>All Employees</h1></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={() => setShowEmail(true)}>📧 Email</button>
                <button className="btn btn-ghost" onClick={handlePrint}>🖨️ Print</button>
              </div>
            </div>
            <UserForm
              editingUser={editingUser}
              onSave={async () => {
                await logAction(session.username, editingUser ? 'UPDATE' : 'CREATE',
                  editingUser ? `Updated employee: ${editingUser.name}` : 'Added new employee')
                fetchAll()
                setEditingUser(null)
                showMessage(editingUser ? 'Updated!' : 'Added!')
              }}
              onError={msg => showMessage(msg, 'error')}
              onCancel={() => setEditingUser(null)}
            />
            <div className="card">
              <div className="card-header"><h2>Active Employees ({activeUsers.length})</h2></div>
              <UserTable users={activeUsers} onEdit={setEditingUser} onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
            </div>
            {breakUsers.length > 0 && (
              <div className="card card-break">
                <div className="card-header">
                  <h2>🏖️ On Break ({breakUsers.length})</h2>
                  <span className="badge badge-break">Congé</span>
                </div>
                <UserTable users={breakUsers} onEdit={setEditingUser} onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
              </div>
            )}
          </>
        )}

        {/* ── Import ── */}
        {!loading && view === 'import' && (
          <>
            <div className="page-header"><h1>📥 Import Team</h1><p>{importUsers.length} employees</p></div>
            <Stats users={importUsers} label="Import" />
            <div className="card">
              <div className="card-header">
                <h2>Active ({importUsers.filter(u => u.status !== 'break').length})</h2>
                <button className="btn btn-primary" onClick={() => setShowEmail(true)}>📧 Email Team</button>
              </div>
              <UserTable users={importUsers.filter(u => u.status !== 'break')}
                onEdit={u => { setEditingUser(u); setView('users') }}
                onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
            </div>
            {importUsers.filter(u => u.status === 'break').length > 0 && (
              <div className="card card-break">
                <div className="card-header"><h2>🏖️ On Break</h2></div>
                <UserTable users={importUsers.filter(u => u.status === 'break')}
                  onEdit={u => { setEditingUser(u); setView('users') }}
                  onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
              </div>
            )}
          </>
        )}

        {/* ── Export ── */}
        {!loading && view === 'export' && (
          <>
            <div className="page-header"><h1>📤 Export Team</h1><p>{exportUsers.length} employees</p></div>
            <Stats users={exportUsers} label="Export" />
            <div className="card">
              <div className="card-header">
                <h2>Active ({exportUsers.filter(u => u.status !== 'break').length})</h2>
                <button className="btn btn-primary" onClick={() => setShowEmail(true)}>📧 Email Team</button>
              </div>
              <UserTable users={exportUsers.filter(u => u.status !== 'break')}
                onEdit={u => { setEditingUser(u); setView('users') }}
                onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
            </div>
            {exportUsers.filter(u => u.status === 'break').length > 0 && (
              <div className="card card-break">
                <div className="card-header"><h2>🏖️ On Break</h2></div>
                <UserTable users={exportUsers.filter(u => u.status === 'break')}
                  onEdit={u => { setEditingUser(u); setView('users') }}
                  onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
              </div>
            )}
          </>
        )}

        {/* ── NL ── */}
        {!loading && view === 'nl' && (
          <>
            <div className="page-header"><h1>🚢 NL Team</h1><p>{nlUsers.length} employees</p></div>
            <Stats users={nlUsers} label="NL" />
            <div className="card">
              <div className="card-header">
                <h2>Active ({nlUsers.filter(u => u.status !== 'break').length})</h2>
                <button className="btn btn-primary" onClick={() => setShowEmail(true)}>📧 Email Team</button>
              </div>
              <UserTable users={nlUsers.filter(u => u.status !== 'break')}
                onEdit={u => { setEditingUser(u); setView('users') }}
                onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
            </div>
            {nlUsers.filter(u => u.status === 'break').length > 0 && (
              <div className="card card-break">
                <div className="card-header"><h2>🏖️ On Break</h2></div>
                <UserTable users={nlUsers.filter(u => u.status === 'break')}
                  onEdit={u => { setEditingUser(u); setView('users') }}
                  onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
              </div>
            )}
          </>
        )}

        {/* ── Administration ── */}
        {!loading && view === 'administration' && (
          <>
            <div className="page-header"><h1>🏢 Administration</h1><p>{administrationUsers.length} employees</p></div>
            <Stats users={administrationUsers} label="Administration" />
            <div className="card">
              <div className="card-header">
                <h2>Active ({administrationUsers.filter(u => u.status !== 'break').length})</h2>
                <button className="btn btn-primary" onClick={() => setShowEmail(true)}>📧 Email Team</button>
              </div>
              <UserTable users={administrationUsers.filter(u => u.status !== 'break')}
                onEdit={u => { setEditingUser(u); setView('users') }}
                onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
            </div>
            {administrationUsers.filter(u => u.status === 'break').length > 0 && (
              <div className="card card-break">
                <div className="card-header"><h2>🏖️ On Break</h2></div>
                <UserTable users={administrationUsers.filter(u => u.status === 'break')}
                  onEdit={u => { setEditingUser(u); setView('users') }}
                  onDelete={handleDeleteUser} isAdmin onRefresh={fetchAll} />
              </div>
            )}
          </>
        )}

        {/* ── Admins ── */}
        {!loading && view === 'admins' && (
          <>
            <div className="page-header"><h1>🔐 Admins</h1></div>
            <AdminForm
              editingAdmin={editingAdmin}
              onSave={() => { fetchAll(); setEditingAdmin(null); showMessage(editingAdmin ? 'Admin updated!' : 'Admin added!') }}
              onError={msg => showMessage(msg, 'error')}
              onCancel={() => setEditingAdmin(null)}
            />
            <div className="card">
              <div className="card-header"><h2>Admin List ({admins.length})</h2></div>
              <AdminTable admins={admins} currentId={session.id}
                onEdit={setEditingAdmin} onDelete={handleDeleteAdmin} />
            </div>
          </>
        )}

        {/* ── Audit Log ── */}
        {!loading && view === 'auditlog' && (
          <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><h1>🕓 Audit Log</h1><p>All admin actions recorded</p></div>
              <button className="btn btn-ghost" onClick={() => exportToExcel(auditLog.map(l => ({
                Admin: l.admin, Action: l.action, Details: l.details, Date: l.date
              })))}>📥 Export</button>
            </div>
            <div className="card">
              {auditLog.length === 0 ? (
                <div className="empty">No actions recorded yet</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Admin</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((log, i) => (
                      <tr key={i}>
                        <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{log.date}</td>
                        <td><strong>{log.admin}</strong></td>
                        <td>
                          <span className={`badge ${log.action === 'DELETE' ? 'badge-break' : log.action === 'CREATE' ? 'badge-green' : 'badge-amber'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontSize: 13, color: '#374151' }}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      </main>

      {showEmail && <EmailComposer users={users} onClose={() => setShowEmail(false)} />}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

    </div>
  )
}