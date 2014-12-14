encoding.json
=============

[![Build status](https://img.shields.io/travis/folktale/encoding.json/master.svg?style=flat)](https://travis-ci.org/folktale/encoding.json)
[![NPM version](https://img.shields.io/npm/v/encoding.json.svg?style=flat)](https://npmjs.org/package/encoding.json)
[![Dependencies status](https://img.shields.io/david/folktale/encoding.json.svg?style=flat)](https://david-dm.org/folktale/encoding.json)
![Licence](https://img.shields.io/npm/l/encoding.json.svg?style=flat&label=licence)
![Experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat)


Lossless serialisation and parsing of JSON structures for complex objects


## Example

```js
var Enc = require('encoding.json');

// Simple structures
var Nothing = {
  // A toJSON method should return the representation of the object
  toJSON: function() {
    return { '#type': 'Nothing' }
  },
  // And a fromJSON method should return an Either.Right, if the
  // provided data can be parsed, otherwise an Either.Left with the
  // reasons it can't be parsed.
  fromJSON: function(data) {
    return Enc.foldType({
      'Nothing': function(){ return Nothing }
    }, data)
  },
  toString: function(){ return 'Nothing' }
}

var Just = function(value) {
  return {
    toJSON: function() {
      return { '#type': 'Just', value: value }
    },
    fromJSON: function(data) {
      return Enc.foldType({
        'Just': function(data){ return Just(data.value) }
      }, data)
    },
    toString: function(){ return 'Just(' + value + ')' }
  }
}

var a = Enc.serialise(Nothing)
// => (String) '{ "#type": "Nothing" }'
Enc.parseAs(Nothing, a)
// => Nothing

var b = Enc.serialise(Just(2))
// => (String) '{ "#type": "Just", "value": 2 }'
Enc.parseSAs(Just, b)
// => Just(2)
Enc.parseAs(Just, a)
// => Either.Left("Unknow type: Nothing")


// Complex interfaces
var IPerson = Enc.spec({
  name: Enc.Any,
  age: Enc.Any,
  avatar: Maybe
});

var personA = { name: "Alice", age: 12, avatar: Maybe.Just("/alice.png") };
var personB = { name: "Rabbit", age: 100, avatar: Maybe.Nothing };

Enc.reifyAs(IPerson, Enc.serialise(personA)) // => personA
Enc.reifyAs(IPerson, Enc.serialise(personB)) // => personB
```


## Installing

The easiest way is to grab it from NPM. If you're running in a Browser
environment, you can use [Browserify][]

    $ npm install encoding.json


### Using with CommonJS

If you're not using NPM, [Download the latest release][release], and require
the `encoding.json.umd.js` file:

```js
var JSON = require('encoding.json')
```


### Using with AMD

[Download the latest release][release], and require the `encoding.json.umd.js`
file:

```js
require(['encoding.json'], function(JSON) {
  ( ... )
})
```


### Using without modules

[Download the latest release][release], and load the `encoding.json.umd.js`
file. The properties are exposed in the global `Folktale.Encoding.JSON` object:

```html
<script src="/path/to/encoding.json.umd.js"></script>
```


### Compiling from source

If you want to compile this library from the source, you'll need [Git][],
[Make][], [Node.js][], and run the following commands:

    $ git clone git://github.com/folktale/encoding.json.git
    $ cd encoding.json
    $ npm install
    $ make bundle
    
This will generate the `dist/encoding.json.umd.js` file, which you can load in
any JavaScript environment.

    
## Documentation

You can [read the documentation online][docs] or build it yourself:

    $ git clone git://github.com/folktale/encoding.json.git
    $ cd encoding.json
    $ npm install
    $ make documentation

Then open the file `docs/index.html` in your browser.


## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :)


## Licence

Copyright (c) 2014 Quildreen Motta.

Released under the [MIT licence](https://github.com/folktale/encoding.json/blob/master/LICENCE).

<!-- links -->
[Fantasy Land]: https://github.com/fantasyland/fantasy-land
[Browserify]: http://browserify.org/
[Git]: http://git-scm.com/
[Make]: http://www.gnu.org/software/make/
[Node.js]: http://nodejs.org/
[es5-shim]: https://github.com/kriskowal/es5-shim
[docs]: http://folktale.github.io/encoding.json
<!-- [release: https://github.com/folktale/encoding.json/releases/download/v$VERSION/encoding.json-$VERSION.tar.gz] -->
[release]: https://github.com/folktale/encoding.json/releases/download/v0.1.0/encoding.json-0.1.0.tar.gz
<!-- [/release] -->
