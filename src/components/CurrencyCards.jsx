import React from 'react';
import { Calculator, ArrowUpRight } from 'lucide-react';
import { getCurrencyMeta, formatRate, calculateSpread } from '../utils/formatters';
import { FlagIcon } from './FlagIcon';

export const CurrencyCards = ({ rates = [], onSelectForCalc }) => {
  return (
    <div className="kpi-grid">
      {rates.map((item) => {
        const meta = getCurrencyMeta(item.moneda);
        const spread = calculateSpread(item.compra, item.venta);

        return (
          <div 
            key={item.moneda} 
            className="card currency-kpi-card"
            style={{ borderTopColor: meta.color }}
          >
            {/* Header */}
            <div className="kpi-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FlagIcon code={item.moneda} size={36} />
                <div className="kpi-currency-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="kpi-currency-code">{item.moneda}</span>
                    {meta.popular && (
                      <span className="badge bg-label-success" style={{ fontSize: '0.65rem' }}>
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="kpi-country-name">{item.pais || meta.name}</span>
                </div>
              </div>

              {/* Spread Badge */}
              <span 
                className={`badge badge-pill ${spread.percentage > 0.5 ? 'bg-label-warning' : 'bg-label-primary'}`}
              >
                {spread.formatted}
              </span>
            </div>

            {/* Main Venta Display */}
            <div className="kpi-rate-display">
              <span className="kpi-rate-label">Tasa Oficial Venta</span>
              <div className="kpi-rate-number">
                <span style={{ fontSize: '1.1rem', color: 'var(--bs-primary)', marginRight: '0.35rem' }}>
                  Bs.
                </span>
                {formatRate(item.venta, item.moneda)}
              </div>
            </div>

            {/* Footer with Compra & Spread Diff */}
            <div className="kpi-footer-row">
              <div>
                <span style={{ fontSize: '0.7rem', color: '#a1acb8', display: 'block', fontWeight: 700 }}>
                  COMPRA
                </span>
                <span className="kpi-compra-val">
                  Bs. {formatRate(item.compra, item.moneda)}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#a1acb8', display: 'block', fontWeight: 700 }}>
                  DIFERENCIAL
                </span>
                <span style={{ fontWeight: 700, color: 'var(--bs-warning-dark)' }}>
                  Bs. {spread.diffFormatted}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button 
              className="btn btn-outline-primary btn-sm"
              style={{ width: '100%', marginTop: '0.25rem' }}
              onClick={() => onSelectForCalc(item.moneda)}
            >
              <Calculator size={14} />
              <span>Calcular Conversión</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
