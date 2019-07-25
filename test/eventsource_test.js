var EventSource = require('eventsource');

var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var after = require('mocha').after;

this.eventSource;

describe('EventSource subscription tests', () => {

  before(() => {
    this.eventSource = new EventSource('http://192.168.178.35:5180/events');
  })

  describe('Receive real-time updates for sensor state', () => {
    it('should retreive playload(s) with state', (done) => {

      var receivedPayloads = 0;
      const expectedNumPayloads = 4;  // 2 = only the immidiate response, 4 = wait until receiving the first update

      this.eventSource.addEventListener('state', function (e) {
        if (e.data) receivedPayloads++;
        if (receivedPayloads == expectedNumPayloads) {
          assert.ok('Received all payloads')
          done();
        }
      });
    }).timeout(90 * 1000); // Timeout after 90 seconds
  });

  after(() => {
    // Clean up stuff
    this.eventSource.close();
  });
});