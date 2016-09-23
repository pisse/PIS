/**
 * Created by Administrator on 2016/9/23.
 */

var assert = require('assert')
var Promise = require('../src').Promise

var $val = {
    val: "ok"
};

setPrototypeOf = Object.setPrototypeOf
var utils = {
    sleep: function (ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms)
        })
    }
}

function itt(name, expect, f) {
    describe(name, function () {
        it("", function(){
            return f().then(function (actual) {
                assert.deepEqual(expect, actual)
            })
        })
    })
}

itt("resolve order", ["DEHAFGBC", "DEHAFGBC"], function () {
    return new Promise(function (assertResolve) {
        var assertRes = [];
        var result = "";
        var resolve, resolve2;

        var p = new Promise(function (r) {
            resolve = r;
        });

        resolve({
            then: function () {
                result += "A";
                throw Error();
            }
        });

        p.catch(function () {
            result += "B";
        });
        p.catch(function () {
            result += "C";
            assertRes.push(result);
        });

        var p2 = new Promise(function (r) {
            resolve2 = r;
        });
        resolve2(Object.defineProperty({}, "then", {
            get: function () {
                result += "D";
                throw Error();
            }
        }));
        result += "E";
        p2.catch(function () {
            result += "F";
        });
        p2.catch(function () {
            result += "G";
        });
        result += "H";
        setTimeout(function () {
            if (~result.indexOf("C")) {
                assertRes.push(result);
            }

            assertResolve(assertRes);
        }, 100);
    });
});
/*
itt("resolve", $val, function () {
    return new Promise(function (resolve) {
        return resolve($val);
    });
});

itt("resolve promise like value", $val, function () {
    return new Promise(function (resolve) {
        return resolve({
            then: function (fulfil) {
                return fulfil($val);
            }
        });
    });
});

itt("constructor throw", $val, function () {
    return new Promise(function () {
        throw $val;
    })["catch"](function (e) {
        return e;
    });
});

itt("resolve static", $val, function () {
    return Promise.resolve($val);
});

itt("resolve promise", $val, function () {
    return Promise.resolve(Promise.resolve($val));
});

itt("reject", $val, function () {
    return Promise.reject($val)["catch"](function (val) {
        return val;
    });
});


itt("catch", $val, function () {
    return new Promise(function (nil, reject) {
        return reject($val);
    })["catch"](function (val) {
        return val;
    });
});

itt("chain", "ok", function () {
    return Promise.resolve().then(function () {
        return new Promise(function (r) {
            return setTimeout(function () {
                return r("ok");
            }, 10);
        });
    });
});

itt("all with empty", [], function () {
    return Promise.all([]);
});

itt("all with null", true, function () {
    return Promise.all(null).catch(function (err) {
        return err instanceof TypeError;
    });
});

itt("all with array like", true, function () {
    return Promise.all({
        "0": 1, "1": 2, "2": 3, length: 3
    }).catch(function (err) {
        return err instanceof TypeError;
    });
});

itt("all", [1, "test", "x", 10, 0], function () {
    function randomPromise (i) {
        return new Promise(function (r) {
            return setTimeout(function () {
                return r(i);
            }, Math.random() * 10);
        });
    }

    return Promise.all([
        randomPromise(1), randomPromise("test"), Promise.resolve("x"), new Promise(function (r) {
            return setTimeout(function () {
                return r(10);
            }, 1);
        }), new Promise(function (r) {
            return r(0);
        })
    ]);
});

itt("all with custom Symbol.iterator", [1, 2, 3], function () {
    var arr = [];

    if (!Symbol.iterator)
    // skip the test
        return [1, 2, 3];

    arr[Symbol.iterator] = function () {
        return [1, 2, 3][Symbol.iterator]();
    };

    return Promise.all(arr);
});

itt("all with iterator like", [1, 2, 3], function () {
    var arr = {
        list: [3, 2, 1],
        next: function () {
            return {
                done: !this.list.length,
                value: this.list.pop()
            };
        }
    };
    arr[Symbol.iterator] = function () { return this; };

    return Promise.all(arr);
});

itt("all with iterator like, iteration error", "error", function () {
    var arr = {
        next: function () {
            throw "error";
        }
    };
    arr[Symbol.iterator] = function () { return this; };

    return Promise.all(arr).catch(function (err) {
        return err;
    });
});

itt("all with iterator like, resolve error", "clean", function () {
    function SubPromise (itt) {
        var self = new Promise(itt);
        setPrototypeOf(self, SubPromise.prototype);
        return self;
    }

    setPrototypeOf(SubPromise, Promise);
    SubPromise.prototype = Object.create(Promise.prototype);
    SubPromise.prototype.constructor = SubPromise;

    return new Promise(function (resolve) {
        var arr = {
            count: 2,
            "return": function () {
                resolve("clean");
            },
            next: function () {
                return {
                    done: !--this.count
                };
            }
        };
        arr[Symbol.iterator] = function () { return this; };

        SubPromise.resolve = function () { throw "err"; };

        SubPromise.all(arr).catch(function () {});
    });
});

itt("race with empty should never resolve", "ok", function () {
    return new Promise(function (resolve) {
        Promise.race([]).then(function () {
            resolve("err");
        });

        utils.sleep(30).then(function () {
            resolve("ok");
        });
    });
});

itt("race with null", true, function () {
    return Promise.race(null).catch(function (err) {
        return err instanceof TypeError;
    });
});

itt("race", 0, function () {
    return Promise.race([
        new Promise(function (r) {
            return setTimeout(function () {
                return r(1);
            }, 10);
        }),
        new Promise(function (r) {
            return setTimeout(function () {
                return r(0);
            });
        })
    ]);
});

itt("race with custom Symbol.iterator", 1, function () {
    var arr = [];

    if (!Symbol.iterator)
    // skip the test
        return Promise.resolve(1);

    arr[Symbol.iterator] = function () {
        return [1, 2, 3][Symbol.iterator]();
    };

    return Promise.race(arr);
});

itt("race with iterator like", 1, function () {
    var arr = {
        list: [3, 2, 1],
        next: function () {
            return {
                done: !this.list.length,
                value: this.list.pop()
            };
        }
    };
    arr[Symbol.iterator] = function () { return this; };

    return Promise.race(arr);
});

itt("race with iterator like, iteration error", "error", function () {
    var arr = {
        next: function () {
            throw "error";
        }
    };
    arr[Symbol.iterator] = function () { return this; };

    return Promise.race(arr).catch(function (err) {
        return err;
    });
});

itt("race with iterator like, resolve error", "clean", function () {
    function SubPromise (itt) {
        var self;
        self = new Promise(itt);
        setPrototypeOf(self, SubPromise.prototype);
        return self;
    }

    setPrototypeOf(SubPromise, Promise);
    SubPromise.prototype = Object.create(Promise.prototype);
    SubPromise.prototype.constructor = SubPromise;

    return new Promise(function (resolve) {
        var arr = {
            count: 2,
            "return": function () {
                resolve("clean");
            },
            next: function () {
                return {
                    done: !--this.count
                };
            }
        };
        arr[Symbol.iterator] = function () { return this; };

        SubPromise.resolve = function () { throw "err"; };

        SubPromise.race(arr).catch(function () {});
    });
});

itt("subclass", ["subclass", "subclass", "subclass", "subclass", "subclass", true, true, 5, 6], function () {
    function SubPromise (itt) {
        var self;
        self = new Promise(itt);
        setPrototypeOf(self, SubPromise.prototype);
        self.mine = "subclass";
        return self;
    }

    var result = [];

    setPrototypeOf(SubPromise, Promise);
    SubPromise.prototype = Object.create(Promise.prototype);
    SubPromise.prototype.constructor = SubPromise;

    var p1 = SubPromise.resolve(5);
    result.push(p1.mine);
    p1 = p1.then(function (itt) {
        return result.push(itt);
    });
    result.push(p1.mine);

    var p2 = new SubPromise(function (itt) {
        return itt(6);
    });
    result.push(p2.mine);
    p2 = p2.then(function (itt) {
        return result.push(itt);
    });
    result.push(p2.mine);

    var p3 = SubPromise.all([p1, p2]);
    result.push(p3.mine);
    result.push(p3 instanceof Promise);
    result.push(p3 instanceof SubPromise);

    return p3.then(utils.sleep(50), function (itt) {
        return result.push(itt);
    }).then(function () {
        return result;
    });
});

itt("subclass PromiseCapability promise.then", true, function () {
    var promise, FakePromise1, FakePromise2;
    promise = new Promise(function (itt){ itt(42); });

    promise.constructor = FakePromise1 = function a (itt){
        itt(function () {}, function () {});
    };

    FakePromise1[Symbol.species || Symbol.for('species')] = FakePromise2 = function b (itt){
        itt(function () {}, function () {});
    };
    setPrototypeOf(FakePromise2, Promise);

    return Promise.resolve(promise.then(function () {}) instanceof FakePromise2);
});

itt("subclass PromiseCapability promise.then TypeError", true, function () {
    var promise = new Promise(function (itt){ itt(42); });

    promise.constructor = FakePromise;
    function FakePromise() {}
    FakePromise[Symbol.species || Symbol.for('species')] = FakePromise

    try {
        promise.then(function () {});
    } catch (err) {
        return Promise.resolve(err instanceof TypeError);
    }
});
*/
