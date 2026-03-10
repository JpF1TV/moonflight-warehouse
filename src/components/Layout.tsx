import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Logo size={45} />
          <div className="brand-text">
            <h1>Moonflight</h1>
            <span>{user?.username}</span>
          </div>
        </div>
        <div className="nav-links">
          {(user?.role === 'warehouse' || user?.role === 'admin') && (
            <Link to="/almacen" className={location.pathname === '/almacen' ? 'active' : ''}>
              Almacén
            </Link>
          )}
          <Link to="/historial" className={location.pathname === '/historial' ? 'active' : ''}>
            Historial
          </Link>
          <Link to="/solicitud" className={location.pathname === '/solicitud' ? 'active' : ''}>
            Solicitud de Piezas
          </Link>
          {user?.role === 'admin' && (
            <Link to="/administrativo" className={location.pathname === '/administrativo' ? 'active' : ''}>
              Administrativo
            </Link>
          )}
          <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
