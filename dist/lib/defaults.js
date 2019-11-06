"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("./helpers/headers");
var data_1 = require("./helpers/data");
/**
 * 配置默认的一些请求参数等，比如给post请求添加什么，添加请求头等
 */
var defaults = {
    method: 'get',
    timeout: 0,
    headers: {
        // 默认给所有请求添加的请求头内容
        common: {
            Accept: 'application/json, text/plain, /*/*',
        }
    },
    // 默认的transformRequest、transformResponse
    transformRequest: [
        function (data, headers) {
            // 对请求的headers进行处理，设置属性
            headers_1.processHeaders(headers, data);
            // 请求的data进行转换，对普通对象data进行转换成json字符串，然后返回新的data
            return data_1.transformRequest(data);
        }
    ],
    transformResponse: [
        // 响应的data进行转换,对返回的json字符串转换成json对象，其它情况下不处理
        function (data) {
            return data_1.transformResponse(data);
        }
    ],
    // 默认值
    xsrfCookieName: 'XSRF-TOKEN',
    xsrHeaderName: 'X-XSRF-TOKEN',
    // 默认合法状态码
    validateStatus: function (status) {
        // 状态码等于这个得情况下，直接返回
        return status >= 200 && status < 300;
    }
};
// 当是这四种类型
var methodsNoData = ['delete', 'head', 'get', 'options'];
methodsNoData.forEach(function (method) {
    defaults.headers[method] = {}; // headers添加这么多空对象
});
// 当是如下三种类型
var methodsWithData = ['post', 'put', 'patch'];
methodsWithData.forEach(function (method) {
    defaults.headers[method] = {
        // 默认带了content-type
        'Content-Type': 'application/x-www-form-urlencoded'
    };
});
exports.default = defaults;
//# sourceMappingURL=defaults.js.map