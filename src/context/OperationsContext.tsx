import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pilot, Aircraft, FlightLog } from '../types';

interface OperationsContextType {
  pilots: Pilot[];
  aircraft: Aircraft[];
  flightLogs: FlightLog[];
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
  { id: '1', name: 'Carlos Rodríguez', licenseNumber: 'ATP-COL-001', email: 'c.rodriguez@siga.com', phone: '3001234567', isActive: true, totalBlockHours: 4250, totalNoctHours: 820, totalIfrHours: 1640, totalVfrHours: 1790 },
  { id: '2', name: 'María González', licenseNumber: 'ATP-COL-002', email: 'm.gonzalez@siga.com', phone: '3109876543', isActive: true, totalBlockHours: 3180, totalNoctHours: 610, totalIfrHours: 1200, totalVfrHours: 1370 },
  { id: '3', name: 'Andrés Martínez', licenseNumber: 'CPL-COL-003', email: 'a.martinez@siga.com', phone: '3205551234', isActive: true, totalBlockHours: 1850, totalNoctHours: 290, totalIfrHours: 720, totalVfrHours: 840 },
  { id: '4', name: 'Laura Pérez', licenseNumber: 'ATP-COL-004', email: 'l.perez@siga.com', phone: '3154449876', isActive: true, totalBlockHours: 5620, totalNoctHours: 1100, totalIfrHours: 2200, totalVfrHours: 2320 },
  { id: '5', name: 'Jorge Ramírez', licenseNumber: 'CPL-COL-005', email: 'j.ramirez@siga.com', phone: '3007778899', isActive: false, totalBlockHours: 980, totalNoctHours: 120, totalIfrHours: 380, totalVfrHours: 480 },
];

const sampleAircraft: Aircraft[] = [
  { id: '1', registration: 'HK-1234', model: 'Cessna 208B Grand Caravan', serialNumber: 'SN-208B-001', isActive: true, totalHours: 4520, totalCycles: 3210 },
  { id: '2', registration: 'HK-5678', model: 'Beechcraft 1900D', serialNumber: 'SN-1900D-002', isActive: true, totalHours: 6800, totalCycles: 5100 },
  { id: '3', registration: 'HK-9012', model: 'Cessna 208B Grand Caravan', serialNumber: 'SN-208B-003', isActive: true, totalHours: 2100, totalCycles: 1580 },
  { id: '4', registration: 'HK-3456', model: 'ATR 42-600', serialNumber: 'SN-ATR42-004', isActive: false, totalHours: 12400, totalCycles: 9800 },
];

