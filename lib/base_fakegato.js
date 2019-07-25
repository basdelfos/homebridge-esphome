'use strict';
const BaseAccessory = require('./base');
//var FakeGatoHistoryService = require('fakegato-history')(homebridge);

class BaseAccessoryFakeGatoHistory extends BaseAccessory {
  constructor(platform) {
    super(platform);

    this.FakeGatoHistoryService = require('fakegato-history')(platform.api);
    this.historyServiceStoragePath = platform.api.user.storagePath() + '/fakegato/';
    this.log = platform.log.log;

    this.historyService;
  }

  createHistoryService(accessory, type) {
    if (!this.historyService) {
      this.historyService = new this.FakeGatoHistoryService(
        type,
        accessory,
        {
          storage: 'fs',
          path: this.historyServiceStoragePath,
          disableTimer: false,
          disableRepeatLastData: false
        });
      this.historyService.log = this.log;
    }
    return this.historyService;
  }

  getHistoryService() {
    return this.historyService;
  }

  addHistoryEntry(accessory, params = {}) {
    this.historyService.addEntry(params);
  }

}