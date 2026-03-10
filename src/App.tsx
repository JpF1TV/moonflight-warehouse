import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Almacen from './pages/Almacen';
import Historial from './pages/Historial';
import Solicitud from './pages/Solicitud';
import Administrativo from './pages/Administrativo';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/almacen" />} />
              <Route path="almacen" element={<Almacen />} />
              <Route path="historial" element={<Historial />} />
              <Route path="solicitud" element={<Solicitud />} />
              <Route path="administrativo" element={<Administrativo />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
};

const LoginRoute: React.FC = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : <Login />;
};

export default App;
