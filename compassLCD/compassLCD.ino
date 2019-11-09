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

void setup(void) {
  Serial.begin(9600);
  compass.init(); 
  
  tft.initR(INITR_144GREENTAB); // Init ST7735R chip, green tab

}

void loop() {
    int x, y, z, a, b;
    char myArray[3];
    
    compass.read();
    
    x = compass.getX();
    y = compass.getY();
    z = compass.getZ();
    
    a = compass.getAzimuth();
    
    b = compass.getBearing(a);
  
    compass.getDirection(myArray, a);
    
    
    Serial.print("X: ");
    Serial.print(x);
  
    Serial.print(" Y: ");
    Serial.print(y);
  
    Serial.print(" Z: ");
    Serial.print(z);
  
    Serial.print(" Azimuth: ");
    Serial.print(a);
  
    Serial.print(" Bearing: ");
    Serial.print(b);
  
    Serial.print(" Direction: ");
//    Serial.print(myArray[0]);
    Serial.print(myArray[1]);
    Serial.print(myArray[2]);
  
    Serial.println();
  
    delay(250);

    tft.setTextWrap(false);
    tft.fillScreen(ST77XX_BLACK);
    tft.setCursor(10, 30);
    String dir = String(myArray[1])+String(myArray[2]);
    tft.print(dir);
    tft.setTextColor(ST77XX_WHITE);
    tft.setTextSize(2);
}


void testdrawtext(char *text, uint16_t color) {
  tft.setCursor(0, 0);
  tft.setTextColor(color);
  tft.setTextWrap(true);
  tft.print(text);
}

void tftPrintTest() {
  tft.setTextWrap(false);
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 30);
  tft.println("jjjjj!");
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(2);
}
