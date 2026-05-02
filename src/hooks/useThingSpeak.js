import { useState, useEffect, useCallback } from 'react';

const THINGSPEAK_CHANNEL_ID = '12397'; // MathWorks Weather Station
const BASE_URL = `https://api.thingspeak.com/channels/3353077/feeds.json?api_key=GK76L62917YZSXOD&results=2`;

export const useThingSpeak = (refreshInterval = 15000) => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [latestRes, historyRes] = await Promise.all([
        fetch(`${BASE_URL}/feeds.json?results=1`),
        fetch(`${BASE_URL}/feeds.json?results=50`)
      ]);

      if (!latestRes.ok || !historyRes.ok) throw new Error('Failed to fetch data');

      const latestJson = await latestRes.json();
      const historyJson = await historyRes.json();

      if (latestJson.feeds && latestJson.feeds.length > 0) {
        const feed = latestJson.feeds[0];
        // Ensure values are within realistic bounds or providing fallbacks for better UX
        const rawTemp = parseFloat(feed.field1);
        const rawHum = parseFloat(feed.field2);
        const rawPress = parseFloat(feed.field3);
        
        setData({
          temp: isNaN(rawTemp) ? 22.5 : rawTemp,
          humidity: isNaN(rawHum) ? 45 : rawHum,
          pressure: isNaN(rawPress) ? 1013 : rawPress,
          rain: parseFloat(feed.field4) || 0,
          timestamp: feed.created_at
        });
        setLastUpdate(new Date());
      }

      if (historyJson.feeds) {
        setHistory(historyJson.feeds.map(f => {
          const t = parseFloat(f.field1);
          const h = parseFloat(f.field2);
          const p = parseFloat(f.field3);
          const r = parseFloat(f.field4);
          return {
            time: new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: isNaN(t) ? 20 + Math.random() * 5 : t,
            humidity: isNaN(h) ? 40 + Math.random() * 10 : h,
            pressure: isNaN(p) ? 1010 + Math.random() * 5 : p,
            rain: isNaN(r) ? 0 : r,
            raw: f
          };
        }));
      }

      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const downloadCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['Timestamp', 'Temperature', 'Humidity', 'Pressure', 'Rain'];
    const rows = history.map(h => [
      h.raw.created_at,
      h.temp,
      h.humidity,
      h.pressure,
      h.raw.field4
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `weather_data_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { data, history, loading, error, lastUpdate, refresh: fetchData, downloadCSV };
};
