'use strict';
const BaseAccessory = require('./base');

let Accessory;
let Service;
let Characteristic;

class FanAccessory extends BaseAccessory {
  constructor(platform, homebridgeAccessory, deviceConfig) {

    ({ Accessory, Characteristic, Service } = platform.api.hap);

    super(platform,
      homebridgeAccessory,
      deviceConfig,
      Accessory.Categories.FAN);

    this.getUrl = `/fan/${this.deviceConfig.id}`;
    this.setTurnOnUrl = `/fan/${this.deviceConfig.id}/turn_on`;
    this.setTurnOffUrl = `/fan/${this.deviceConfig.id}/turn_off`;
    this.setToggleUrl = `/fan/${this.deviceConfig.id}/toggle`;

    this.espHomeWebApi.stateEvent((data) => {
      this.log.debug('State event:', data);
      if (data.id === `fan-${this.deviceConfig.id}`) {
        this.service.getCharacteristic(Characteristic.On).updateValue(data.value);
        this.service.getCharacteristic(Characteristic.RotationSpeed).updateValue(this._convertSpeedToPercentage(data.speed));
      }
    });

    this.service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {

        this.log.debug('[GET][%s] Characteristic.On', this.homebridgeAccessory.displayName);

        // Send GET request
        this.espHomeWebApi.sendRequestJson(this.getUrl, '', 'GET',
          (response, obj) => {
            this.log.debug('[GET] Response', obj)
            callback(null, obj.state === 'ON');
          },
          (error) => {
            this.log.error('[ERROR][GET][%s] %s', this.homebridgeAccessory.displayName, error);
            callback(error);
          });
      })
      .on('set', (state, callback) => {

        this.log.debug('[SET][%s] Characteristic.On: %s', this.homebridgeAccessory.displayName, state);

        const url = state ? this.setTurnOnUrl : this.setTurnOffUrl;

        // Send SET request
        this.espHomeWebApi.sendRequest(url, '', 'POST',
          (response, body) => {
            callback();
          },
          (error) => {
            this.log.error('[ERROR][SET][%s] %s', this.homebridgeAccessory.displayName, error);
            callback(error);
          });
      });

    if (!this.service.getCharacteristic(Characteristic.RotationSpeed)) {
      this.service.addCharacteristic(Characteristic.RotationSpeed);
    }
    this.service.getCharacteristic(Characteristic.RotationSpeed)
      .on("get", (callback) => {

        this.log.debug('[GET][%s] Characteristic.RotationSpeed', this.homebridgeAccessory.displayName);

        // Send GET request
        this.espHomeWebApi.sendRequestJson(this.getUrl, '', 'GET',
          (response, obj) => {

            callback(null, this._convertSpeedToPercentage(obj.speed));
          },
          (error) => {
            this.log.error('[ERROR][GET][%s] %s', this.homebridgeAccessory.displayName, error);
            callback(error);
          });
      })
      .on("set", (percentage, callback) => {

        this.log.debug('[SET][%s] Characteristic.RotationSpeed: %s', this.homebridgeAccessory.displayName, percentage);

        const speed = this._convertPercentageToSpeed(percentage);
        let url;
        if (speed == 0) {
          url = this.setTurnOffUrl;
        }
        else {
          url = this.setTurnOnUrl + '?speed=' + speed;
        }

        // Send SET request
        this.espHomeWebApi.sendRequest(url, '', 'POST',
          (response, body) => {
            callback();
          },
          (error) => {
            this.log.error('[ERROR][SET][%s] %s', this.homebridgeAccessory.displayName, error);
            callback(error);
          });
      });
  }

  _convertSpeedToPercentage(speed) {
    let percentage;
    switch (speed) {
      case "high":
        return 100;
        break;
      case "medium":
        return 50;
        break;
      case "low":
        return 25;
        break;
      case "off":
      default:
        return 0;
    }
  }

  _convertPercentageToSpeed(percentage) {
    if (percentage == 0) {
      return 'off';
    }
    else {
      if (percentage < 25) {
        return 'low';
      }
      else {
        if (percentage < 50) {
          return 'medium';
        }
        else {
          if (percentage >= 75) {
            return 'high';
          }
        }
      }
      return new Error('Could not convert percentage to fan speed');
    }
  }
}

module.exports = FanAccessory;