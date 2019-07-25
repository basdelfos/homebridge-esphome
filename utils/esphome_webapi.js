const request = require('request');
const EventSource = require('eventsource');

class EspHomeWebApi {
  constructor(log, host, port) {
    this.log = log;
    this.host = host;
    this.port = port;
    this.baseUrl = `http://${this.host}:${this.port}`;
    this.eventSource = new EventSource(this.baseUrl + '/events');
  }

  stateEvent(callback) {
    this.log.debug('Starting State EventSource listener on', this.eventSource.url);
    this.eventSource.addEventListener('state', (e) => {
      callback(e.data);
    });
  }

  logEvent(callback) {
    this.eventSource.addEventListener('log', (e) => {
      callback(e.data);
    });
  }

  pingEvent(callback) {
    this.eventSource.addEventListener('ping', (e) => {
      callback(e.data);
    });
  }

  async sendRequest(url, body, method, callbackSuccess, callbackError) {
    url = this.baseUrl + url;
    this.log.debug('Send %s request [%s]: %s', method, url, body);
    request({
      url: url,
      body: body,
      method: method,
      timeout: 5 * 1000,  // Device has to respond within 5 seconds
      rejectUnauthorized: false
    },
      (error, response, body) => {
        this.log.debug('Received response: %s', body || '(empty)');
        if (error) {
          if (error.code === 'ENOTFOUND') {
            callbackError(new Error('Could not connect to host'));
          }
          else {
            callbackError(error);
          }
        }
        else {
          callbackSuccess(response, body)
        }
      });
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
    );
  }
}

module.exports = EspHomeWebApi;