import { useState } from 'react'
import {
  DndContext, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext,
  sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getAvatarColor, getInitials } from '../utils/avatarColor'

function SortableRow({ user, onEdit, onDelete, isAdmin }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: user.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#f0fdf4' : undefined,
  }

  const color = getAvatarColor(user.name)

  return (
    <tr ref={setNodeRef} style={style}>
      {isAdmin && (
        <td style={{ width: 32, cursor: 'grab', color: '#9ca3af', fontSize: 18 }}
          {...attributes} {...listeners}>
          ⠿
        </td>
      )}
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: color, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {getInitials(user.name)}
          </div>
          <strong>{user.name}</strong>
        </div>
      </td>
      <td style={{ color: '#6b7280' }}>{user.email}</td>
      <td>{user.phone || <span style={{ color: '#d1d5db' }}>—</span>}</td>
      <td>
        <span className={`badge ${
          user.department === 'Import' ? 'badge-blue'   :
          user.department === 'Export' ? 'badge-orange' :
          user.department === 'NL'     ? 'badge-blue'   : 'badge-purple'
        }`}>
          {user.department === 'Import' ? '📥' :
           user.department === 'Export' ? '📤' :
           user.department === 'NL'     ? '🚢' : '🏢'} {user.department}
        </span>
      </td>
      <td>{user.role || <span style={{ color: '#d1d5db' }}>—</span>}</td>
      <td>
        <span className={`badge ${user.schedule === '8-4' ? 'badge-green' : 'badge-amber'}`}>
          {user.schedule === '8-4' ? '🟢 08:00→16:00' : '🟡 09:00→17:00'}
        </span>
      </td>
      <td>
        <span className={`badge ${user.status === 'break' ? 'badge-break' : 'badge-active'}`}>
          {user.status === 'break' ? '🏖️ Congé' : '✅ Active'}
        </span>
      </td>
      {isAdmin && (
        <td style={{ display: 'flex', gap: 6 }}>
          <button className="btn-sm btn-edit" onClick={() => onEdit(user)}>Edit</button>
          <button className="btn-sm btn-delete" onClick={() => onDelete(user.id)}>Delete</button>
          <a className="btn-sm btn-email" href={`mailto:${user.email}`}>📧</a>
        </td>
      )}
    </tr>
  )
}

export default function DraggableTable({ users, onEdit, onDelete, isAdmin, onRefresh }) {
  const [items, setItems] = useState(users)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(i => i.id === active.id)
        const newIndex = prev.findIndex(i => i.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  // Sync if users prop changes
  useState(() => { setItems(users) }, [users])

  const filtered = items.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.schedule === filter
    return matchSearch && matchFilter
  })

  return (
    <>
      <input className="search-bar" placeholder="Search name, email, role..."
        value={search} onChange={e => setSearch(e.target.value)} />
      <div className="filter-tabs">
        {[['all','All'],['8-4','08:00→16:00'],['9-5','09:00→17:00']].map(([v, l]) => (
          <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`}
            onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No employees found</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map(u => u.id)} strategy={verticalListSortingStrategy}>
            <table>
              <thead>
                <tr>
                  {isAdmin && <th style={{ width: 32 }} />}
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <SortableRow
                    key={user.id} user={user}
                    onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      )}
    </>
  )
}