import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AircraftComponent } from '../types';

interface EngineeringContextType {
  components: AircraftComponent[];
  addComponent: (c: Omit<AircraftComponent, 'id' | 'status'>) => void;
  updateComponent: (id: string, updates: Partial<AircraftComponent>) => void;
  deleteComponent: (id: string) => void;
  recalcStatus: (id: string, currentHours: number, currentCycles: number) => void;
}

const EngineeringContext = createContext<EngineeringContextType | undefined>(undefined);

function calcStatus(c: Omit<AircraftComponent, 'id' | 'status'>, currentHours: number, currentCycles: number): AircraftComponent['status'] {
  const usedHours = currentHours - c.installHours;
  const usedCycles = currentCycles - c.installCycles;
  if (c.limitDate) {
    const daysLeft = Math.floor((new Date(c.limitDate).getTime() - Date.now()) / 86400000);
    if (daysLeft <= 0) return 'overdue';
    if (c.alertDays && daysLeft <= c.alertDays) return 'alert';
  }
  if (c.limitHours) {
    const remaining = c.limitHours - usedHours;
    if (remaining <= 0) return 'overdue';
    if (c.alertHours && remaining <= c.alertHours) return 'alert';
  }
  if (c.limitCycles) {
    const remaining = c.limitCycles - usedCycles;
    if (remaining <= 0) return 'overdue';
    if (c.alertCycles && remaining <= c.alertCycles) return 'alert';
  }
  return 'ok';
}

const sampleComponents: AircraftComponent[] = [
  { id: '1', aircraftId: '1', aircraftRegistration: 'HK-1234', description: 'Filtro de aceite motor PT6A', partNumber: 'PN-FO-PT6-01', serialNumber: 'SN-FO-001', installDate: '2024-03-01', installHours: 4400, installCycles: 3100, limitHours: 200, alertHours: 50, status: 'alert' },
  { id: '2', aircraftId: '1', aircraftRegistration: 'HK-1234', description: 'Bujías de encendido Champion', partNumber: 'PN-SP-CH-01', serialNumber: 'SN-SP-001', installDate: '2024-01-15', installHours: 4200, installCycles: 2900, limitHours: 500, alertHours: 100, status: 'ok' },
  { id: '3', aircraftId: '1', aircraftRegistration: 'HK-1234', description: 'Correa de accesorios', partNumber: 'PN-BLT-208-01', serialNumber: 'SN-BLT-001', installDate: '2023-06-01', installHours: 3800, installCycles: 2600, limitHours: 1000, alertHours: 150, status: 'ok' },
  { id: '4', aircraftId: '2', aircraftRegistration: 'HK-5678', description: 'Neumático tren principal izq', partNumber: 'PN-TY-850-01', serialNumber: 'SN-TY-001', installDate: '2023-11-01', installHours: 6500, installCycles: 4800, limitCycles: 500, alertCycles: 80, status: 'alert' },
  { id: '5', aircraftId: '2', aircraftRegistration: 'HK-5678', description: 'Neumático tren principal der', partNumber: 'PN-TY-850-02', serialNumber: 'SN-TY-002', installDate: '2023-11-01', installHours: 6500, installCycles: 4800, limitCycles: 500, alertCycles: 80, status: 'alert' },
  { id: '6', aircraftId: '2', aircraftRegistration: 'HK-5678', description: 'Filtro de combustible', partNumber: 'PN-FF-1900-01', serialNumber: 'SN-FF-001', installDate: '2024-02-10', installHours: 6600, installCycles: 4950, limitHours: 300, alertHours: 60, status: 'ok' },
  { id: '7', aircraftId: '3', aircraftRegistration: 'HK-9012', description: 'Amortiguador tren nariz', partNumber: 'PN-NS-208-01', serialNumber: 'SN-NS-001', installDate: '2023-08-15', installHours: 1800, installCycles: 1300, limitDate: '2024-08-15', alertDays: 60, status: 'ok' },
  { id: '8', aircraftId: '3', aircraftRegistration: 'HK-9012', description: 'Alternador 28V', partNumber: 'PN-ALT-28V-01', serialNumber: 'SN-ALT-001', installDate: '2022-01-10', installHours: 800, installCycles: 600, limitHours: 2000, alertHours: 300, status: 'ok' },
  { id: '9', aircraftId: '1', aircraftRegistration: 'HK-1234', description: 'Válvula de combustible', partNumber: 'PN-FV-208-01', serialNumber: 'SN-FV-001', installDate: '2024-04-21', installHours: 4510, installCycles: 3200, limitDate: '2026-04-21', alertDays: 90, status: 'ok' },
  { id: '10', aircraftId: '2', aircraftRegistration: 'HK-5678', description: 'Batería de arranque 24V', partNumber: 'PN-BAT-24V-01', serialNumber: 'SN-BAT-001', installDate: '2022-06-01', installHours: 5800, installCycles: 4200, limitDate: '2024-06-01', alertDays: 30, status: 'overdue' },
];

export const EngineeringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<AircraftComponent[]>(sampleComponents);

  const addComponent = (c: Omit<AircraftComponent, 'id' | 'status'>) => {
    const status = calcStatus(c, c.installHours, c.installCycles);
    setComponents(prev => [...prev, { ...c, id: Date.now().toString(), status }]);
  };

  const updateComponent = (id: string, updates: Partial<AircraftComponent>) =>
    setComponents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

  const deleteComponent = (id: string) =>
    setComponents(prev => prev.filter(c => c.id !== id));

  const recalcStatus = (id: string, currentHours: number, currentCycles: number) =>
    setComponents(prev => prev.map(c => c.id !== id ? c : { ...c, status: calcStatus(c, currentHours, currentCycles) }));

  return (
    <EngineeringContext.Provider value={{ components, addComponent, updateComponent, deleteComponent, recalcStatus }}>
      {children}
    </EngineeringContext.Provider>
  );
};

export const useEngineering = () => {
  const ctx = useContext(EngineeringContext);
  if (!ctx) throw new Error('useEngineering must be used within EngineeringProvider');
  return ctx;
};
