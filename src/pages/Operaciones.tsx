import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { useAuth } from '../context/AuthContext';
import { FlightLog, Pilot, Aircraft } from '../types';
import './Pages.css';

type Tab = 'libro' | 'pilotos' | 'aeronaves' | 'informes';

const Operaciones: React.FC = () => {
  const { user } = useAuth();
  const { pilots, aircraft, flightLogs, addPilot, updatePilot, deletePilot, addAircraft, addFlightLog } = useOperations();
  const [tab, setTab] = useState<Tab>('libro');

  // ── Libro de vuelo ──────────────────────────────────────────────────────────
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [flightForm, setFlightForm] = useState({
    flightNumber: '', aircraftId: '', pilotId: '', coPilotId: '',
    origin: '', destination: '', departureTime: '', arrivalTime: '',
    blockHours: '', flightType: 'VFR' as FlightLog['flightType'],
    passengers: '', occupancyRate: '', notes: '',
  });

  const submitFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const ac = aircraft.find(a => a.id === flightForm.aircraftId);
    const pilot = pilots.find(p => p.id === flightForm.pilotId);
    const coPilot = pilots.find(p => p.id === flightForm.coPilotId);
    if (!ac || !pilot) return;
    addFlightLog({
      flightNumber: flightForm.flightNumber,
      aircraftId: ac.id,
      aircraftRegistration: ac.registration,
      pilotId: pilot.id,
      pilotName: pilot.name,
      coPilotId: coPilot?.id,
      coPilotName: coPilot?.name,
      origin: flightForm.origin,
      destination: flightForm.destination,
      departureTime: flightForm.departureTime,
      arrivalTime: flightForm.arrivalTime,
      blockHours: parseFloat(flightForm.blockHours) || 0,
      flightType: flightForm.flightType,
      passengers: parseInt(flightForm.passengers) || 0,
      occupancyRate: parseFloat(flightForm.occupancyRate) || 0,
      notes: flightForm.notes,
      createdBy: user?.username || '',
      createdDate: new Date().toISOString(),
    });
    setFlightForm({ flightNumber: '', aircraftId: '', pilotId: '', coPilotId: '', origin: '', destination: '', departureTime: '', arrivalTime: '', blockHours: '', flightType: 'VFR', passengers: '', occupancyRate: '', notes: '' });
    setShowFlightForm(false);
  };

  // ── Pilotos ─────────────────────────────────────────────────────────────────
  const [showPilotForm, setShowPilotForm] = useState(false);
  const [pilotForm, setPilotForm] = useState({ name: '', licenseNumber: '', email: '', phone: '' });

  const submitPilot = (e: React.FormEvent) => {
    e.preventDefault();
    addPilot({ ...pilotForm, isActive: true, totalBlockHours: 0, totalNoctHours: 0, totalIfrHours: 0, totalVfrHours: 0 });
    setPilotForm({ name: '', licenseNumber: '', email: '', phone: '' });
    setShowPilotForm(false);
  };

  // ── Aeronaves ───────────────────────────────────────────────────────────────
  const [showAcForm, setShowAcForm] = useState(false);
  const [acForm, setAcForm] = useState({ registration: '', model: '', serialNumber: '', totalHours: '', totalCycles: '' });

  const submitAircraft = (e: React.FormEvent) => {
    e.preventDefault();
    addAircraft({
      registration: acForm.registration, model: acForm.model, serialNumber: acForm.serialNumber,
      isActive: true,
      totalHours: parseFloat(acForm.totalHours) || 0,
      totalCycles: parseInt(acForm.totalCycles) || 0,
    });
    setAcForm({ registration: '', model: '', serialNumber: '', totalHours: '', totalCycles: '' });
    setShowAcForm(false);
  };

  // ── Informes ────────────────────────────────────────────────────────────────
  const [filterPilot, setFilterPilot] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredLogs = flightLogs.filter(l =>
    (!filterPilot || l.pilotId === filterPilot) &&
    (!filterType || l.flightType === filterType)
  );

  const pilotHoursReport = pilots.map(p => ({
    ...p,
    flights: flightLogs.filter(l => l.pilotId === p.id).length,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>✈️ Operaciones</h2>
      </div>

      <div className="tabs">
        {(['libro', 'pilotos', 'aeronaves', 'informes'] as Tab[]).map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'libro' ? '📋 Libro de Vuelo' : t === 'pilotos' ? '👨‍✈️ Pilotos' : t === 'aeronaves' ? '🛩️ Aeronaves' : '📊 Informes'}
          </button>
        ))}
      </div>

      {/* ── LIBRO DE VUELO ── */}
      {tab === 'libro' && (
        <div>
          <div className="header-actions" style={{ marginBottom: 20 }}>
            <button className="btn-primary" onClick={() => setShowFlightForm(!showFlightForm)}>
              {showFlightForm ? 'Cancelar' : '+ Registrar Vuelo'}
            </button>
          </div>

          {showFlightForm && (
            <form className="form-card" onSubmit={submitFlight}>
              <h3>Nuevo Registro de Vuelo</h3>
              <div className="form-grid">
                <input placeholder="N° de vuelo" value={flightForm.flightNumber} onChange={e => setFlightForm(p => ({ ...p, flightNumber: e.target.value }))} required />
                <select value={flightForm.aircraftId} onChange={e => setFlightForm(p => ({ ...p, aircraftId: e.target.value }))} required>
                  <option value="">Seleccionar aeronave</option>
                  {aircraft.filter(a => a.isActive).map(a => <option key={a.id} value={a.id}>{a.registration} - {a.model}</option>)}
                </select>
                <select value={flightForm.pilotId} onChange={e => setFlightForm(p => ({ ...p, pilotId: e.target.value }))} required>
                  <option value="">Piloto al mando</option>
                  {pilots.filter(p => p.isActive).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={flightForm.coPilotId} onChange={e => setFlightForm(p => ({ ...p, coPilotId: e.target.value }))}>
                  <option value="">Copiloto (opcional)</option>
                  {pilots.filter(p => p.isActive).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input placeholder="Origen (ICAO)" value={flightForm.origin} onChange={e => setFlightForm(p => ({ ...p, origin: e.target.value }))} required />
                <input placeholder="Destino (ICAO)" value={flightForm.destination} onChange={e => setFlightForm(p => ({ ...p, destination: e.target.value }))} required />
                <input type="datetime-local" placeholder="Salida" value={flightForm.departureTime} onChange={e => setFlightForm(p => ({ ...p, departureTime: e.target.value }))} required />
                <input type="datetime-local" placeholder="Llegada" value={flightForm.arrivalTime} onChange={e => setFlightForm(p => ({ ...p, arrivalTime: e.target.value }))} required />
                <input type="number" step="0.1" placeholder="Horas de bloque" value={flightForm.blockHours} onChange={e => setFlightForm(p => ({ ...p, blockHours: e.target.value }))} required />
                <select value={flightForm.flightType} onChange={e => setFlightForm(p => ({ ...p, flightType: e.target.value as FlightLog['flightType'] }))}>
                  <option value="VFR">VFR</option>
                  <option value="IFR">IFR</option>
                  <option value="NOCT">NOCT</option>
                </select>
                <input type="number" placeholder="Pasajeros" value={flightForm.passengers} onChange={e => setFlightForm(p => ({ ...p, passengers: e.target.value }))} />
                <input type="number" step="0.1" placeholder="Ocupación %" value={flightForm.occupancyRate} onChange={e => setFlightForm(p => ({ ...p, occupancyRate: e.target.value }))} />
              </div>
              <input placeholder="Notas" value={flightForm.notes} onChange={e => setFlightForm(p => ({ ...p, notes: e.target.value }))} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5, marginBottom: 10 }} />
              <div className="form-actions">
                <button type="submit" className="btn-primary">Registrar</button>
              </div>
            </form>
          )}

          {flightLogs.length === 0 ? (
            <div className="empty-state">No hay vuelos registrados aún.</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>N° Vuelo</th><th>Aeronave</th><th>Piloto</th><th>Origen</th><th>Destino</th>
                    <th>Salida</th><th>Horas Bloque</th><th>Tipo</th><th>Pasajeros</th><th>Ocupación</th>
                  </tr>
                </thead>
                <tbody>
                  {flightLogs.map(l => (
                    <tr key={l.id}>
                      <td>{l.flightNumber}</td>
                      <td>{l.aircraftRegistration}</td>
                      <td>{l.pilotName}</td>
                      <td>{l.origin}</td>
                      <td>{l.destination}</td>
                      <td>{new Date(l.departureTime).toLocaleString('es-CO')}</td>
                      <td>{l.blockHours.toFixed(1)} h</td>
                      <td><span className={`status status-${l.flightType.toLowerCase()}`}>{l.flightType}</span></td>
                      <td>{l.passengers}</td>
                      <td>{l.occupancyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── PILOTOS ── */}
      {tab === 'pilotos' && (
        <div>
          <div className="header-actions" style={{ marginBottom: 20 }}>
            <button className="btn-primary" onClick={() => setShowPilotForm(!showPilotForm)}>
              {showPilotForm ? 'Cancelar' : '+ Agregar Piloto'}
            </button>
          </div>
          {showPilotForm && (
            <form className="form-card" onSubmit={submitPilot}>
              <h3>Nuevo Piloto</h3>
              <div className="form-grid">
                <input placeholder="Nombre completo" value={pilotForm.name} onChange={e => setPilotForm(p => ({ ...p, name: e.target.value }))} required />
                <input placeholder="N° Licencia" value={pilotForm.licenseNumber} onChange={e => setPilotForm(p => ({ ...p, licenseNumber: e.target.value }))} required />
                <input placeholder="Email" value={pilotForm.email} onChange={e => setPilotForm(p => ({ ...p, email: e.target.value }))} />
                <input placeholder="Teléfono" value={pilotForm.phone} onChange={e => setPilotForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          )}
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Nombre</th><th>Licencia</th><th>Horas Bloque</th><th>NOCT</th><th>IFR</th><th>VFR</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {pilots.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.licenseNumber}</td>
                    <td>{p.totalBlockHours.toFixed(1)} h</td>
                    <td>{p.totalNoctHours.toFixed(1)} h</td>
                    <td>{p.totalIfrHours.toFixed(1)} h</td>
                    <td>{p.totalVfrHours.toFixed(1)} h</td>
                    <td><span className={`status ${p.isActive ? 'status-approved' : 'status-rejected'}`}>{p.isActive ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-small" style={{ background: '#f39c12' }} onClick={() => updatePilot(p.id, { isActive: !p.isActive })}>
                          {p.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button className="btn-small" onClick={() => deletePilot(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── AERONAVES ── */}
      {tab === 'aeronaves' && (
        <div>
          <div className="header-actions" style={{ marginBottom: 20 }}>
            <button className="btn-primary" onClick={() => setShowAcForm(!showAcForm)}>
              {showAcForm ? 'Cancelar' : '+ Agregar Aeronave'}
            </button>
          </div>
          {showAcForm && (
            <form className="form-card" onSubmit={submitAircraft}>
              <h3>Nueva Aeronave</h3>
              <div className="form-grid">
                <input placeholder="Matrícula (ej: HK-1234)" value={acForm.registration} onChange={e => setAcForm(p => ({ ...p, registration: e.target.value }))} required />
                <input placeholder="Modelo" value={acForm.model} onChange={e => setAcForm(p => ({ ...p, model: e.target.value }))} required />
                <input placeholder="N° Serie" value={acForm.serialNumber} onChange={e => setAcForm(p => ({ ...p, serialNumber: e.target.value }))} required />
                <input type="number" placeholder="Horas totales actuales" value={acForm.totalHours} onChange={e => setAcForm(p => ({ ...p, totalHours: e.target.value }))} />
                <input type="number" placeholder="Ciclos totales actuales" value={acForm.totalCycles} onChange={e => setAcForm(p => ({ ...p, totalCycles: e.target.value }))} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          )}
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Matrícula</th><th>Modelo</th><th>N° Serie</th><th>Horas Totales</th><th>Ciclos Totales</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {aircraft.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.registration}</strong></td>
                    <td>{a.model}</td>
                    <td>{a.serialNumber}</td>
                    <td>{a.totalHours.toFixed(1)} h</td>
                    <td>{a.totalCycles}</td>
                    <td><span className={`status ${a.isActive ? 'status-approved' : 'status-rejected'}`}>{a.isActive ? 'Activa' : 'Inactiva'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── INFORMES ── */}
      {tab === 'informes' && (
        <div>
          <h3 style={{ marginBottom: 20, color: '#2c3e50' }}>Informe de Horas por Piloto</h3>
          <div className="form-grid" style={{ marginBottom: 20 }}>
            <select value={filterPilot} onChange={e => setFilterPilot(e.target.value)}>
              <option value="">Todos los pilotos</option>
              {pilots.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">Todos los tipos</option>
              <option value="VFR">VFR</option>
              <option value="IFR">IFR</option>
              <option value="NOCT">NOCT</option>
            </select>
          </div>

          <div className="table-container" style={{ marginBottom: 30 }}>
            <table>
              <thead>
                <tr><th>Piloto</th><th>Licencia</th><th>Total Bloque</th><th>NOCT</th><th>IFR</th><th>VFR</th><th>Vuelos</th></tr>
              </thead>
              <tbody>
                {pilotHoursReport.filter(p => !filterPilot || p.id === filterPilot).map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.licenseNumber}</td>
                    <td><strong>{p.totalBlockHours.toFixed(1)} h</strong></td>
                    <td>{p.totalNoctHours.toFixed(1)} h</td>
                    <td>{p.totalIfrHours.toFixed(1)} h</td>
                    <td>{p.totalVfrHours.toFixed(1)} h</td>
                    <td>{p.flights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ marginBottom: 20, color: '#2c3e50' }}>Vuelos Filtrados</h3>
          {filteredLogs.length === 0 ? (
            <div className="empty-state">No hay vuelos con los filtros seleccionados.</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>N° Vuelo</th><th>Aeronave</th><th>Piloto</th><th>Ruta</th><th>Fecha</th><th>Horas</th><th>Tipo</th><th>Pasajeros</th></tr>
                </thead>
                <tbody>
                  {filteredLogs.map(l => (
                    <tr key={l.id}>
                      <td>{l.flightNumber}</td>
                      <td>{l.aircraftRegistration}</td>
                      <td>{l.pilotName}</td>
                      <td>{l.origin} → {l.destination}</td>
                      <td>{new Date(l.departureTime).toLocaleDateString('es-CO')}</td>
                      <td>{l.blockHours.toFixed(1)} h</td>
                      <td>{l.flightType}</td>
                      <td>{l.passengers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Operaciones;
