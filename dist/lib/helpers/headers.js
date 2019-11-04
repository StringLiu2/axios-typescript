"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * 对普通函数的大小写不敏感规范，变成大写
 * @param headers 需要被转换成首字母大写key的对象
 * @param normalizaName 首字母大写的key
 */
function normalizeHeaderName(headers, normalizaName) {
    if (!headers) { // 当headers不存在的时候，直接不处理
        return;
    }
    // 存在的话 遍历headers对象
    Object.keys(headers).forEach(function (key) {
        // key和normalizaName不相等，并且key全部大写的时候值是相等的话
        if (key !== normalizaName && key.toUpperCase() === normalizaName.toUpperCase()) {
            // 然后把全小写的key对应的值赋值给首字母大写的key为normalizaName的值
            headers[normalizaName] = headers[key];
            // 然后删除掉小写的，变成首字母大写
            delete headers[key];
        }
    });
}
/**
 * 对请求的headers进行处理，设置属性
 * @param headers 需要被处理的headers
 * @param data 判断这个是不是普通对象来设置headers的Content-Type参数
 */
function processHeaders(headers, data) {
    // 先处理一下，转换一下headers的属性的key变成首字母大写
    normalizeHeaderName(headers, 'Content-Type');
    // 判断data是不是普通对象
    if (util_1.isPlainObject(data)) {
        // 并且headers存在，没设置Content-Type
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
exports.processHeaders = processHeaders;
/**
 * 对返回的headers进行处理变成一个对象
 * @param headers 转换成对象的headers
 */
function parseHeaders(headers) {
    // 创建一个空对象
    var parsed = Object.create(null);
    // 当headers不存在的时候，返回空对象
    if (!headers) {
        return parsed;
    }
    // 对headers这个字符串进行换行分割
    headers.split('\r\n').forEach(function (line) {
        // 然后对冒号进行分割
        var _a = line.split(':'), key = _a[0], vals = _a.slice(1); // 例如 Content-Type: application/json
        // 然后把后面所有包含:被切割的值合并一起
        var val = vals.join(':');
        // 然后对key进行去除空格,然后转成小谢
        key = key.trim().toLowerCase();
        // 当key为空的话，跳出本次循环
        if (!key)
            return;
        if (val) { // 判断val有没有，有则就直接去掉空格
            val = val.trim();
        }
        parsed[key] = val; // 然后存入到parsed
    });
    return parsed; // 最后返回这个parsed对象
}
exports.parseHeaders = parseHeaders;
/**
 * 提取headers里面的一些common、post什么的提取出来，按照method来提取
 * @param headers
 * @param method
 */
function flattenHeaders(headers, method) {
    if (!headers)
        return headers;
    // 拷贝common、method对应的请求方式，还有自身
    headers = util_1.deepMerge(headers.common, headers[method], headers);
    // 删除headers里面这些字段
    var methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(function (key) {
        delete headers[key];
    });
    return headers;
}
exports.flattenHeaders = flattenHeaders;
//# sourceMappingURL=headers.js.map