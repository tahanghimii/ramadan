import { useState } from 'react'

export default function EmailComposer({ users, onClose }) {
  const [mode, setMode] = useState('single')
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const getRecipients = () => {
    if (mode === 'single') {
      return selectedUser ? [selectedUser] : []
    }
    if (selectedDept === 'all') {
      return users.map(u => u.email).filter(Boolean)
    }
    return users
      .filter(u => u.department === selectedDept)
      .map(u => u.email)
      .filter(Boolean)
  }

  const handleSend = () => {
    const recipients = getRecipients()
    if (recipients.length === 0) return alert('Please select a recipient')
    if (!subject.trim()) return alert('Please enter a subject')
    const to = recipients.join(';')
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  const recipients = getRecipients()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>📧 Send Email</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="login-toggle" style={{ marginBottom: 20 }}>
          <button type="button"
            className={mode === 'single' ? 'active' : ''}
            onClick={() => setMode('single')}>
            👤 Single Employee
          </button>
          <button type="button"
            className={mode === 'department' ? 'active' : ''}
            onClick={() => setMode('department')}>
            👥 Department
          </button>
        </div>

        {mode === 'single' && (
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Select Employee</label>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="">-- Choose employee --</option>
              {users.map(u => (
                <option key={u.id} value={u.email}>
                  {u.name} ({u.department}) — {u.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === 'department' && (
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Select Department</label>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
              <option value="all">📢 All Employees</option>
              <option value="Import">📥 Import Team</option>
              <option value="Export">📤 Export Team</option>
              <option value="NL">🚢 NL Team</option>
              <option value="Administration">🏢 Administration</option>
            </select>
          </div>
        )}

        {recipients.length > 0 && (
          <div className="recipients-preview">
            <span className="recipients-label">
              To: {recipients.length} recipient{recipients.length > 1 ? 's' : ''}
            </span>
            <div className="recipients-list">{recipients.join(', ')}</div>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Subject *</label>
          <input
            placeholder="e.g. Ramadan Schedule Update"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Message</label>
          <textarea
            placeholder="Type your message here..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            style={{
              width: '100%', padding: '10px 12px',
              border: '1.5px solid #e5e7eb', borderRadius: 8,
              fontSize: 14, resize: 'vertical', fontFamily: 'inherit'
            }}
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSend}>
            📧 Open in Outlook
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  )
}