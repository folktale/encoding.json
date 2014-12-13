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
var __ref = require('claire');
var forAll = __ref.forAll;
var __o = __ref.data;
var Any = __o.Any;
var Int = __o.Int;
var sized = __ref.sized;
var label = __ref.label;
var transform = __ref.transform;
var choice = __ref.choice;
var Anys = sized(function () {
        return 10;
    }, Any);
var maybe = function (a) {
    return choose([
        Maybe.Nothing,
        Maybe.Just(a)
    ]);
};
var TMaybe = function (a) {
    return label('Maybe', transform(maybe, a));
};
var U = choice(Anys, TMaybe);
var __ref$2 = require('data.either');
var Left = __ref$2.Left;
var Right = __ref$2.Right;
function choose(xs) {
    return xs[Math.floor(Math.random() * xs.length)];
}
var PNumber = {
        fromJSON: function (data) {
            return typeof data !== 'number' ? Left(new TypeError('Not a number: ' + data)) : Right(data);
        }
    };
var PString = {
        fromJSON: function (data) {
            return typeof data !== 'string' ? Left(new TypeError('Not a string: ' + data)) : Right(data);
        }
    };
module.exports = function (hifive) {
    var _scope = {
            hifive: hifive,
            tests: [],
            beforeAll: [],
            afterAll: [],
            beforeEach: [],
            afterEach: []
        };
    (function () {
        var _scope$2 = {
                hifive: _scope.hifive,
                tests: [],
                beforeAll: [],
                afterAll: [],
                beforeEach: [],
                afterEach: []
            };
        (function () {
            var _scope$3 = {
                    hifive: _scope$2.hifive,
                    tests: [],
                    beforeAll: [],
                    afterAll: [],
                    beforeEach: [],
                    afterEach: []
                };
            _scope$3.tests.push(_scope$3.hifive.Test.Case.create({
                name: 'Should respect the JSON serialisation defined by the object',
                timeout: new _scope$3.hifive._Maybe.Nothing(),
                slow: new _scope$3.hifive._Maybe.Nothing(),
                enabled: new _scope$3.hifive._Maybe.Nothing(),
                test: new _scope$3.hifive._Future(function (reject, resolve) {
                    try {
                        (function () {
                            forAll(U).satisfy(function (a) {
                                return !!function (alright) {
                                    return alright.verify(Enc.serialise(a))(alright.equal(JSON.stringify(a)));
                                }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
                            }).asTest()();
                        }());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            _scope$2.tests.push(_scope$2.hifive.Test.Suite.create({
                name: 'Serialisation',
                tests: _scope$3.tests,
                beforeAll: _scope$2.hifive.Hook(_scope$3.beforeAll),
                beforeEach: _scope$2.hifive.Hook(_scope$3.beforeEach),
                afterAll: _scope$2.hifive.Hook(_scope$3.afterAll),
                afterEach: _scope$2.hifive.Hook(_scope$3.afterEach)
            }));
        }());
        (function () {
            var _scope$3 = {
                    hifive: _scope$2.hifive,
                    tests: [],
                    beforeAll: [],
                    afterAll: [],
                    beforeEach: [],
                    afterEach: []
                };
            _scope$3.tests.push(_scope$3.hifive.Test.Case.create({
                name: 'reifyAs(s,t) Should correctly reify the structure',
                timeout: new _scope$3.hifive._Maybe.Nothing(),
                slow: new _scope$3.hifive._Maybe.Nothing(),
                enabled: new _scope$3.hifive._Maybe.Nothing(),
                test: new _scope$3.hifive._Future(function (reject, resolve) {
                    try {
                        (function () {
                            forAll(TMaybe(Anys)).satisfy(function (a) {
                                return !!function (alright) {
                                    return alright.verify(Enc.reifyAs(Maybe, a.toJSON()))(alright.equal(a));
                                }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
                            });
                        }());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            _scope$3.tests.push(_scope$3.hifive.Test.Case.create({
                name: 'parseAs(s,t) Should correctly parse & reify the structure',
                timeout: new _scope$3.hifive._Maybe.Nothing(),
                slow: new _scope$3.hifive._Maybe.Nothing(),
                enabled: new _scope$3.hifive._Maybe.Nothing(),
                test: new _scope$3.hifive._Future(function (reject, resolve) {
                    try {
                        (function () {
                            forAll(TMaybe(Int)).satisfy(function (a) {
                                return !!function (alright) {
                                    return alright.verify(Enc.parseAs(Maybe, Enc.serialise(a)))(alright.equal(a));
                                }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
                            }).asTest()();
                        }());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            _scope$2.tests.push(_scope$2.hifive.Test.Suite.create({
                name: 'Parsing',
                tests: _scope$3.tests,
                beforeAll: _scope$2.hifive.Hook(_scope$3.beforeAll),
                beforeEach: _scope$2.hifive.Hook(_scope$3.beforeEach),
                afterAll: _scope$2.hifive.Hook(_scope$3.afterAll),
                afterEach: _scope$2.hifive.Hook(_scope$3.afterEach)
            }));
        }());
        (function () {
            var _scope$3 = {
                    hifive: _scope$2.hifive,
                    tests: [],
                    beforeAll: [],
                    afterAll: [],
                    beforeEach: [],
                    afterEach: []
                };
            _scope$3.tests.push(_scope$3.hifive.Test.Case.create({
                name: 'Should apply the parsers to the right keys',
                timeout: new _scope$3.hifive._Maybe.Nothing(),
                slow: new _scope$3.hifive._Maybe.Nothing(),
                enabled: new _scope$3.hifive._Maybe.Nothing(),
                test: new _scope$3.hifive._Future(function (reject, resolve) {
                    try {
                        (function () {
                            var IPerson = Enc['spec']({
                                    name: PString,
                                    age: PNumber
                                });
                            (function (alright) {
                                return alright.verify(Enc.reifyAs(IPerson, {
                                    name: 'Alice',
                                    age: 12,
                                    likes: 'sweets'
                                }))(alright.equal({
                                    name: 'Alice',
                                    age: 12
                                }));
                            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
                        }());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            _scope$3.tests.push(_scope$3.hifive.Test.Case.create({
                name: 'Should fail if any of the keys fail',
                timeout: new _scope$3.hifive._Maybe.Nothing(),
                slow: new _scope$3.hifive._Maybe.Nothing(),
                enabled: new _scope$3.hifive._Maybe.Nothing(),
                test: new _scope$3.hifive._Future(function (reject, resolve) {
                    try {
                        (function () {
                            var IPerson = Enc['spec']({
                                    name: PString,
                                    age: PNumber
                                });
                            (function (alright) {
                                return alright.verify(function () {
                                    return Enc.reifyAs(IPerson, {
                                        name: 'Alice',
                                        age: '12'
                                    });
                                })(_.raise(TypeError));
                            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
                        }());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            _scope$3.tests.push(_scope$3.hifive.Test.Case.create({
                name: 'Should work with complex data structures',
                timeout: new _scope$3.hifive._Maybe.Nothing(),
                slow: new _scope$3.hifive._Maybe.Nothing(),
                enabled: new _scope$3.hifive._Maybe.Nothing(),
                test: new _scope$3.hifive._Future(function (reject, resolve) {
                    try {
                        (function () {
                            var IPerson = Enc['spec']({
                                    name: PString,
                                    age: PNumber,
                                    avatar: Maybe
                                });
                            var eq = function (b) {
                                return this.name === b.name && this.age === b.age && this.avatar.isEqual(b.avatar);
                            };
                            var p1 = {
                                    name: 'Alice',
                                    age: 12,
                                    avatar: Maybe.Just('/alice.png'),
                                    isEqual: eq
                                };
                            var p2 = {
                                    name: 'Rabbit',
                                    age: 100,
                                    avatar: Maybe.Nothing,
                                    isEqual: eq
                                };
                            (function (alright) {
                                return alright.verify(Enc.parseAs(IPerson, Enc.serialise(p1)))(alright.equal(p1));
                            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
                            (function (alright) {
                                return alright.verify(Enc.parseAs(IPerson, Enc.serialise(p2)))(alright.equal(p2));
                            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
                        }());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            _scope$2.tests.push(_scope$2.hifive.Test.Suite.create({
                name: 'Specs',
                tests: _scope$3.tests,
                beforeAll: _scope$2.hifive.Hook(_scope$3.beforeAll),
                beforeEach: _scope$2.hifive.Hook(_scope$3.beforeEach),
                afterAll: _scope$2.hifive.Hook(_scope$3.afterAll),
                afterEach: _scope$2.hifive.Hook(_scope$3.afterEach)
            }));
        }());
        _scope.tests.push(_scope.hifive.Test.Suite.create({
            name: 'Core',
            tests: _scope$2.tests,
            beforeAll: _scope.hifive.Hook(_scope$2.beforeAll),
            beforeEach: _scope.hifive.Hook(_scope$2.beforeEach),
            afterAll: _scope.hifive.Hook(_scope$2.afterAll),
            afterEach: _scope.hifive.Hook(_scope$2.afterEach)
        }));
    }());
    return _scope.tests[0];
}(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('hifive') : window.hifive);