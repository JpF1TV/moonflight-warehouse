import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { TicketProvider } from './context/TicketContext';
import { OperationsProvider } from './context/OperationsContext';
import { EngineeringProvider } from './context/EngineeringContext';
import { OMAProvider } from './context/OMAContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Almacen from './pages/Almacen';
import Historial from './pages/Historial';
import Mantenimiento from './pages/Mantenimiento';
import AdminPanel from './pages/AdminPanel';
import SuperAdmin from './pages/SuperAdmin';
import Operaciones from './pages/Operaciones';
import Ingenieria from './pages/Ingenieria';
import OMA from './pages/OMA';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
};

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'superadmin' ? <>{children}</> : <Navigate to="/" />;
};

const LoginRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Login />;
  if (user.role === 'superadmin') return <Navigate to="/superadmin" />;
  if (user.role === 'admin') return <Navigate to="/admin-panel" />;
  if (user.role === 'warehouse') return <Navigate to="/almacen" />;
  return <Navigate to="/mantenimiento" />;
};

const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'superadmin') return <Navigate to="/superadmin" />;
  if (user?.role === 'admin') return <Navigate to="/admin-panel" />;
  if (user?.role === 'warehouse') return <Navigate to="/almacen" />;
  return <Navigate to="/mantenimiento" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TicketProvider>
        <DataProvider>
          <OperationsProvider>
            <EngineeringProvider>
              <OMAProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginRoute />} />
                    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                      <Route index element={<RoleBasedRedirect />} />
                      <Route path="almacen" element={<Almacen />} />
                      <Route path="historial" element={<Historial />} />
                      <Route path="mantenimiento" element={<Mantenimiento />} />
                      <Route path="operaciones" element={<Operaciones />} />
                      <Route path="ingenieria" element={<Ingenieria />} />
                      <Route path="oma" element={<OMA />} />
                      <Route path="admin-panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                      <Route path="superadmin" element={<SuperAdminRoute><SuperAdmin /></SuperAdminRoute>} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </OMAProvider>
            </EngineeringProvider>
          </OperationsProvider>
        </DataProvider>
      </TicketProvider>
    </AuthProvider>
  );
};

export default App;
