import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pilot, Aircraft, FlightLog } from '../types';

interface OperationsContextType {
  pilots: Pilot[];
  aircraft: Aircraft[];
  flightLogs: FlightLog[];
  nextRegistroNumber: number;
  addPilot: (p: Omit<Pilot, 'id'>) => void;
  updatePilot: (id: string, updates: Partial<Pilot>) => void;
  deletePilot: (id: string) => void;
  addAircraft: (a: Omit<Aircraft, 'id'>) => void;
  updateAircraft: (id: string, updates: Partial<Aircraft>) => void;
  addFlightLog: (log: Omit<FlightLog, 'id'>) => void;
  updateFlightLog: (id: string, updates: Partial<FlightLog>) => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

const samplePilots: Pilot[] = [
  { id: '1', name: 'Carlos Rodríguez', licenseNumber: 'ATP-001', isActive: true, totalBlockHours: 1250, totalFlightHours: 1180, totalCycles: 3210 },
  { id: '2', name: 'María González', licenseNumber: 'ATP-002', isActive: true, totalBlockHours: 980, totalFlightHours: 920, totalCycles: 2540 },
];

const sampleAircraft: Aircraft[] = [
  { id: '1', registration: 'HK-1234', model: 'Cessna 208B', serialNumber: 'SN-208-001', isActive: true, totalHours: 4520, totalCycles: 3210 },
  { id: '2', registration: 'HK-5678', model: 'Beechcraft 1900D', serialNumber: 'SN-1900-002', isActive: true, totalHours: 6800, totalCycles: 5100 },
];

export const OperationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pilots, setPilots] = useState<Pilot[]>(samplePilots);
  const [aircraft, setAircraft] = useState<Aircraft[]>(sampleAircraft);
  const [flightLogs, setFlightLogs] = useState<FlightLog[]>([]);
  const [nextRegistroNumber, setNextRegistroNumber] = useState(1);

  const addPilot = (p: Omit<Pilot, 'id'>) =>
    setPilots(prev => [...prev, { ...p, id: Date.now().toString() }]);

  const updatePilot = (id: string, updates: Partial<Pilot>) =>
    setPilots(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const deletePilot = (id: string) =>
    setPilots(prev => prev.filter(p => p.id !== id));

  const addAircraft = (a: Omit<Aircraft, 'id'>) =>
    setAircraft(prev => [...prev, { ...a, id: Date.now().toString() }]);

  const updateAircraft = (id: string, updates: Partial<Aircraft>) =>
    setAircraft(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

  const addFlightLog = (log: Omit<FlightLog, 'id'>) => {
    const newLog: FlightLog = { ...log, id: Date.now().toString() };
    setFlightLogs(prev => [newLog, ...prev]);
    setNextRegistroNumber(n => n + 1);

    // Actualizar horas y ciclos del piloto
    const flightHours = log.totalFlightMinutes / 60;
    const blockHours = log.totalBlockMinutes / 60;
    setPilots(prev => prev.map(p => {
      if (p.id === log.pilotId) {
        return {
          ...p,
          totalBlockHours: p.totalBlockHours + blockHours,
          totalFlightHours: p.totalFlightHours + flightHours,
          totalCycles: p.totalCycles + log.totalCycles,
        };
      }
      return p;
    }));

    // Actualizar horas y ciclos de la aeronave
    setAircraft(prev => prev.map(a => {
      if (a.id === log.aircraftId) {
        return {
          ...a,
          totalHours: a.totalHours + blockHours,
          totalCycles: a.totalCycles + log.totalCycles,
        };
      }
      return a;
    }));
  };

  const updateFlightLog = (id: string, updates: Partial<FlightLog>) =>
    setFlightLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

  return (
    <OperationsContext.Provider value={{
      pilots, aircraft, flightLogs, nextRegistroNumber,
      addPilot, updatePilot, deletePilot,
      addAircraft, updateAircraft,
      addFlightLog, updateFlightLog,
    }}>
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider');
  return ctx;
};
