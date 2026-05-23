import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { useAuth } from '../context/AuthContext';
import { FlightLog } from '../types';
import './Pages.css';

type Tab = 'libro' | 'pilotos' | 'aeronaves' | 'informes';

// ── Helpers PDF ───────────────────────────────────────────────────────────────
function openPDF(html: string, filename: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
  const a = document.createElement('a');
  const blob = new Blob([html], { type: 'text/html' });
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

const style = `
  body{font-family:'Segoe UI',sans-serif;margin:0;padding:24px;color:#1e293b;background:#fff}
  h1{color:#1e3a5f;font-size:22px;margin-bottom:4px}
  h2{color:#334155;font-size:16px;margin:20px 0 8px}
  p{margin:2px 0;font-size:13px;color:#475569}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}
  th{background:#1e293b;color:#fff;padding:8px 10px;text-align:left}
  td{padding:7px 10px;border-bottom:1px solid #e2e8f0}
  tr:nth-child(even) td{background:#f8fafc}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1e3a5f;padding-bottom:12px;margin-bottom:20px}
  .badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}
  .ok{background:#dcfce7;color:#166534}.alert{background:#fef3c7;color:#92400e}.footer{margin-top:30px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:10px}
`;

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
      flightNumber: flightForm.flightNumber, aircraftId: ac.id, aircraftRegistration: ac.registration,
      pilotId: pilot.id, pilotName: pilot.name, coPilotId: coPilot?.id, coPilotName: coPilot?.name,
      origin: flightForm.origin, destination: flightForm.destination,
      departureTime: flightForm.departureTime, arrivalTime: flightForm.arrivalTime,
      blockHours: parseFloat(flightForm.blockHours) || 0, flightType: flightForm.flightType,
      passengers: parseInt(flightForm.passengers) || 0, occupancyRate: parseFloat(flightForm.occupancyRate) || 0,
      notes: flightForm.notes, createdBy: user?.username || '', createdDate: new Date().toISOString(),
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
    addAircraft({ registration: acForm.registration, model: acForm.model, serialNumber: acForm.serialNumber, isActive: true, totalHours: parseFloat(acForm.totalHours) || 0, totalCycles: parseInt(acForm.totalCycles) || 0 });
    setAcForm({ registration: '', model: '', serialNumber: '', totalHours: '', totalCycles: '' });
    setShowAcForm(false);
  };

  // ── Informes ────────────────────────────────────────────────────────────────
  const [filterPilot, setFilterPilot] = useState('');
  const [filterType, setFilterType] = useState('');
  const filteredLogs = flightLogs.filter(l => (!filterPilot || l.pilotId === filterPilot) && (!filterType || l.flightType === filterType));
  const pilotHoursReport = pilots.map(p => ({ ...p, flights: flightLogs.filter(l => l.pilotId === p.id).length }));

  // ── PDF: Libro de vuelo ─────────────────────────────────────────────────────
  const downloadFlightLogPDF = () => {
    const rows = flightLogs.map(l => `
      <tr>
        <td>${l.flightNumber}</td><td>${l.aircraftRegistration}</td><td>${l.pilotName}</td>
        <td>${l.origin} → ${l.destination}</td>
        <td>${new Date(l.departureTime).toLocaleString('es-CO')}</td>
        <td>${l.blockHours.toFixed(1)} h</td><td>${l.flightType}</td>
        <td>${l.passengers}</td><td>${l.occupancyRate}%</td>
        <td>${l.notes || '-'}</td>
      </tr>`).join('');
    const totalHours = flightLogs.reduce((s, l) => s + l.blockHours, 0);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Libro de Vuelo SIGA</title><style>${style}</style></head><body>
      <div class="header">
        <div><h1>✈️ SIGA — Libro de Vuelo</h1><p>Generado: ${new Date().toLocaleString('es-CO')} | Por: ${user?.username}</p></div>
        <div><p><strong>Total vuelos:</strong> ${flightLogs.length}</p><p><strong>Total horas:</strong> ${totalHours.toFixed(1)} h</p></div>
      </div>
      <table><thead><tr><th>N° Vuelo</th><th>Aeronave</th><th>Piloto</th><th>Ruta</th><th>Salida</th><th>Horas</th><th>Tipo</th><th>Pax</th><th>Ocup.</th><th>Notas</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="footer">SIGA — Sistema Integrado de Gestión Aeronáutica | Documento oficial</div>
    </body></html>`;
    openPDF(html, `LibroVuelo_SIGA_${new Date().toISOString().split('T')[0]}.html`);
  };

  // ── PDF: Pilotos ────────────────────────────────────────────────────────────
  const downloadPilotsPDF = () => {
    const rows = pilots.map(p => `
      <tr>
        <td>${p.name}</td><td>${p.licenseNumber}</td>
        <td>${p.email || '-'}</td><td>${p.phone || '-'}</td>
        <td>${p.totalBlockHours.toFixed(1)} h</td><td>${p.totalNoctHours.toFixed(1)} h</td>
        <td>${p.totalIfrHours.toFixed(1)} h</td><td>${p.totalVfrHours.toFixed(1)} h</td>
        <td>${flightLogs.filter(l => l.pilotId === p.id).length}</td>
        <td><span class="${p.isActive ? 'badge ok' : 'badge alert'}">${p.isActive ? 'Activo' : 'Inactivo'}</span></td>
      </tr>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pilotos SIGA</title><style>${style}</style></head><body>
      <div class="header">
        <div><h1>👨‍✈️ SIGA — Base de Datos de Pilotos</h1><p>Generado: ${new Date().toLocaleString('es-CO')} | Por: ${user?.username}</p></div>
        <div><p><strong>Total pilotos:</strong> ${pilots.length}</p><p><strong>Activos:</strong> ${pilots.filter(p => p.isActive).length}</p></div>
      </div>
      <table><thead><tr><th>Nombre</th><th>Licencia</th><th>Email</th><th>Teléfono</th><th>Bloque</th><th>NOCT</th><th>IFR</th><th>VFR</th><th>Vuelos</th><th>Estado</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="footer">SIGA — Sistema Integrado de Gestión Aeronáutica | Documento oficial</div>
    </body></html>`;
    openPDF(html, `Pilotos_SIGA_${new Date().toISOString().split('T')[0]}.html`);
  };

  // ── PDF: Aeronaves ──────────────────────────────────────────────────────────
  const downloadAircraftPDF = () => {
    const rows = aircraft.map(a => {
      const vuelos = flightLogs.filter(l => l.aircraftId === a.id).length;
      return `<tr>
        <td><strong>${a.registration}</strong></td><td>${a.model}</td><td>${a.serialNumber}</td>
        <td>${a.totalHours.toFixed(1)} h</td><td>${a.totalCycles}</td><td>${vuelos}</td>
        <td><span class="${a.isActive ? 'badge ok' : 'badge alert'}">${a.isActive ? 'Activa' : 'Inactiva'}</span></td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Aeronaves SIGA</title><style>${style}</style></head><body>
      <div class="header">
        <div><h1>🛩️ SIGA — Flota de Aeronaves</h1><p>Generado: ${new Date().toLocaleString('es-CO')} | Por: ${user?.username}</p></div>
        <div><p><strong>Total aeronaves:</strong> ${aircraft.length}</p><p><strong>Activas:</strong> ${aircraft.filter(a => a.isActive).length}</p></div>
      </div>
      <table><thead><tr><th>Matrícula</th><th>Modelo</th><th>N° Serie</th><th>Horas Totales</th><th>Ciclos</th><th>Vuelos</th><th>Estado</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="footer">SIGA — Sistema Integrado de Gestión Aeronáutica | Documento oficial</div>
    </body></html>`;
    openPDF(html, `Aeronaves_SIGA_${new Date().toISOString().split('T')[0]}.html`);
  };

  // ── PDF: Informe de horas ───────────────────────────────────────────────────
  const downloadInformePDF = () => {
    const filtered = pilotHoursReport.filter(p => !filterPilot || p.id === filterPilot);
    const rows = filtered.map(p => `<tr>
      <td>${p.name}</td><td>${p.licenseNumber}</td>
      <td>${p.totalBlockHours.toFixed(1)} h</td><td>${p.totalNoctHours.toFixed(1)} h</td>
      <td>${p.totalIfrHours.toFixed(1)} h</td><td>${p.totalVfrHours.toFixed(1)} h</td><td>${p.flights}</td>
    </tr>`).join('');
    const logRows = filteredLogs.map(l => `<tr>
      <td>${l.flightNumber}</td><td>${l.aircraftRegistration}</td><td>${l.pilotName}</td>
      <td>${l.origin} → ${l.destination}</td>
      <td>${new Date(l.departureTime).toLocaleDateString('es-CO')}</td>
      <td>${l.blockHours.toFixed(1)} h</td><td>${l.flightType}</td><td>${l.passengers}</td>
    </tr>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Informe Operaciones SIGA</title><style>${style}</style></head><body>
      <div class="header">
        <div><h1>📊 SIGA — Informe de Operaciones</h1><p>Generado: ${new Date().toLocaleString('es-CO')} | Por: ${user?.username}</p></div>
      </div>
      <h2>Horas por Piloto</h2>
      <table><thead><tr><th>Piloto</th><th>Licencia</th><th>Bloque</th><th>NOCT</th><th>IFR</th><th>VFR</th><th>Vuelos</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <h2>Detalle de Vuelos</h2>
      <table><thead><tr><th>N° Vuelo</th><th>Aeronave</th><th>Piloto</th><th>Ruta</th><th>Fecha</th><th>Horas</th><th>Tipo</th><th>Pax</th></tr></thead>
      <tbody>${logRows}</tbody></table>
      <div class="footer">SIGA — Sistema Integrado de Gestión Aeronáutica | Documento oficial</div>
    </body></html>`;
    openPDF(html, `InformeOperaciones_SIGA_${new Date().toISOString().split('T')[0]}.html`);
  };

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
            <button className="btn-pdf" onClick={downloadFlightLogPDF}>📄 Descargar PDF</button>
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
                <input type="datetime-local" value={flightForm.departureTime} onChange={e => setFlightForm(p => ({ ...p, departureTime: e.target.value }))} required />
                <input type="datetime-local" value={flightForm.arrivalTime} onChange={e => setFlightForm(p => ({ ...p, arrivalTime: e.target.value }))} required />
                <input type="number" step="0.1" placeholder="Horas de bloque" value={flightForm.blockHours} onChange={e => setFlightForm(p => ({ ...p, blockHours: e.target.value }))} required />
                <select value={flightForm.flightType} onChange={e => setFlightForm(p => ({ ...p, flightType: e.target.value as FlightLog['flightType'] }))}>
                  <option value="VFR">VFR</option><option value="IFR">IFR</option><option value="NOCT">NOCT</option>
                </select>
                <input type="number" placeholder="Pasajeros" value={flightForm.passengers} onChange={e => setFlightForm(p => ({ ...p, passengers: e.target.value }))} />
                <input type="number" step="0.1" placeholder="Ocupación %" value={flightForm.occupancyRate} onChange={e => setFlightForm(p => ({ ...p, occupancyRate: e.target.value }))} />
              </div>
              <input placeholder="Notas" value={flightForm.notes} onChange={e => setFlightForm(p => ({ ...p, notes: e.target.value }))} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5, marginBottom: 10 }} />
              <div className="form-actions"><button type="submit" className="btn-primary">Registrar</button></div>
            </form>
          )}

          {flightLogs.length === 0 ? <div className="empty-state">No hay vuelos registrados.</div> : (
            <div className="table-container">
              <table>
                <thead><tr><th>N° Vuelo</th><th>Aeronave</th><th>Piloto</th><th>Origen</th><th>Destino</th><th>Salida</th><th>Horas</th><th>Tipo</th><th>Pax</th><th>Ocup.</th></tr></thead>
                <tbody>
                  {flightLogs.map(l => (
                    <tr key={l.id}>
                      <td>{l.flightNumber}</td><td>{l.aircraftRegistration}</td><td>{l.pilotName}</td>
                      <td>{l.origin}</td><td>{l.destination}</td>
                      <td>{new Date(l.departureTime).toLocaleString('es-CO')}</td>
                      <td>{l.blockHours.toFixed(1)} h</td>
                      <td><span className="status">{l.flightType}</span></td>
                      <td>{l.passengers}</td><td>{l.occupancyRate}%</td>
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
            <button className="btn-pdf" onClick={downloadPilotsPDF}>📄 Descargar PDF</button>
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
              <div className="form-actions"><button type="submit" className="btn-primary">Guardar</button></div>
            </form>
          )}
          <div className="table-container">
            <table>
              <thead><tr><th>Nombre</th><th>Licencia</th><th>Email</th><th>Bloque</th><th>NOCT</th><th>IFR</th><th>VFR</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {pilots.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>{p.licenseNumber}</td><td>{p.email || '-'}</td>
                    <td>{p.totalBlockHours.toFixed(1)} h</td><td>{p.totalNoctHours.toFixed(1)} h</td>
                    <td>{p.totalIfrHours.toFixed(1)} h</td><td>{p.totalVfrHours.toFixed(1)} h</td>
                    <td><span className={`status ${p.isActive ? 'status-approved' : 'status-rejected'}`}>{p.isActive ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-small" style={{ background: '#f39c12' }} onClick={() => updatePilot(p.id, { isActive: !p.isActive })}>{p.isActive ? 'Desactivar' : 'Activar'}</button>
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
            <button className="btn-pdf" onClick={downloadAircraftPDF}>📄 Descargar PDF</button>
          </div>
          {showAcForm && (
            <form className="form-card" onSubmit={submitAircraft}>
              <h3>Nueva Aeronave</h3>
              <div className="form-grid">
                <input placeholder="Matrícula (ej: HK-1234)" value={acForm.registration} onChange={e => setAcForm(p => ({ ...p, registration: e.target.value }))} required />
                <input placeholder="Modelo" value={acForm.model} onChange={e => setAcForm(p => ({ ...p, model: e.target.value }))} required />
                <input placeholder="N° Serie" value={acForm.serialNumber} onChange={e => setAcForm(p => ({ ...p, serialNumber: e.target.value }))} required />
                <input type="number" placeholder="Horas totales" value={acForm.totalHours} onChange={e => setAcForm(p => ({ ...p, totalHours: e.target.value }))} />
                <input type="number" placeholder="Ciclos totales" value={acForm.totalCycles} onChange={e => setAcForm(p => ({ ...p, totalCycles: e.target.value }))} />
              </div>
              <div className="form-actions"><button type="submit" className="btn-primary">Guardar</button></div>
            </form>
          )}
          <div className="table-container">
            <table>
              <thead><tr><th>Matrícula</th><th>Modelo</th><th>N° Serie</th><th>Horas Totales</th><th>Ciclos</th><th>Vuelos</th><th>Estado</th></tr></thead>
              <tbody>
                {aircraft.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.registration}</strong></td><td>{a.model}</td><td>{a.serialNumber}</td>
                    <td>{a.totalHours.toFixed(1)} h</td><td>{a.totalCycles}</td>
                    <td>{flightLogs.filter(l => l.aircraftId === a.id).length}</td>
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
          <div className="header-actions" style={{ marginBottom: 20 }}>
            <select value={filterPilot} onChange={e => setFilterPilot(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontFamily: 'inherit' }}>
              <option value="">Todos los pilotos</option>
              {pilots.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontFamily: 'inherit' }}>
              <option value="">Todos los tipos</option>
              <option value="VFR">VFR</option><option value="IFR">IFR</option><option value="NOCT">NOCT</option>
            </select>
            <button className="btn-pdf" onClick={downloadInformePDF}>📄 Descargar Informe PDF</button>
          </div>

          <div className="table-container" style={{ marginBottom: 24 }}>
            <table>
              <thead><tr><th>Piloto</th><th>Licencia</th><th>Total Bloque</th><th>NOCT</th><th>IFR</th><th>VFR</th><th>Vuelos</th></tr></thead>
              <tbody>
                {pilotHoursReport.filter(p => !filterPilot || p.id === filterPilot).map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>{p.licenseNumber}</td>
                    <td><strong>{p.totalBlockHours.toFixed(1)} h</strong></td>
                    <td>{p.totalNoctHours.toFixed(1)} h</td><td>{p.totalIfrHours.toFixed(1)} h</td>
                    <td>{p.totalVfrHours.toFixed(1)} h</td><td>{p.flights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 ? <div className="empty-state">No hay vuelos con los filtros seleccionados.</div> : (
            <div className="table-container">
              <table>
                <thead><tr><th>N° Vuelo</th><th>Aeronave</th><th>Piloto</th><th>Ruta</th><th>Fecha</th><th>Horas</th><th>Tipo</th><th>Pax</th></tr></thead>
                <tbody>
                  {filteredLogs.map(l => (
                    <tr key={l.id}>
                      <td>{l.flightNumber}</td><td>{l.aircraftRegistration}</td><td>{l.pilotName}</td>
                      <td>{l.origin} → {l.destination}</td>
                      <td>{new Date(l.departureTime).toLocaleDateString('es-CO')}</td>
                      <td>{l.blockHours.toFixed(1)} h</td><td>{l.flightType}</td><td>{l.passengers}</td>
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
