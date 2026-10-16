import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DateBanner } from './components/DateBanner';
import { QuickMetrics } from './components/QuickMetrics';
import { CurrencyCards } from './components/CurrencyCards';
import { Converter } from './components/Converter';
import { RatesTable } from './components/RatesTable';
import { HistoricoTable } from './components/HistoricoTable';
import { ConfigModal } from './components/ConfigModal';
import { fetchBCVRates, getStoredApiUrl, saveStoredApiUrl, getStoredRefreshInterval, saveStoredRefreshInterval } from './services/api';

export function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sneat_theme') || 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sneat_sidebar_collapsed') === 'true';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [selectedCurrencyForCalc, setSelectedCurrencyForCalc] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(getStoredRefreshInterval());

  const handleToggleSidebar = () => {
    if (window.innerWidth < 992) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => {
        const next = !prev;
        localStorage.setItem('sneat_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

  // Sync theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sneat_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch rates
  const loadRates = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetchBCVRates();
      setData(res.data);
      setIsMock(res.isMock);
      setLastUpdated(res.timestamp);
      if (res.error && res.isMock) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al conectar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        loadRates();
      }, refreshInterval * 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [loadRates, refreshInterval]);

  const handleSelectForCalc = (currencyCode) => {
    setSelectedCurrencyForCalc(currencyCode);
    setActiveTab('calculator');
  };

  const handleSaveConfig = (newUrl, newInterval) => {
    saveStoredApiUrl(newUrl);
    saveStoredRefreshInterval(newInterval);
    setRefreshInterval(newInterval);
    loadRates();
  };

  // Custom currency display priority: 1. USD, 2. EUR, 3. COP, 4. RUB
  const CURRENCY_ORDER = { USD: 1, EUR: 2, COP: 3, RUB: 4 };
  const rawRatesList = data?.valores || [];
  const ratesList = [...rawRatesList].sort((a, b) => {
    const pA = CURRENCY_ORDER[a.moneda?.toUpperCase()] || 99;
    const pB = CURRENCY_ORDER[b.moneda?.toUpperCase()] || 99;
    return pA - pB;
  });

  return (
    <div className={`layout-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sneat Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onToggleCollapse={handleToggleSidebar}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        ratesCount={ratesList.length}
        onOpenConfig={() => setConfigModalOpen(true)}
        theme={theme}
      />

      {/* Main Page Area */}
      <div className="layout-page">
        {/* Sneat Navbar */}
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
          loading={loading}
          onRefresh={loadRates}
          onOpenConfig={() => setConfigModalOpen(true)}
          isMock={isMock}
          theme={theme}
          onToggleTheme={toggleTheme}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Content Wrapper */}
        <main className="content-wrapper">
          {/* Operation & Value Date Banner */}
          <DateBanner data={data} isMock={isMock} />

          {/* Quick Metrics (visible on dashboard) */}
          {activeTab === 'dashboard' && <QuickMetrics rates={ratesList} />}

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <>
              {/* Currency KPI Cards */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="card-title">Cotizaciones Principales BCV</h3>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setActiveTab('table')}
                >
                  Ver todas ({ratesList.length}) →
                </button>
              </div>

              <CurrencyCards 
                rates={ratesList} 
                onSelectForCalc={handleSelectForCalc} 
              />

              {/* Calculator Section */}
              <Converter 
                rates={ratesList} 
                defaultCurrency={selectedCurrencyForCalc} 
              />
            </>
          )}

          {activeTab === 'calculator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Converter 
                rates={ratesList} 
                defaultCurrency={selectedCurrencyForCalc} 
              />
              <RatesTable 
                rates={ratesList} 
                rawData={data} 
                onSelectForCalc={handleSelectForCalc} 
              />
            </div>
          )}

          {activeTab === 'table' && (
            <RatesTable 
              rates={ratesList} 
              rawData={data} 
              onSelectForCalc={handleSelectForCalc} 
            />
          )}

          {activeTab === 'history' && (
            <HistoricoTable />
          )}
        </main>

        {/* Footer */}
        <footer className="layout-footer">
          <div>
            © 2026 <strong>BCV Tasas Dashboard</strong> — Plantilla Sneat Bootstrap Admin Theme
          </div>
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
            Conectado al servicio backend en Node.js • Banco Central de Venezuela
          </div>
        </footer>
      </div>

      {/* Config Modal */}
      <ConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        currentUrl={getStoredApiUrl()}
        currentInterval={refreshInterval}
        onSave={handleSaveConfig}
      />
    </div>
  );
}

export default App;
