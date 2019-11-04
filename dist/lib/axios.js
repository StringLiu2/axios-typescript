"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Axios_1 = require("./core/Axios");
var util_1 = require("./helpers/util");
var defaults_1 = require("./defaults"); // 默认传入这个defaults
var margeConfig_1 = require("./core/margeConfig");
var CancelToken_1 = require("./cancel/CancelToken");
var Cancel_1 = require("./cancel/Cancel");
/**
 * 工厂函数，创建实例
 * @param config axios默认的配置
 */
function createInstance(config) {
    var context = new Axios_1.default(config); // 默认的defaults配置的config
    // instance指向了request方法，为了保证this指向，绑定context
    var instance = Axios_1.default.prototype.request.bind(context);
    // 然后拷贝context上面的所有方法属性到instance，并且返回结果导出
    util_1.extend(instance, context);
    return instance;
}
/**
 * axios对象，内置各种请求方法等
 */
var axios = createInstance(defaults_1.default);
// 扩展方法,创建新的axios实例
axios.create = function create(config) {
    config = margeConfig_1.default(defaults_1.default, config); // 合并config然后传递给createInstance
    return createInstance(config);
};
// 扩展取消请求的方法
axios.CancelToken = CancelToken_1.default;
axios.Cancel = Cancel_1.default;
axios.isCancel = Cancel_1.isCancel;
axios.all = function all(promises) {
    return Promise.all(promises);
};
// 一个高阶函数,把数组展开成多个参数
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
};
axios.Axios = Axios_1.default;
exports.default = axios;
//# sourceMappingURL=axios.js.map