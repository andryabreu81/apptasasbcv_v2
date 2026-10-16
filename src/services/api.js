// API Service to consume http://localhost:3003/apitasasbcv/getValoresBCV and getHistoricoBCV

export const DEFAULT_API_URL = 'https://tasasbcvdev.bdt.com.ve/apitasasbcv/getValoresBCV';
export const DEFAULT_HISTORICO_URL = 'https://tasasbcvdev.bdt.com.ve/apitasasbcv/getHistoricoBCV';

export const MOCK_BCV_DATA = {
  estatus: "201",
  mensaje: "⚠️ No se pudo conectar a (https://tasasbcvdev.bdt.com.ve/apitasasbcv/getValoresBCV). Verifique que el servicio Node.js esté corriendo.",
  fechaOperacion: "2026-09-18",
  fechaValor: "2026-09-21",
  valores: [
    {
      moneda: "USD",
      pais: "E.U.A.",
      compra: "847.44009000",
      venta: "849.56400000"
    },
    {
      moneda: "EUR",
      pais: "Zona Euro",
      compra: "971.65785839",
      venta: "974.09309112"
    },
    {
      moneda: "COP",
      pais: "Colombia",
      compra: "0.26455220",
      venta: "0.26521524"
    },
    {
      moneda: "RUB",
      pais: "Rusia",
      compra: "10.06407127",
      venta: "10.08929451"
    }
  ],
  isMock: true
};

export const getStoredApiUrl = () => {
  return localStorage.getItem('bcv_api_url') || DEFAULT_API_URL;
};

export const saveStoredApiUrl = (url) => {
  localStorage.setItem('bcv_api_url', url.trim());
};

export const DEFAULT_REFRESH_INTERVAL = 60; // in minutes

export const getStoredRefreshInterval = () => {
  const val = localStorage.getItem('bcv_refresh_interval');
  return val ? parseInt(val, 10) : DEFAULT_REFRESH_INTERVAL;
};

export const saveStoredRefreshInterval = (minutes) => {
  localStorage.setItem('bcv_refresh_interval', minutes.toString());
};

export const getHistoricoApiUrl = () => {
  const current = getStoredApiUrl();
  return current.replace('getValoresBCV', 'getHistoricoBCV');
};

export const fetchBCVRates = async (customUrl = null) => {
  const url = customUrl || getStoredApiUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Servidor devolvió código ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.valores)) {
      throw new Error('Formato de respuesta inválido: Falta el arreglo de "valores".');
    }

    return {
      success: true,
      data: {
        ...data,
        isMock: false,
      },
      timestamp: new Date(),
      error: null,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[BCV API Notice] Conectando a datos de respaldo (${url}):`, err.message);

    return {
      success: false,
      data: {
        ...MOCK_BCV_DATA,
        isMock: true,
      },
      timestamp: new Date(),
      error: err.name === 'AbortError'
        ? 'Tiempo de espera agotado al consultar el backend local (Timeout 6s).'
        : `No se pudo conectar a (${url}). Verifique que el servicio Node.js esté corriendo.`,
    };
  }
};

/**
 * Fetch historical exchange rates from PostgreSQL backend
 * @param {Object} filters - { moneda, fecha_desde, fecha_hasta, limit }
 */
export const fetchHistoricoBCV = async (filters = {}) => {
  const baseUrl = getHistoricoApiUrl();
  const params = new URLSearchParams();

  if (filters.moneda && filters.moneda !== 'TODAS') {
    params.append('moneda', filters.moneda);
  }
  if (filters.fecha_desde) {
    params.append('fecha_desde', filters.fecha_desde);
  }
  if (filters.fecha_hasta) {
    params.append('fecha_hasta', filters.fecha_hasta);
  }
  if (filters.limit) {
    params.append('limit', filters.limit);
  }

  const urlWithParams = `${baseUrl}?${params.toString()}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Servidor devolvió código ${res.status}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.historicos)) {
      throw new Error('Formato de respuesta inválido en históricos.');
    }

    return {
      success: true,
      total: data.total || data.historicos.length,
      data: data.historicos,
      isMock: false,
      error: null,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[BCV API Historico] Error conectando a ${urlWithParams}:`, err.message);

    // Generate fallback mock data if backend not updated yet
    return {
      success: false,
      total: 0,
      data: [],
      isMock: true,
      error: err.message,
    };
  }
};
