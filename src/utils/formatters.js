// Utility formatting functions for Venezuelan BCV currency and dates

export const CURRENCY_METADATA = {
  USD: {
    symbol: '$',
    name: 'Dólar Estadounidense',
    flag: '🇺🇸',
    color: '#71dd37',
    bgColor: 'rgba(113, 221, 55, 0.16)',
    popular: true,
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    color: '#696cff',
    bgColor: 'rgba(105, 108, 255, 0.16)',
    popular: true,
  },
  RUB: {
    symbol: '₽',
    name: 'Rublo Ruso',
    flag: '🇷🇺',
    color: '#ff3e1d',
    bgColor: 'rgba(255, 62, 29, 0.16)',
    popular: false,
  },
  COP: {
    symbol: 'Col$',
    name: 'Peso Colombiano',
    flag: '🇨🇴',
    color: '#ffab00',
    bgColor: 'rgba(255, 171, 0, 0.16)',
    popular: true,
  },
  CNY: {
    symbol: '¥',
    name: 'Yuan Chino',
    flag: '🇨🇳',
    color: '#ff3e1d',
    bgColor: 'rgba(255, 62, 29, 0.16)',
    popular: false,
  },
  TRY: {
    symbol: '₺',
    name: 'Lira Turca',
    flag: '🇹🇷',
    color: '#03c3ec',
    bgColor: 'rgba(3, 195, 236, 0.16)',
    popular: false,
  },
  VES: {
    symbol: 'Bs.',
    name: 'Bolívar Digital',
    flag: '🇻🇪',
    color: '#696cff',
    bgColor: 'rgba(105, 108, 255, 0.16)',
    popular: true,
  }
};

export const getCurrencyMeta = (code) => {
  const upper = (code || '').toUpperCase().trim();
  return CURRENCY_METADATA[upper] || {
    symbol: upper,
    name: upper,
    flag: '🌐',
    color: '#696cff',
    bgColor: 'rgba(105, 108, 255, 0.16)',
    popular: false,
  };
};

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || num === '') return '0,00';
  const val = typeof num === 'number' ? num : parseFloat(String(num).replace(',', '.'));
  if (isNaN(val)) return '0,00';

  return val.toLocaleString('es-VE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatRate = (rateStr, currencyCode = '') => {
  if (!rateStr) return '0,00';
  const val = parseFloat(String(rateStr).replace(',', '.'));
  if (isNaN(val)) return '0,00';

  if (currencyCode.toUpperCase() === 'COP' || val < 1) {
    return val.toLocaleString('es-VE', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  }

  return val.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

export const calculateSpread = (compra, venta) => {
  const c = parseFloat(String(compra).replace(',', '.'));
  const v = parseFloat(String(venta).replace(',', '.'));
  if (isNaN(c) || isNaN(v) || c <= 0) {
    return { diff: 0, percentage: 0, formatted: '+0,00%' };
  }

  const diff = v - c;
  const percentage = (diff / c) * 100;
  return {
    diff,
    percentage,
    diffFormatted: diff.toFixed(4).replace('.', ','),
    formatted: `+${percentage.toFixed(2)}%`,
  };
};

export const formatDateSpanish = (dateStr) => {
  if (!dateStr) return 'Fecha no disponible';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const d = new Date(year, month - 1, day);
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const str = d.toLocaleDateString('es-ES', opts);
    return str.charAt(0).toUpperCase() + str.slice(1);
  } catch (e) {
    return dateStr;
  }
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
};

export const generateReportText = (data) => {
  if (!data || !data.valores) return '';
  let text = `📊 *COTIZACIONES OFICIALES BCV*\n`;
  text += `📅 *Fecha Valor:* ${formatDateSpanish(data.fechaValor)}\n`;
  text += `📌 *Operación:* ${formatShortDate(data.fechaOperacion)}\n`;
  text += `─────────────────────\n`;

  data.valores.forEach((item) => {
    text += `💵 *${item.moneda}* (${item.pais}):\n`;
    text += `   • Compra: Bs. ${formatRate(item.compra, item.moneda)}\n`;
    text += `   • Venta:  Bs. ${formatRate(item.venta, item.moneda)}\n`;
  });

  text += `─────────────────────\n`;
  text += `🏛 Fuente: Banco Central de Venezuela\n`;
  text += `⚡ Monitor Sneat Dashboard`;
  return text;
};
