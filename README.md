# Arduino GPS tracker
## project explanation
arduino project for a tracker device.
## running steps
- Connect your arduino to any gps module and run `project_delay.ino` or `project.ino` to start gathering data.
- After gathering adequate data connect arduino to your pc again and run `read.ino`, and open up serial monitor and copy output coordinates (ignoring first line) to a file.
- open `display.html` click `choose File` and choose the file from previous step.
- it'll load the coordinates snap them to roads and displays them.

## file explanation:
### arduino code
__read.ino__: reads values stored at EEPROM.

__clear.ino__: clears EEPROM. 

__project_delay__: reads GPS values periodically.

__project.ino__: reads GPS values as they change.

### web code
__display.html__: display the gathered data stored at a text file

__sc.js__: java script code for displaying data


## notes
- you should have [tinyGPS library](https://github.com/mikalhart/TinyGPS) to compile arduino code
- you should insert google maps api key & google maps roads api key to be able to display google maps
- code is built for arduino mega, so there's a `Serial1`. if you're using another arduino convert `Serial1` to `SoftwareSerial`.
- depending on your gps module data may/may not be precise, also note that many gps modules work only in open spaces.
