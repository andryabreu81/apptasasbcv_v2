import React from 'react';
import { Calculator, ArrowUpRight } from 'lucide-react';
import { getCurrencyMeta, formatRate, calculateSpread } from '../utils/formatters';
import { FlagIcon } from './FlagIcon';

// Ordering priority requested: 1. USD, 2. EUR, 3. COP, 4. RUB
const CURRENCY_ORDER = {
  USD: 1,
  EUR: 2,
  COP: 3,
  RUB: 4,
};

export const CurrencyCards = ({ rates = [], onSelectForCalc }) => {
  const sortedRates = [...rates].sort((a, b) => {
    const pA = CURRENCY_ORDER[a.moneda?.toUpperCase()] || 99;
    const pB = CURRENCY_ORDER[b.moneda?.toUpperCase()] || 99;
    return pA - pB;
  });

  return (
    <div className="kpi-grid">
      {sortedRates.map((item) => {
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

            {/* Rates Grid: Compra & Venta side-by-side with equal visual weight */}
            <div className="kpi-rates-grid">
              <div className="kpi-rate-box kpi-rate-compra">
                <span className="kpi-rate-label">Compra</span>
                <div className="kpi-rate-number" title={`Bs. ${formatRate(item.compra, item.moneda)}`}>
                  <span className="kpi-rate-currency">Bs.</span>
                  <span className="kpi-rate-amount">{formatRate(item.compra, item.moneda)}</span>
                </div>
              </div>

              <div className="kpi-rate-box kpi-rate-venta">
                <span className="kpi-rate-label">Venta</span>
                <div className="kpi-rate-number" title={`Bs. ${formatRate(item.venta, item.moneda)}`}>
                  <span className="kpi-rate-currency">Bs.</span>
                  <span className="kpi-rate-amount">{formatRate(item.venta, item.moneda)}</span>
                </div>
              </div>
            </div>

            {/* Footer with Spread Diff & Margen */}
            <div className="kpi-footer-row">
              <div>
                <span style={{ fontSize: '0.7rem', color: '#a1acb8', display: 'block', fontWeight: 700 }}>
                  DIFERENCIAL
                </span>
                <span style={{ fontWeight: 700, color: 'var(--bs-warning-dark)' }}>
                  Bs. {spread.diffFormatted}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#a1acb8', display: 'block', fontWeight: 700 }}>
                  MARGEN (SPREAD)
                </span>
                <span style={{ fontWeight: 700, color: 'var(--bs-primary)' }}>
                  {spread.formatted}
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
