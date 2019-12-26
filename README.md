!! THIS REPOSITORY IS NOG ACTIVELY MAINTAINED ANYMORE, PLEASE FEEL FREE TO CREATE FORK !!

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
      "id": "sonoff_basic_relay"
    },
    {
      "name": "ESPHome Fan 1",
      "host": "hostname",
      "type": "fan",
      "id": "ventilation"
    }
  ]
}
```

Each `device` object passed to the `devices` array has these properties:

- `name` - The name that should appear in HomeKit.
- `host` - The ip-adres or hostname of the device.
- `type` - The type of device. Can be `switch` or `fan`.
- `id` - The id refers to the id of the component - this ID is created by taking the name of the component, stripping out all non-alphanumeric characters, making everything lowercase and replacing all spaces by underscores.

### Prerequisites

The ESPHome firmware on the device has to be compiled with support for the **REST API** as this plugin uses HTTP calls and EventSource Events.

Info: [ESPHome Web Server API](https://esphome.io/web-api/index.html)

Compile the ESPHome firmware with the following component enabled:

```yaml
# Enable REST api in ESPHome firmware
web_server:
  port: 5180 # optional
```

`port:` is optional, defaults to port 80.

### Notes

Type `Fan` in HomeKit is controlled in percentage, whereas in ESPHome `fan` is controlled in steps `off`, `low`, `medium` and `high`. Therefor the plugin converts speed steps in the following percentages.
- `off` = device is showing off in HomeKit.
- `low` = 25 percentage.
- `medium` = 50 percentage.
- `high` = 100 percentage.

## TODO

- Implement more device types.
- More real-life testing.
