export function downloadManual() {
  const style = `
    body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;color:#1e293b;background:#fff}
    .cover{background:linear-gradient(135deg,#0f172a,#1e3a5f);color:white;padding:60px 48px;min-height:200px}
    .cover h1{font-size:36px;margin:0 0 8px;font-weight:800;letter-spacing:-1px}
    .cover p{font-size:16px;opacity:.8;margin:4px 0}
    .cover .version{margin-top:20px;font-size:12px;opacity:.5}
    .content{padding:40px 48px}
    h2{color:#1e3a5f;font-size:20px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;margin-top:36px}
    h3{color:#334155;font-size:15px;margin:20px 0 8px}
    h4{color:#1e3a5f;font-size:13px;margin:14px 0 6px;font-weight:700}
    p,li{font-size:13px;line-height:1.7;color:#475569}
    ul{padding-left:20px}
    ol{padding-left:20px}
    ol li{font-size:13px;line-height:1.8;color:#475569}
    .module{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin:12px 0}
    .module h3{margin:0 0 8px;color:#1e3a5f}
    .badge{display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;margin:2px}
    .role-admin{background:#ede9fe;color:#5b21b6}
    .role-warehouse{background:#fef3c7;color:#92400e}
    .role-requester{background:#dbeafe;color:#1e40af}
    .role-super{background:#fce7f3;color:#9d174d}
    table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
    th{background:#1e293b;color:white;padding:8px 12px;text-align:left}
    td{padding:8px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top}
    tr:nth-child(even) td{background:#f8fafc}
    .footer{background:#f1f5f9;padding:20px 48px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0}
    .tip{background:#eff6ff;border-left:3px solid #2563eb;padding:10px 14px;border-radius:0 6px 6px 0;margin:10px 0;font-size:12px;color:#1e40af}
    .warn{background:#fff7ed;border-left:3px solid #f59e0b;padding:10px 14px;border-radius:0 6px 6px 0;margin:10px 0;font-size:12px;color:#92400e}
    .danger{background:#fef2f2;border-left:3px solid #ef4444;padding:10px 14px;border-radius:0 6px 6px 0;margin:10px 0;font-size:12px;color:#991b1b}
    .steps{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin:10px 0}
    .steps h4{color:#166534;margin:0 0 8px}
    .cred{background:#1e293b;color:#e2e8f0;border-radius:6px;padding:8px 14px;font-family:monospace;font-size:12px;margin:6px 0;display:inline-block}
    @media print{.no-print{display:none}}
  `;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Usuario — SIGA</title>
  <style>${style}</style>
</head>
<body>

<div class="cover">
  <h1>✈️ SIGA</h1>
  <p>Sistema Integrado de Gestión Aeronáutica</p>
  <p>Manual de Usuario — Guía de Capacitación</p>
  <div class="version">Versión 1.0 · ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}</div>
</div>

