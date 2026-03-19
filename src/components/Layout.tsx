import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const canAccess = (roles: string[]) => roles.includes(user?.role || '');

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
          {canAccess(['warehouse', 'requester', 'admin']) && (
            <Link to="/almacen" className={isActive('/almacen')}>Almacén</Link>
          )}
          {canAccess(['warehouse', 'requester', 'admin']) && (
            <Link to="/historial" className={isActive('/historial')}>Historial</Link>
          )}
          {canAccess(['warehouse', 'requester', 'admin']) && (
            <Link to="/mantenimiento" className={isActive('/mantenimiento')}>Mantenimiento</Link>
          )}
          {canAccess(['warehouse', 'admin']) && (
            <Link to="/operaciones" className={isActive('/operaciones')}>Operaciones</Link>
          )}
          {canAccess(['warehouse', 'admin']) && (
            <Link to="/ingenieria" className={isActive('/ingenieria')}>Ingeniería</Link>
          )}
          {canAccess(['warehouse', 'admin']) && (
            <Link to="/oma" className={isActive('/oma')}>OMA</Link>
          )}
          {canAccess(['admin']) && (
            <Link to="/admin-panel" className={isActive('/admin-panel')}>Panel Admin</Link>
          )}
          {canAccess(['superadmin']) && (
            <Link to="/superadmin" className={isActive('/superadmin')}>Super Admin</Link>
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
