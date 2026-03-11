import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import './Pages.css';

const Mantenimiento: React.FC = () => {
  const { parts, requests, addRequest } = useData();
  const { user } = useAuth();
  const { tickets, addTicket } = useTickets();
  const [activeTab, setActiveTab] = useState<'solicitud' | 'mis-solicitudes' | 'tickets'>('solicitud');
  const [formData, setFormData] = useState({
    partNumber: '',
    quantity: 1,
    notes: '',
    requestPdf: null as File | null
  });

  const [ticketForm, setTicketForm] = useState({
    type: 'other' as 'user_blocked' | 'platform_error' | 'feature_request' | 'other',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: any = {
      partNumber: formData.partNumber,
      quantity: formData.quantity,
      notes: formData.notes,
      requestedBy: user?.username || '',
      requestDate: new Date().toISOString(),
      status: 'pending',
      requestType: 'exit'
    };

    // Si hay PDF, procesarlo
    if (formData.requestPdf) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newRequest.requestPdfUrl = e.target?.result as string;
        newRequest.requestPdfName = formData.requestPdf?.name;
        addRequest(newRequest);
        alert('Solicitud enviada exitosamente');
      };
      reader.readAsDataURL(formData.requestPdf);
    } else {
      addRequest(newRequest);
      alert('Solicitud enviada exitosamente');
    }
    
    setFormData({ partNumber: '', quantity: 1, notes: '', requestPdf: null });
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket({
      ...ticketForm,
      createdBy: user?.username || '',
      status: 'open'
    });
    setTicketForm({ type: 'other', title: '', description: '', priority: 'medium' });
    alert('Ticket creado exitosamente. Será atendido por el administrador.');
  };

  const myTickets = tickets.filter(t => t.createdBy === user?.username);

  const myRequests = requests.filter(r => r.requestedBy === user?.username);

  const getAvailableCount = (description: string) => {
    const part = parts.find(p => p.description === description);
    if (!part) return 0;
    return part.items.filter(i => i.status === 'available').length;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Mantenimiento</h2>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'solicitud' ? 'active' : ''}`}
          onClick={() => setActiveTab('solicitud')}
        >
          📝 Nueva Solicitud
        </button>
        <button 
          className={`tab ${activeTab === 'mis-solicitudes' ? 'active' : ''}`}
          onClick={() => setActiveTab('mis-solicitudes')}
        >
          📋 Mis Solicitudes ({myRequests.length})
        </button>
        <button 
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Tickets ({myTickets.length})
        </button>
      </div>

      {activeTab === 'solicitud' && (
        <div className="maintenance-form-container">
          <form onSubmit={handleSubmit} className="form-card">
            <h3>Solicitar Piezas</h3>
            <div className="form-grid">
              <select
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                required
              >
                <option value="">Seleccionar pieza...</option>
                {parts.filter(p => getAvailableCount(p.description) > 0).map(part => (
                  <option key={part.id} value={part.items[0]?.partNumber || ''}>
                    {part.description} (Disponible: {getAvailableCount(part.description)})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cantidad"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                min="1"
                required
              />
              <input
                type="text"
                placeholder="Motivo/Notas"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ gridColumn: '1 / -1' }}
                required
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="file-upload-label">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData({ ...formData, requestPdf: file });
                    }}
                    style={{ display: 'none' }}
                  />
                  <span className="file-upload-btn">
                    📎 {formData.requestPdf ? formData.requestPdf.name : 'Adjuntar PDF de Solicitud (opcional)'}
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-primary">Enviar Solicitud</button>
          </form>

          <div className="info-box">
            <h4>ℹ️ Información</h4>
            <p>• Las solicitudes serán revisadas por el departamento administrativo</p>
            <p>• Puedes adjuntar un PDF con la solicitud oficial si la tienes</p>
            <p>• Recibirás notificación cuando tu solicitud sea aprobada o rechazada</p>
          </div>
        </div>
      )}

      {activeTab === 'mis-solicitudes' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>P/N</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Aprobado Por</th>
                <th>Notas</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map(request => (
                <tr key={request.id}>
                  <td>{new Date(request.requestDate).toLocaleDateString('es-MX')}</td>
                  <td>
                    <span className={`status ${request.requestType === 'exit' ? 'status-out' : 'status-overhaul'}`}>
                      {request.requestType === 'exit' ? 'Salida' : 'Overhaul'}
                    </span>
                  </td>
                  <td><strong>{request.partNumber}</strong></td>
                  <td>{request.quantity}</td>
                  <td>
                    <span className={`status status-${request.status}`}>
                      {request.status === 'pending' ? 'Pendiente' : 
                       request.status === 'approved' ? 'Aprobado' : 
                       request.status === 'rejected' ? 'Rechazado' : 'Completado'}
                    </span>
                  </td>
                  <td>{request.approvedBy || '-'}</td>
                  <td>{request.notes || '-'}</td>
                  <td>
                    {request.requestPdfUrl ? (
                      <a href={request.requestPdfUrl} download={request.requestPdfName} className="pdf-link">
                        📄 {request.requestPdfName}
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myRequests.length === 0 && (
            <p className="empty-state">No tienes solicitudes registradas</p>
          )}
        </div>
      )}

      {activeTab === 'tickets' && (
        <>
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

          <div className="table-container" style={{ marginTop: '30px' }}>
            <h3>Mis Tickets</h3>
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Prioridad</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Resuelto Por</th>
                </tr>
              </thead>
              <tbody>
                {myTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.ticketNumber}</strong></td>
                    <td style={{ fontSize: '12px' }}>
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
            {myTickets.length === 0 && (
              <p className="empty-state">No has creado tickets</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Mantenimiento;
