#include <TinyGPS.h>
#include <EEPROM.h>

TinyGPS gps;
int counter = 0;
void setup() {
  // put your setup code here, to run once:
  Serial1.begin(9600);
  Serial.begin(9600);
  
  loadCounter();

  pinMode(13,OUTPUT);
  digitalWrite(13,LOW);
}

void loop() {
  while(Serial1.available()){
    char c = Serial1.read();
//    Serial.print(c);
    if(gps.encode(c)){
//      displayInf();
        saveInf();
    }
  }
}

void saveInf(){
  if(counter < EEPROM.length() - 10){
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon, &age);
    EEPROM.put(counter+2,flat);
    EEPROM.put(counter+6,flon);
    counter += 8;
    updateCounter();
    blinkLed();
  }
}
void loadCounter()
{
  EEPROM.get(0,counter);
}
void updateCounter(){
  EEPROM.put(0,counter);
}

void blinkLed(){
  digitalWrite(13,HIGH);
  delay(100);
  digitalWrite(13,LOW);
}
//----------------------------------
void displayInf(){
  float flat, flon;
  unsigned long age;
  gps.f_get_position(&flat, &flon, &age);
  Serial.print("LAT=");
  Serial.print(flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6);
  Serial.print(" LON=");
  Serial.print(flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6);
  Serial.print(" SAT=");
  Serial.print(gps.satellites() == TinyGPS::GPS_INVALID_SATELLITES ? 0 : gps.satellites());
  Serial.print(" PREC=");
  Serial.print(gps.hdop() == TinyGPS::GPS_INVALID_HDOP ? 0 : gps.hdop());
  Serial.print(" AGE=");
  Serial.print( age == TinyGPS::GPS_INVALID_AGE? 0: age);
  Serial.println("");
}

void displayStatus(){
  unsigned long chars;
  unsigned short sentences, failed;
  gps.stats(&chars, &sentences, &failed);
  Serial.print(" CHARS=");
  Serial.print(chars);
  Serial.print(" SENTENCES=");
  Serial.print(sentences);
  Serial.print(" CSUM ERR=");
  Serial.println(failed);
}


