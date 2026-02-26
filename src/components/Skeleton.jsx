export function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton skeleton-text" style={{ width: '60%' }} /></td>
      <td><div className="skeleton skeleton-text" style={{ width: '80%' }} /></td>
      <td><div className="skeleton skeleton-text" style={{ width: '50%' }} /></td>
      <td><div className="skeleton skeleton-badge" /></td>
      <td><div className="skeleton skeleton-text" style={{ width: '40%' }} /></td>
      <td><div className="skeleton skeleton-badge" /></td>
      <td><div className="skeleton skeleton-badge" /></td>
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <div className="skeleton skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: 8 }} />
          <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        </div>
      </div>
      <div className="skeleton skeleton-text" style={{ width: '100%', marginBottom: 8 }} />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="stats" style={{ marginBottom: 24 }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="stat-card">
          <div className="skeleton skeleton-avatar" style={{ width: 48, height: 48, borderRadius: 12 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: 8, height: 28 }} />
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="skeleton skeleton-text" style={{ width: '30%' }} />
      </div>
      <div className="skeleton skeleton-text" style={{ width: '100%', marginBottom: 16, height: 38 }} />
      <table>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
        </tbody>
      </table>
    </div>
  )
}