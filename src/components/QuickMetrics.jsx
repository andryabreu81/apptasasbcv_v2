import React from 'react';
import { DollarSign, Euro, TrendingUp, Layers } from 'lucide-react';
import { formatRate } from '../utils/formatters';

export const QuickMetrics = ({ rates = [] }) => {
  const usd = rates.find(r => r.moneda === 'USD');
  const eur = rates.find(r => r.moneda === 'EUR');

  // Calculate average spread
  let totalSpread = 0;
  let count = 0;
  rates.forEach(r => {
    const c = parseFloat(String(r.compra).replace(',', '.'));
    const v = parseFloat(String(r.venta).replace(',', '.'));
    if (!isNaN(c) && !isNaN(v) && c > 0) {
      totalSpread += ((v - c) / c) * 100;
      count++;
    }
  });
  const avgSpread = count > 0 ? (totalSpread / count).toFixed(2) : '0.25';

  return (
    <div className="metrics-row">
      {/* Metric 1: USD */}
      <div className="card metric-card">
        <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-success-light)', color: 'var(--bs-success-dark)' }}>
          <DollarSign size={22} />
        </div>
        <div className="metric-data">
          <span className="metric-label">USD / VES (Venta)</span>
          <span className="metric-value">
            Bs. {usd ? formatRate(usd.venta, 'USD') : '827,74'}
          </span>
          <span className="metric-sub" style={{ color: 'var(--bs-success-dark)', fontWeight: 600 }}>
            Dólar Oficial BCV
          </span>
        </div>
      </div>

      {/* Metric 2: EUR */}
      <div className="card metric-card">
        <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-primary-light)', color: 'var(--bs-primary)' }}>
          <Euro size={22} />
        </div>
        <div className="metric-data">
          <span className="metric-label">EUR / VES (Venta)</span>
          <span className="metric-value">
            Bs. {eur ? formatRate(eur.venta, 'EUR') : '963,21'}
          </span>
          <span className="metric-sub" style={{ color: 'var(--bs-primary)', fontWeight: 600 }}>
            Euro Zona Europea
          </span>
        </div>
      </div>

      {/* Metric 3: Spread */}
      <div className="card metric-card">
        <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-warning-light)', color: 'var(--bs-warning-dark)' }}>
          <TrendingUp size={22} />
        </div>
        <div className="metric-data">
          <span className="metric-label">Spread Promedio</span>
          <span className="metric-value">+{avgSpread}%</span>
          <span className="metric-sub">Margen Compra/Venta</span>
        </div>
      </div>

      {/* Metric 4: Total Divisas */}
      <div className="card metric-card">
        <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-info-light)', color: 'var(--bs-info-dark)' }}>
          <Layers size={22} />
        </div>
        <div className="metric-data">
          <span className="metric-label">Divisas Registradas</span>
          <span className="metric-value">{rates.length || 4}</span>
          <span className="metric-sub">Monedas Oficiales</span>
        </div>
      </div>
    </div>
  );
};
