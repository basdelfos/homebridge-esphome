# homebridge-esphome

Homebridge plugin to control ESP8266/ESP32 devices running ESPHome firmware (https://esphome.io)

## Installation

```
npm i homebridge-esphome -g
```

## Basic config.json

```javascript
{
  "platform": "ESPHomePlatform",
  "name": "ESPHomePlatform",
  "devices": [
    {
      "name": "ESPHome Switch 1",
      "host": "hostname",
      "type": "switch"
    },
    {
      "name": "ESPHome Fan 1",
      "host": "hostname",
      "type": "fan"
    }
  ]
}
```

Each `device` object passed to the `devices` array has these properties:

- `name`: the name that should appear in HomeKit.
