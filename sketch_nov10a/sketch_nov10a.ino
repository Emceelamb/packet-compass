//Compass
#include <QMC5883LCompass.h>
#include <Wire.h>
QMC5883LCompass compass;

//LCD
#include <Adafruit_GFX.h>    // Core graphics library
#include <Adafruit_ST7735.h> // Hardware-specific library for ST7735
#include <Adafruit_ST7789.h> // Hardware-specific library for ST7789
#include <SPI.h>

#if defined(ARDUINO_FEATHER_ESP32) // Feather Huzzah32
  #define TFT_CS         14
  #define TFT_RST        15
  #define TFT_DC         32

#elif defined(ESP8266)
  #define TFT_CS         4
  #define TFT_RST        16                                            
  #define TFT_DC         5

#else
  // For the breakout board, you can use any 2 or 3 pins.
  // These pins will also work for the 1.8" TFT shield.
  #define TFT_CS        10
  #define TFT_RST        9 // Or set to -1 and connect to Arduino RESET pin
  #define TFT_DC         8
#endif

// For 1.44" and 1.8" TFT with ST7735 use:
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
float p = 3.1415926;

//Stepper 
#include <Stepper.h>
const int stepsPerRevolution = 512;
const int leftStep  = -2;
const int rightStep = 20;
// initialize the stepper library on pins 8 through 11:
Stepper stepper(stepsPerRevolution, 3, 5, 6, 7);

//button 
const int buttonPin = 2; 
int buttonState = 0;         // variable for reading the pushbutton status
int buttonPrev = 0;
int counter = 0;
String hop[15][5] =  {
  {"128.122.1.4","500 miles", "40.4353N", "73.59.24W", " N"},
  {"192.168.184.228","200 miles","74.006W", "73.9973W", " W"},
  {"128.122.254.114","889","37.4633N", "122.2343W", "E"},
  {"192.168.184.221","500 miles", "40.7128N", "74.0060W", "E"},
  {"192.76.177.202","200 miles","74.006W", "73.9973W", "E"},
  {"128.122.254.109","fd.","37.4633N", "122.2343W", "E"},
//  {"128.122.254.64","dfdf.","37.4633N", "122.2343W", "E"},
//  {"199.109.5.5","500 miles", "40.7128N", "74.0060W", "E"},
//  {"199.109.5.2","200 miles","74.006W", "73.9973W", "E"},
//  {"162.252.70.138",".","37.4633N", "122.2343W", "E"},
//  {"162.252.70.137","500 miles", "40.7128N", "74.0060W", "E"},
//  {"99.82.179.34","200 miles","74.006W", "73.9973W", "E"},
//  {"52.93.28.126","200 miles","74.006W", "73.9973W", "E"}, 
//  {"52.93.28.100","200 miles","74.006W", "73.9973W", "E"}, 
//  {"52.93.28.120","You've arrived","74.006W", "73.9973W", "E"}
};

void setup(void) {
  Serial.begin(9600);
  compass.init(); 
  tft.initR(INITR_144GREENTAB); // Init ST7735R chip, green tab

  stepper.setSpeed(60);

  pinMode(buttonPin, INPUT);
}

void loop() {
    int x, y, z, a, b;
    char myArray[3];
    
    compass.read();
    
    a = compass.getAzimuth();
    b = compass.getBearing(a); 
    compass.getDirection(myArray, a);
  
    Serial.print(" Direction: ");
//    Serial.print(myArray[0]);
    Serial.print(myArray[1]);
    Serial.print(myArray[2]);
  
    Serial.println();
  
    delay(250);

    String dir = String(myArray[1])+String(myArray[2]);

    tft.setTextWrap(false);
    tft.fillScreen(ST77XX_BLACK);
    tft.setCursor(10, 30);

    buttonState = digitalRead(buttonPin);
//    if(buttonState != button 
    if(buttonState != buttonPrev){
      if(buttonState==HIGH){
        Serial.println("HIGHkjkj");
        counter++;

      }
      buttonPrev = buttonState;
      if (counter>3){
        counter = 0;
      }
    }

    
    tft.println(hop[counter][0]);
    tft.setCursor(10, 50);
    tft.println("hi");
    tft.setCursor(10, 62);
    tft.println(hop[counter][1]);
    
    tft.setCursor(10, 74);
    tft.println(hop[counter][2] + + ", " + hop[counter][3]);
    tft.setTextColor(ST77XX_WHITE);
    tft.setTextSize(1);

    if (dir != hop[counter][5]){
      stepper.step(rightStep);
      Serial.println("Moving");
      Serial.print(String(hop[counter][5]));
    } else {
//      Serial.println("At North");
    }
}

void tftPrintTest() {
  tft.setTextWrap(false);
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 30);
  tft.println("jjjjj!");
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(2);
}
