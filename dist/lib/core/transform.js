"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 对headers和data进行补充和转换，添加等操作的方法
 * @param data data数据
 * @param headers 请求头
 * @param fns 转换的方法数组或者方法
 */
function transform(data, headers, fns) {
    // 当fns不存在的话，直接返回
    if (!fns)
        return data;
    // 判断fns是不是数组
    if (!Array.isArray(fns)) {
        fns = [fns]; // 转换成数组
    }
    // 循环执行函数，获取data一直遍历到最后的data
    fns.forEach(function (fn) {
        data = fn(data, headers);
    });
    return data;
}
exports.default = transform;
//# sourceMappingURL=transform.js.map