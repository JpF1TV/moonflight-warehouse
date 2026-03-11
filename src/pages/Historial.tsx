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

  // Filtrar historial de las últimas 24 horas
  const getLast24HoursHistory = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= twentyFourHoursAgo;
    });
  };

  const downloadPDF = () => {
    const last24Hours = getLast24HoursHistory();
    
    if (last24Hours.length === 0) {
      alert('No hay movimientos en las últimas 24 horas');
      return;
    }

    // Crear contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Historial Moonflight - Últimas 24 Horas</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #2c3e50;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1e3a5f;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1e3a5f;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #7f8c8d;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #1e3a5f;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 11px;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .action-entry { color: #27ae60; font-weight: bold; }
          .action-exit { color: #e74c3c; font-weight: bold; }
          .action-overhaul { color: #f39c12; font-weight: bold; }
          .action-overhaul_return { color: #3498db; font-weight: bold; }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #7f8c8d;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌙 MOONFLIGHT</h1>
          <h2>Historial de Movimientos</h2>
          <p>Últimas 24 Horas</p>
          <p>Generado: ${new Date().toLocaleString('es-MX')}</p>
          <p>Total de movimientos: ${last24Hours.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Acción</th>
              <th>Número de Serie</th>
              <th>Número de Parte</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${last24Hours.map(entry => `
              <tr>
                <td>${new Date(entry.date).toLocaleString('es-MX')}</td>
                <td class="action-${entry.action}">
                  ${entry.action === 'entry' ? 'Entrada' : 
                    entry.action === 'exit' ? 'Salida' : 
                    entry.action === 'overhaul' ? 'Enviado a Overhaul' :
                    entry.action === 'overhaul_return' ? 'Retorno de Overhaul' : 'Reservado'}
                </td>
                <td>${entry.serialNumber || '-'}</td>
                <td><strong>${entry.partNumber}</strong></td>
                <td>${entry.quantity}</td>
                <td>${entry.user}</td>
                <td>${entry.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Moonflight - Sistema de Control de Almacén</p>
          <p>Este documento es un registro oficial de los movimientos de inventario</p>
        </div>
      </body>
      </html>
    `;

    // Crear un Blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace temporal y hacer click para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `Historial_Moonflight_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Abrir en nueva ventana para imprimir como PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que cargue y abrir diálogo de impresión
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Historial de Movimientos</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="🔍 Buscar por número de parte o serie..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          <button onClick={downloadPDF} className="btn-primary btn-pdf">
            📄 Descargar PDF (24h)
          </button>
        </div>
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
