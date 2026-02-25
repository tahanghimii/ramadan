import { useState, useEffect } from 'react'
import { addUser, updateUser } from '../sheets'

const empty = {
  name: '', email: '', phone: '', password: '',
  department: 'Import', role: '', schedule: '8-4', status: 'active'
}

export default function UserForm({ editingUser, onSave, onError, onCancel }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(editingUser ? {
      name:       editingUser.name,
      email:      editingUser.email,
      phone:      editingUser.phone || '',
      password:   '',
      department: editingUser.department,
      role:       editingUser.role || '',
      schedule:   editingUser.schedule,
      status:     editingUser.status || 'active'
    } : empty)
  }, [editingUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let result
    if (editingUser) {
      const data = { ...form }
      if (!data.password) delete data.password
      result = await updateUser(editingUser.id, data)
    } else {
      result = await addUser(form)
    }
    if (result.error) { onError(result.error); setLoading(false); return }
    onSave()
    setLoading(false)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{editingUser ? '✏️ Edit Employee' : '➕ Add Employee'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label>Full Name *</label>
            <input
              placeholder="e.g. Ahmed Benali"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              placeholder="e.g. ahmed@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              placeholder="e.g. 0661234567"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Role / Position</label>
            <input
              placeholder="e.g. Manager, Officer"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="Import">📥 Import</option>
              <option value="Export">📤 Export</option>
              <option value="NL">🚢 NL</option>
              <option value="Administration">🏢 Administration</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ramadan Schedule *</label>
            <select
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
            >
              <option value="8-4">🟢 08:00 → 16:00 (Early)</option>
              <option value="9-5">🟡 09:00 → 17:00 (Late)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">✅ Active</option>
              <option value="break">🏖️ On Break (Congé)</option>
            </select>
          </div>

          <div className="form-group">
            <label>{editingUser ? 'New Password (blank = keep)' : 'Password *'}</label>
            <input
              type="password"
              placeholder={editingUser ? 'Leave blank to keep' : 'Set login password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              {...(!editingUser && { required: true })}
            />
          </div>

        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingUser ? 'Update Employee' : 'Add Employee'}
          </button>
          {editingUser && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  )
}