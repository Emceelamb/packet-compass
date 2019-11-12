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
const int rightStep = 2;
// initialize the stepper library on pins 8 through 11:
Stepper stepper(stepsPerRevolution, 3, 5, 6, 7);

//button
const int buttonPin = 2;
int buttonState = 0;         // variable for reading the pushbutton status
int buttonPrev = 0;
int counter = 0;
String hop[6][7] =  {
  {"128.122.1.4", "New York, NY USA", "Distance: 2.67 m", " N", "40.7314", "-73.9884", "0"},
  {"199.109.5.5", "Syracuse, NY USA", "Distance: 0.49 m", "NW", "40.7589", "-73.9790", "14"},
  {"162.252.70.138", "Ann Arbor, MI USA", "Distance: 514.81 m", " W", "42.2234", "-83.7292", "12"},
//  {"99.82.179.34", "Ashburn, VA USA", "Distance: 394.57 m", " SW", "39.0437", "-77.4742", "10"},
//  {"52.93.28.126", "Frankfurt, Germany", "Distance: 4068.57 m", " NE", "50.1109", "8.6821", "2"},
//  {"www.expanding", "experience.kr", " ", "You've arrived!", " ", " ", " "},
};

//String dis[2] = {"500 miles", "200 miles"};
//String lat[2] = {"40.7128N", "40.7308N"};
//String lon[2] = {"74.0060W", "73.9973W"};


int calibrate = 0;
void setup(void) {
  Serial.begin(9600);
  compass.init();
  tft.initR(INITR_144GREENTAB); // Init ST7735R chip, green tab

  tft.fillScreen(ST77XX_BLACK);
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


  delay(250);
  // clear screen
  tft.fillScreen(ST77XX_BLACK);


  String dir = String(myArray[1]) + String(myArray[2]);
  //    String dis = "500 miles";
  //    String lat = "40.7128N";
  //    String lon = "74.0060W";
//  Serial.println(dir);
//   Serial.println(hop[counter][7].toInt());
  tft.setTextWrap(false);
  //    tft.println("1. 128.122.1.4");

  buttonState = digitalRead(buttonPin);
  //    if(buttonState != button
  if (buttonState != buttonPrev) {
    if (buttonState == HIGH) {
      //        Serial.println("pressed");

      tft.fillScreen(ST77XX_BLACK);
      counter++;
      if (myArray[1] + myArray[2] == 110) {
    //      hop[counter][3];
 
    int direction_ = hop[counter][7].toInt();
    Serial.println(direction_);
    switch (direction_) {
      case 199: //N
         stepper.step(calibrate);
        break;
      case 2:
         stepper.step(calibrate);
        stepper.step(375);
        calibrate = -375;
        break;
      case 6:
         stepper.step(calibrate);
        stepper.step(750);
        calibrate = -750;
        break;
      case 0: //w
         stepper.step(calibrate);
        stepper.step(1500);
        calibrate = -1500;
        break;
      case 162: //w
         stepper.step(calibrate);
        stepper.step(1875);
        calibrate = -1875;
        Serial.println("14");
        break;
      default:
        break;
    }
  }

    }
    buttonPrev = buttonState;
    if (counter > 6) {
      counter = 0;
    }
  }

  //Print out current location
  tft.setCursor(10, 11);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setTextSize(1);
  tft.print("Current:");
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(10, 21);
  tft.print(dir);

  //Print out hop information
  tft.setCursor(10, 52);
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.println(hop[counter][0]);
  tft.setCursor(10, 64);
  tft.println(hop[counter][1]);
  tft.setCursor(10, 76);
  tft.println(hop[counter][2]);
  tft.setCursor(10, 88);
  tft.println(hop[counter][3]);
  tft.setCursor(10, 100);
  tft.println("Lat: " + hop[counter][4]);
  tft.setCursor(10, 112);
  tft.println("Lon: " + hop[counter][5]);
  Serial.println(myArray[1]+myArray[2]);
  

}


const float resolution  = 5.625; // put your step resolution here
int step_degree(String desired_degree){
    float desired_degree_ = desired_degree.toInt();
    desired_degree = desired_degree.toFloat();
    
//    float d = desired_degree;
    return (desired_degree_/resolution);}
