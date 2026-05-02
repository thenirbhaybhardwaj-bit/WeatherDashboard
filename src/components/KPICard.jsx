import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ label, value, unit, icon: Icon, color, loading, trend }) => {
  if (loading) {
    return (
      <div className="card" style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--border-color)', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ width: '60%', height: '1.5rem', background: 'var(--border-color)', marginBottom: '0.5rem', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ width: '40%', height: '1rem', background: 'var(--border-color)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          background: `${color}15`, 
          color: color, 
          padding: '0.6rem', 
          borderRadius: '12px',
          display: 'flex'
        }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem', 
            fontSize: '0.875rem',
            color: trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--error)' : 'var(--text-secondary)'
          }}>
            {trend > 0 ? <TrendingUp size={16} /> : trend < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '0.25rem' }}>{label}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>{value ?? '--'}</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{unit}</span>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default KPICard;
