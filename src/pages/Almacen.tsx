import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Almacen: React.FC = () => {
  const { parts, addPart, addPartItem, updatePartItem, addHistory } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const [showItemForm, setShowItemForm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    partNumber: '',
    description: '',
    location: '',
    type: 'unit' as 'unit' | 'bulk',
    serialNumber: '',
    quantity: 1
  });

  const [itemFormData, setItemFormData] = useState({
    serialNumber: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPart = {
      partNumber: formData.partNumber,
      description: formData.description,
      location: formData.location,
      type: formData.type,
      items: formData.type === 'bulk' 
        ? [{
            id: '',
            serialNumber: formData.serialNumber,
            status: 'available' as const,
            entryDate: new Date().toISOString().split('T')[0]
          }]
        : []
    };
    
    addPart(newPart);
    addHistory({
      partNumber: formData.partNumber,
      serialNumber: formData.type === 'bulk' ? formData.serialNumber : undefined,
      action: 'entry',
      quantity: formData.type === 'bulk' ? formData.quantity : 0,
      user: user?.username || '',
      date: new Date().toISOString()
    });
    
    setFormData({ partNumber: '', description: '', location: '', type: 'unit', serialNumber: '', quantity: 1 });
    setShowForm(false);
  };

  const handleAddItem = (partId: string) => {
    addPartItem(partId, {
      serialNumber: itemFormData.serialNumber,
      status: 'available',
      entryDate: new Date().toISOString().split('T')[0],
      notes: itemFormData.notes
    });
    
    const part = parts.find(p => p.id === partId);
    addHistory({
      partNumber: part?.partNumber || '',
      serialNumber: itemFormData.serialNumber,
      action: 'entry',
      quantity: 1,
      user: user?.username || '',
      date: new Date().toISOString()
    });
    
    setItemFormData({ serialNumber: '', notes: '' });
    setShowItemForm(null);
  };

  const handleFileUpload = (partId: string, itemId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePartItem(partId, itemId, {
        pdfUrl: e.target?.result as string,
        pdfName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleExit = (partId: string, itemId: string) => {
    const part = parts.find(p => p.id === partId);
    const item = part?.items.find(i => i.id === itemId);
    
    if (item) {
      updatePartItem(partId, itemId, { status: 'out' });
      addHistory({
        partNumber: part?.partNumber || '',
        serialNumber: item.serialNumber,
        action: 'exit',
        quantity: 1,
        user: user?.username || '',
        date: new Date().toISOString()
      });
    }
  };

  const getAvailableCount = (part: any) => {
    return part.items.filter((i: any) => i.status === 'available').length;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Almacén</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : '+ Nueva Pieza'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Registrar Nueva Pieza</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Número de Parte"
              value={formData.partNumber}
              onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Ubicación"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'unit' | 'bulk' })}
              required
            >
              <option value="unit">Pieza Unitaria (Rotor, Motor, etc.)</option>
              <option value="bulk">Consumible (Tornillos, etc.)</option>
            </select>
            {formData.type === 'bulk' && (
              <>
                <input
                  type="text"
                  placeholder="Número de Serie/Lote"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </>
            )}
          </div>
          <button type="submit" className="btn-primary">Registrar</button>
        </form>
      )}

      <div className="parts-list">
        {parts.map(part => (
          <div key={part.id} className="part-card">
            <div className="part-header" onClick={() => setExpandedPart(expandedPart === part.id ? null : part.id)}>
              <div className="part-info">
                <h3>{part.partNumber} - {part.description}</h3>
                <p>Ubicación: {part.location} | Tipo: {part.type === 'unit' ? 'Unitaria' : 'Consumible'}</p>
                <p>Disponibles: {getAvailableCount(part)} / {part.items.length}</p>
              </div>
              <button className="expand-btn">
                {expandedPart === part.id ? '▼' : '▶'}
              </button>
            </div>

            {expandedPart === part.id && (
              <div className="part-details">
                {part.type === 'unit' && (
                  <button 
                    onClick={() => setShowItemForm(showItemForm === part.id ? null : part.id)} 
                    className="btn-primary btn-small-margin"
                  >
                    + Agregar Unidad
                  </button>
                )}

                {showItemForm === part.id && (
                  <div className="item-form">
                    <input
                      type="text"
                      placeholder="Número de Serie"
                      value={itemFormData.serialNumber}
                      onChange={(e) => setItemFormData({ ...itemFormData, serialNumber: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Notas (opcional)"
                      value={itemFormData.notes}
                      onChange={(e) => setItemFormData({ ...itemFormData, notes: e.target.value })}
                    />
                    <button onClick={() => handleAddItem(part.id)} className="btn-primary">
                      Agregar
                    </button>
                  </div>
                )}

                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Número de Serie</th>
                      <th>Fecha Entrada</th>
                      <th>Estado</th>
                      <th>PDF Trazabilidad</th>
                      <th>Notas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {part.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.serialNumber}</td>
                        <td>{new Date(item.entryDate).toLocaleDateString('es-MX')}</td>
                        <td>
                          <span className={`status status-${item.status}`}>
                            {item.status === 'available' ? 'Disponible' : 
                             item.status === 'reserved' ? 'Reservado' : 'Salida'}
                          </span>
                        </td>
                        <td>
                          {item.pdfUrl ? (
                            <a href={item.pdfUrl} download={item.pdfName} className="pdf-link">
                              📄 {item.pdfName}
                            </a>
                          ) : (
                            <label className="upload-label">
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(part.id, item.id, file);
                                }}
                                style={{ display: 'none' }}
                              />
                              📎 Subir PDF
                            </label>
                          )}
                        </td>
                        <td>{item.notes || '-'}</td>
                        <td>
                          <button 
                            onClick={() => handleExit(part.id, item.id)} 
                            className="btn-small"
                            disabled={item.status !== 'available'}
                          >
                            Registrar Salida
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Almacen;
