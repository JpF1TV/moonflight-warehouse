import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoginSession } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  sessions: LoginSession[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdDate'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: User[] = [
  { 
    id: '1', 
    username: 'superadmin', 
    password: 'super123', 
    role: 'superadmin',
    fullName: 'Usuario Madre',
    email: 'superadmin@moonflight.com',
    createdDate: '2024-01-01',
    isActive: true
  },
  { 
    id: '2', 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin',
    fullName: 'Administrador',
    email: 'admin@moonflight.com',
    createdDate: '2024-01-01',
    isActive: true
  },
  { 
    id: '3', 
    username: 'almacen', 
    password: 'almacen123', 
    role: 'warehouse',
    fullName: 'Personal de Almacén',
    email: 'almacen@moonflight.com',
    createdDate: '2024-01-01',
    isActive: true
  },
  { 
    id: '4', 
    username: 'usuario', 
    password: 'usuario123', 
    role: 'requester',
    fullName: 'Usuario Solicitante',
    email: 'usuario@moonflight.com',
    createdDate: '2024-01-01',
    isActive: true
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sessions, setSessions] = useState<LoginSession[]>([]);

  const login = (username: string, password: string): boolean => {
    const found = users.find(u => u.username === username && u.password === password && u.isActive);
    if (found) {
      const userWithoutPassword = { ...found };
      delete (userWithoutPassword as any).password;
      setUser(userWithoutPassword);
      
      // Registrar sesión
      const newSession: LoginSession = {
        id: Date.now().toString(),
        userId: found.id,
        username: found.username,
        loginTime: new Date().toISOString(),
        isActive: true
      };
      setSessions(prev => [...prev, newSession]);
      
      // Actualizar último login
      setUsers(prev => prev.map(u => 
        u.id === found.id ? { ...u, lastLogin: new Date().toISOString() } : u
      ));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user) {
      // Cerrar sesión activa
      setSessions(prev => prev.map(s => 
        s.userId === user.id && s.isActive 
          ? { ...s, isActive: false, logoutTime: new Date().toISOString() }
          : s
      ));
    }
    setUser(null);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdDate'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, users, sessions, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
