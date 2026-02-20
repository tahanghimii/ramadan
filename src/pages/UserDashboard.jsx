import { useEffect, useState } from 'react'
import { getUsers } from '../sheets'
import Stats from '../components/Stats'
import UserTable from '../components/UserTable'

export default function UserDashboard({ session, onLogout }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const dept = session.department
const icon = dept === 'Import' ? '📥' 
           : dept === 'Export' ? '📤'
           : dept === 'NL' ? '🚢'
           : '🏢'

  useEffect(() => {
    getUsers(dept).then(data => { setUsers(data); setLoading(false) })
  }, [])

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="moon">🌙</div>
          <h2>Ramadan</h2>
          <span>{dept} Team</span>
        </div>
        <nav className="sidebar-nav">
          <a className="active">{icon} {dept} Dashboard</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-tag">
            <div className="admin-avatar"
              style={{ background: dept === 'Import' ? '#0369a1' 
          : dept === 'Export' ? '#b45309'
          : dept === 'NL' ? '#0891b2'
          : '#7c3aed' }}>
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
        <div className="page-header">
          <h1>{icon} {dept} Team</h1>
          <p>Ramadan schedule — read only</p>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <>
            <Stats users={users} label={dept} />
            <div className="card">
              <div className="card-header">
                <h2>{dept} Team Members ({users.length})</h2>
                <span className={`badge ${dept === 'Import' ? 'badge-blue' : 'badge-orange'}`}>{dept}</span>
              </div>
              <UserTable users={users} isAdmin={false} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}