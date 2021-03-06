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

var Enc = require('../../');
var _ = require('alright');
var Maybe = require('../maybe');
var {forAll, data:{Any,Int}, sized, label, transform, choice} = require('claire');
var Anys = sized(λ[10], Any);
var maybe = λ(a) -> choose([Maybe.Nothing, Maybe.Just(a)]);
var TMaybe = λ(a) -> label('Maybe', transform(maybe, a));
var U = choice(Anys, TMaybe);
var { Left, Right } = require('data.either');

function choose(xs) {
  return xs[Math.floor(Math.random() * xs.length)];
}

var PNumber = {
  fromJSON: function(data) {
    return (typeof data !== 'number')?  Left(new TypeError('Not a number: ' + data))
    :      /* otherwise */              Right(data)
  }
}

var PString = {
  fromJSON: function(data) {
    return (typeof data !== 'string')?  Left(new TypeError('Not a string: ' + data))
    :      /* otherwise */              Right(data)
  }
}


module.exports = spec 'Core' {
  spec 'Serialisation' {
    it 'Should respect the JSON serialisation defined by the object' {
      forAll(U).satisfy(λ(a) ->
        !!(Enc.serialise(a) => JSON.stringify(a))
      ).asTest()()
    }
  }

  spec 'Parsing' {
    it 'reifyAs(s,t) Should correctly reify the structure' {
      forAll(TMaybe(Anys)).satisfy(λ(a) ->
        !!(Enc.reifyAs(Maybe, a.toJSON()) => a)
      )
    }
    it 'parseAs(s,t) Should correctly parse & reify the structure' {
      forAll(TMaybe(Int)).satisfy(λ(a) ->
        !!(Enc.parseAs(Maybe, Enc.serialise(a)) => a)
      ).asTest()()
    }
  }

  spec 'Specs' {
    it 'Should apply the parsers to the right keys' {
      var IPerson = Enc['spec']({ name: PString, age: PNumber });
      Enc.reifyAs(IPerson, { name: "Alice", age: 12, likes: "sweets" })
      => { name: "Alice", age: 12 }
    }
    it 'Should fail if any of the keys fail' {
      var IPerson = Enc['spec']({ name: PString, age: PNumber });
      
      λ[Enc.reifyAs(IPerson, { name: "Alice", age: "12" })] should _.raise(TypeError)
    }
    it 'Should work with complex data structures' {
      var IPerson = Enc['spec']({ name: PString, age: PNumber, avatar: Maybe });
      var eq = λ(b) -> ( this.name === b.name
                      && this.age  === b.age
                      && this.avatar.isEqual(b.avatar)
                       );
      
      var p1 = { name: "Alice", age: 12, avatar: Maybe.Just("/alice.png"), isEqual: eq };
      var p2 = { name: "Rabbit", age: 100, avatar: Maybe.Nothing, isEqual: eq };

      Enc.parseAs(IPerson, Enc.serialise(p1)) => p1;
      Enc.parseAs(IPerson, Enc.serialise(p2)) => p2;
    }
  }
}
