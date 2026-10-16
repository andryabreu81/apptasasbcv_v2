import React from 'react';
import { Calendar, Clock, Info, ShieldAlert } from 'lucide-react';
import { formatDateSpanish, formatShortDate } from '../utils/formatters';

export const DateBanner = ({ data, isMock }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Date Cards Grid */}
      <div className="date-banner-grid">
        {/* Fecha Valor */}
        <div className="card date-card" style={{ borderLeft: '4px solid var(--bs-primary)' }}>
          <div className="date-icon-box">
            <Calendar size={22} />
          </div>
          <div className="date-details">
            <span className="date-title">Fecha Valor Vigente (BCV)</span>
            <span className="date-main">
              {data?.fechaValor ? formatShortDate(data.fechaValor) : '--/--/----'}
            </span>
            <span className="date-human">
              {data?.fechaValor ? formatDateSpanish(data.fechaValor) : 'Cargando fecha...'}
            </span>
          </div>
        </div>

        {/* Fecha Operación */}
        <div className="card date-card" style={{ borderLeft: '4px solid var(--bs-info)' }}>
          <div className="date-icon-box" style={{ backgroundColor: 'var(--bs-info-light)', color: 'var(--bs-info-dark)' }}>
            <Clock size={22} />
          </div>
          <div className="date-details">
            <span className="date-title">Fecha de Operación</span>
            <span className="date-main">
              {data?.fechaOperacion ? formatShortDate(data.fechaOperacion) : '--/--/----'}
            </span>
            <span className="date-human" style={{ color: 'var(--bs-info-dark)' }}>
              Registro bancario del sistema
            </span>
          </div>
        </div>
      </div>

      {/* Backend API Message Alert */}
      {data?.mensaje && (
        <div className="alert-bcv">
          <Info size={20} style={{ flexShrink: 0 }} />
          <span>{data.mensaje}</span>
        </div>
      )}
    </div>
  );
};
