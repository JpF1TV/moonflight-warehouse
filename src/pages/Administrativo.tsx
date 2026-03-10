import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Administrativo: React.FC = () => {
  const { requests, updateRequest, parts, updatePartItem, addHistory } = useData();
  const { user } = useAuth();

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const part = parts.find(p => p.partNumber === request.partNumber);
    if (!part) return;

    const availableItems = part.items.filter(i => i.status === 'available');
    
    if (availableItems.length >= request.quantity) {
      // Marcar las piezas como salida
      for (let i = 0; i < request.quantity; i++) {
        updatePartItem(part.id, availableItems[i].id, { status: 'out' });
        addHistory({
          partNumber: request.partNumber,
          serialNumber: availableItems[i].serialNumber,
          action: 'exit',
          quantity: 1,
          user: user?.username || '',
          date: new Date().toISOString(),
          notes: `Solicitud aprobada para ${request.requestedBy}`
        });
      }

      updateRequest(requestId, {
        status: 'approved',
        approvedBy: user?.username,
        approvalDate: new Date().toISOString()
      });
    }
  };

  const handleReject = (requestId: string) => {
    updateRequest(requestId, {
      status: 'rejected',
      approvedBy: user?.username,
      approvalDate: new Date().toISOString()
    });
  };

  const getAvailableCount = (partNumber: string) => {
    const part = parts.find(p => p.partNumber === partNumber);
    if (!part) return 0;
    return part.items.filter(i => i.status === 'available').length;
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Administrativo - Aprobación de Solicitudes</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Número de Parte</th>
              <th>Cantidad</th>
              <th>Disponible</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(request => {
              const available = getAvailableCount(request.partNumber);
              return (
                <tr key={request.id}>
                  <td>{new Date(request.requestDate).toLocaleDateString('es-MX')}</td>
                  <td>{request.requestedBy}</td>
                  <td>{request.partNumber}</td>
                  <td>{request.quantity}</td>
                  <td>{available}</td>
                  <td>{request.notes || '-'}</td>
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
    </div>
  );
};

export default Administrativo;
