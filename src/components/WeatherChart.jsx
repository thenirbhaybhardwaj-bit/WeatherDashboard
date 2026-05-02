import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const WeatherChart = ({ history, loading }) => {
  const [activeMetric, setActiveMetric] = useState('temp');

  const metrics = [
    { id: 'temp', label: 'Temperature', color: '#3b82f6', unit: '°C' },
    { id: 'humidity', label: 'Humidity', color: '#10b981', unit: '%' },
    { id: 'pressure', label: 'Pressure', color: '#f59e0b', unit: 'hPa' },
    { id: 'rain', label: 'Rainfall', color: '#06b6d4', unit: 'mm' },
  ];

  const currentMetric = metrics.find(m => m.id === activeMetric);

  if (loading) {
    return (
      <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading historical trends...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Historical Trends</h2>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.25rem', borderRadius: '12px' }}>
          {metrics.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: activeMetric === m.id ? 'var(--surface-color)' : 'transparent',
                color: activeMetric === m.id ? m.color : 'var(--text-secondary)',
                boxShadow: activeMetric === m.id ? 'var(--card-shadow)' : 'none',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              unit={currentMetric.unit}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--surface-color)', 
                borderColor: 'var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-primary)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey={activeMetric} 
              stroke={currentMetric.color} 
              fillOpacity={1} 
              fill="url(#colorMetric)" 
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
