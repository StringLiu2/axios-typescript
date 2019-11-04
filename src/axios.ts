import { AxiosRequestConfig, AxiosStatic } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import defaults from "./defaults"; // 默认传入这个defaults
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/CancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";

/**
 * 工厂函数，创建实例
 * @param config axios默认的配置
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config); // 默认的defaults配置的config
    // instance指向了request方法，为了保证this指向，绑定context
    const instance = Axios.prototype.request.bind(context);
    // 然后拷贝context上面的所有方法属性到instance，并且返回结果导出
    extend(instance, context);
    return instance as AxiosStatic;
}
/**
 * axios对象，内置各种请求方法等
 */
const axios = createInstance(defaults);
// 扩展方法,创建新的axios实例
axios.create = function create(config?) {
    config = mergeConfig(defaults, config);// 合并config然后传递给createInstance
    return createInstance(config);
};
// 扩展取消请求的方法
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

axios.all = function all(promises) {
    return Promise.all(promises);
}
// 一个高阶函数,把数组展开成多个参数
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    }
}
axios.Axios = Axios;

export default axios;
