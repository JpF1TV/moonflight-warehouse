import React, { useState } from 'react';
import { useEngineering } from '../context/EngineeringContext';
import { useOperations } from '../context/OperationsContext';
import { useOMA } from '../context/OMAContext';
import { useAuth } from '../context/AuthContext';
import { AircraftComponent } from '../types';
import './Pages.css';

const Ingenieria: React.FC = () => {
  const { user } = useAuth();
  const { components, addComponent, deleteComponent } = useEngineering();
  const { aircraft } = useOperations();
  const { generateFromComponent } = useOMA();

  const [filterAircraft, setFilterAircraft] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    aircraftId: '', description: '', partNumber: '', serialNumber: '',
    installDate: '', installHours: '', installCycles: '',
    limitHours: '', limitCycles: '', limitDate: '',
    alertHours: '', alertCycles: '', alertDays: '', notes: '',
  });

  const submitComponent = (e: React.FormEvent) => {
    e.preventDefault();
    const ac = aircraft.find(a => a.id === form.aircraftId);
    if (!ac) return;
    const base: Omit<AircraftComponent, 'id' | 'status'> = {
      aircraftId: ac.id,
      aircraftRegistration: ac.registration,
      description: form.description,
      partNumber: form.partNumber,
      serialNumber: form.serialNumber,
      installDate: form.installDate,
      installHours: parseFloat(form.installHours) || 0,
      installCycles: parseInt(form.installCycles) || 0,
      limitHours: form.limitHours ? parseFloat(form.limitHours) : undefined,
      limitCycles: form.limitCycles ? parseInt(form.limitCycles) : undefined,
      limitDate: form.limitDate || undefined,
      alertHours: form.alertHours ? parseFloat(form.alertHours) : undefined,
      alertCycles: form.alertCycles ? parseInt(form.alertCycles) : undefined,
      alertDays: form.alertDays ? parseInt(form.alertDays) : undefined,
      notes: form.notes,
    };
    addComponent(base);
    setForm({ aircraftId: '', description: '', partNumber: '', serialNumber: '', installDate: '', installHours: '', installCycles: '', limitHours: '', limitCycles: '', limitDate: '', alertHours: '', alertCycles: '', alertDays: '', notes: '' });
    setShowForm(false);
  };

  const handleGenerateOT = (c: AircraftComponent) => {
    const projected = new Date();
    projected.setDate(projected.getDate() + 7);
    generateFromComponent({
      componentId: c.id,
      aircraftId: c.aircraftId,
      aircraftRegistration: c.aircraftRegistration,
      description: `Mantenimiento: ${c.description}`,
      taskCode: `TASK-${c.partNumber}`,
      projectedDate: projected.toISOString().split('T')[0],
      createdBy: user?.username || 'sistema',
    });
    alert(`✅ Orden de Trabajo generada automáticamente para: ${c.description}`);
  };

  const filtered = components.filter(c =>
    (!filterAircraft || c.aircraftId === filterAircraft) &&
    (!filterStatus || c.status === filterStatus)
  );

  const alerts = components.filter(c => c.status === 'alert' || c.status === 'overdue');

  const statusLabel = (s: AircraftComponent['status']) => {
    if (s === 'ok') return <span className="status status-approved">✅ OK</span>;
    if (s === 'alert') return <span className="status status-pending">⚠️ Alerta</span>;
    return <span className="status status-rejected">🔴 Vencido</span>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🔧 Ingeniería</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Agregar Componente'}
        </button>
      </div>

      {/* Alertas activas */}
      {alerts.length > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #f39c12', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <strong>⚠️ {alerts.length} componente(s) requieren atención:</strong>
          <ul style={{ margin: '8px 0 0 20px' }}>
            {alerts.map(c => (
              <li key={c.id} style={{ color: c.status === 'overdue' ? '#721c24' : '#856404' }}>
                {c.aircraftRegistration} — {c.description} ({c.partNumber}) — {c.status === 'overdue' ? 'VENCIDO' : 'EN ALERTA'}
                {' '}
                <button className="btn-small" style={{ background: '#e67e22', marginLeft: 8 }} onClick={() => handleGenerateOT(c)}>
                  Generar OT
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form className="form-card" onSubmit={submitComponent}>
          <h3>Nuevo Componente</h3>
          <div className="form-grid">
            <select value={form.aircraftId} onChange={e => setForm(p => ({ ...p, aircraftId: e.target.value }))} required>
              <option value="">Seleccionar aeronave</option>
              {aircraft.map(a => <option key={a.id} value={a.id}>{a.registration} - {a.model}</option>)}
            </select>
            <input placeholder="Descripción" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
            <input placeholder="Part Number" value={form.partNumber} onChange={e => setForm(p => ({ ...p, partNumber: e.target.value }))} required />
            <input placeholder="Serial Number" value={form.serialNumber} onChange={e => setForm(p => ({ ...p, serialNumber: e.target.value }))} required />
            <input type="date" placeholder="Fecha instalación" value={form.installDate} onChange={e => setForm(p => ({ ...p, installDate: e.target.value }))} required />
            <input type="number" placeholder="Horas avión al instalar" value={form.installHours} onChange={e => setForm(p => ({ ...p, installHours: e.target.value }))} required />
            <input type="number" placeholder="Ciclos avión al instalar" value={form.installCycles} onChange={e => setForm(p => ({ ...p, installCycles: e.target.value }))} required />
          </div>
          <p style={{ color: '#7f8c8d', fontSize: 13, margin: '10px 0 5px' }}>Límites de vida (dejar vacío si no aplica):</p>
          <div className="form-grid">
            <input type="number" placeholder="Límite horas" value={form.limitHours} onChange={e => setForm(p => ({ ...p, limitHours: e.target.value }))} />
            <input type="number" placeholder="Límite ciclos" value={form.limitCycles} onChange={e => setForm(p => ({ ...p, limitCycles: e.target.value }))} />
            <input type="date" placeholder="Fecha límite" value={form.limitDate} onChange={e => setForm(p => ({ ...p, limitDate: e.target.value }))} />
            <input type="number" placeholder="Alerta horas remanentes" value={form.alertHours} onChange={e => setForm(p => ({ ...p, alertHours: e.target.value }))} />
            <input type="number" placeholder="Alerta ciclos remanentes" value={form.alertCycles} onChange={e => setForm(p => ({ ...p, alertCycles: e.target.value }))} />
            <input type="number" placeholder="Alerta días remanentes" value={form.alertDays} onChange={e => setForm(p => ({ ...p, alertDays: e.target.value }))} />
          </div>
          <input placeholder="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5, marginTop: 10 }} />
          <div className="form-actions" style={{ marginTop: 15 }}>
            <button type="submit" className="btn-primary">Guardar Componente</button>
          </div>
        </form>
      )}

      {/* Filtros */}
      <div className="form-grid" style={{ marginBottom: 20 }}>
        <select value={filterAircraft} onChange={e => setFilterAircraft(e.target.value)}>
          <option value="">Todas las aeronaves</option>
          {aircraft.map(a => <option key={a.id} value={a.id}>{a.registration}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="ok">OK</option>
          <option value="alert">En Alerta</option>
          <option value="overdue">Vencido</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No hay componentes registrados.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Aeronave</th><th>Componente</th><th>P/N</th><th>S/N</th>
                <th>Instalado</th><th>Límite Horas</th><th>Límite Ciclos</th><th>Fecha Límite</th>
                <th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ background: c.status === 'overdue' ? '#fff5f5' : c.status === 'alert' ? '#fffbf0' : undefined }}>
                  <td><strong>{c.aircraftRegistration}</strong></td>
                  <td>{c.description}</td>
                  <td>{c.partNumber}</td>
                  <td>{c.serialNumber}</td>
                  <td>{c.installDate}</td>
                  <td>{c.limitHours ? `${c.limitHours} h` : '—'}</td>
                  <td>{c.limitCycles ? `${c.limitCycles} ciclos` : '—'}</td>
                  <td>{c.limitDate || '—'}</td>
                  <td>{statusLabel(c.status)}</td>
                  <td>
                    <div className="action-buttons">
                      {(c.status === 'alert' || c.status === 'overdue') && (
                        <button className="btn-small" style={{ background: '#e67e22' }} onClick={() => handleGenerateOT(c)}>
                          Generar OT
                        </button>
                      )}
                      <button className="btn-small" onClick={() => deleteComponent(c.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ingenieria;
