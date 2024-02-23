#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTPIN 4 // Change this according to your ESP32 board's pinout
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "Crablock";
const char* password = "Joako060601";

String serverUrl = "https://growino.app/api/sensor";

unsigned long lastTime = 0;
unsigned long timerDelay = 600000; // 10 minutes

String hum = "0.0";
String temp = "0.0";
int userid = 1;

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
 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    HTTPClient http;   
    http.begin(serverUrl);  
    http.addHeader("Content-Type", "application/json");         
    
    StaticJsonDocument<200> doc; //JSON Object
    doc["userid"] = userid;
    doc["temp"] = temp;
    doc["hum"] = hum;
    JsonArray data = doc.createNestedArray("soil");
    data.add("{id: 1, soil: 45}");
    data.add("{id: 2, soil: 54}");
    data.add("{id: 3, soil: 49}");
     
    String requestBody;
    serializeJson(doc, requestBody);
     
    int httpResponseCode = http.POST(requestBody);
    if (httpResponseCode>0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
}

void getReadings(){
    temp = getTemp();
    hum = getHum();
}

String getTemp(){
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return "0.0";
  }
  else {
    String temp = String(t, 1);
    return temp;
  }
}

String getHum() {
  float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println("Failed to read from DHT sensor!");
    return "0.0";
  }
  else {
    String hum = String(h, 1);
    return hum;
  }
}
