'use strict';
const EspHomeWebApi = require('../utils/esphome_webapi');

let PlatformAccessory;
let Accessory;
let Service;
let Characteristic;
let UUIDGen;

class BaseAccessory {
  constructor(platform, homebridgeAccessory, deviceConfig, categoryType) {
    this.platform = platform;
    this.log = platform.log;
    this.homebridgeAccessory = homebridgeAccessory;
    this.deviceConfig = deviceConfig;

    // Create ESPHome Web Api client
    this.espHomeWebApi = new EspHomeWebApi(
      this.log,
      this.deviceConfig.host,
      this.deviceConfig.port
    );

    PlatformAccessory = platform.api.platformAccessory;
    ({ Accessory, Service, Characteristic, uuid: UUIDGen } = platform.api.hap);

    if (this.homebridgeAccessory) {
      if (!this.homebridgeAccessory.context.host) {
        this.homebridgeAccessory.context.host = this.deviceConfig.host;
      }

      this.log.info(
        'Existing Accessory found [%s] [%s] [%s]',
        homebridgeAccessory.displayName,
        homebridgeAccessory.context.host,
        homebridgeAccessory.UUID
      );
      this.homebridgeAccessory.displayName = this.deviceConfig.name;
    }
    else {
      this.log.info('Creating new Accessory %s', this.deviceConfig.name);
      this.homebridgeAccessory = new PlatformAccessory(
        this.deviceConfig.name,
        UUIDGen.generate(this.deviceConfig.name),
        categoryType
      );
      this.homebridgeAccessory.context.host = this.deviceConfig.host;
      platform.registerPlatformAccessory(this.homebridgeAccessory);
    }

    let serviceType;
    switch (categoryType) {
      case Accessory.Categories.SWITCH:
        serviceType = Service.Switch;
        break;
      case Accessory.Categories.FAN:
        serviceType = Service.Fan;
        break;
      default:
        serviceType = Service.AccessoryInformation;
    }

    this.service = this.homebridgeAccessory.getService(serviceType);
    if (this.service) {
      this.service.setCharacteristic(Characteristic.Name, this.deviceConfig.name);
    }
    else {
      this.log.debug('Creating new Service %s', this.deviceConfig.name);
      this.service = this.homebridgeAccessory.addService(serviceType, this.deviceConfig.name);
    }

    this.homebridgeAccessory.on('identify', (paired, callback) => {
      this.log.debug('[IDENTIFY][%s]', this.homebridgeAccessory.displayName);
      callback();
    });
  }
}

module.exports = BaseAccessory;
