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

    // this.platform = platform;
    // this.log = platform.log;
    // this.homebridgeAccessory = homebridgeAccessory;
    // this.deviceConfig = deviceConfig;

    // PlatformAccessory = platform.api.platformAccessory;
    // ({ Accessory, Service, Characteristic, uuid: UUIDGen } = platform.api.hap);

    // if (this.homebridgeAccessory) {
    //   if (!this.homebridgeAccessory.context.host) {
    //     this.homebridgeAccessory.context.host = this.deviceConfig.host;
    //   }

    //   this.log.info(
    //     'Existing Accessory found [%s] [%s] [%s]',
    //     homebridgeAccessory.displayName,
    //     homebridgeAccessory.context.host,
    //     homebridgeAccessory.UUID
    //   );
    //   this.homebridgeAccessory.displayName = this.deviceConfig.name;
    // }
    // else {
    //   this.log.info('Creating new Accessory %s', this.deviceConfig.name);
    //   this.homebridgeAccessory = new PlatformAccessory(
    //     this.deviceConfig.name,
    //     UUIDGen.generate(this.deviceConfig.name),
    //     Accessory.Categories.OUTLET
    //   );
    //   this.homebridgeAccessory.context.host = this.deviceConfig.host;
    //   platform.registerPlatformAccessory(this.homebridgeAccessory);
    // }

    // this.service = this.homebridgeAccessory.getService(Service.Outlet);
    // if (this.service) {
    //   this.service.setCharacteristic(Characteristic.Name, this.deviceConfig.name);
    // }
    // else {
    //   this.log.debug('Creating new Service %s', this.deviceConfig.name);
    //   this.service = this.homebridgeAccessory.addService(Service.Outlet, this.deviceConfig.name);
    // }

    this.service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
        var state = false;
        callback(null, state);
        this.log.debug('[GET][%s] On: %s', this.homebridgeAccessory.displayName, state);
      })
      .on('set', (state, callback) => {
        this.log.debug('[SET][%s] On: %s', this.homebridgeAccessory.displayName, state);
        callback();
      });

  }
}

module.exports = SwitchAccessory;