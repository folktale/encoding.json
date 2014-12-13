// Copyright (c) 2014 Quildreen Motta
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

/**
 * Lossless serialisation and parsing of JSON structures for complex objects
 *
 * @module lib/index
 */

var { Left, Right } = require('data.either');
var { curry } = require('core.lambda');

function raise(e) {
  throw e
}

function id(a) {
  return a
}

function pairs(o) {
  return Object.keys(o).map(λ(k) -> ({ key: k, value: o[k] }))
}


function toParser(a) {
  if (Object(a) !== a) throw new TypeError('Values in a spec must be parsers or specs');

  return a.fromJSON?      a
  :      /* otherwise */  spec(a)
}

function applyValue(f) {
  return function(pair) {
    return { key: pair.key, value: f(pair.value) }
  }
}

function foldType(mapping, data) {
  var type = data['#type'];
  var branch = mapping[type];

  return !type?    Left(new Error("The provided data structure isn't typed."))
  :      !branch?  Left(new Error("No mapping provided by type: " + type))
  :      /* _ */   Right(branch(data))
}

function spec(iface) {
  var strategy = pairs(iface).map(applyValue(toParser));
  var builder = curry(strategy.length, function() {
    var result = {};
    for (var i = 0; i < arguments.length; ++i) {
      var pair = arguments[i];
      result[pair[0]] = pair[1];
    }
    return result
  })
  
  return {
    fromJSON: function(data) {
      return strategy.reduce(function(result, pair) {
        return result.ap(pair.value.fromJSON(data[pair.key]).map(λ[([pair.key, #])]))
      }, Right(builder));
    }
  }
}

function reifyAs(spec, data) {
  return spec.fromJSON(data).fold(raise, id)
}

function parseAs(spec, text) {
  return reifyAs(spec, JSON.parse(text))
}

// Common interfaces
var Any = {
  fromJSON: function(data) {
    return Right(data)
  }
};


module.exports = {
  serialise: JSON.stringify,
  foldType: foldType,
  reifyAs: reifyAs,
  spec: spec,
  parseAs: parseAs,
  Any: Any
}
