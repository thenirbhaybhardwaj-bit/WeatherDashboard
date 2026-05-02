# 🌡️ Weather Dashboard IoT Setup Guide

This guide will help you connect your own ESP8266/ESP32 hardware to the Weather Dashboard.

## 1. ThingSpeak Configuration

The Rainfall Dashboard is built to fetch data from the ThingSpeak API. To show your own data, you need to set up a ThingSpeak Channel with the following specific field mapping:

| Field | Parameter | Unit |
|---|---|---|
| **Field 1** | Temperature | °C |
| **Field 2** | Humidity | % |
| **Field 3** | Pressure | hPa |
| **Field 4** | Rainfall | mm |

### Steps:
1. Log in to [ThingSpeak](https://thingspeak.com/).
2. Create a **New Channel**.
3. Enable **Field 1** through **Field 4** and name them as shown above.
4. Go to the **API Keys** tab and note your **Channel ID** and **Read API Key**.

---

## 2. Connect Your Dashboard

Once your channel is ready, update the dashboard source code:

1. Open `src/hooks/useThingSpeak.js`.
2. Locate the following constants at the top of the file:
   ```javascript
   const THINGSPEAK_CHANNEL_ID = 'YOUR_CHANNEL_ID';
   ```
3. Replace `'YOUR_CHANNEL_ID'` with your actual ThingSpeak Channel ID.
4. If your channel is **Private**, you must modify the `BASE_URL`:
   ```javascript
   const BASE_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}`;
   // Change to:
   const BASE_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}?api_key=YOUR_READ_API_KEY`;
   ```

---

## 3. ESP8266/ESP32 Code Snippet

Use the following Arduino code structure to send data from your sensors (like BME280 or a tipping bucket rain gauge) to ThingSpeak.

```cpp
#include <ThingSpeak.h>
#include <ESP8266WiFi.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* pass = "YOUR_WIFI_PASSWORD";
unsigned long myChannelNumber = YOUR_CHANNEL_ID;
const char* myWriteAPIKey = "YOUR_WRITE_API_KEY";

WiFiClient client;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, pass);
  ThingSpeak.begin(client);
}

void loop() {
  // Read your sensors
  float temp = 24.5;    // e.g., bme.readTemperature()
  float hum = 65.0;     // e.g., bme.readHumidity()
  float press = 1013.2; // e.g., bme.readPressure() / 100.0F
  int rain = 0;         // e.g., digitalRead(RAIN_PIN) == LOW ? 1 : 0

  // Write to fields
  ThingSpeak.setField(1, temp);
  ThingSpeak.setField(2, hum);
  ThingSpeak.setField(3, press);
  ThingSpeak.setField(4, rain);

  // Send data
  int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  
  if(x == 200){
    Serial.println("Channel update successful.");
  } else {
    Serial.println("Problem updating channel. HTTP error code " + String(x));
  }

  // ThingSpeak update rate is every 15 seconds
  delay(15000); 
}
```

---

## 4. Troubleshooting
- **Dashboard shows NaN**: Ensure your ThingSpeak channel has data in the correct fields. The dashboard will fallback to mock data if it encounters `NaN`.
- **Authorization Error**: If your channel is private, ensure you've appended the `api_key` to the URL.
- **Data Not Refreshing**: Check your internet connection and verify that your ESP is successfully sending data (HTTP 200).

> [!IMPORTANT]
> Always ensure your sensor reading logic (e.g., `bme.readTemperature()`) is correctly implemented before trying to send data to ThingSpeak.
