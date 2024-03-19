#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTPIN D4  // Change this according to your ESP32 board's pinout
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

const int plants = 3;
const int userid = 1;
const int tent = 1;
const char* ssid = "Apto 10";
const char* password = "alohomora123";

String serverUrl = "https://www.growino.app/api/sensor";

unsigned long lastTime = 0;
unsigned long timerDelay = 600000;  // 10 minutes

void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(4000);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  delay(500);
  postDataToServer();
}

void loop() {
  //Send an HTTP POST request every 10 minutes
  if ((millis() - lastTime) > timerDelay) {
    postDataToServer();
    lastTime = millis();
  }
  delay(500);
}

void postDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {  //Check WiFi connection status
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["userid"] = userid;
    doc["tent"] = tent;
    doc["temperature"] = getTemp();
    doc["humidity"] = getHum();
    doc["power"] = 420;
    
    JsonArray soil = doc.createNestedArray("soil");
    for (int i = 1; i <= plants; i++) {
      StaticJsonDocument<200> s;
      s["id"] = i;
      s["soil"] = random(70);
      soil.add(s);
    }

    String requestBody;
    serializeJson(doc, requestBody);

    Serial.println(requestBody);

    int httpResponseCode = http.POST(requestBody);
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

String getTemp() {
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return "0.0";
  } else {
    String temp = String(t, 1);
    return temp;
  }
}

String getHum() {
  float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println("Failed to read from DHT sensor!");
    return "0.0";
  } else {
    String hum = String(h, 1);
    return hum;
  }
}
