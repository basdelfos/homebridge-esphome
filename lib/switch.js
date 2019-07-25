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
      Accessory.Categories.SWITCH);

    this.getUrl = `/switch/${this.deviceConfig.id}`;
    this.setTurnOnUrl = `/switch/${this.deviceConfig.id}/turn_on`;
    this.setTurnOffUrl = `/switch/${this.deviceConfig.id}/turn_off`;
    this.setToggleUrl = `/switch/${this.deviceConfig.id}/toggle`;

    this.espHomeWebApi.stateEvent((data) => {
      this.log.debug('State event:', data);
      if (data.id === `switch-${this.deviceConfig.id}`) {
        this.service.getCharacteristic(Characteristic.On).updateValue(data.value);
      }
    });

    this.service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {

        this.log.debug('[GET][%s] Characteristic.On', this.homebridgeAccessory.displayName);

        // Send GET request
        this.espHomeWebApi.sendRequestJson(this.getUrl, '', 'GET',
          (response, obj) => {
            callback(null, obj.value);
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
          (response, obj) => {
            callback();
          },
          (error) => {
            this.log.error('[ERROR][SET][%s] %s', this.homebridgeAccessory.displayName, error);
            callback(error);
          });
      });

  }
}

module.exports = SwitchAccessory;