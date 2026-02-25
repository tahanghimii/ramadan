import { useState } from 'react'

export default function SidebarSearch({ users, onSelect }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const results = query.length > 1
    ? users.filter(u =>
        u.name?.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase()) ||
        (u.role || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  return (
    <div className="sidebar-search-wrap">
      <input
        className="sidebar-search-input"
        placeholder="🔍 Search employee..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />
      {focused && results.length > 0 && (
        <div className="sidebar-search-results">
          {results.map(u => (
            <div key={u.id} className="sidebar-search-item"
              onClick={() => { onSelect(u); setQuery('') }}>
              <div className="sidebar-search-name">{u.name}</div>
              <div className="sidebar-search-meta">{u.department} · {u.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}