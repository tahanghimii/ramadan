import { useState } from 'react'
import { loginAdmin, loginUser } from '../sheets'

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('admin')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = tab === 'admin'
      ? await loginAdmin(form.username, form.password)
      : await loginUser(form.email, form.password)
    if (result.error) { setError(result.error); setLoading(false); return }
    const stored = JSON.parse(sessionStorage.getItem('session'))
    onLogin(stored)
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="moon">🌙</div>
          <h1>Ramadan</h1>
          <p>Schedule Manager — Sign in to continue</p>
        </div>

        <div className="login-toggle">
          <button type="button" className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>
            🔐 Admin
          </button>
          <button type="button" className={tab === 'user' ? 'active' : ''} onClick={() => setTab('user')}>
            👤 Employee
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'admin' ? (
            <>
              <label>Username</label>
              <input type="text" placeholder="Admin username" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} required autoFocus />
            </>
          ) : (
            <>
              <label>Email</label>
              <input type="email" placeholder="Your work email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required autoFocus />
            </>
          )}
          <label>Password</label>
          <input type="password" placeholder="Enter password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}