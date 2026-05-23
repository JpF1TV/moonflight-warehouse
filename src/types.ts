export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'superadmin' | 'admin' | 'warehouse' | 'requester';
  fullName?: string;
  email?: string;
  createdDate?: string;
  lastLogin?: string;
  isActive?: boolean;
}

export interface LoginSession {
  id: string;
  userId: string;
  username: string;
  loginTime: string;
  logoutTime?: string;
  isActive: boolean;
}

export interface Part {
  id: string;
  description: string;
  type: 'unit' | 'bulk';
  items: PartItem[];
}

export interface PartItem {
  id: string;
  serialNumber: string;
  partNumber: string;
  location: string;
  status: 'available' | 'reserved' | 'out' | 'overhaul';
  entryDate: string;
  pdfUrl?: string;
  pdfName?: string;
  notes?: string;
  overhaulInfo?: {
    sentDate: string;
    expectedReturn?: string;
    repairShop?: string;
    reason?: string;
    aircraftRemoved?: string;
  };
}

export interface PartRequest {
  id: string;
  partNumber: string;
  serialNumber?: string;
  quantity: number;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  requestType: 'exit' | 'overhaul';
  pdfUrl?: string;
  pdfName?: string;
  requestPdfUrl?: string;
  requestPdfName?: string;
  overhaulInfo?: {
    repairShop?: string;
    aircraftRemoved?: string;
    expectedReturn?: string;
    reason?: string;
  };
}

export interface HistoryEntry {
  id: string;
  partNumber: string;
  serialNumber?: string;
  action: 'entry' | 'exit' | 'reserved' | 'overhaul' | 'overhaul_return';
  quantity: number;
  user: string;
  date: string;
  notes?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  type: 'user_block' | 'platform_failure' | 'request' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  cause?: string;
  createdBy: string;
  createdDate: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolvedBy?: string;
  resolvedDate?: string;
  notes?: string;
}

export interface Pilot {
  id: string;
  name: string;
  licenseNumber: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  totalBlockHours: number;
  totalFlightHours: number;
  totalCycles: number;
}

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  serialNumber: string;
  isActive: boolean;
  totalHours: number;
  totalCycles: number;
}

/** Un trayecto dentro de un registro de vuelo */
export interface FlightLeg {
  id: string;
  /** Número de trayecto dentro del registro (1, 2, 3…) */
  legNumber: number;
  origin: string;
  destination: string;
  /** Hora militar HHmm, ej: "0830" */
  blockStart: string;
  /** Hora militar HHmm */
  flightStart: string;
  /** Hora militar HHmm */
  flightEnd: string;
  /** Hora militar HHmm */
  blockEnd: string;
  /** Combustible al inicio del trayecto (galones/libras) */
  fuelInitial: number;
  /** Combustible al final del trayecto */
  fuelFinal: number;
  /** Calculado: fuelInitial - fuelFinal */
  fuelBurned: number;
  /** Ciclo acumulado del registro (auto) */
  cycle: number;
  /** RIN acumulado del registro (auto, igual a cycle) */
  rin: number;
  /** Tiempo de vuelo del trayecto en minutos (flightEnd - flightStart) */
  flightMinutes: number;
  /** Tiempo de bloque del trayecto en minutos (blockEnd - blockStart) */
  blockMinutes: number;
}

/** Registro de vuelo: encabezado + lista de trayectos */
export interface FlightLog {
  id: string;
  /** Número de registro auto-incremental */
  registroNumber: number;
  /** Número de vuelo del libro físico */
  flightNumber: string;
  aircraftId: string;
  aircraftRegistration: string;
  pilotId: string;
  pilotName: string;
  hasCoPilot: boolean;
  coPilotId?: string;
  coPilotName?: string;
  /** Lista de trayectos del día */
  legs: FlightLeg[];
  /** Tiempo total de vuelo en minutos (suma de legs) */
  totalFlightMinutes: number;
  /** Tiempo total de bloque en minutos (suma de legs) */
  totalBlockMinutes: number;
  /** Tiempo cliente = tiempo de vuelo total (en minutos) */
  clientMinutes: number;
  /** Total ciclos del registro */
  totalCycles: number;
  notes?: string;
  createdBy: string;
  createdDate: string;
}

export interface AircraftComponent {
  id: string;
  aircraftId: string;
  aircraftRegistration: string;
  description: string;
  partNumber: string;
  serialNumber: string;
  installDate: string;
  installHours: number;
  installCycles: number;
  limitHours?: number;
  limitCycles?: number;
  limitDate?: string;
  alertHours?: number;
  alertCycles?: number;
  alertDays?: number;
  status: 'ok' | 'alert' | 'overdue';
  notes?: string;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  componentId?: string;
  aircraftId: string;
  aircraftRegistration: string;
  taskCode: string;
  description: string;
  type: 'scheduled' | 'unscheduled' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectedDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  partsRequired: WorkOrderPart[];
  partsAvailable?: boolean;
  createdBy: string;
  createdDate: string;
  notes?: string;
  autoGenerated?: boolean;
}

export interface WorkOrderPart {
  partNumber: string;
  description: string;
  quantityRequired: number;
  quantityAvailable: number;
}
