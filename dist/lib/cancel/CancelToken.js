"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cancel_1 = require("./Cancel");
/**
 * 取消token的类
 */
var CancelToken = /** @class */ (function () {
    // 当外部实例化这个CancelToken的时候并传入executor，然后就会调用方法,executor，这个方法获取到一个为参数，然后执行这个方法即可
    function CancelToken(executor) {
        var _this = this;
        // 临时变量
        var resolvePromise;
        // 实例化promise 这时候就执行了Promise，自动给resolvePromise赋值resolve方法
        // 同时把结果返回给了this.promise
        this.promise = new Promise(function (resolve) {
            // 指向，然后调用resolvePromise的时候就是调用promise的resolve
            resolvePromise = resolve;
        });
        // 调用执行者方法，传入一个回调函数，获取这个返回的方法，执行后，this.promise就会拥有this.reason这个Cancel对象
        executor(function (message) {
            // 防止多次调用,当这个有值得时候别重复调用
            if (_this.reason) {
                return;
            }
            _this.reason = new Cancel_1.default(message); // 先赋值一个reasonCancel对象的实例
            // 然后执行promise的resolve
            resolvePromise(_this.reason);
        });
    }
    /**
     * source静态方法，返回结果是CancelTokenSource类型,
     * 一个工厂方法
     */
    CancelToken.source = function () {
        // 定义一个cancel变量,cancel不为空
        var cancel;
        // 实例化一个cancelToken,传入的回调函数的c方法就是cancel方法
        var token = new CancelToken(function (c) {
            cancel = c; // 然后把这个c函数赋值给cancel
        });
        return {
            token: token,
            cancel: cancel
        };
    };
    /**
     * 如果再次使用Cancel（就是已经取消过）抛出异常的方法
     */
    CancelToken.prototype.throwIfRequested = function () {
        // 当this.reason方法不为空的情况下就是执行了executor方法，这时候就不能执行了
        if (this.reason) {
            throw this.reason;
        }
    };
    return CancelToken;
}());
exports.default = CancelToken;
//# sourceMappingURL=CancelToken.js.map