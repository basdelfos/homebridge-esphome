'use strict';
const BaseAccessory = require('./base');
const request = require('request');

let Accessory;
let Service;
let Characteristic;

class SwitchAccessory extends BaseAccessory {
  constructor(platform, homebridgeAccessory, deviceConfig) {
    
    ({ Accessory, Characteristic, Service } = platform.api.hap);

    super(platform, 
      homebridgeAccessory, 
      deviceConfig,
      Accessory.Categories.FAN);

    this.service.getCharacteristic(Characteristic.Active)
      .on('get', (callback) => {
        var state = false;
        callback(null, state);
        this.log.debug('[GET][%s] active: %s', this.homebridgeAccessory.displayName, state);
      })
      .on('set', (state, callback) => {
        this.log.debug('[SET][%s] active: %s', this.homebridgeAccessory.displayName, state);
        callback();
      });

      this.service.addCharacteristic(Characteristic.RotationSpeed)
      .on("get", (callback) => {
        var speed = 1;
        callback(null, speed);
        this.log.debug('[GET][%s] speed: %s', this.homebridgeAccessory.displayName, speed);
      })
      .on("set", (speed, callback) => {
        this.log.debug('[SET][%s] speed: %s', this.homebridgeAccessory.displayName, speed);
        callback();
      });
  }
}

module.exports = SwitchAccessory;