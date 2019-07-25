const request = require('request');

class HttpUtil {
  constructor(log) {
    this.log = log;
  }

  async sendRequest(url, body, method, callbackSuccess, callbackError) {
    this.log.debug('Send %s request [%s]: %s', method, url, body);
    request({
      url: url,
      body: body,
      method: method,
      rejectUnauthorized: false
    },
      (error, response, body) => {
        if (error) {
          this.log.debug('Received response: %s', body);
          callbackError(error);
        }
        else {
          callbackSuccess(response, body)
        }
      }).bind(this);
  }

  sendRequestJson(url, body, method, callbackSuccess, callbackError) {
    this.sendRequest(url, body, method,
      (response, body) => {
        try {
          const obj = JSON.parse(body);
          callbackSuccess(response, obj);
        }
        catch (error) {
          callbackError(new Error('Could not parse json. ', error));
        }
      },
      (error) => {
        callbackError(error);
      }
    ).bind(this);
  }
}

module.exports = HttpUtil;