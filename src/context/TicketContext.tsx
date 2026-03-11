import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket } from '../types';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdDate'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const generateTicketNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = String(tickets.length + 1).padStart(4, '0');
    return `TKT-${year}${month}-${count}`;
  };

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdDate'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      ticketNumber: generateTicketNumber(),
      createdDate: new Date().toISOString()
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket, deleteTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets must be used within TicketProvider');
  return context;
};
