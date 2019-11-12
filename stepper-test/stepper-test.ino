#include <Stepper.h>

const int stepsPerRevolution = 512;

const int leftStep  = -2;
const int rightStep = 2;

const int leftPin   = 2;  
int       leftState = 0;

const int rightPin   = 3;
int       rightState = 0;

const int buttonPin = 2; 
int buttonState = 0;         // variable for reading the pushbutton status
int buttonPrev = 0;
int counter = 0;

// initialize the stepper library on pins 8 through 11:
Stepper stepper(stepsPerRevolution, 3, 5, 6, 7);

void setup() {
  
  stepper.setSpeed(60);
  
  Serial.begin(9600);
}

void loop() {

//  stepper.step(step_degree(40));
    buttonState = digitalRead(buttonPin);
//    if(buttonState != button 
    if(buttonState != buttonPrev){
      if(buttonState==HIGH){
        Serial.println("pressed");
       
  stepper.step(step_degree(375));
 
      }
           buttonPrev = buttonState;
    }
}

const float resolution  = 5.625; // put your step resolution here
int step_degree(float desired_degree){
    Serial.println("moved 40");
    return (desired_degree/resolution);}
