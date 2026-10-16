import * as XLSX from 'xlsx';
import { calculateSpread, formatNumber } from './formatters';

/**
 * Export historical rates data to an Excel (.xlsx) file
 * @param {Array} data - Array of historical rate objects
 * @param {string} fileName - Base filename
 */
export const exportRatesToExcel = (data = [], fileName = 'Historico_Tasas_BCV') => {
  if (!data || data.length === 0) {
    alert('No hay registros para exportar con los filtros seleccionados.');
    return;
  }

  // Transform data for clean Excel export
  const exportRows = data.map((item, index) => {
    const spread = calculateSpread(item.compra, item.venta);
    const compraNum = parseFloat(String(item.compra).replace(',', '.')) || 0;
    const ventaNum = parseFloat(String(item.venta).replace(',', '.')) || 0;

    return {
      'N°': index + 1,
      'ID Registro': item.id || '',
      'Moneda': item.moneda || '',
      'País / Territorio': item.codigo_pais || item.pais || '',
      'Tasa Compra (Bs.)': compraNum,
      'Tasa Venta (Bs.)': ventaNum,
      'Diferencial Spread (Bs.)': spread.diff,
      'Spread (%)': `${spread.percentage.toFixed(2)}%`,
      'Fecha Operación': item.fecha_operacion ? String(item.fecha_operacion).split('T')[0] : '',
      'Fecha Valor Vigente': item.fecha_valor ? String(item.fecha_valor).split('T')[0] : '',
      'Fecha de Registro': item.create_at ? String(item.create_at).replace('T', ' ').substring(0, 19) : '',
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportRows);

  // Set column widths
  const colWidths = [
    { wch: 6 },  // N°
    { wch: 12 }, // ID Registro
    { wch: 10 }, // Moneda
    { wch: 20 }, // País
    { wch: 18 }, // Compra
    { wch: 18 }, // Venta
    { wch: 22 }, // Spread Bs
    { wch: 14 }, // Spread %
    { wch: 18 }, // Fecha Operación
    { wch: 20 }, // Fecha Valor
    { wch: 22 }, // Fecha Creación
  ];
  worksheet['!cols'] = colWidths;

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasas BCV');

  // Generate file name with current date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const finalFileName = `${fileName}_${dateStr}.xlsx`;

  // Write and trigger download
  XLSX.writeFile(workbook, finalFileName);
};
