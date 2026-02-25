import { useState } from 'react'
import { updateUser } from '../sheets'

export default function BulkActions({ selectedIds, users, onDone, onCancel }) {
  const [action, setAction] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const selected = users.filter(u => selectedIds.includes(u.id))

  const handleApply = async () => {
    if (!action || !value) return alert('Please select an action and value')
    setLoading(true)
    for (const user of selected) {
      await updateUser(user.id, { ...user, [action]: value })
    }
    setLoading(false)
    onDone()
  }

  return (
    <div className="bulk-bar">
      <div className="bulk-info">
        <span className="bulk-count">{selectedIds.length} selected</span>
      </div>

      <div className="bulk-controls">
        <select value={action} onChange={e => { setAction(e.target.value); setValue('') }}>
          <option value="">Select action...</option>
          <option value="schedule">Change Schedule</option>
          <option value="status">Change Status</option>
          <option value="department">Change Department</option>
        </select>

        {action === 'schedule' && (
          <select value={value} onChange={e => setValue(e.target.value)}>
            <option value="">Select schedule...</option>
            <option value="8-4">🟢 08:00 → 16:00</option>
            <option value="9-5">🟡 09:00 → 17:00</option>
          </select>
        )}

        {action === 'status' && (
          <select value={value} onChange={e => setValue(e.target.value)}>
            <option value="">Select status...</option>
            <option value="active">✅ Active</option>
            <option value="break">🏖️ On Break</option>
          </select>
        )}

        {action === 'department' && (
          <select value={value} onChange={e => setValue(e.target.value)}>
            <option value="">Select department...</option>
            <option value="Import">📥 Import</option>
            <option value="Export">📤 Export</option>
            <option value="NL">🚢 NL</option>
            <option value="Administration">🏢 Administration</option>
          </select>
        )}

        <button className="btn btn-primary" onClick={handleApply} disabled={loading}>
          {loading ? 'Applying...' : 'Apply'}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}