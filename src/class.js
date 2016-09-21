/**
 * Created by Administrator on 2016/9/18.
 */

var Create = Object.create,
    GetPrototypeOf = Object.getPrototypeOf,
    DefineProperty = Object.DefineProperty,
    DefineProperties = Object.defineProperties,
    GetOwnPropertyNames = Object.getOwnPropertyNames,
    GetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    ToString = Object.toString;

//create a class
function Class(proto){
    return CreateClass(proto);
}

function CreateClass(proto, superProto, superCtr){
    proto = proto || {};

    var names = GetOwnPropertyNames(proto), props = {};
    for (var i = 0, j = names.length; i < j; i++){
        var propDesc = GetOwnPropertyDescriptor( proto, names[i] );
        if('value' in propDesc){
            if( typeof propDesc['value'] === 'function'){
                propDesc['value'] = createMethod(names[i], propDesc['value'], superProto);
            } else {
                throw new TypeError('[' + names[i] + '] is not a function')
            }
        }
        props[names[i]] = propDesc;
    }

    var constructor = props.hasOwnProperty('constructor') && props["constructor"]['value'];
    if( constructor ){ //
        if( typeof constructor !== "function"){
            throw new TypeError('constructor should be an funciton');
        }
    } else {
        constructor = function(){
            superProto && superProto["constructor"].apply(this, arguments);
        }
    }

    //有继承
    if(arguments.length>1){
        constructor.prototype = Create(superProto);
    }

    DefineProperties(constructor.prototype, props);

    constructor.prototype.constructor = constructor;

    if(superCtr){
        constructor.__proto__ = superCtr;
    }

    return constructor;
}

//support call super class method
function createMethod(name, func, superProto){
    var re_super = /\((.*?)\)/;
    var str_func = ToString.call(func);
    if(str_func.match(re_super)[1].indexOf("$super") >-1){ // to call super
        return  function(){
            var Super = CreateSuper(name, superProto, this);
            var args = [].slice.call(arguments);
            args.unshift(Super);
            return func.apply(this, args);
        }
    }
    return func;
}

//create a Super
function CreateSuper(name,proto, ctx){
    var Super = function(){}
    Super.prototype = Create(proto);

    var func  =  new Super()[name];
    return func.bind(ctx);
}

//extend a class
Class.extend = function( Super ){
    var _stype = typeof Super;
    var superProto, superCtr;

    if(_stype === "function"){
        superProto = Super && Super.prototype;
        superCtr = Super;
    } else if( _stype === "object"){
        superProto = Super;
        superCtr = null;
    }

    return function(proto){
        return CreateClass(proto, superProto, superCtr);
    }
}