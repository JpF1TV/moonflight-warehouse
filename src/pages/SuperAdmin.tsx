import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import './Pages.css';

const SuperAdmin: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const { tickets, updateTicket, deleteTicket } = useTickets();
  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'requester' as 'admin' | 'warehouse' | 'requester',
    isActive: true
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser, userForm);
      alert('Usuario actualizado exitosamente');
    } else {
      addUser(userForm);
      alert('Usuario creado exitosamente');
    }
    
    setUserForm({ username: '', password: '', fullName: '', email: '', role: 'requester', isActive: true });
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserForm({
        username: user.username,
        password: user.password,
        fullName: user.fullName,
        email: user.email || '',
        role: user.role as any,
        isActive: user.isActive
      });
      setEditingUser(userId);
      setShowUserForm(true);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser(userId);
      alert('Usuario eliminado');
    }
  };

  const handleUpdateTicket = (ticketId: string, status: string) => {
    const currentUser = 'superadmin';
    updateTicket(ticketId, { 
      status: status as any,
      resolvedBy: status === 'resolved' || status === 'closed' ? currentUser : undefined,
      resolvedDate: status === 'resolved' || status === 'closed' ? new Date().toISOString() : undefined
    });
    
    if (status === 'resolved') {
      alert('Ticket marcado como resuelto. El administrador será notificado.');
    }
  };

  const handleQuickResolve = (ticketId: string) => {
    if (confirm('¿Marcar este ticket como resuelto?')) {
      handleUpdateTicket(ticketId, 'resolved');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>👑 Super Administrador</h2>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Gestión de Usuarios ({users.length})
        </button>
        <button 
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Gestión de Tickets ({tickets.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className="page-header">
            <h3>Usuarios del Sistema</h3>
            <button onClick={() => { setShowUserForm(!showUserForm); setEditingUser(null); setUserForm({ username: '', password: '', fullName: '', email: '', role: 'requester', isActive: true }); }} className="btn-primary">
              {showUserForm ? 'Cancelar' : '+ Nuevo Usuario'}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleAddUser} className="form-card">
              <h3>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                />
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  required
                >
                  <option value="requester">Solicitante</option>
                  <option value="warehouse">Almacén</option>
                  <option value="admin">Administrador</option>
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={userForm.isActive}
                    onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                  />
                  Usuario Activo
                </label>
              </div>
              <button type="submit" className="btn-primary">
                {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>
            </form>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role !== 'superadmin').map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.fullName}</td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span className={`status status-${user.role}`}>
                        {user.role === 'admin' ? 'Administrador' :
                         user.role === 'warehouse' ? 'Almacén' : 'Solicitante'}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${user.isActive ? 'status-available' : 'status-out'}`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString('es-MX') : 'Nunca'}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEditUser(user.id)} className="btn-approve">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="btn-reject">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'tickets' && (
        <div className="table-container">
          <h3>Gestión de Tickets</h3>
          <table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Tipo</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Creado Por</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Resuelto Por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td><strong>{ticket.ticketNumber}</strong></td>
                  <td style={{ fontSize: '12px' }}>
                    {ticket.type === 'user_blocked' ? '🔒 Usuario Bloqueado' :
                     ticket.type === 'platform_error' ? '⚠️ Error Plataforma' :
                     ticket.type === 'feature_request' ? '💡 Solicitud' : '📝 Otro'}
                  </td>
                  <td>{ticket.title}</td>
                  <td style={{ fontSize: '12px', maxWidth: '200px' }}>{ticket.description}</td>
                  <td>
                    <span className={`priority priority-${ticket.priority}`}>
                      {ticket.priority === 'urgent' ? 'URGENTE' :
                       ticket.priority === 'high' ? 'Alta' :
                       ticket.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </td>
                  <td>{ticket.createdBy}</td>
                  <td>{new Date(ticket.createdDate).toLocaleDateString('es-MX')}</td>
                  <td>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdateTicket(ticket.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </td>
                  <td>{ticket.resolvedBy || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                        <button 
                          onClick={() => handleQuickResolve(ticket.id)} 
                          className="btn-approve btn-small"
                          title="Marcar como resuelto"
                        >
                          ✓ Resolver
                        </button>
                      )}
                      <button 
                        onClick={() => deleteTicket(ticket.id)} 
                        className="btn-reject btn-small"
                        title="Eliminar ticket"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && (
            <p className="empty-state">No hay tickets registrados</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
