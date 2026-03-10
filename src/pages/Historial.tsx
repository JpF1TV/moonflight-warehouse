import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Pages.css';

const Historial: React.FC = () => {
  const { history } = useData();
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(entry =>
    entry.partNumber.toLowerCase().includes(filter.toLowerCase()) ||
    (entry.serialNumber && entry.serialNumber.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Historial de Movimientos</h2>
        <input
          type="text"
          placeholder="Buscar por número de parte o serie..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Número de Serie</th>
              <th>Número de Parte</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map(entry => (
              <tr key={entry.id}>
                <td>{new Date(entry.date).toLocaleString('es-MX')}</td>
                <td>
                  <span className={`action action-${entry.action}`}>
                    {entry.action === 'entry' ? 'Entrada' : 
                     entry.action === 'exit' ? 'Salida' : 
                     entry.action === 'overhaul' ? 'Enviado a Overhaul' :
                     entry.action === 'overhaul_return' ? 'Retorno de Overhaul' : 'Reservado'}
                  </span>
                </td>
                <td>{entry.serialNumber || '-'}</td>
                <td>{entry.partNumber}</td>
                <td>{entry.quantity}</td>
                <td>{entry.user}</td>
                <td>{entry.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historial;
