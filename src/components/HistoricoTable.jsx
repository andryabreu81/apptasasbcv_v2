import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Search, 
  FileSpreadsheet, 
  Calendar, 
  Filter, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ArrowUpDown,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { 
  getCurrencyMeta, 
  formatRate, 
  calculateSpread, 
  formatDateSpanish, 
  formatShortDate, 
  formatNumber 
} from '../utils/formatters';
import { exportRatesToExcel } from '../utils/excelExporter';
import { fetchHistoricoBCV } from '../services/api';
import { FlagIcon } from './FlagIcon';

export const HistoricoTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedMoneda, setSelectedMoneda] = useState('TODAS');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortField, setSortField] = useState('fecha_operacion');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [exporting, setExporting] = useState(false);

  // Load historical rates from API
  const loadHistorico = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHistoricoBCV({
        moneda: selectedMoneda,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
      });

      if (res.success && res.data) {
        setData(res.data);
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      setError(err.message || 'Error al consultar históricos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorico();
  }, [selectedMoneda, fechaDesde, fechaHasta]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedMoneda('TODAS');
    setFechaDesde('');
    setFechaHasta('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Sorting and searching
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          (item.moneda && item.moneda.toLowerCase().includes(q)) ||
          (item.codigo_pais && item.codigo_pais.toLowerCase().includes(q)) ||
          (item.fecha_operacion && item.fecha_operacion.includes(q)) ||
          (item.fecha_valor && item.fecha_valor.includes(q)) ||
          (item.compra && item.compra.includes(q)) ||
          (item.venta && item.venta.includes(q))
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'compra' || sortField === 'venta' || sortField === 'id') {
        aVal = parseFloat(String(aVal || 0));
        bVal = parseFloat(String(bVal || 0));
      } else {
        aVal = String(aVal || '');
        bVal = String(bVal || '');
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchTerm, sortField, sortOrder]);

  // Summary Metrics
  const metrics = useMemo(() => {
    if (filteredAndSortedData.length === 0) return { max: 0, min: 0, avg: 0 };
    let max = 0;
    let min = Infinity;
    let sum = 0;

    filteredAndSortedData.forEach((item) => {
      const v = parseFloat(String(item.venta || 0).replace(',', '.'));
      if (!isNaN(v) && v > 0) {
        if (v > max) max = v;
        if (v < min) min = v;
        sum += v;
      }
    });

    if (min === Infinity) min = 0;
    const avg = filteredAndSortedData.length > 0 ? sum / filteredAndSortedData.length : 0;
    return { max, min, avg };
  }, [filteredAndSortedData]);

  // Pagination calculation
  const totalRows = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportExcel = () => {
    setExporting(true);
    try {
      exportRatesToExcel(filteredAndSortedData, `Historico_Tasas_BCV_${selectedMoneda}`);
    } catch (e) {
      alert('Error al generar Excel: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  // Distinct currencies list for dropdown
  const currencyOptions = ['TODAS', 'USD', 'EUR', 'RUB', 'COP', 'CNY', 'TRY'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner with Quick Metrics */}
      <div className="metrics-row">
        <div className="card metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-primary-light)', color: 'var(--bs-primary)' }}>
            <Database size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Registros Históricos</span>
            <span className="metric-value">{totalRows}</span>
            <span className="metric-sub">Base de datos PostgreSQL</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-success-light)', color: 'var(--bs-success-dark)' }}>
            <TrendingUp size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Tasa Máxima (Venta)</span>
            <span className="metric-value">
              {metrics.max > 0 ? `Bs. ${formatRate(metrics.max)}` : '--'}
            </span>
            <span className="metric-sub">En período filtrado</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-info-light)', color: 'var(--bs-info-dark)' }}>
            <Layers size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Tasa Mínima (Venta)</span>
            <span className="metric-value">
              {metrics.min > 0 ? `Bs. ${formatRate(metrics.min)}` : '--'}
            </span>
            <span className="metric-sub">En período filtrado</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--bs-warning-light)', color: 'var(--bs-warning-dark)' }}>
            <Clock size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Promedio Período</span>
            <span className="metric-value">
              {metrics.avg > 0 ? `Bs. ${formatRate(metrics.avg)}` : '--'}
            </span>
            <span className="metric-sub">Cálculo estadístico</span>
          </div>
        </div>
      </div>

      {/* Main DataTable Card */}
      <div className="card">
        {/* Card Header */}
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="card-title">Histórico de Tasas Cambiarias BCV</h3>
            <p className="card-subtitle">
              Consulta de cotizaciones bancarias almacenadas en tabla <code>public.tb_valores</code>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Refresh Button */}
            <button 
              className="btn btn-icon btn-sm"
              onClick={loadHistorico}
              disabled={loading}
              title="Recargar datos"
            >
              <RefreshCw size={15} className={loading ? 'spin-anim' : ''} />
            </button>

            {/* Export Excel Button */}
            <button 
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: '#2e7d32', borderColor: '#2e7d32', boxShadow: '0 3px 8px rgba(46, 125, 50, 0.35)' }}
              onClick={handleExportExcel}
              disabled={exporting || totalRows === 0}
              title="Descargar archivo Excel (.xlsx)"
            >
              <FileSpreadsheet size={16} />
              <span>Exportar a Excel ({totalRows})</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-body" style={{ paddingBottom: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
            {/* Moneda Filter */}
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                Moneda:
              </label>
              <select
                value={selectedMoneda}
                onChange={(e) => { setSelectedMoneda(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--bs-border-radius)', border: '1.5px solid var(--bs-border-color)', background: 'var(--bs-input-bg)', color: 'var(--bs-heading-color)', fontSize: '0.875rem', fontWeight: 600, outline: 'none' }}
              >
                {currencyOptions.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr === 'TODAS' ? 'Todas las Divisas' : `${curr} - ${getCurrencyMeta(curr).name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                Fecha Desde:
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => { setFechaDesde(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--bs-border-radius)', border: '1.5px solid var(--bs-border-color)', background: 'var(--bs-input-bg)', color: 'var(--bs-heading-color)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                Fecha Hasta:
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => { setFechaHasta(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--bs-border-radius)', border: '1.5px solid var(--bs-border-color)', background: 'var(--bs-input-bg)', color: 'var(--bs-heading-color)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            {/* Search Box */}
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                Buscador Rápido:
              </label>
              <div className="search-box" style={{ maxWidth: '100%', height: '40px' }}>
                <Search size={15} color="#a1acb8" />
                <input
                  type="text"
                  placeholder="Buscar en tabla..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            {/* Reset Filters */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                className="btn btn-outline-primary btn-sm"
                style={{ width: '100%', height: '40px' }}
                onClick={handleResetFilters}
                title="Limpiar filtros"
              >
                <RotateCcw size={14} />
                <span>Limpiar</span>
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="badge bg-label-warning" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--bs-border-radius)', width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>Aviso: {error}. Asegúrese de que el backend Node.js esté reiniciado con la nueva ruta.</span>
            </div>
          )}

          {/* DataTable */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>ID</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fecha_operacion')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>Fecha Operación</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fecha_valor')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>Fecha Valor</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('moneda')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>Moneda / País</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('compra')}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                      <span>Tasa Compra</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('venta')}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                      <span>Tasa Venta</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Spread (Dif.)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <RefreshCw size={24} className="spin-anim" style={{ margin: '0 auto 0.5rem auto', color: 'var(--bs-primary)', display: 'block' }} />
                      <span style={{ color: '#a1acb8', fontWeight: 600 }}>Cargando registros históricos de PostgreSQL...</span>
                    </td>
                  </tr>
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a1acb8' }}>
                      <Database size={32} style={{ margin: '0 auto 0.5rem auto', display: 'block', opacity: 0.5 }} />
                      <span>No se encontraron registros para los filtros seleccionados.</span>
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const meta = getCurrencyMeta(row.moneda);
                    const spread = calculateSpread(row.compra, row.venta);
                    const operDate = row.fecha_operacion ? String(row.fecha_operacion).split('T')[0] : '';
                    const valDate = row.fecha_valor ? String(row.fecha_valor).split('T')[0] : '';

                    return (
                      <tr key={row.id}>
                        <td style={{ color: '#a1acb8', fontWeight: 600, fontSize: '0.75rem' }}>
                          #{row.id}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={14} color="var(--bs-primary)" />
                            <strong>{formatShortDate(operDate)}</strong>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--bs-body-color)', fontWeight: 600 }}>
                            {formatShortDate(valDate)}
                          </span>
                        </td>
                        <td>
                          <div className="table-currency-cell">
                            <FlagIcon code={row.moneda} size={28} />
                            <div>
                              <span style={{ fontWeight: 800, color: 'var(--bs-heading-color)' }}>
                                {row.moneda}
                              </span>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: '#a1acb8' }}>
                                {row.codigo_pais || row.pais || meta.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          <span style={{ color: '#a1acb8', fontSize: '0.75rem', marginRight: '0.25rem' }}>Bs.</span>
                          {formatRate(row.compra, row.moneda)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--bs-heading-color)' }}>
                          <span style={{ color: 'var(--bs-primary)', fontSize: '0.8rem', marginRight: '0.25rem' }}>Bs.</span>
                          {formatRate(row.venta, row.moneda)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${spread.percentage > 0.5 ? 'bg-label-warning' : 'bg-label-primary'}`}>
                            {spread.formatted}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--bs-border-color-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#a1acb8' }}>
              <span>Mostrando</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--bs-border-radius-sm)', border: '1px solid var(--bs-border-color)', background: 'var(--bs-body-bg)', color: 'var(--bs-heading-color)' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>de <strong>{totalRows}</strong> registros</span>
            </div>

            {/* Page Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '0.35rem 0.6rem' }}
              >
                <ChevronLeft size={14} />
                <span>Anterior</span>
              </button>

              <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '0 0.5rem', color: 'var(--bs-heading-color)' }}>
                Página {currentPage} de {totalPages}
              </span>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                style={{ padding: '0.35rem 0.6rem' }}
              >
                <span>Siguiente</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
