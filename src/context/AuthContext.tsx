import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: { username: string; password: string; user: User }[] = [
  { username: 'admin', password: 'admin123', user: { id: '1', username: 'admin', role: 'admin' } },
  { username: 'almacen', password: 'almacen123', user: { id: '2', username: 'almacen', role: 'warehouse' } },
  { username: 'usuario', password: 'usuario123', user: { id: '3', username: 'usuario', role: 'requester' } },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const found = mockUsers.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found.user);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
