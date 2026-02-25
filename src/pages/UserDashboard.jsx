import { useEffect, useState } from 'react'
import { getUsers } from '../sheets'
import Stats from '../components/Stats'
import UserTable from '../components/UserTable'
import ScheduleCard from '../components/ScheduleCard'

export default function UserDashboard({ session, onLogout }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const dept = session.department

  const icon = dept === 'Import' ? '📥'
             : dept === 'Export' ? '📤'
             : dept === 'NL' ? '🚢' : '🏢'

  const avatarColor = dept === 'Import' ? '#0369a1'
                    : dept === 'Export' ? '#b45309'
                    : dept === 'NL' ? '#0891b2' : '#7c3aed'

  useEffect(() => {
    getUsers(dept).then(data => { setUsers(data); setLoading(false) })
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const activeUsers = users.filter(u => u.status !== 'break')
  const breakUsers  = users.filter(u => u.status === 'break')

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="moon">🌙</div>
          <h2>Ramadan</h2>
          <span>{dept} Team</span>
        </div>
        <nav className="sidebar-nav">
          <a className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
            {icon} {dept} Dashboard
          </a>
        </nav>
        <div className="sidebar-bottom">
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <div className="admin-tag">
            <div className="admin-avatar" style={{ background: avatarColor }}>
              {session.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{session.name}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>{dept} Team</div>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout}>🚪 Sign Out</button>
        </div>
      </aside>

      <main className="main">
        {view === 'dashboard' && (
          <>
            <div className="page-header">
              <h1>{icon} {dept} Team</h1>
              <p>Ramadan schedule — read only</p>
            </div>

            {loading ? <div className="loading">Loading...</div> : (
              <>
                {/* Personal schedule card */}
                <ScheduleCard session={session} users={users} />

                <Stats users={users} label={dept} />

                {/* Active employees */}
                <div className="card">
                  <div className="card-header">
                    <h2>{dept} Team — Active ({activeUsers.length})</h2>
                    <span className={`badge ${dept === 'Import' ? 'badge-blue' : dept === 'Export' ? 'badge-orange' : dept === 'NL' ? 'badge-blue' : 'badge-purple'}`}>
                      {icon} {dept}
                    </span>
                  </div>
                  <UserTable users={activeUsers} isAdmin={false} />
                </div>

                {/* On break employees */}
                {breakUsers.length > 0 && (
                  <div className="card card-break">
                    <div className="card-header">
                      <h2>🏖️ On Break / Congé ({breakUsers.length})</h2>
                      <span className="badge badge-break">Congé</span>
                    </div>
                    <UserTable users={breakUsers} isAdmin={false} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}