<div class="content">

  <h2>1. Introducción</h2>
  <p>SIGA es una plataforma web diseñada para gestionar de forma integral las operaciones aeronáuticas de la empresa. Centraliza el control de almacén, operaciones de vuelo, ingeniería de mantenimiento y órdenes de trabajo en un solo sistema accesible desde cualquier navegador.</p>

  <h2>2. Acceso al Sistema</h2>
  <h3>2.1 Inicio de Sesión</h3>
  <p>Ingrese a la URL del sistema en su navegador. En la pantalla de inicio de sesión introduzca su <strong>usuario</strong> y <strong>contraseña</strong> asignados por el administrador. Al autenticarse correctamente verá una pantalla de bienvenida y será redirigido automáticamente al módulo correspondiente a su rol.</p>
  <div class="tip">💡 Si olvida su contraseña, contacte al Super Administrador para restablecerla.</div>

  <h3>2.2 Roles y Permisos</h3>
  <table>
    <thead><tr><th>Rol</th><th>Acceso</th><th>Descripción</th></tr></thead>
    <tbody>
      <tr><td><span class="badge role-super">Super Admin</span></td><td>Panel Super Admin</td><td>Gestión total de usuarios y tickets del sistema</td></tr>
      <tr><td><span class="badge role-admin">Administrador</span></td><td>Todos los módulos + Panel Admin</td><td>Aprobaciones, usuarios conectados, tickets y todos los módulos operativos</td></tr>
      <tr><td><span class="badge role-warehouse">Almacén</span></td><td>Almacén, Historial, Mantenimiento, Operaciones, Ingeniería, OMA</td><td>Gestión completa del inventario y operaciones técnicas</td></tr>
      <tr><td><span class="badge role-requester">Usuario</span></td><td>Historial, Mantenimiento</td><td>Consulta de historial y creación de solicitudes y tickets</td></tr>
    </tbody>
  </table>

  <h2>3. Módulos del Sistema</h2>

  <div class="module">
    <h3>📦 Almacén</h3>
    <p>Gestión completa del inventario de piezas aeronáuticas.</p>
    <ul>
      <li><strong>Inventario:</strong> Lista todas las piezas con su descripción, tipo (unitaria o consumible), cantidad disponible y estado.</li>
      <li><strong>Agregar pieza:</strong> Registre nuevas piezas con Part Number, Serial Number, ubicación física, PDF de trazabilidad y opción de ingreso directo a Overhaul.</li>
      <li><strong>Salida:</strong> Genera una solicitud de salida pendiente de aprobación por el administrador.</li>
      <li><strong>Overhaul:</strong> Envía la pieza a reparación externa. Registra taller, motivo y fecha estimada de retorno.</li>
      <li><strong>Búsqueda:</strong> Filtre por nombre del componente o Part Number.</li>
      <li><strong>Tab Overhaul:</strong> Vista de todas las piezas actualmente en proceso de reparación.</li>
    </ul>
    <div class="tip">💡 Las salidas y envíos a overhaul NO se ejecutan directamente. Quedan pendientes hasta que el Administrador las apruebe.</div>
  </div>

  <div class="module">
    <h3>📋 Historial</h3>
    <p>Registro cronológico de todos los movimientos del inventario.</p>
    <ul>
      <li>Visualice entradas, salidas, reservas y movimientos de overhaul.</li>
      <li>Use el buscador para filtrar por Part Number, usuario o tipo de acción.</li>
      <li><strong>Descargar PDF 24h:</strong> Genera un reporte en PDF con todos los movimientos de las últimas 24 horas.</li>
    </ul>
  </div>

  <div class="module">
    <h3>🔧 Mantenimiento</h3>
    <p>Módulo para solicitudes de piezas y gestión de tickets de soporte.</p>
    <ul>
      <li><strong>Nueva Solicitud:</strong> Seleccione la pieza, cantidad y motivo. Puede adjuntar un PDF de la solicitud oficial.</li>
      <li><strong>Mis Solicitudes:</strong> Consulte el estado de sus solicitudes y vea el PDF adjunto si aplica.</li>
      <li><strong>Tickets:</strong> Cree tickets para reportar bloqueos de usuario, fallas en la plataforma o solicitudes especiales. Incluya título, descripción y prioridad.</li>
    </ul>
  </div>

  <div class="module">
    <h3>✈️ Operaciones</h3>
    <p>Gestión del libro de vuelo y base de datos operacional.</p>
    <ul>
      <li><strong>Libro de Vuelo:</strong> Registre cada vuelo con aeronave, piloto, copiloto, ruta (ICAO), horas de bloque, tipo (VFR/IFR/NOCT), pasajeros y ocupación.</li>
      <li><strong>Pilotos:</strong> Base de datos de pilotos con acumulado de horas por tipo de vuelo. Activar/desactivar pilotos.</li>
      <li><strong>Aeronaves:</strong> Registro de la flota con horas totales y ciclos acumulados.</li>
      <li><strong>Informes:</strong> Reporte de horas por piloto filtrable. Exportar en PDF.</li>
      <li><strong>Descargar PDF:</strong> Disponible en cada sección para exportar la información.</li>
    </ul>
  </div>

  <div class="module">
    <h3>🔩 Ingeniería</h3>
    <p>Control de vida útil de componentes instalados en cada aeronave.</p>
    <ul>
      <li>Registre componentes con sus límites de vida por <strong>horas de vuelo</strong>, <strong>ciclos</strong> o <strong>fecha calendario</strong>.</li>
      <li>Configure umbrales de alerta: el sistema notifica cuando el remanente es menor o igual al valor configurado.</li>
      <li><strong>Estados:</strong> ✅ OK — ⚠️ En Alerta — 🔴 Vencido.</li>
      <li><strong>Generar OT:</strong> Desde un componente en alerta o vencido, genere automáticamente una Orden de Trabajo en el módulo OMA.</li>
    </ul>
    <div class="tip">💡 Los componentes vencidos requieren atención inmediata. El sistema los resalta en rojo.</div>
  </div>

  <div class="module">
    <h3>📋 OMA — Órdenes de Trabajo</h3>
    <p>Gestión de órdenes de mantenimiento programadas y no programadas.</p>
    <ul>
      <li>Cree órdenes de trabajo manuales o recíbalas automáticamente desde Ingeniería.</li>
      <li>Las OTs automáticas se marcan con la etiqueta <strong>AUTO</strong>.</li>
      <li>El sistema verifica en tiempo real si las piezas requeridas están disponibles en almacén.</li>
      <li><strong>Flujo:</strong> Pendiente → En Progreso → Completada.</li>
      <li>Panel de resumen con conteo por estado.</li>
    </ul>
  </div>

  <div class="module">
    <h3>🛡️ Panel Administrativo</h3>
    <p>Exclusivo para el rol Administrador.</p>
    <ul>
      <li><strong>Usuarios Conectados:</strong> Monitoreo en tiempo real de sesiones activas con duración.</li>
      <li><strong>Aprobaciones:</strong> Aprobar o rechazar solicitudes de salida y overhaul. Verifica disponibilidad antes de aprobar.</li>
      <li><strong>Tickets:</strong> Visualiza y crea tickets. Los tickets son gestionados por el Super Administrador.</li>
    </ul>
  </div>

  <div class="module">
    <h3>👑 Super Administrador</h3>
    <p>Panel de control total del sistema. Acceso exclusivo del Super Admin.</p>
    <ul>
      <li><strong>Gestión de Usuarios:</strong> Crear, editar, activar/desactivar y eliminar usuarios. Asignar roles y credenciales.</li>
      <li><strong>Gestión de Tickets:</strong> Ver todos los tickets del sistema, cambiar estado y marcar como resuelto. Registra automáticamente quién resolvió y la fecha.</li>
    </ul>
  </div>

  <h2>4. Flujo de Trabajo Principal</h2>
  <table>
    <thead><tr><th>Paso</th><th>Acción</th><th>Responsable</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Técnico solicita pieza en Mantenimiento</td><td>Usuario / Almacén</td></tr>
      <tr><td>2</td><td>Administrador aprueba o rechaza la solicitud</td><td>Administrador</td></tr>
      <tr><td>3</td><td>Inventario se actualiza automáticamente al aprobar</td><td>Sistema</td></tr>
      <tr><td>4</td><td>Movimiento queda registrado en Historial</td><td>Sistema</td></tr>
      <tr><td>5</td><td>Ingeniería detecta componente próximo a vencer</td><td>Sistema / Almacén</td></tr>
      <tr><td>6</td><td>Se genera OT automática en OMA</td><td>Sistema</td></tr>
      <tr><td>7</td><td>OMA verifica disponibilidad de piezas en almacén</td><td>Sistema</td></tr>
      <tr><td>8</td><td>Técnico ejecuta trabajo y cierra la OT</td><td>Almacén</td></tr>
    </tbody>
  </table>

  <h2>5. Preguntas Frecuentes</h2>
  <h3>¿Por qué no puedo ver todos los módulos?</h3>
  <p>El acceso a módulos depende de su rol. Contacte al administrador si necesita acceso adicional.</p>
  <h3>¿Los datos se guardan permanentemente?</h3>
  <p>En la versión actual los datos se almacenan en memoria del navegador. Para persistencia permanente se requiere integración con base de datos (versión futura).</p>
  <h3>¿Cómo reporto un problema con la plataforma?</h3>
  <p>Use el módulo <strong>Mantenimiento → Tickets</strong> y cree un ticket con tipo "Error en la Plataforma".</p>
  <h3>¿Cómo agrego un nuevo usuario?</h3>
  <p>Solo el Super Administrador puede crear usuarios desde el <strong>Panel Super Admin → Gestión de Usuarios</strong>.</p>

</div>

<div class="footer">
  SIGA — Sistema Integrado de Gestión Aeronáutica &nbsp;|&nbsp; Manual de Usuario v1.0 &nbsp;|&nbsp; Diseñado por Juan &amp; Carlos
</div>

<script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Manual_SIGA_v1.0.html`;
  a.click();

  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}
