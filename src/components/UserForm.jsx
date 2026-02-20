import { useState, useEffect } from 'react'
import { addUser, updateUser } from '../sheets'

const empty = { name: '', email: '', phone: '', password: '', department: 'Import', role: '', schedule: '8-4' }

export default function UserForm({ editingUser, onSave, onError, onCancel }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(editingUser ? {
      name: editingUser.name, email: editingUser.email,
      phone: editingUser.phone || '', password: '',
      department: editingUser.department, role: editingUser.role || '',
      schedule: editingUser.schedule
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

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value })
  })

  return (
    <div className="card">
      <div className="card-header">
        <h2>{editingUser ? '✏️ Edit Employee' : '➕ Add Employee'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input placeholder="e.g. Ahmed Benali" {...f('name')} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" placeholder="e.g. ahmed@company.com" {...f('email')} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input placeholder="e.g. 0661234567" {...f('phone')} />
          </div>
          <div className="form-group">
            <label>Role / Position</label>
            <input placeholder="e.g. Manager, Officer" {...f('role')} />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <select {...f('department')} required>
              <option value="Import">📥 Import</option>
              <option value="Export">📤 Export</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ramadan Schedule *</label>
            <select {...f('schedule')}>
              <option value="8-4">🟢 08:00 → 16:00 (Early)</option>
              <option value="9-5">🟡 09:00 → 17:00 (Late)</option>
            </select>
          </div>
          <div className="form-group">
            <label>{editingUser ? 'New Password (blank = keep)' : 'Password *'}</label>
            <input type="password" placeholder={editingUser ? 'Leave blank to keep' : 'Set login password'}
              {...f('password')} {...(!editingUser && { required: true })} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingUser ? 'Update Employee' : 'Add Employee'}
          </button>
          {editingUser && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  )
}