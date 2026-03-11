import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { useData } from '../context/DataContext';
import './Pages.css';

const AdminPanel: React.FC = () => {
  const { sessions } = useAuth();
  const { tickets, updateTicket, addTicket } = useTickets();
  const { requests, updateRequest, parts, updatePartItem, addHistory } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sessions' | 'approvals' | 'tickets'>('sessions');
  const [showTicketForm, setShowTicketForm] = useState(false);
  
  const [ticketForm, setTicketForm] = useState({
    type: 'other' as 'user_blocked' | 'platform_error' | 'feature_request' | 'other',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  // Usuarios conectados actualmente
  const activeSessions = sessions.filter(s => s.isActive);

  // Solicitudes pendientes
  const pendingRequests = requests.filter(r => r.status === 'pending');

  // Tickets abiertos
  const openTickets = tickets.filter(t => t.status !== 'closed');

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const part = parts.find(p => p.items.some(i => i.partNumber === request.partNumber));
    if (!part) {
      alert('No se encontró la pieza solicitada');
      return;
    }

    const availableItems = part.items.filter(i => 
      i.partNumber === request.partNumber && 
      i.status === 'available'
    );
    
    if (availableItems.length < request.quantity) {
      alert(`No hay suficientes piezas disponibles. Disponibles: ${availableItems.length}, Solicitadas: ${request.quantity}`);
      return;
    }

    if (request.requestType === 'exit') {
      for (let i = 0; i < request.quantity; i++) {
        updatePartItem(part.id, availableItems[i].id, { status: 'out' });
        addHistory({
          partNumber: request.partNumber,
          serialNumber: availableItems[i].serialNumber,
          action: 'exit',
          quantity: 1,
          user: user?.username || '',
          date: new Date().toISOString(),
          notes: `Solicitud aprobada para ${request.requestedBy} - ${request.notes || ''}`
        });
      }
    } else if (request.requestType === 'overhaul') {
      const item = availableItems[0];
      updatePartItem(part.id, item.id, {
        status: 'overhaul',
        overhaulInfo: {
          sentDate: new Date().toISOString().split('T')[0],
          expectedReturn: request.overhaulInfo?.expectedReturn,
          repairShop: request.overhaulInfo?.repairShop,
          reason: request.overhaulInfo?.reason,
          aircraftRemoved: request.overhaulInfo?.aircraftRemoved
        }
      });
      
      addHistory({
        partNumber: request.partNumber,
        serialNumber: item.serialNumber,
        action: 'overhaul',
        quantity: 1,
        user: user?.username || '',
        date: new Date().toISOString(),
        notes: `Enviado a ${request.overhaulInfo?.repairShop} - ${request.overhaulInfo?.reason}`
      });
    }

    updateRequest(requestId, {
      status: 'approved',
      approvedBy: user?.username,
      approvalDate: new Date().toISOString()
    });

    alert('Solicitud aprobada exitosamente');
  };

  const handleReject = (requestId: string) => {
    updateRequest(requestId, {
      status: 'rejected',
      approvedBy: user?.username,
      approvalDate: new Date().toISOString()
    });
    alert('Solicitud rechazada');
  };

  const getAvailableCount = (partNumber: string) => {
    const part = parts.find(p => p.items.some(i => i.partNumber === partNumber));
    if (!part) return 0;
    return part.items.filter(i => i.partNumber === partNumber && i.status === 'available').length;
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket({
      ...ticketForm,
      createdBy: user?.username || '',
      status: 'open'
    });
    setTicketForm({ type: 'other', title: '', description: '', priority: 'medium' });
    setShowTicketForm(false);
    alert('Ticket creado exitosamente. Será atendido por el Super Administrador.');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Panel Administrativo</h2>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          👥 Usuarios Conectados ({activeSessions.length})
        </button>
        <button 
          className={`tab ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          ✅ Aprobaciones ({pendingRequests.length})
        </button>
        <button 
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Tickets ({openTickets.length})
        </button>
      </div>

      {activeTab === 'sessions' && (
        <div className="table-container">
          <h3>Usuarios Conectados Actualmente</h3>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Hora de Ingreso</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map(session => {
                const duration = Math.floor((new Date().getTime() - new Date(session.loginTime).getTime()) / 60000);
                return (
                  <tr key={session.id}>
                    <td><strong>{session.username}</strong></td>
                    <td>{new Date(session.loginTime).toLocaleString('es-MX')}</td>
                    <td>{duration} minutos</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {activeSessions.length === 0 && (
            <p className="empty-state">No hay usuarios conectados actualmente</p>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="table-container">
          <h3>Solicitudes Pendientes de Aprobación</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Solicitante</th>
                <th>P/N</th>
                <th>Cantidad</th>
                <th>Disponible</th>
                <th>Motivo</th>
                <th>PDF</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map(request => {
                const available = getAvailableCount(request.partNumber);
                return (
                  <tr key={request.id}>
                    <td>{new Date(request.requestDate).toLocaleDateString('es-MX')}</td>
                    <td>
                      <span className={`status ${request.requestType === 'exit' ? 'status-out' : 'status-overhaul'}`}>
                        {request.requestType === 'exit' ? 'Salida' : 'Overhaul'}
                      </span>
                    </td>
                    <td>{request.requestedBy}</td>
                    <td><strong>{request.partNumber}</strong></td>
                    <td>{request.quantity}</td>
                    <td>{available}</td>
                    <td>{request.notes || '-'}</td>
                    <td>
                      {request.requestPdfUrl ? (
                        <a href={request.requestPdfUrl} download={request.requestPdfName} className="pdf-link" target="_blank" rel="noopener noreferrer">
                          📄 Ver
                        </a>
                      ) : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleApprove(request.id)} 
                          className="btn-approve"
                          disabled={available < request.quantity}
                        >
                          Aprobar
                        </button>
                        <button 
                          onClick={() => handleReject(request.id)} 
                          className="btn-reject"
                        >
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pendingRequests.length === 0 && (
            <p className="empty-state">No hay solicitudes pendientes</p>
          )}
        </div>
      )}

      {activeTab === 'tickets' && (
        <>
          <div className="page-header">
            <h3>Tickets</h3>
            <button onClick={() => setShowTicketForm(!showTicketForm)} className="btn-primary">
              {showTicketForm ? 'Cancelar' : '+ Crear Ticket'}
            </button>
          </div>

          {showTicketForm && (
            <form onSubmit={handleSubmitTicket} className="form-card">
              <h3>Crear Nuevo Ticket</h3>
              <div className="form-grid">
                <select
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value as any })}
                  required
                >
                  <option value="user_blocked">🔒 Usuario Bloqueado</option>
                  <option value="platform_error">⚠️ Error en la Plataforma</option>
                  <option value="feature_request">💡 Solicitud de Funcionalidad</option>
                  <option value="other">📝 Otro</option>
                </select>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                  required
                >
                  <option value="low">Prioridad Baja</option>
                  <option value="medium">Prioridad Media</option>
                  <option value="high">Prioridad Alta</option>
                  <option value="urgent">URGENTE</option>
                </select>
                <input
                  type="text"
                  placeholder="Título del ticket"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  required
                  style={{ gridColumn: '1 / -1' }}
                />
                <textarea
                  placeholder="Descripción detallada del problema o solicitud"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  required
                  rows={4}
                  style={{ gridColumn: '1 / -1', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <button type="submit" className="btn-primary">Crear Ticket</button>
            </form>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Prioridad</th>
                  <th>Creado Por</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Resuelto Por</th>
                </tr>
              </thead>
              <tbody>
                {openTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.ticketNumber}</strong></td>
                    <td>
                      {ticket.type === 'user_blocked' ? '🔒 Usuario Bloqueado' :
                       ticket.type === 'platform_error' ? '⚠️ Error Plataforma' :
                       ticket.type === 'feature_request' ? '💡 Solicitud' : '📝 Otro'}
                    </td>
                    <td>{ticket.title}</td>
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
                      <span className={`status status-${ticket.status}`}>
                        {ticket.status === 'open' ? 'Abierto' :
                         ticket.status === 'in_progress' ? 'En Progreso' :
                         ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                      </span>
                    </td>
                    <td>
                      {ticket.resolvedBy ? (
                        <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                          ✓ {ticket.resolvedBy}
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {openTickets.length === 0 && (
              <p className="empty-state">No hay tickets abiertos</p>
            )}
            <p style={{ marginTop: '20px', color: '#7f8c8d', fontSize: '14px' }}>
              ℹ️ Los tickets solo pueden ser gestionados por el Super Administrador
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
