import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Solicitud: React.FC = () => {
  const { parts, requests, addRequest } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    partNumber: '',
    quantity: 1,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      ...formData,
      requestedBy: user?.username || '',
      requestDate: new Date().toISOString(),
      status: 'pending'
    });
    setFormData({ partNumber: '', quantity: 1, notes: '' });
  };

  const myRequests = requests.filter(r => r.requestedBy === user?.username);

  const getAvailableCount = (partNumber: string) => {
    const part = parts.find(p => p.partNumber === partNumber);
    if (!part) return 0;
    return part.items.filter(i => i.status === 'available').length;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Solicitud de Piezas</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <h3>Nueva Solicitud</h3>
        <div className="form-grid">
          <select
            value={formData.partNumber}
            onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
            required
          >
            <option value="">Seleccionar pieza...</option>
            {parts.filter(p => getAvailableCount(p.partNumber) > 0).map(part => (
              <option key={part.id} value={part.partNumber}>
                {part.partNumber} - {part.description} (Disponible: {getAvailableCount(part.partNumber)})
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
            placeholder="Notas (opcional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary">Enviar Solicitud</button>
      </form>

      <h3>Mis Solicitudes</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Número de Parte</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Aprobado Por</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map(request => (
              <tr key={request.id}>
                <td>{new Date(request.requestDate).toLocaleDateString('es-MX')}</td>
                <td>{request.partNumber}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Solicitud;
