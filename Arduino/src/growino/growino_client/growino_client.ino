#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#include "DHT.h"

#define DHTPIN D4  //ESP8266: use pins 3, 4, 5, 12, 13 or 14
#define DHTTYPE DHT11

ESP8266WiFiMulti wifiMulti;
DHT dht(DHTPIN, DHTTYPE);

WiFiClient wifiClient;

const int plants = 3;
const int userid = 1;
const int tent = 1;
const char* ssid = "Apto 10";
const char* password = "alohomora123";

const String serverUrl = "http://www.growino.app/api/sensor";

unsigned long lastTime = 0;
unsigned long timerDelay = 600000;

String hum = "0.0";
String temp = "0.0";


void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(4000);
  wifiMulti.addAP(ssid, password);
  Serial.println("conectando");
  while (wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  getReadings();
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
  getReadings();

  // Block until we are able to connect to the WiFi access point
  if (wifiMulti.run() == WL_CONNECTED) {
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

    HTTPClient http;
    http.setTimeout(5000);
    http.begin(wifiClient, serverUrl);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(requestBody);  //Send the request
    String payload = http.getString();   //Get the response payload

    Serial.println(httpCode);  //Print HTTP return code
    Serial.println(payload);   //Print request response payload

    http.end();
  }
}

void getReadings() {
  temp = getTemp();
  hum = getHum();
  Serial.println("temp: " + temp + " hum: " + hum);
}

String getTemp() {
  float t = dht.readTemperature();
  String temp = String(t, 1);
  return temp;
}

String getHum() {
  float h = dht.readHumidity();
  String hum = String(h, 1);
  return hum;
}