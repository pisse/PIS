/**
 * Created by Administrator on 2016/9/22.
 */

function isFunction(arg) {
    return typeof arg === 'function';
}

function isConstructor(argument) {
    return typeof argument === 'function'
}
function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

exports.isFunction = isFunction;
exports.isConstructor = isConstructor;
exports.isObject = isObject;