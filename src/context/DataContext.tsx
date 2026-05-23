import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Part, PartItem, PartRequest, HistoryEntry } from '../types';

interface DataContextType {
  parts: Part[];
  requests: PartRequest[];
  history: HistoryEntry[];
  addPart: (part: Omit<Part, 'id'>) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  addPartItem: (partId: string, item: Omit<PartItem, 'id'>) => void;
  updatePartItem: (partId: string, itemId: string, updates: Partial<PartItem>) => void;
  addRequest: (request: Omit<PartRequest, 'id'>) => void;
  updateRequest: (id: string, updates: Partial<PartRequest>) => void;
  addHistory: (entry: Omit<HistoryEntry, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialParts: Part[] = [
  {
    id: '1', description: 'Motor turbohélice PT6A-114A', type: 'unit',
    items: [
      { id: '1-1', serialNumber: 'SN-PT6-001', partNumber: 'PN-PT6A-114A', location: 'A-01', status: 'available', entryDate: '2024-01-10' },
      { id: '1-2', serialNumber: 'SN-PT6-002', partNumber: 'PN-PT6A-114B', location: 'A-02', status: 'available', entryDate: '2024-01-12' },
      { id: '1-3', serialNumber: 'SN-PT6-003', partNumber: 'PN-PT6A-114C', location: 'A-03', status: 'overhaul', entryDate: '2023-11-05',
        overhaulInfo: { sentDate: '2024-03-01', repairShop: 'Pratt & Whitney MRO', reason: 'Inspección 3000h', expectedReturn: '2024-06-01' } },
    ]
  },
  {
    id: '2', description: 'Hélice Hartzell HC-B3TN', type: 'unit',
    items: [
      { id: '2-1', serialNumber: 'SN-HEL-001', partNumber: 'PN-HC-B3TN-1', location: 'B-01', status: 'available', entryDate: '2024-02-01' },
      { id: '2-2', serialNumber: 'SN-HEL-002', partNumber: 'PN-HC-B3TN-2', location: 'B-02', status: 'available', entryDate: '2024-02-03' },
    ]
  },
  {
    id: '3', description: 'Tren de aterrizaje principal', type: 'unit',
    items: [
      { id: '3-1', serialNumber: 'SN-LG-001', partNumber: 'PN-MLG-208-01', location: 'C-01', status: 'available', entryDate: '2024-01-20' },
      { id: '3-2', serialNumber: 'SN-LG-002', partNumber: 'PN-MLG-208-02', location: 'C-02', status: 'out', entryDate: '2023-12-10' },
    ]
  },
  {
    id: '4', description: 'Alternador eléctrico 28V', type: 'unit',
    items: [
      { id: '4-1', serialNumber: 'SN-ALT-001', partNumber: 'PN-ALT-28V-01', location: 'D-01', status: 'available', entryDate: '2024-03-05' },
      { id: '4-2', serialNumber: 'SN-ALT-002', partNumber: 'PN-ALT-28V-02', location: 'D-02', status: 'available', entryDate: '2024-03-06' },
    ]
  },
  {
    id: '5', description: 'Batería de arranque 24V', type: 'unit',
    items: [
      { id: '5-1', serialNumber: 'SN-BAT-001', partNumber: 'PN-BAT-24V-01', location: 'D-05', status: 'available', entryDate: '2024-04-01' },
    ]
  },
  {
    id: '6', description: 'Neumático tren principal 8.50-10', type: 'unit',
    items: [
      { id: '6-1', serialNumber: 'SN-TY-001', partNumber: 'PN-TY-850-01', location: 'E-01', status: 'available', entryDate: '2024-02-15' },
      { id: '6-2', serialNumber: 'SN-TY-002', partNumber: 'PN-TY-850-02', location: 'E-02', status: 'available', entryDate: '2024-02-15' },
      { id: '6-3', serialNumber: 'SN-TY-003', partNumber: 'PN-TY-850-03', location: 'E-03', status: 'reserved', entryDate: '2024-02-16' },
    ]
  },
  {
    id: '7', description: 'Filtro de aceite motor', type: 'bulk',
    items: [
      { id: '7-1', serialNumber: 'BULK-FO-001', partNumber: 'PN-FO-PT6-01', location: 'F-01', status: 'available', entryDate: '2024-01-05' },
      { id: '7-2', serialNumber: 'BULK-FO-002', partNumber: 'PN-FO-PT6-01', location: 'F-01', status: 'available', entryDate: '2024-01-05' },
      { id: '7-3', serialNumber: 'BULK-FO-003', partNumber: 'PN-FO-PT6-01', location: 'F-01', status: 'available', entryDate: '2024-01-05' },
      { id: '7-4', serialNumber: 'BULK-FO-004', partNumber: 'PN-FO-PT6-01', location: 'F-01', status: 'available', entryDate: '2024-01-05' },
      { id: '7-5', serialNumber: 'BULK-FO-005', partNumber: 'PN-FO-PT6-01', location: 'F-01', status: 'available', entryDate: '2024-01-05' },
    ]
  },
  {
    id: '8', description: 'Bujías de encendido Champion', type: 'bulk',
    items: [
      { id: '8-1', serialNumber: 'BULK-SP-001', partNumber: 'PN-SP-CH-01', location: 'F-02', status: 'available', entryDate: '2024-02-20' },
      { id: '8-2', serialNumber: 'BULK-SP-002', partNumber: 'PN-SP-CH-01', location: 'F-02', status: 'available', entryDate: '2024-02-20' },
      { id: '8-3', serialNumber: 'BULK-SP-003', partNumber: 'PN-SP-CH-01', location: 'F-02', status: 'available', entryDate: '2024-02-20' },
      { id: '8-4', serialNumber: 'BULK-SP-004', partNumber: 'PN-SP-CH-01', location: 'F-02', status: 'out', entryDate: '2024-02-20' },
    ]
  },
  {
    id: '9', description: 'Indicador de temperatura EGT', type: 'unit',
    items: [
      { id: '9-1', serialNumber: 'SN-EGT-001', partNumber: 'PN-EGT-208-01', location: 'G-01', status: 'available', entryDate: '2024-03-10' },
    ]
  },
  {
    id: '10', description: 'Transmisor de presión de aceite', type: 'unit',
    items: [
      { id: '10-1', serialNumber: 'SN-OPT-001', partNumber: 'PN-OPT-01', location: 'G-02', status: 'available', entryDate: '2024-03-12' },
      { id: '10-2', serialNumber: 'SN-OPT-002', partNumber: 'PN-OPT-02', location: 'G-03', status: 'available', entryDate: '2024-03-12' },
    ]
  },
  {
    id: '11', description: 'Válvula de combustible', type: 'unit',
    items: [
      { id: '11-1', serialNumber: 'SN-FV-001', partNumber: 'PN-FV-208-01', location: 'H-01', status: 'available', entryDate: '2024-04-05' },
      { id: '11-2', serialNumber: 'SN-FV-002', partNumber: 'PN-FV-208-02', location: 'H-02', status: 'overhaul', entryDate: '2024-01-10',
        overhaulInfo: { sentDate: '2024-04-10', repairShop: 'AeroParts Colombia', reason: 'Fuga detectada', expectedReturn: '2024-05-15' } },
    ]
  },
  {
    id: '12', description: 'Amortiguador de nariz', type: 'unit',
    items: [
      { id: '12-1', serialNumber: 'SN-NS-001', partNumber: 'PN-NS-208-01', location: 'C-05', status: 'available', entryDate: '2024-02-28' },
    ]
  },
  {
    id: '13', description: 'Tornillos estructurales AN3 (caja x100)', type: 'bulk',
    items: [
      { id: '13-1', serialNumber: 'BULK-AN3-001', partNumber: 'PN-AN3-100', location: 'Z-01', status: 'available', entryDate: '2024-01-01' },
      { id: '13-2', serialNumber: 'BULK-AN3-002', partNumber: 'PN-AN3-100', location: 'Z-01', status: 'available', entryDate: '2024-01-01' },
      { id: '13-3', serialNumber: 'BULK-AN3-003', partNumber: 'PN-AN3-100', location: 'Z-01', status: 'available', entryDate: '2024-01-01' },
    ]
  },
  {
    id: '14', description: 'Cinturón de seguridad piloto', type: 'unit',
    items: [
      { id: '14-1', serialNumber: 'SN-SB-001', partNumber: 'PN-SB-PIL-01', location: 'I-01', status: 'available', entryDate: '2024-03-20' },
      { id: '14-2', serialNumber: 'SN-SB-002', partNumber: 'PN-SB-PIL-02', location: 'I-02', status: 'available', entryDate: '2024-03-20' },
    ]
  },
  {
    id: '15', description: 'Radio VHF Garmin GNC 255', type: 'unit',
    items: [
      { id: '15-1', serialNumber: 'SN-VHF-001', partNumber: 'PN-GNC255-01', location: 'J-01', status: 'available', entryDate: '2024-04-10' },
      { id: '15-2', serialNumber: 'SN-VHF-002', partNumber: 'PN-GNC255-02', location: 'J-02', status: 'reserved', entryDate: '2024-04-10' },
    ]
  },
];

const initialRequests: PartRequest[] = [
  { id: 'r1', partNumber: 'PN-FO-PT6-01', quantity: 2, requestedBy: 'almacen', requestDate: '2024-05-01T08:00:00Z', status: 'pending', requestType: 'exit', notes: 'Cambio de aceite programado HK-1234' },
  { id: 'r2', partNumber: 'PN-SP-CH-01', quantity: 4, requestedBy: 'usuario', requestDate: '2024-05-02T10:00:00Z', status: 'pending', requestType: 'exit', notes: 'Reemplazo bujías 100h HK-5678' },
  { id: 'r3', partNumber: 'PN-FV-208-01', quantity: 1, requestedBy: 'almacen', requestDate: '2024-04-20T09:00:00Z', status: 'approved', approvedBy: 'admin', approvalDate: '2024-04-21T08:00:00Z', requestType: 'exit', notes: 'Reemplazo urgente' },
  { id: 'r4', partNumber: 'PN-PT6A-114C', quantity: 1, requestedBy: 'almacen', requestDate: '2024-03-01T07:00:00Z', status: 'approved', approvedBy: 'admin', approvalDate: '2024-03-02T08:00:00Z', requestType: 'overhaul', notes: 'Inspección 3000h', overhaulInfo: { repairShop: 'Pratt & Whitney MRO', reason: 'Inspección programada', expectedReturn: '2024-06-01' } },
];

const initialHistory: HistoryEntry[] = [
  { id: 'h1', partNumber: 'PN-PT6A-114C', serialNumber: 'SN-PT6-003', action: 'overhaul', quantity: 1, user: 'admin', date: '2024-03-01T07:00:00Z', notes: 'Enviado a Pratt & Whitney MRO' },
  { id: 'h2', partNumber: 'PN-FV-208-01', serialNumber: 'SN-FV-001', action: 'exit', quantity: 1, user: 'admin', date: '2024-04-21T08:00:00Z', notes: 'Reemplazo urgente aprobado' },
  { id: 'h3', partNumber: 'PN-MLG-208-02', serialNumber: 'SN-LG-002', action: 'exit', quantity: 1, user: 'admin', date: '2024-02-10T10:00:00Z', notes: 'Instalado en HK-5678' },
  { id: 'h4', partNumber: 'PN-FO-PT6-01', serialNumber: 'BULK-FO-001', action: 'entry', quantity: 5, user: 'almacen', date: '2024-01-05T08:00:00Z', notes: 'Ingreso inicial inventario' },
  { id: 'h5', partNumber: 'PN-AN3-100', serialNumber: 'BULK-AN3-001', action: 'entry', quantity: 3, user: 'almacen', date: '2024-01-01T08:00:00Z', notes: 'Ingreso inicial' },
  { id: 'h6', partNumber: 'PN-SP-CH-01', serialNumber: 'BULK-SP-004', action: 'exit', quantity: 1, user: 'admin', date: '2024-03-15T09:00:00Z', notes: 'Mantenimiento 50h HK-1234' },
  { id: 'h7', partNumber: 'PN-TY-850-03', serialNumber: 'SN-TY-003', action: 'reserved', quantity: 1, user: 'almacen', date: '2024-04-01T11:00:00Z', notes: 'Reservado para HK-1234' },
  { id: 'h8', partNumber: 'PN-GNC255-02', serialNumber: 'SN-VHF-002', action: 'reserved', quantity: 1, user: 'almacen', date: '2024-04-10T14:00:00Z', notes: 'Reservado para instalación' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);

  const addPart = (part: Omit<Part, 'id'>) =>
    setParts(prev => [...prev, { ...part, id: Date.now().toString() }]);

  const updatePart = (id: string, updates: Partial<Part>) =>
    setParts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const addPartItem = (partId: string, item: Omit<PartItem, 'id'>) =>
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      return { ...p, items: [...p.items, { ...item, id: `${partId}-${Date.now()}` }] };
    }));

  const updatePartItem = (partId: string, itemId: string, updates: Partial<PartItem>) =>
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      return { ...p, items: p.items.map(i => i.id === itemId ? { ...i, ...updates } : i) };
    }));

  const addRequest = (request: Omit<PartRequest, 'id'>) =>
    setRequests(prev => [...prev, { ...request, id: Date.now().toString() }]);

  const updateRequest = (id: string, updates: Partial<PartRequest>) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

  const addHistory = (entry: Omit<HistoryEntry, 'id'>) =>
    setHistory(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);

  return (
    <DataContext.Provider value={{ parts, requests, history, addPart, updatePart, addPartItem, updatePartItem, addRequest, updateRequest, addHistory }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
