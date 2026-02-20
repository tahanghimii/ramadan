export default function Stats({ users, label }) {
  const count84 = users.filter(u => u.schedule === '8-4').length
  const count95 = users.filter(u => u.schedule === '9-5').length
  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-icon blue">👥</div>
        <div className="stat-info">
          <div className="number">{users.length}</div>
          <div className="label">{label ? `${label} Employees` : 'Total Employees'}</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green">🟢</div>
        <div className="stat-info">
          <div className="number">{count84}</div>
          <div className="label">08:00 → 16:00</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon amber">🟡</div>
        <div className="stat-info">
          <div className="number">{count95}</div>
          <div className="label">09:00 → 17:00</div>
        </div>
      </div>
    </div>
  )
}