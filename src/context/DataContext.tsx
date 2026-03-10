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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      description: 'Motor eléctrico',
      type: 'unit',
      items: [
        {
          id: '1-1',
          serialNumber: 'SN001',
          partNumber: 'PN-12345',
          location: 'A-01',
          status: 'available',
          entryDate: '2024-01-15'
        },
        {
          id: '1-2',
          serialNumber: 'SN002',
          partNumber: 'PN-12346',
          location: 'A-02',
          status: 'available',
          entryDate: '2024-01-16'
        }
      ]
    },
    {
      id: '2',
      description: 'Tornillos M8',
      type: 'bulk',
      items: [
        {
          id: '2-1',
          serialNumber: 'BULK-001',
          partNumber: 'PN-67890',
          location: 'B-05',
          status: 'available',
          entryDate: '2024-01-10'
        }
      ]
    }
  ]);

  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addPart = (part: Omit<Part, 'id'>) => {
    const newPart = { ...part, id: Date.now().toString() };
    setParts(prev => [...prev, newPart]);
  };

  const updatePart = (id: string, updates: Partial<Part>) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPartItem = (partId: string, item: Omit<PartItem, 'id'>) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        const newItem = { ...item, id: `${partId}-${Date.now()}` };
        return { ...p, items: [...p.items, newItem] };
      }
      return p;
    }));
  };

  const updatePartItem = (partId: string, itemId: string, updates: Partial<PartItem>) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        return {
          ...p,
          items: p.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
        };
      }
      return p;
    }));
  };

  const addRequest = (request: Omit<PartRequest, 'id'>) => {
    const newRequest = { ...request, id: Date.now().toString() };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateRequest = (id: string, updates: Partial<PartRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const addHistory = (entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setHistory(prev => [newEntry, ...prev]);
  };

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
