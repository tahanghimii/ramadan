export default function AdminTable({ admins, currentId, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr><th>Username</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {admins.map(admin => (
          <tr key={admin.id}>
            <td>
              <strong>{admin.username}</strong>
              {admin.id === currentId && (
                <span className="badge badge-green" style={{ marginLeft: 8 }}>You</span>
              )}
            </td>
            <td style={{ display: 'flex', gap: 8 }}>
              <button className="btn-sm btn-edit" onClick={() => onEdit(admin)}>Edit</button>
              {admin.id !== currentId && (
                <button className="btn-sm btn-delete" onClick={() => onDelete(admin.id)}>Delete</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}