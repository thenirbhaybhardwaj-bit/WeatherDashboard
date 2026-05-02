import React from 'react';
import { Sun, Moon, RefreshCw, Download, Wifi, Clock } from 'lucide-react';

const StatusHeader = ({ theme, toggleTheme, lastUpdate, onRefresh, onDownload, isRefreshing }) => {
  return (
    <header className="glass container" style={{ 
      margin: '1.5rem auto', 
      borderRadius: '20px', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: '12px',
          padding: '0.5rem',
          display: 'flex',
          color: 'white'
        }}>
          <Wifi size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Weather Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            <span>Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onDownload} className="card" style={{ padding: '0.6rem', borderRadius: '12px', display: 'flex' }} title="Download CSV">
          <Download size={20} />
        </button>
        
        <button 
          onClick={onRefresh} 
          className="card" 
          style={{ 
            padding: '0.6rem', 
            borderRadius: '12px', 
            display: 'flex',
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
          }} 
          title="Refresh Data"
        >
          <RefreshCw size={20} />
        </button>

        <button onClick={toggleTheme} className="card" style={{ padding: '0.6rem', borderRadius: '12px', display: 'flex' }} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};

export default StatusHeader;
