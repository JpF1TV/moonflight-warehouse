import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { TicketProvider } from './context/TicketContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Almacen from './pages/Almacen';
import Historial from './pages/Historial';
import Mantenimiento from './pages/Mantenimiento';
import Administrativo from './pages/Administrativo';
import SuperAdmin from './pages/SuperAdmin';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TicketProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<RoleBasedRedirect />} />
                <Route path="almacen" element={<Almacen />} />
                <Route path="historial" element={<Historial />} />
                <Route path="mantenimiento" element={<Mantenimiento />} />
                <Route path="admin-panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="superadmin" element={<SuperAdminRoute><SuperAdmin /></SuperAdminRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </TicketProvider>
    </AuthProvider>
  );
};

const LoginRoute: React.FC = () => {
  const { user } = useAuth();
  
  if (user) {
    // Redirigir según el rol
    if (user.role === 'superadmin') {
      return <Navigate to="/superadmin" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-panel" />;
    } else if (user.role === 'warehouse') {
      return <Navigate to="/almacen" />;
    } else {
      return <Navigate to="/mantenimiento" />;
    }
  }
  
  return <Login />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
};

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'superadmin' ? <>{children}</> : <Navigate to="/" />;
};

const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'superadmin') {
    return <Navigate to="/superadmin" />;
  } else if (user?.role === 'admin') {
    return <Navigate to="/admin-panel" />;
  } else if (user?.role === 'warehouse') {
    return <Navigate to="/almacen" />;
  } else {
    return <Navigate to="/mantenimiento" />;
  }
};

export default App;
