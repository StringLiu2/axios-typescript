"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cancel = /** @class */ (function () {
    // 直接构造函数赋值
    function Cancel(message) {
        this.message = message;
    }
    return Cancel;
}());
exports.default = Cancel;
/**
 * 判断val是不是一个Cancel的实例
 * @param val 判断这个属性
 */
function isCancel(val) {
    return val instanceof Cancel;
}
exports.isCancel = isCancel;
//# sourceMappingURL=Cancel.js.map