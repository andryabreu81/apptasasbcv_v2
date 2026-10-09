import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Printer, 
  FileSpreadsheet, 
  ArrowUpDown,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { 
  getCurrencyMeta, 
  formatRate, 
  calculateSpread, 
  generateReportText,
  formatDateSpanish 
} from '../utils/formatters';
import { FlagIcon } from './FlagIcon';

export const RatesTable = ({ rates = [], rawData, onSelectForCalc }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [sortKey, setSortKey] = useState('none'); // 'none' | 'rate-desc' | 'rate-asc' | 'name'

  let filteredRates = rates.filter((item) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      item.moneda.toLowerCase().includes(q) ||
      (item.pais && item.pais.toLowerCase().includes(q))
    );
  });

  if (sortKey === 'rate-desc') {
    filteredRates = [...filteredRates].sort((a, b) => parseFloat(b.venta) - parseFloat(a.venta));
  } else if (sortKey === 'rate-asc') {
    filteredRates = [...filteredRates].sort((a, b) => parseFloat(a.venta) - parseFloat(b.venta));
  } else if (sortKey === 'name') {
    filteredRates = [...filteredRates].sort((a, b) => a.moneda.localeCompare(b.moneda));
  }

  const handleCopyReport = () => {
    const reportText = generateReportText(rawData);
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Tabla de Cotizaciones Oficiales</h3>
          <p className="card-subtitle">
            Listado publicado por el BCV para la fecha valor {rawData?.fechaValor ? formatDateSpanish(rawData.fechaValor) : ''}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={handleCopyReport}
            title="Copiar reporte formal de tasas"
          >
            {copied ? <Check size={14} color="var(--bs-success)" /> : <Copy size={14} />}
            <span>{copied ? '¡Reporte Copiado!' : 'Copiar Reporte'}</span>
          </button>

          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={handlePrint}
            title="Imprimir / Exportar a PDF"
          >
            <Printer size={14} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <div className="card-body" style={{ paddingBottom: '0.5rem' }}>
        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className="search-box" style={{ maxWidth: '300px', display: 'flex' }}>
            <Search size={16} color="#a1acb8" />
            <input 
              type="text" 
              placeholder="Filtrar por divisa o país..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1acb8' }}>ORDENAR:</span>
            <select 
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--bs-border-radius)', border: '1px solid var(--bs-border-color)', background: 'var(--bs-body-bg)', color: 'var(--bs-heading-color)', fontSize: '0.8125rem', outline: 'none' }}
            >
              <option value="none">Por defecto</option>
              <option value="rate-desc">Mayor valor de venta</option>
              <option value="rate-asc">Menor valor de venta</option>
              <option value="name">Alfabético (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Moneda / País</th>
                <th style={{ textAlign: 'right' }}>Tasa Compra</th>
                <th style={{ textAlign: 'right' }}>Tasa Venta</th>
                <th style={{ textAlign: 'right' }}>Spread (Dif.)</th>
                <th style={{ textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#a1acb8' }}>
                    No se encontraron monedas coincidentes con "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredRates.map((item) => {
                  const meta = getCurrencyMeta(item.moneda);
                  const spread = calculateSpread(item.compra, item.venta);

                  return (
                    <tr key={item.moneda}>
                      <td>
                        <div className="table-currency-cell">
                          <FlagIcon code={item.moneda} size={28} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <strong style={{ color: 'var(--bs-heading-color)' }}>{item.moneda}</strong>
                              {meta.popular && (
                                <span className="badge bg-label-success" style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem' }}>
                                  Oficial
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#a1acb8' }}>
                              {item.pais || meta.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        <span style={{ color: '#a1acb8', fontSize: '0.75rem', marginRight: '0.25rem' }}>Bs.</span>
                        {formatRate(item.compra, item.moneda)}
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--bs-heading-color)', fontSize: '0.95rem' }}>
                        <span style={{ color: 'var(--bs-primary)', fontSize: '0.8rem', marginRight: '0.25rem' }}>Bs.</span>
                        {formatRate(item.venta, item.moneda)}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span className={`badge ${spread.percentage > 0.5 ? 'bg-label-warning' : 'bg-label-primary'}`}>
                            {spread.formatted}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#a1acb8', marginTop: '0.15rem' }}>
                            Bs. {spread.diffFormatted}
                          </span>
                        </div>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn btn-icon btn-sm"
                          title={`Calcular ${item.moneda}`}
                          onClick={() => onSelectForCalc && onSelectForCalc(item.moneda)}
                          style={{ margin: '0 auto' }}
                        >
                          <Calculator size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0 0.5rem 0', fontSize: '0.75rem', color: '#a1acb8' }}>
          <ShieldCheck size={14} color="var(--bs-success)" />
          <span>Información sincronizada con el sistema cambiario del Banco Central de Venezuela.</span>
        </div>
      </div>
    </div>
  );
};
