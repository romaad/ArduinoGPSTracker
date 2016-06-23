#include <EEPROM.h>
int storedCounter = 0,cnt = 0;
void setup() {
  // put your setup code here, to run once:
  loadCounter();
  Serial.begin(9600);
  Serial.println(storedCounter);
  for(cnt = 0; cnt < storedCounter; cnt+=8){
    float lat,lon;
    EEPROM.get(cnt+2,lat);
    EEPROM.get(cnt+6,lon);
    Serial.print(lat);
    Serial.print("\t");
    Serial.println(lon);
  }
}

void loop() {
  
}
void loadCounter()
{
  EEPROM.get(0,storedCounter);
}
