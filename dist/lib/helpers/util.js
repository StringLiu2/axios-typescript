"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toString = Object.prototype.toString; // 对象上面的toString方法
/**
 * 判断是不是应该date类型,返回类型保护
 * @param val 需要被判断的值
 */
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
exports.isDate = isDate;
/**
 * 判断是不是对象
 * @param val 需要被判断的值
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}
exports.isObject = isObject;
/**
 * 判断是不是普通对象
 * @param val val就是需要判断的那个
 */
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
/**
 * 把Axios对象的属性拷贝到extend中的函数
 * @param to 合并到的那个
 * @param from 需要被合并的
 */
function extend(to, from) {
    // 循环拷贝属性，方法
    for (var key in from) {
        to[key] = from[key];
    }
    return to;
}
exports.extend = extend;
/**
 * 对普通对象进行深拷贝
 */
function deepMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var result = Object.create(null); // 创建一个空对象
    objs.forEach(function (obj) {
        if (obj) { // 获得每个对象不能为空，然后对每个对象的key进行获取处理判断是不是普通值
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                if (isPlainObject(val)) { // 如果还是对象，继续递归
                    if (isPlainObject(result[key])) { // 如果result里面存在的话，把result[key], val都拷贝到result[key]中
                        result[key] = deepMerge(result[key], val);
                    }
                    else {
                        result[key] = deepMerge(val);
                    }
                }
                else { // 普通值就直接赋值
                    result[key] = val;
                }
            });
        }
    });
    return result; // 最后返回result
}
exports.deepMerge = deepMerge;
/**
 * 扩展方法，判断是不是formData
 */
function isFormData(val) {
    // 是不是为空并且，是不是FormData的实例
    return typeof val !== 'undefined' && val instanceof FormData;
}
exports.isFormData = isFormData;
/**
 * 判断是不是URLSearchParams类型的参数
 * @param val 接收一个params参数
 */
function isURLSearchParams(val) {
    return typeof val !== 'undefined' && val instanceof URLSearchParams;
}
exports.isURLSearchParams = isURLSearchParams;
//# sourceMappingURL=util.js.map