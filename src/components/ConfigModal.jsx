import React, { useState } from 'react';
import { Settings, X, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { DEFAULT_API_URL, fetchBCVRates } from '../services/api';

export const ConfigModal = ({ 
  isOpen, 
  onClose, 
  currentUrl, 
  currentInterval,
  onSave 
}) => {
  const [url, setUrl] = useState(currentUrl || DEFAULT_API_URL);
  const [interval, setIntervalVal] = useState(currentInterval || 60);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetchBCVRates(url);
      if (res.success) {
        setTestResult({
          success: true,
          message: `¡Conexión Exitosa! Se recibieron ${res.data.valores?.length || 0} tasas oficiales.`,
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || 'No se pudo conectar al endpoint.',
        });
      }
    } catch (e) {
      setTestResult({
        success: false,
        message: e.message || 'Error de conexión.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (url.trim()) {
      onSave(url.trim(), parseInt(interval, 10) || 60);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="date-icon-box" style={{ width: 36, height: 36 }}>
              <Settings size={18} />
            </div>
            <div>
              <h4 className="card-title">Configuración de API Backend</h4>
              <span className="card-subtitle">Servicio REST Node.js de Tasas BCV</span>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div>
            <label className="field-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
              URL DEL SERVICIO REST (GET):
            </label>
            <div className="input-with-addon">
              <input 
                type="text" 
                className="converter-input" 
                style={{ fontSize: '0.9rem', fontWeight: 600 }}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="http://localhost:3003/apitasasbcv/getValoresBCV"
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="field-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
              ACTUALIZACIÓN AUTOMÁTICA (Minutos):
            </label>
            <div className="input-with-addon">
              <input 
                type="number" 
                className="converter-input" 
                style={{ fontSize: '0.9rem', fontWeight: 600 }}
                value={interval}
                onChange={(e) => setIntervalVal(e.target.value)}
                placeholder="Ej. 60"
                min="1"
              />
            </div>
            <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
              El dashboard se refrescará automáticamente cada este intervalo de tiempo (0 para desactivar).
            </small>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="field-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
              Presets Rápidos:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="chip-btn"
                onClick={() => setUrl('http://localhost:3003/apitasasbcv/getValoresBCV')}
              >
                Localhost:3003
              </button>
              <button 
                className="chip-btn"
                onClick={() => setUrl('http://127.0.0.1:3003/apitasasbcv/getValoresBCV')}
              >
                127.0.0.1:3003
              </button>
            </div>
          </div>

          {/* Test Button */}
          <button 
            className="btn btn-outline-primary"
            style={{ width: '100%' }}
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? <RefreshCw size={16} className="spin-anim" /> : <Zap size={16} />}
            <span>{testing ? 'Comprobando endpoint...' : 'Probar Conexión con Backend'}</span>
          </button>

          {/* Result Alert */}
          {testResult && (
            <div 
              className={`badge ${testResult.success ? 'bg-label-success' : 'bg-label-danger'}`}
              style={{ padding: '0.75rem 1rem', borderRadius: 'var(--bs-border-radius)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.4 }}
            >
              {testResult.success ? <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> : <AlertCircle size={18} style={{ flexShrink: 0 }} />}
              <span style={{ fontSize: '0.8125rem' }}>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-sm btn-outline-primary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Guardar y Sincronizar
          </button>
        </div>
      </div>
    </div>
  );
};
