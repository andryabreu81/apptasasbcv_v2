import React from 'react';
import { 
  Menu, 
  Search, 
  RefreshCw, 
  Settings, 
  Sun, 
  Moon, 
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Navbar = ({ 
  onToggleSidebar, 
  isSidebarCollapsed,
  loading, 
  onRefresh, 
  onOpenConfig, 
  isMock, 
  theme, 
  onToggleTheme,
  searchTerm,
  onSearchChange
}) => {
  return (
    <nav className="layout-navbar">
      <div className="navbar-left">
        {/* Sidebar Toggle Button (Desktop & Mobile) */}
        <button 
          className="sidebar-nav-toggle" 
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? "Mostrar barra lateral" : "Ocultar barra lateral"}
          aria-label="Alternar menú lateral"
        >
          <Menu size={20} />
        </button>

        {/* Search Box */}
        <div className="search-box">
          <Search size={16} color="#a1acb8" />
          <input 
            type="text" 
            placeholder="Buscar divisa o país (USD, EUR, RUB...)" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Status Pill */}
        <div 
          className={`badge badge-pill ${isMock ? 'bg-label-warning' : 'bg-label-success'}`}
          style={{ cursor: 'pointer' }}
          onClick={onOpenConfig}
          title={isMock ? 'Haga clic para verificar conexión con el backend' : 'API Node.js conectada localmente'}
        >
          <span className={`pulse-dot ${isMock ? 'mock' : 'online'}`}></span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
            {isMock ? 'Respaldo' : 'API Online'}
          </span>
        </div>

        {/* Refresh Button */}
        <button 
          className="btn btn-icon" 
          onClick={onRefresh} 
          disabled={loading}
          title="Actualizar tasas"
          aria-label="Actualizar tasas"
        >
          <RefreshCw size={17} className={loading ? 'spin-anim' : ''} />
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="btn btn-icon" 
          onClick={onToggleTheme}
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Config / Settings Button */}
        <button 
          className="btn btn-icon" 
          onClick={onOpenConfig}
          title="Configuración de endpoint API"
          aria-label="Configuración"
        >
          <Settings size={17} />
        </button>
      </div>
    </nav>
  );
};
