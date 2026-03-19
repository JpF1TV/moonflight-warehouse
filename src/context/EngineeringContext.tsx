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

function calcStatus(
  c: Omit<AircraftComponent, 'id' | 'status'>,
  currentHours: number,
  currentCycles: number
): AircraftComponent['status'] {
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
  {
    id: '1', aircraftId: '1', aircraftRegistration: 'HK-1234',
    description: 'Filtro de aceite motor', partNumber: 'FO-208-001', serialNumber: 'SN-FO-001',
    installDate: '2024-06-01', installHours: 4400, installCycles: 3100,
    limitHours: 200, alertHours: 50, status: 'alert',
  },
  {
    id: '2', aircraftId: '1', aircraftRegistration: 'HK-1234',
    description: 'Bujías de encendido', partNumber: 'SP-208-002', serialNumber: 'SN-SP-002',
    installDate: '2024-01-15', installHours: 4200, installCycles: 2900,
    limitHours: 500, alertHours: 100, status: 'ok',
  },
  {
    id: '3', aircraftId: '2', aircraftRegistration: 'HK-5678',
    description: 'Neumático tren principal', partNumber: 'TY-1900-001', serialNumber: 'SN-TY-001',
    installDate: '2023-11-01', installHours: 6500, installCycles: 4800,
    limitCycles: 500, alertCycles: 80, status: 'alert',
  },
];

export const EngineeringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<AircraftComponent[]>(sampleComponents);

  const addComponent = (c: Omit<AircraftComponent, 'id' | 'status'>) => {
    // We need aircraft current hours/cycles — default to installHours for new entry
    const status = calcStatus(c, c.installHours, c.installCycles);
    setComponents(prev => [...prev, { ...c, id: Date.now().toString(), status }]);
  };

  const updateComponent = (id: string, updates: Partial<AircraftComponent>) =>
    setComponents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

  const deleteComponent = (id: string) =>
    setComponents(prev => prev.filter(c => c.id !== id));

  const recalcStatus = (id: string, currentHours: number, currentCycles: number) => {
    setComponents(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, status: calcStatus(c, currentHours, currentCycles) };
    }));
  };

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
