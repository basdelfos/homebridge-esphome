const FanAccessory = require('./lib/fan');
const SwitchAccessory = require('./lib/switch');

var Accessory, Service, Characteristic, UUIDGen;

module.exports = function (homebridge) {

  // Accessory must be created from PlatformAccessory Constructor
  Accessory = homebridge.platformAccessory;

  // Service and Characteristic are from hap-nodejs
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  // For platform plugin to be considered as dynamic platform plugin,
  homebridge.registerPlatform("homebridge-esphome", "ESPHomePlatform", ESPHomePlatform, true);
}

// Platform constructor
class ESPHomePlatform {
  constructor(log, config, api) {
    var platform = this;
    this.log = log;
    this.config = config || {};

    // Keep track of all registered accessories by this platform
    this.accessories = new Map();

    if (api) {
      // Save the API object as plugin needs to register new accessory via this object
      this.api = api;

      // Listen to event "didFinishLaunching", this means homebridge already finished loading cached accessories.
      // Platform Plugin should only register new accessory that doesn't exist in homebridge after this event.
      // Or start discover new accessories.
      this.api.on('didFinishLaunching', function () {
        platform.log("Initializing ESPHomePlatform devices");

        for (const device of this.config.devices) {
          if (!device.name) {
            this.log.error('Device has no name configured.')
          }
          else if (!device.host) {
            this.log.info('Device [%s] has no hostname configured.', device.name);
          }
          else if (!device.type) {
            this.log.error('Device [%s] has no type configured.', device.name);
          }
          else if (!device.id) {
            this.log.error('Device [%s] has no id configured.', device.name);
          }
          else {
            device.port = device.port || 80;
            this.initializeAccessory(device);
          }
        }
      }.bind(this));
    }
  }

  // Function invoked when homebridge tries to restore cached accessory
  configureAccessory(accessory) {
    this.log.info(
      'Configuring cached accessory: [%s] %s %s',
      accessory.displayName,
      accessory.context.host,
      accessory.UUID
    );
    this.accessories.set(accessory.UUID, accessory);
  }

  registerPlatformAccessory(platformAccessory) {
    this.log.debug('Register PlatformAccessory: (%s)', platformAccessory.displayName);
    this.api.registerPlatformAccessories('homebridge-esphome', 'ESPHomePlatform', [platformAccessory]);
  }

  initializeAccessory(device, knownId) {
    // Get UUID
    const uuid = knownId || this.api.hap.uuid.generate(device.name);
    const homebridgeAccessory = this.accessories.get(uuid);

    this.log.info('Adding: %s (%s)', device.name || 'unnamed', device.type);

    // Construct new accessory
    let deviceAccessory;
    switch (device.type) {
      case 'switch':
        deviceAccessory = new SwitchAccessory(this, homebridgeAccessory, device);
        break;
      case 'fan':
        deviceAccessory = new FanAccessory(this, homebridgeAccessory, device);
        break;
      default:
        this.log.error('Device %s: configured type \'%s\' does not exist.');
        break;
    }

    // Add to registered accessories
    this.accessories.set(uuid, deviceAccessory.homebridgeAccessory);
  }
}

module.exports = function (homebridge) {
  homebridge.registerPlatform('homebridge-esphome', 'ESPHomePlatform', ESPHomePlatform, true);
};