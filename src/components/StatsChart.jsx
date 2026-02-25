export default function StatsChart({ users }) {
  const departments = ['Import', 'Export', 'NL', 'Administration']
  const icons = { Import: '📥', Export: '📤', NL: '🚢', Administration: '🏢' }
  const colors = { Import: '#0369a1', Export: '#b45309', NL: '#0891b2', Administration: '#7c3aed' }

  const data = departments.map(dept => {
    const list   = users.filter(u => u.department === dept)
    const early  = list.filter(u => u.schedule === '8-4').length
    const late   = list.filter(u => u.schedule === '9-5').length
    const onBreak = list.filter(u => u.status === 'break').length
    return { dept, total: list.length, early, late, onBreak }
  }).filter(d => d.total > 0)

  const max = Math.max(...data.map(d => d.total), 1)

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-header">
        <h2>📊 Schedule Distribution</h2>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{users.length} total employees</span>
      </div>

      <div className="chart-wrap">
        {data.map(d => (
          <div key={d.dept} className="chart-row">
            <div className="chart-label">
              <span>{icons[d.dept]}</span>
              <span>{d.dept}</span>
            </div>

            <div className="chart-bars">
              {/* Early bar */}
              <div className="chart-bar-wrap">
                <div className="chart-bar-label">08:00→16:00</div>
                <div className="chart-bar-track">
                  <div className="chart-bar early-bar"
                    style={{ width: `${(d.early / max) * 100}%` }}>
                    {d.early > 0 && <span>{d.early}</span>}
                  </div>
                </div>
              </div>

              {/* Late bar */}
              <div className="chart-bar-wrap">
                <div className="chart-bar-label">09:00→17:00</div>
                <div className="chart-bar-track">
                  <div className="chart-bar late-bar"
                    style={{ width: `${(d.late / max) * 100}%` }}>
                    {d.late > 0 && <span>{d.late}</span>}
                  </div>
                </div>
              </div>

              {/* Break bar */}
              {d.onBreak > 0 && (
                <div className="chart-bar-wrap">
                  <div className="chart-bar-label">On Break</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar break-bar"
                      style={{ width: `${(d.onBreak / max) * 100}%` }}>
                      <span>{d.onBreak}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chart-total"
              style={{ background: colors[d.dept] }}>
              {d.total}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <span className="legend-item"><span className="legend-dot early-dot" />08:00→16:00</span>
        <span className="legend-item"><span className="legend-dot late-dot" />09:00→17:00</span>
        <span className="legend-item"><span className="legend-dot break-dot" />On Break</span>
      </div>
    </div>
  )
}