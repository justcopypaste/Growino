#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WiFi.h>
#include "DHT.h"

#define DHTPIN D5 //ESP8266: use pins 3, 4, 5, 12, 13 or 14
#define DHTTYPE DHT11

ESP8266WiFiMulti wifiMulti;
DHT dht(DHTPIN, DHTTYPE);

HTTPClient http;   
WiFiClient wifiClient;

const char* ssid = "Crablock";
const char* password = "Joako060601";

String serverName = "http://www.growino.app/sensor/";

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
  while(wifiMulti.run() != WL_CONNECTED){
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
  
  String url = serverName + "post";
 
  // Block until we are able to connect to the WiFi access point
  if (wifiMulti.run() == WL_CONNECTED) {
    http.begin(wifiClient, url);  
    http.addHeader("Content-Type", "application/json");         
     
    StaticJsonDocument<200> doc; //JSON Object
    doc["temp"] = temp;
    doc["hum"] = hum;
    JsonArray data = doc.createNestedArray("soil");// "soil": {}
    data.add(123);
    data.add(245);
    data.add(168);
     
    String requestBody;
    serializeJson(doc, requestBody);
     
    http.POST(requestBody);
  Serial.println("Posting Data To Server");
  }
}

void getReadings(){
    temp = getTemp();
    hum = getHum();
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
