// Copyright 2011 Mark Cavage, Inc.  All rights reserved.

var assert = require('assert');
var util = require('util');

var LDAPResult = require('./result');
var Protocol = require('../protocol');



///--- API

function BindResponse(options) {
  if (options) {
    if (typeof (options) !== 'object')
      throw new TypeError('options must be an object');
  } else {
    options = {};
  }

  options.protocolOp = Protocol.LDAP_REP_BIND;
  LDAPResult.call(this, options);

  this.__defineGetter__('data', function () {
    return this.responseData;
  });
  this.__defineSetter__('data', function (val) {
    if (!Buffer.isBuffer(val))
      throw new TypeError('value must be a buffer');
    this.responseData = val;
  });

}

util.inherits(BindResponse, LDAPResult);
module.exports = BindResponse;


BindResponse.prototype._parse = function (ber) {
  assert.ok(ber);

  if (!LDAPResult.prototype._parse.call(this, ber))
    return false;

  if (ber.peek() === 0x87){
    this.responseData = ber.readString(0x87,true); //no readBuffer implementation
    //var o = ber.readLength(ber._offset + 1); // stored in `length`
    //this.responseData = ber._buf.slice(ber._offset, ber._offset + ber.length);

  }


  return true;
};


BindResponse.prototype._toBer = function (ber) {
  assert.ok(ber);

  if (!LDAPResult.prototype._toBer.call(this, ber))
    return false;

  if (this.responseData)
    ber.writeBuffer(this.responseData, 0x87);

  return ber;
};


BindResponse.prototype._json = function (j) {
  assert.ok(j);

  j = LDAPResult.prototype._json.call(this, j);

  j.responseData = this.responseData;

  return j;
};
