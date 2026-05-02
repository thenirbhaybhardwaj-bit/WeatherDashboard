import React from 'react';
import { CloudRain, CloudSun } from 'lucide-react';

const RainIndicator = ({ isRaining, loading }) => {
  if (loading) {
    return (
      <div className="card glass" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--border-color)', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  return (
    <div className={`card glass`} style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '1rem',
      background: isRaining 
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1))' 
        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))',
      border: isRaining ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
    }}>
      <div style={{ position: 'relative' }}>
        {isRaining ? (
          <div className="rain-animation">
            <CloudRain size={64} color="#3b82f6" />
          </div>
        ) : (
          <div className="sun-animation">
            <CloudSun size={64} color="#f59e0b" />
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
          {isRaining ? 'Raining' : 'Clear Skies'}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isRaining ? 'Rain detected by sensor' : 'No precipitation detected'}
        </p>
      </div>

      <style>{`
        .rain-animation {
          animation: float 3s ease-in-out infinite;
        }
        .sun-animation {
          animation: scale 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default RainIndicator;
