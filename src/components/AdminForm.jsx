import { useState, useEffect } from 'react'
import { addAdmin, updateAdmin } from '../sheets'

const empty = { username: '', password: '' }

export default function AdminForm({ editingAdmin, onSave, onError, onCancel }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(editingAdmin ? { username: editingAdmin.username, password: '' } : empty)
  }, [editingAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let result
    if (editingAdmin) {
      const data = { ...form }
      if (!data.password) delete data.password
      result = await updateAdmin(editingAdmin.id, data)
    } else {
      result = await addAdmin(form)
    }
    if (result.error) { onError(result.error); setLoading(false); return }
    onSave()
    setLoading(false)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{editingAdmin ? '✏️ Edit Admin' : '➕ Add Admin'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Username *</label>
            <input placeholder="e.g. manager1" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{editingAdmin ? 'New Password (blank = keep)' : 'Password *'}</label>
            <input type="password" placeholder={editingAdmin ? 'Leave blank to keep' : 'Set password'}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              {...(!editingAdmin && { required: true })} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Add Admin'}
          </button>
          {editingAdmin && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  )
}