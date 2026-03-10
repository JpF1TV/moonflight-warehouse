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

    // Buscar la pieza que contiene el item con ese partNumber
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

    // Procesar según el tipo de solicitud
    if (request.requestType === 'exit') {
      // Salida normal
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
      // Envío a overhaul
      const item = availableItems[0]; // Solo se envía una pieza a overhaul
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
              <th>Tipo</th>
              <th>Solicitante</th>
              <th>P/N</th>
              <th>S/N</th>
              <th>Cantidad</th>
              <th>Disponible</th>
              <th>Motivo/Detalles</th>
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
                  <td>{request.serialNumber || '-'}</td>
                  <td>{request.quantity}</td>
                  <td>{available}</td>
                  <td>
                    {request.requestType === 'exit' ? (
                      request.notes || '-'
                    ) : (
                      <div style={{ fontSize: '12px' }}>
                        <div><strong>Taller:</strong> {request.overhaulInfo?.repairShop}</div>
                        <div><strong>Aeronave:</strong> {request.overhaulInfo?.aircraftRemoved || '-'}</div>
                        <div><strong>Razón:</strong> {request.overhaulInfo?.reason}</div>
                      </div>
                    )}
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
    </div>
  );
};

export default Administrativo;
