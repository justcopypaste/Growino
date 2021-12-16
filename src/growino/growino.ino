#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTPIN D5 //ESP8266: use pins 3, 4, 5, 12, 13 or 14
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

AsyncWebServer server(80);

String humedad = "0.0";
String temp = "0.0";

const char* ssid = "Crablock";
const char* password = "notengoidea";

const char* PARAM_INPUT_1 = "temp_sensor";

String processor(const String& var) {
  if (var == "TEMP") {
    return temp;
  }
  else if (var == "HUMEDAD") {
    return humedad;
  }
  return String();
}

void setup() {
  Serial.begin(9600);
  while (!Serial) continue;

  dht.begin();
  humedad = getHum();
  temp = getTemp();
  Serial.println("Temp: ");
  Serial.print(temp);
  Serial.print(" Hum: ");
  Serial.print(humedad);
  Serial.println();

  if (!SPIFFS.begin()) {
    Serial.println("Error montando SPIFFS");
    return;
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to ");
  Serial.print(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  timeClient.begin();
  timeClient.setTimeOffset(-10800);
  
  getReadings();
  iniciarServerWeb();  
}

void loop() {
  getReadings();
  delay(2000);
}

void iniciarServerWeb() {
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/index.html", String(), false, processor);
  });

  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/style.css", "text/css");
  });

  // Start server
  server.onNotFound(notFound);
  server.begin();
}

void notFound(AsyncWebServerRequest *request) {
  request->send(404, "text/plain", "Not found");
}

void getReadings(){
    temp = getTemp();
    humedad = getHum();
  }

String getTemp(){
  float t = dht.readTemperature();
  String temp = String(t, 1);
  return temp;
  }

String getHum() {
  float h = dht.readHumidity();
  String hum = String(h, 1);
  return hum;
}
