# Welcome to PIS's tool garden.
Here is my implement of some frontend wheel mentioned in [前端开发中有什么经典的轮子值得自己去实现一遍](https://www.zhihu.com/question/29380608)

------

## Class
Another JavaScript Class factory —compared to [Prototype](http://prototypejs.org/learn/class-inheritance),
                                              [MooTools](http://mootools.net/docs/core/Class/Class) or
                                              [Base2](http://base2.googlecode.com/svn/version/1.0.2/doc/base2.html#/doc/!base2.Base).
### Example ###
```js
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

```