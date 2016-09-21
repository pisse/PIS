/**
 * Created by Administrator on 2016/9/20.
 */


var assert = chai.assert;

describe('class {}', function(){
    it("basic", function(){
        var Test = Class()

        assert.isFunction(Test)
        assert(Object.getPrototypeOf(Test) === Function.prototype)
        assert(Object.getPrototypeOf(Test.prototype) === Object.prototype, "error")
        assert(Test.prototype.constructor === Test)
        var x = new Test()
        assert.instanceOf(x, Test)
    })
})

describe('class { constructor(){}; method(){}; }', function(){

    it("basic 2", function(){
        var Test = Class({
            constructor: function(name) {
                this._name = name
            },
            getName: function() {
                return this._name
            }
        })

        assert.isFunction(Test)
        assert.equal(Object.getPrototypeOf(Test), Function.prototype)
        assert.equal(Object.getPrototypeOf(Test.prototype), Object.prototype)
        assert.equal(Test.prototype.constructor, Test)
        var hax = new Test('hax')
        assert.instanceOf(hax, Test)
        assert.equal(hax.getName(), 'hax')
        assert.equal(Object.getPrototypeOf(hax), Test.prototype)
        //assert.egal(Object.getOwnPropertyDescriptor(Test.prototype, 'getName').enumerable, false)
        //assert.throws(function(){ new hax.getName() }, TypeError)
    })
})

describe('class extends null {}', function(){

    it("extends", function(){
        var Test = Class.extend(null)()

        assert.isFunction(Test)
        assert.equal(Object.getPrototypeOf(Test), Function.prototype)
        assert.equal(Object.getPrototypeOf(Test.prototype), null)
        assert.equal(Test.prototype.constructor, Test)
        assert.instanceOf(new Test(), Test)
    })

})

describe('class extends Super {}', function(){
    it("extends Super", function(){
        function Super() {}
        Super.className = 'Super'
        Super.prototype.getClassName = function() {
            return this.constructor.className
        }
        var Test = Class.extend(Super)()

        assert.isFunction(Test)
       /* if ('__proto__' in function(){}) {
            assert.equal(Object.getPrototypeOf(Test), Super)
        } else {
            assert.equal(Test.className, 'Super')
        }
*/
        assert.equal(Object.getPrototypeOf(Test.prototype), Super.prototype)
        assert.equal(Test.prototype.constructor, Test)
        assert.instanceOf(new Test(), Test)
        assert.instanceOf(new Test(), Super)
        assert.equal(new Test().getClassName(), 'Super')
        Test.className = 'Test'
        assert.equal(new Test().getClassName(), 'Test')
    })
})


describe('class extends proto {}', function(){

    it("extends {}", function(){
        var proto = {
            _name: 'hax',
            getName: function() {
                return this._name
            }
        }
        var Test = Class.extend(proto)()

        assert.isFunction(Test)
        assert.equal(Object.getPrototypeOf(Test), Function.prototype)
        assert.equal(Object.getPrototypeOf(Test.prototype), proto)
        assert.equal(Test.prototype.constructor, Test)
        assert.instanceOf(new Test(), Test)
        assert.equal(new Test().getName(), 'hax')
    })

})

describe('class method override', function(){

    it("method override", function(){
        var A = Class({
            toString: function() { return 'a' }
        })
        var B = Class.extend(A)({
            toString: function() { return 'b' }
        })

        assert.instanceOf(new B(), B)
        assert.instanceOf(new B(), A)
        assert.equal(new A().toString(), 'a')
        assert.equal(new B().toString(), 'b')
    })

})

describe('super call', function(){

    it("super support", function(){
        var A = Class({
            constructor: function(name) {
                this._name = name
            },
            getName: function() {
                return this._name
            },
            toString: function() {
                return this.getName()
            }
        })
        var B = Class.extend(A)({
            constructor: function($super, name, desc) {
                $super(name)
                this._desc = desc
            },
            getDesc: function() {
                return this._desc
            },
            toString: function($super) {
                return $super() + ': ' + this.getDesc()
            }
        })
        var C = Class.extend(B)({
            getName: function($super) {
                return '[' + $super() + ']'
            }
        })

        var b = new B('test', 'Hello world!')
        assert.instanceOf(b, B)
        assert.instanceOf(b, A)
        assert.equal(b.getName(), 'test')
        assert.equal(b.getDesc(), 'Hello world!')
        assert.equal(b.toString(), 'test: Hello world!')

        var c = new C('test', 'Hello world!')
        assert.instanceOf(c, C)
        assert.instanceOf(c, B)
        assert.instanceOf(c, A)
        assert.equal(c.getName(), '[test]')
        assert.equal(c.getDesc(), 'Hello world!')
        assert.equal(c.toString(), '[test]: Hello world!')
    })
})
