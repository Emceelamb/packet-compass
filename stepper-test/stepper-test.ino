#include <Stepper.h>

const int stepsPerRevolution = 512;

const int leftStep  = -2;
const int rightStep = 2;

const int leftPin   = 2;  
int       leftState = 0;

const int rightPin   = 3;
int       rightState = 0;

// initialize the stepper library on pins 8 through 11:
Stepper stepper(stepsPerRevolution, 8, 9, 10, 11);

void setup() {
  
  stepper.setSpeed(60);
  
  pinMode(leftPin, INPUT);
  pinMode(rightPin, INPUT);

  Serial.begin(9600);
}

void loop() {
  
  leftState = digitalRead(leftPin);
  rightState = digitalRead(rightPin);
  
  if (rightState == HIGH) {
    stepper.step(rightStep);
    Serial.println("right high");
  }

  if (leftState == HIGH) {
    stepper.step(leftStep);
    Serial.println("left high");
  }
}