const sampleFlightLogs: FlightLog[] = [
  { id: 'f1', flightNumber: 'MF-101', aircraftId: '1', aircraftRegistration: 'HK-1234', pilotId: '1', pilotName: 'Carlos Rodríguez', coPilotId: '3', coPilotName: 'Andrés Martínez', origin: 'SKBO', destination: 'SKRG', departureTime: '2024-05-01T06:00:00Z', arrivalTime: '2024-05-01T07:10:00Z', blockHours: 1.2, flightType: 'IFR', passengers: 9, occupancyRate: 100, createdBy: 'almacen', createdDate: '2024-05-01T05:30:00Z' },
  { id: 'f2', flightNumber: 'MF-102', aircraftId: '1', aircraftRegistration: 'HK-1234', pilotId: '2', pilotName: 'María González', origin: 'SKRG', destination: 'SKBO', departureTime: '2024-05-01T09:00:00Z', arrivalTime: '2024-05-01T10:15:00Z', blockHours: 1.3, flightType: 'IFR', passengers: 7, occupancyRate: 78, createdBy: 'almacen', createdDate: '2024-05-01T08:30:00Z' },
  { id: 'f3', flightNumber: 'MF-201', aircraftId: '2', aircraftRegistration: 'HK-5678', pilotId: '4', pilotName: 'Laura Pérez', coPilotId: '1', coPilotName: 'Carlos Rodríguez', origin: 'SKBO', destination: 'SKCZ', departureTime: '2024-05-02T05:30:00Z', arrivalTime: '2024-05-02T07:00:00Z', blockHours: 1.5, flightType: 'IFR', passengers: 18, occupancyRate: 95, createdBy: 'almacen', createdDate: '2024-05-02T05:00:00Z' },
  { id: 'f4', flightNumber: 'MF-103', aircraftId: '1', aircraftRegistration: 'HK-1234', pilotId: '1', pilotName: 'Carlos Rodríguez', origin: 'SKBO', destination: 'SKPE', departureTime: '2024-05-03T14:00:00Z', arrivalTime: '2024-05-03T15:30:00Z', blockHours: 1.5, flightType: 'VFR', passengers: 6, occupancyRate: 67, createdBy: 'almacen', createdDate: '2024-05-03T13:30:00Z' },
  { id: 'f5', flightNumber: 'MF-301', aircraftId: '3', aircraftRegistration: 'HK-9012', pilotId: '3', pilotName: 'Andrés Martínez', origin: 'SKRG', destination: 'SKUI', departureTime: '2024-05-04T07:00:00Z', arrivalTime: '2024-05-04T08:20:00Z', blockHours: 1.3, flightType: 'VFR', passengers: 5, occupancyRate: 56, createdBy: 'almacen', createdDate: '2024-05-04T06:30:00Z' },
  { id: 'f6', flightNumber: 'MF-202', aircraftId: '2', aircraftRegistration: 'HK-5678', pilotId: '4', pilotName: 'Laura Pérez', origin: 'SKCZ', destination: 'SKBO', departureTime: '2024-05-04T20:00:00Z', arrivalTime: '2024-05-04T21:30:00Z', blockHours: 1.5, flightType: 'NOCT', passengers: 15, occupancyRate: 79, createdBy: 'almacen', createdDate: '2024-05-04T19:30:00Z' },
  { id: 'f7', flightNumber: 'MF-104', aircraftId: '1', aircraftRegistration: 'HK-1234', pilotId: '2', pilotName: 'María González', coPilotId: '3', coPilotName: 'Andrés Martínez', origin: 'SKBO', destination: 'SKSP', departureTime: '2024-05-05T06:00:00Z', arrivalTime: '2024-05-05T07:45:00Z', blockHours: 1.8, flightType: 'IFR', passengers: 9, occupancyRate: 100, createdBy: 'almacen', createdDate: '2024-05-05T05:30:00Z' },
  { id: 'f8', flightNumber: 'MF-302', aircraftId: '3', aircraftRegistration: 'HK-9012', pilotId: '1', pilotName: 'Carlos Rodríguez', origin: 'SKUI', destination: 'SKRG', departureTime: '2024-05-06T21:00:00Z', arrivalTime: '2024-05-06T22:20:00Z', blockHours: 1.3, flightType: 'NOCT', passengers: 4, occupancyRate: 44, createdBy: 'almacen', createdDate: '2024-05-06T20:30:00Z' },
  { id: 'f9', flightNumber: 'MF-203', aircraftId: '2', aircraftRegistration: 'HK-5678', pilotId: '4', pilotName: 'Laura Pérez', origin: 'SKBO', destination: 'SKBQ', departureTime: '2024-05-07T08:00:00Z', arrivalTime: '2024-05-07T09:10:00Z', blockHours: 1.2, flightType: 'VFR', passengers: 16, occupancyRate: 84, createdBy: 'almacen', createdDate: '2024-05-07T07:30:00Z' },
  { id: 'f10', flightNumber: 'MF-105', aircraftId: '1', aircraftRegistration: 'HK-1234', pilotId: '1', pilotName: 'Carlos Rodríguez', origin: 'SKBO', destination: 'SKRG', departureTime: '2024-05-08T06:30:00Z', arrivalTime: '2024-05-08T07:45:00Z', blockHours: 1.3, flightType: 'IFR', passengers: 8, occupancyRate: 89, createdBy: 'almacen', createdDate: '2024-05-08T06:00:00Z' },
];

export const OperationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pilots, setPilots] = useState<Pilot[]>(samplePilots);
  const [aircraft, setAircraft] = useState<Aircraft[]>(sampleAircraft);
  const [flightLogs, setFlightLogs] = useState<FlightLog[]>(sampleFlightLogs);

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
    const newLog = { ...log, id: Date.now().toString() };
    setFlightLogs(prev => [newLog, ...prev]);
    setPilots(prev => prev.map(p => {
      if (p.id !== log.pilotId) return p;
      return {
        ...p,
        totalBlockHours: p.totalBlockHours + log.blockHours,
        totalNoctHours: log.flightType === 'NOCT' ? p.totalNoctHours + log.blockHours : p.totalNoctHours,
        totalIfrHours: log.flightType === 'IFR' ? p.totalIfrHours + log.blockHours : p.totalIfrHours,
        totalVfrHours: log.flightType === 'VFR' ? p.totalVfrHours + log.blockHours : p.totalVfrHours,
      };
    }));
    setAircraft(prev => prev.map(a => {
      if (a.id !== log.aircraftId) return a;
      return { ...a, totalHours: a.totalHours + log.blockHours, totalCycles: a.totalCycles + 1 };
    }));
  };

  const updateFlightLog = (id: string, updates: Partial<FlightLog>) =>
    setFlightLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

  return (
    <OperationsContext.Provider value={{ pilots, aircraft, flightLogs, addPilot, updatePilot, deletePilot, addAircraft, updateAircraft, addFlightLog, updateFlightLog }}>
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider');
  return ctx;
};
