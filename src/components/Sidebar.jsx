import React from 'react';
import imgBlue from '../img/img_blue.png';
import imgWhite from '../img/img_white.png';
import {
  LayoutDashboard,
  Calculator,
  Table,
  Database,
  TrendingUp,
  Settings,
  Building2,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';

export const Sidebar = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  ratesCount = 4,
  onOpenConfig,
  theme
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`layout-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Brand */}
        <div className="sidebar-header">
          <a href="#" className="sidebar-brand" onClick={(e) => { e.preventDefault(); onSelectTab('dashboard'); }}>
            <img 
              src={theme === 'dark' ? imgWhite : imgBlue} 
              alt="Logo BDT" 
              style={{ maxHeight: '40px', width: 'auto', maxWidth: '100%' }} 
            />
          </a>

          {/* Close button on mobile */}
          <button
            className="mobile-toggle-btn"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <ul className="sidebar-menu">
          <li className="menu-header">Menú Principal</li>

          <li>
            <button
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { onSelectTab('dashboard'); onClose(); }}
            >
              <LayoutDashboard size={18} className="menu-icon" />
              <span>Dashboard</span>
              <span className="menu-badge bg-label-primary">En Vivo</span>
            </button>
          </li>

          <li>
            <button
              className={`menu-item ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => { onSelectTab('calculator'); onClose(); }}
            >
              <Calculator size={18} className="menu-icon" />
              <span>Calculadora</span>
            </button>
          </li>

          <li>
            <button
              className={`menu-item ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => { onSelectTab('table'); onClose(); }}
            >
              <Table size={18} className="menu-icon" />
              <span>Cotizaciones</span>
              <span className="menu-badge bg-label-info">{ratesCount}</span>
            </button>
          </li>

          <li>
            <button
              className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => { onSelectTab('history'); onClose(); }}
            >
              <Database size={18} className="menu-icon" />
              <span>Históricos</span>
              <span className="menu-badge bg-label-success">BD</span>
            </button>
          </li>

          <li className="menu-header">Herramientas</li>

          <li>
            <button
              className="menu-item"
              onClick={() => { onOpenConfig(); onClose(); }}
            >
              <Settings size={18} className="menu-icon" />
              <span>Configuración API</span>
            </button>
          </li>

          <li>
            <a
              href="https://www.bcv.org.ve"
              target="_blank"
              rel="noreferrer"
              className="menu-item"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={18} className="menu-icon" />
              <span>Portal Web BCV</span>
            </a>
          </li>
        </ul>

        {/* Sidebar Footer Card */}
        <div className="sidebar-footer">
          <div className="bcv-source-card">
            <div className="bcv-source-title">
              <ShieldCheck size={16} />
              <span>Fuente Oficial</span>
            </div>
            <div className="bcv-source-sub">
              Banco Central de Venezuela. Tasas bancarias de referencia.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
