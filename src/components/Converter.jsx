import React, { useState, useEffect } from 'react';
import { Calculator, ArrowDownUp, Check, Copy, Info } from 'lucide-react';
import { getCurrencyMeta, formatNumber, formatRate } from '../utils/formatters';
import { FlagIcon } from './FlagIcon';

export const Converter = ({ rates = [], defaultCurrency = 'USD' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [rateType, setRateType] = useState('venta'); // 'venta' | 'compra'
  const [direction, setDirection] = useState('FX_TO_VES'); // 'FX_TO_VES' | 'VES_TO_FX'
  const [amount, setAmount] = useState('100');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultCurrency) {
      setSelectedCurrency(defaultCurrency);
    }
  }, [defaultCurrency]);

  const currentRateObj = rates.find(r => r.moneda === selectedCurrency) || rates[0] || {
    moneda: 'USD',
    pais: 'E.U.A.',
    compra: '825.66775725',
    venta: '827.73710000'
  };

  const meta = getCurrencyMeta(currentRateObj.moneda);
  const activeRate = parseFloat(
    rateType === 'venta' ? currentRateObj.venta : currentRateObj.compra
  ) || 1;

  const parsedAmount = parseFloat(amount.replace(',', '.')) || 0;

  let totalResult = 0;
  if (direction === 'FX_TO_VES') {
    totalResult = parsedAmount * activeRate;
  } else {
    totalResult = activeRate > 0 ? parsedAmount / activeRate : 0;
  }

  const toggleDirection = () => {
    setDirection(prev => prev === 'FX_TO_VES' ? 'VES_TO_FX' : 'FX_TO_VES');
  };

  const quickAmounts = direction === 'FX_TO_VES'
    ? [5, 10, 20, 50, 100, 500, 1000]
    : [1000, 5000, 10000, 25000, 50000, 100000];

  const handleCopyResult = () => {
    const textToCopy = `${direction === 'FX_TO_VES' ? formatNumber(totalResult, 2) + ' Bs.' : formatNumber(totalResult, 4) + ' ' + selectedCurrency}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="date-icon-box" style={{ width: 38, height: 38 }}>
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="card-title">Calculadora de Cambio Oficial</h3>
            <p className="card-subtitle">Conversión instantánea con tasas del BCV</p>
          </div>
        </div>

        {/* Rate Type Selector */}
        <div style={{ display: 'flex', background: 'var(--bs-body-bg)', padding: '3px', borderRadius: 'var(--bs-border-radius)', border: '1px solid var(--bs-border-color)' }}>
          <button 
            className={`btn btn-sm ${rateType === 'venta' ? 'btn-primary' : ''}`}
            style={{ padding: '0.3rem 0.8rem', border: 'none', background: rateType === 'venta' ? 'var(--bs-primary)' : 'transparent', color: rateType === 'venta' ? '#fff' : 'var(--bs-body-color)' }}
            onClick={() => setRateType('venta')}
          >
            Tasa Venta
          </button>
          <button 
            className={`btn btn-sm ${rateType === 'compra' ? 'btn-primary' : ''}`}
            style={{ padding: '0.3rem 0.8rem', border: 'none', background: rateType === 'compra' ? 'var(--bs-primary)' : 'transparent', color: rateType === 'compra' ? '#fff' : 'var(--bs-body-color)' }}
            onClick={() => setRateType('compra')}
          >
            Tasa Compra
          </button>
        </div>
      </div>

      <div className="card-body converter-box">
        {/* Currency Selection Pills */}
        <div>
          <span className="field-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Seleccionar Divisa:
          </span>
          <div className="currency-pills-scroll">
            {rates.map((item) => {
              const itemMeta = getCurrencyMeta(item.moneda);
              const isSelected = item.moneda === selectedCurrency;
              return (
                <button
                  key={item.moneda}
                  className={`currency-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency(item.moneda)}
                >
                  <FlagIcon code={item.moneda} size={20} />
                  <span>{item.moneda}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>({item.pais})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input & Direction Grid */}
        <div className="converter-inputs-grid">
          {/* Source Input */}
          <div className="converter-field">
            <span className="field-label">
              {direction === 'FX_TO_VES' ? `Monto en ${selectedCurrency} (${meta.symbol})` : 'Monto en Bolívares (Bs.)'}
            </span>
            <div className="input-with-addon">
              <span className="addon-symbol">
                {direction === 'FX_TO_VES' ? meta.symbol : 'Bs.'}
              </span>
              <input 
                type="number"
                step="any"
                className="converter-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Swap Direction Button */}
          <button 
            className="swap-btn" 
            onClick={toggleDirection}
            title="Invertir dirección de conversión"
            aria-label="Invertir conversión"
          >
            <ArrowDownUp size={20} />
          </button>

          {/* Result Field Display */}
          <div className="converter-field">
            <span className="field-label">
              {direction === 'FX_TO_VES' ? 'Total en Bolívares (Bs.)' : `Total en ${selectedCurrency} (${meta.symbol})`}
            </span>
            <div className="input-with-addon" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
              <span className="addon-symbol">
                {direction === 'FX_TO_VES' ? 'Bs.' : meta.symbol}
              </span>
              <input 
                type="text"
                readOnly
                className="converter-input"
                value={direction === 'FX_TO_VES' ? formatNumber(totalResult, 2) : formatNumber(totalResult, 4)}
              />
            </div>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="field-label" style={{ marginRight: '0.25rem' }}>Montos Rápidos:</span>
          <div className="quick-amount-chips">
            {quickAmounts.map((val) => (
              <button 
                key={val}
                className="chip-btn"
                onClick={() => setAmount(String(val))}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Result Card */}
        <div className="result-card-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--bs-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Resultado Oficial ({rateType.toUpperCase()})
            </span>
            <span className="badge bg-label-info">
              1 {selectedCurrency} = Bs. {formatRate(activeRate, selectedCurrency)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="result-val-row">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--bs-primary)' }}>
                {direction === 'FX_TO_VES' ? 'Bs.' : meta.symbol}
              </span>
              <span className="result-total-num">
                {direction === 'FX_TO_VES' ? formatNumber(totalResult, 2) : formatNumber(totalResult, 4)}
              </span>
            </div>

            <button 
              className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
              style={{ borderRadius: 'var(--bs-border-radius)' }}
              onClick={handleCopyResult}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado' : 'Copiar Resultado'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#a1acb8', paddingTop: '0.5rem', borderTop: '1px solid var(--bs-border-color-light)' }}>
            <Info size={14} />
            <span>
              {direction === 'FX_TO_VES'
                ? `${parsedAmount} ${selectedCurrency} × ${formatRate(activeRate, selectedCurrency)} Bs. (Tasa oficial ${rateType})`
                : `${formatNumber(parsedAmount, 2)} Bs. ÷ ${formatRate(activeRate, selectedCurrency)} Bs. (Tasa oficial ${rateType})`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
