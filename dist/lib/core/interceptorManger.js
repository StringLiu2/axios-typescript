"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 拦截器管理类
 */
var InterceptorManger = /** @class */ (function () {
    function InterceptorManger() {
        this.interceptors = [];
    }
    InterceptorManger.prototype.use = function (resolved, rejected) {
        // 添加拦截器
        this.interceptors.push({
            resolved: resolved,
            rejected: rejected
        });
        return this.interceptors.length - 1; // 长度就是id
    };
    InterceptorManger.prototype.eject = function (id) {
        if (this.interceptors[id]) { // 当这个拦截器存在，则把对应的位置的拦截器制为空
            this.interceptors[id] = null;
        }
    };
    // 循环执行拦截器
    InterceptorManger.prototype.forEach = function (fn) {
        this.interceptors.forEach(function (interceptor) {
            // 当拦截器不为null就直接运行
            if (interceptor !== null) {
                fn(interceptor);
            }
        });
    };
    return InterceptorManger;
}());
exports.default = InterceptorManger;
//# sourceMappingURL=interceptorManger.js.map