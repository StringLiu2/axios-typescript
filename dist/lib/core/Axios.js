"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchRequest_1 = require("./dispatchRequest");
var interceptorManger_1 = require("./interceptorManger");
var margeConfig_1 = require("./margeConfig");
/**
 * axios类的配置，配置拦截器、defaults、request、get、post、delete等等等。
 * 同时还执行了拦截器
 */
var Axios = /** @class */ (function () {
    function Axios(defaults) {
        this.defaults = defaults;
        // 初始化拦截器
        this.interceptors = {
            request: new interceptorManger_1.default(),
            response: new interceptorManger_1.default(),
        };
    }
    Axios.prototype.request = function (url, config) {
        if (typeof url === 'string') {
            // 当url为字符串的情况下
            if (!config) { // 判断config有没有传，没有则制为空对象
                config = {};
            }
            // 然后对config的url 赋值 url
            config.url = url;
        }
        else {
            // 当url是AxiosRequestConfig的情况下，直接把url赋值给config
            config = url;
        }
        // 先合并一下config
        config = margeConfig_1.default(this.defaults, config); // 合并配置，以用户的配置config有限
        // 转换成小写
        config.method = config.method.toLowerCase();
        // 初始化拦截器链,里面一堆拦截器，初始值
        var chain = [{
                resolved: dispatchRequest_1.default,
                rejected: undefined,
            }];
        // 都是顺序执行传入的use(xxx)的回调函数，第一个就是resolve，第二个就是reject，每次都执行这两个成功/失败的回调，不为空的情况下
        // 循环请求拦截器，放到拦截器链中，在中间的请求拦截器之前
        this.interceptors.request.forEach(function (interceptor) {
            chain.unshift(interceptor); // 因为先添加后执行，所以往前面放,放入的数据就是request的参数
        });
        // 循环响应拦截器，也放入到拦截器链中，在中间的请求拦截器之后
        this.interceptors.response.forEach(function (interceptor) {
            // 先通过ajax请求获取到response，返回的数据，然后提供给后面的响应拦截器使用
            chain.push(interceptor); // 因为先添加先执行，所以往后面放,放入的数据是响应的response
        });
        // 创建一个promise
        // 传入的config就是AxiosReuqestConfig类型的对象，当这个promise链的默认类型，后面就是每次拦截成功或者失败的类型当下一个参数
        var promise = Promise.resolve(config);
        // while循环拿出每个元素
        while (chain.length) {
            var _a = chain.shift(), resolved = _a.resolved, rejected = _a.rejected; // 然后类型断言不为空
            // 每次循环都会执行下一个拦截器，每次都是执行下一个拦截器
            promise = promise.then(rejected, resolved);
        }
        // 最后返回的就是一个promise继续执行then那些
        return promise;
    };
    Axios.prototype.get = function (url, config) {
        // 合并config和rul
        return this.request(this._requestMethodWithoutData(url, 'get', config));
    };
    Axios.prototype.delete = function (url, config) {
        return this.request(this._requestMethodWithoutData(url, 'delete', config));
    };
    Axios.prototype.head = function (url, config) {
        return this.request(this._requestMethodWithoutData(url, 'head', config));
    };
    Axios.prototype.options = function (url, config) {
        return this.request(this._requestMethodWithoutData(url, 'options', config));
    };
    // 合并config、url和method的方法
    Axios.prototype._requestMethodWithoutData = function (url, method, config) {
        return Object.assign(config || {}, {
            url: url,
            method: method,
        });
    };
    Axios.prototype.post = function (url, data, config) {
        return this.request(this._requestMethodWithData(url, 'post', data, config));
    };
    Axios.prototype.put = function (url, data, config) {
        return this.request(this._requestMethodWithData(url, 'put', data, config));
    };
    Axios.prototype.patch = function (url, data, config) {
        return this.request(this._requestMethodWithData(url, 'patch', data, config));
    };
    // 合并config、data、url和method的方法
    Axios.prototype._requestMethodWithData = function (url, method, data, config) {
        return Object.assign(config || {}, {
            url: url,
            method: method,
        });
    };
    Axios.prototype.getUri = function (config) {
        // 先合并一下config
        config = margeConfig_1.default(this.defaults, config);
        // 最后转换一个url，然后返回出去
        return dispatchRequest_1.transformURL(config);
    };
    return Axios;
}());
exports.default = Axios;
//# sourceMappingURL=Axios.js.map