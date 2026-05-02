# 🌡️ Weather Dashboard
 
 Weather Dashboard is a premium, real-time weather monitoring dashboard built with React and Vite. It interfaces with the ThingSpeak API to provide live sensor data visualizations from ESP8266 or ESP32 hardware.

![Rainfall Dashboard](https://raw.githubusercontent.com/placeholder-branding/Rainfall/main/header.png)

## ✨ Features
- **Real-time Monitoring**: Instant updates for Temperature, Humidity, Pressure, and Rainfall.
- **Historical Trends**: Interactive charts showing data trends (Temp, Humidity, Pressure, Rain) over the last 24 hours.
- **Dynamic Alerts**: Visual notifications for high temperature and rain detection.
- **Micro-animations**: Premium responsive design with smooth transitions and glassmorphism.
- **Data Export**: Download your data as a CSV for offline analysis.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔌 Connecting Your Hardware
To use this dashboard with your own ESP8266 or ESP32 data:
1. Refer to the [IOT_GUIDE.md](IOT_GUIDE.md) for step-by-step setup instructions.
2. Update your ThingSpeak Channel ID in `src/hooks/useThingSpeak.js`.

## 🛠️ Built With
- **React**: Frontend framework
- **Vite**: Build tool
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **Vanilla CSS**: Custom styling

---
Built with ❤️ for IoT enthusiasts.
