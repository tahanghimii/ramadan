export default function ScheduleCard({ session, users }) {
  const me = users.find(u => u.email === session.email)
  if (!me) return null

  const isEarly = me.schedule === '8-4'
  const isOnBreak = me.status === 'break'

  return (
    <div className={`schedule-card ${isOnBreak ? 'schedule-card-break' : isEarly ? 'schedule-card-early' : 'schedule-card-late'}`}>
      <div className="schedule-card-top">
        <div className="schedule-avatar">
          {me.name[0].toUpperCase()}
        </div>
        <div>
          <div className="schedule-name">{me.name}</div>
          <div className="schedule-role">{me.role || me.department}</div>
        </div>
        {isOnBreak && <span className="badge badge-break" style={{ marginLeft: 'auto' }}>🏖️ Congé</span>}
      </div>

      {isOnBreak ? (
        <div className="schedule-time-display break">
          <span>🏖️</span>
          <div>
            <div className="schedule-time-label">Currently on break</div>
            <div className="schedule-time-value">Enjoy your time off!</div>
          </div>
        </div>
      ) : (
        <div className="schedule-time-display">
          <span style={{ fontSize: 32 }}>{isEarly ? '🌅' : '☀️'}</span>
          <div>
            <div className="schedule-time-label">Your Ramadan Schedule</div>
            <div className="schedule-time-value">
              {isEarly ? '08:00 → 16:00' : '09:00 → 17:00'}
            </div>
          </div>
        </div>
      )}

      <div className="schedule-card-footer">
        <span className={`badge ${me.department === 'Import' ? 'badge-blue' : me.department === 'Export' ? 'badge-orange' : me.department === 'NL' ? 'badge-blue' : 'badge-purple'}`}>
          {me.department === 'Import' ? '📥' : me.department === 'Export' ? '📤' : me.department === 'NL' ? '🚢' : '🏢'} {me.department}
        </span>
        <span className={`badge ${isEarly ? 'badge-green' : 'badge-amber'}`}>
          {isEarly ? '🟢 Early shift' : '🟡 Late shift'}
        </span>
      </div>
    </div>
  )
}