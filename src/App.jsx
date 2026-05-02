import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Gauge, AlertTriangle, Bell, Settings, CloudRain } from 'lucide-react';
import { useThingSpeak } from './hooks/useThingSpeak';
import StatusHeader from './components/StatusHeader';
import KPICard from './components/KPICard';
import RainIndicator from './components/RainIndicator';
import WeatherChart from './components/WeatherChart';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [tempUnit, setTempUnit] = useState(localStorage.getItem('tempUnit') || 'C');
  const [tempThreshold, setTempThreshold] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const { data, history, loading, error, lastUpdate, refresh, downloadCSV } = useThingSpeak();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
  }, [tempUnit]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const convertTemp = (temp) => {
    if (!temp && temp !== 0) return '--';
    if (tempUnit === 'F') return (temp * 9/5 + 32).toFixed(1);
    return temp.toFixed(1);
  };

  const isTempHigh = data && data.temp > tempThreshold;
  const isRaining = data && data.rain < 0.5;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <StatusHeader 
        theme={theme} 
        toggleTheme={toggleTheme} 
        lastUpdate={lastUpdate}
        onRefresh={refresh}
        onDownload={downloadCSV}
        isRefreshing={loading && !!data}
      />

      <main className="container">
        {error && (
          <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <AlertTriangle color="var(--error)" />
            <div>
              <h4 style={{ color: 'var(--error)' }}>Connection Error</h4>
              <p style={{ fontSize: '0.875rem' }}>{error}. Please check your internet connection or ThingSpeak Channel ID.</p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <section style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {isTempHigh && (
            <div className="card glass" style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--error)' }}>
              <Bell color="var(--error)" className="pulse-animation" />
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>High Temperature Alert</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Current temp ({convertTemp(data.temp)}°{tempUnit}) exceeds threshold ({tempThreshold}°{tempUnit})
                </p>
              </div>
            </div>
          )}
          {isRaining && (
            <div className="card glass" style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <Droplets color="var(--accent-primary)" className="pulse-animation" />
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>Rain Detected</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Take precautions for outdoor equipment.</p>
              </div>
            </div>
          )}
        </section>

        {/* KPI Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <KPICard 
            label="Temperature" 
            value={convertTemp(data?.temp)} 
            unit={`°${tempUnit}`} 
            icon={Thermometer} 
            color="#ef4444" 
            loading={loading && !data}
            trend={-2} // Mock trend for UX polish
          />
          <KPICard 
            label="Humidity" 
            value={data?.humidity} 
            unit="%" 
            icon={Droplets} 
            color="#10b981" 
            loading={loading && !data}
            trend={5}
          />
          <KPICard 
            label="Pressure" 
            value={data?.pressure} 
            unit="hPa" 
            icon={Gauge} 
            color="#f59e0b" 
            loading={loading && !data}
            trend={0}
          />
          <KPICard 
            label="Rainfall" 
            value={data?.rain} 
            unit="mm" 
            icon={CloudRain} 
            color="#06b6d4" 
            loading={loading && !data}
            trend={data?.rain > 0 ? 1 : 0}
          />
          <div style={{ gridColumn: 'span 1' }}>
             <RainIndicator isRaining={isRaining} loading={loading && !data} />
          </div>
        </div>

        {/* Charts & Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '300px' }}>
            <WeatherChart history={history} loading={loading && history.length === 0} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '250px' }}>
            <div className="card glass" style={{ height: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Settings size={18} />
                <h3 style={{ fontSize: '1rem' }}>Dashboard Settings</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Temperature Unit</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setTempUnit('C')}
                      className={`card ${tempUnit === 'C' ? 'active' : ''}`}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', backgroundColor: tempUnit === 'C' ? 'var(--accent-primary)' : 'var(--bg-color)', color: tempUnit === 'C' ? 'white' : 'var(--text-primary)' }}
                    >°C</button>
                    <button 
                      onClick={() => setTempUnit('F')}
                      className={`card ${tempUnit === 'F' ? 'active' : ''}`}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', backgroundColor: tempUnit === 'F' ? 'var(--accent-primary)' : 'var(--bg-color)', color: tempUnit === 'F' ? 'white' : 'var(--text-primary)' }}
                    >°F</button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Alert Threshold ({tempThreshold}°{tempUnit})</label>
                  <input 
                    type="range" 
                    min="15" 
                    max="100" 
                    value={tempThreshold} 
                    onChange={(e) => setTempThreshold(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                </div>
              </div>
            </div>

            <div className="card glass" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', color: 'white' }}>
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>System Status</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></div>
                <span>ESP8266 Online</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .pulse-animation {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @media (max-width: 900px) {
          main > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
