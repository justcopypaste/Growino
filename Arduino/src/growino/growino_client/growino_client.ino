
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTPIN D4  //ESP8266: use pins 3, 4, 5, 12, 13 or 14
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

WiFiClient client;

const int plants = 3;
const int userid = 1;
const int tent = 1;
const char* ssid = "Apto 10";
const char* password = "alohomora123";

unsigned long lastTime = 0;
// unsigned long timerDelay = 600000;
unsigned long timerDelay = 10000;

String hum = "0.0";
String temp = "0.0";

void setup() {
  Serial.begin(115200);
  dht.begin();
  connect_wifi();
  getReadings();
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    postDataToServer();
    lastTime = millis();
  }
  delay(500);
}

void connect_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP: ");
  Serial.print(WiFi.localIP());
}

void postDataToServer() {
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

  if ((WiFi.status() == WL_CONNECTED)) {
    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);

    // Ignore SSL certificate validation
    client->setInsecure();

    //create an HTTPClient instance
    HTTPClient https;

    //Initializing an HTTPS communication using the secure client
    Serial.print("[HTTPS] begin...\n");
    if (https.begin(*client, "https://www.growino.app:420/api/test")) {  // HTTPS
      Serial.print("[HTTPS] POST...\n");

      String requestBody;
      serializeJson(doc, requestBody);
      Serial.print("Body: ");
      Serial.println(requestBody);

      int httpCode = https.POST(requestBody);
      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTPS] POST... code: %d\n", httpCode);
        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTPS] POST... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end();
    } else {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
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