// Copyright (c) 2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Enc = require('../');
var deepEqual = require('deep-equal');

var Nothing = {
  isNothing: true,
  isJust: false,
  toJSON: function() {
    return { '#type': 'Nothing' }
  },
  fromJSON: function(data) {
    return Enc.foldType({
      'Nothing': function(){ return Nothing }
    }, data)
  },
  isEqual: function(b) {
    return b.isNothing
  },
  toString: function() {
    return 'Nothing'
  }
}

var Just = function(value) {
  return {
    _value: value,
    isNothing: false,
    isJust: true,
    toJSON: function() {
      return { '#type': 'Just', value: value }
    },
    fromJSON: function(data) {
      return Enc.foldType({
        'Just': function(){ return Just(data.value) }
      }, data)
    },
    isEqual: function(b) {
      return b.isJust && deepEqual(b._value, value)
    },
    toString: function() {
      return 'Just(' + value + ')'
    }
  }
}

var Maybe = {
  Nothing: Nothing,
  Just: Just,
  fromJSON: function(data) {
    return Enc.foldType({
      'Nothing': function(){ return Nothing },
      'Just': function(x){ return Just(x.value) }
    }, data)
  }
}

module.exports = Maybe