import { useState, useEffect } from 'react'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('session')
    if (stored) setSession(JSON.parse(stored))
  }, [])

  const handleLogin = (data) => setSession(data)

  const handleLogout = () => {
    sessionStorage.removeItem('session')
    setSession(null)
  }

  if (!session) return <Login onLogin={handleLogin} />
  if (session.role === 'admin') return <AdminDashboard session={session} onLogout={handleLogout} />
  return <UserDashboard session={session} onLogout={handleLogout} />
}