"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xhr_1 = require("./xhr");
var url_1 = require("../helpers/url");
// import { transformRequest, transformResponse } from "../helpers/data";
var headers_1 = require("../helpers/headers");
var transform_1 = require("./transform");
/**
 * 请求处理并返回一个promise对象
 * @param config 请求参数配置
 */
function dispatchRequest(config) {
    throwIfCancellationRequest(config); // 先判断使用过没Cancel
    processConfig(config); // 先处理config
    // 返回ajax返回的数据
    return xhr_1.default(config).then(function (res) {
        // 对res的data进行处理，然后返回结果
        res.data = transformResponseData(res);
        return res;
    }, function (err) {
        if (err && err.response) {
            err.response = transformResponseData(err.response);
        }
        return Promise.reject(err);
    });
}
exports.default = dispatchRequest;
/**
 * 对config进行处理
 * @param config 需要被处理的config
 */
function processConfig(config) {
    config.url = transformURL(config); // 对url进行处理
    // config.headers = transFormHeaders(config); // 对headers的content-type进行处理,要先在data转换成普通对象前处理
    config.data = transform_1.default(config.data, config.headers, config.transformRequest); // 对data进行处理，普通对象等
    config.headers = headers_1.flattenHeaders(config.headers, config.method); // 对headers的content-type进行处理,要先在data转换成普通对象前处理,最后对headers里面默认传入的defaults进行合并
}
/**
 * 对url做转换
 * @param config 需要被处理的config对象
 */
function transformURL(_a) {
    var url = _a.url, params = _a.params, paramsSerializer = _a.paramsSerializer, baseURL = _a.baseURL;
    // 判断baseURL有没有 并且url不是绝对地址url
    if (baseURL && !url_1.isAbsoluteURL(url)) {
        url = url_1.combineURL(baseURL, url);
    }
    return url_1.buildURL(url, params, paramsSerializer);
}
exports.transformURL = transformURL;
// /**
//  * 对data进行处理
//  * @param config 需要被处理的config对象 
//  */
// function transformRequestData({ data }: AxiosRequestConfig): any {
//     return transformRequest(data);
// }
// /**
//  * 对headers进行处理  , 默认headers为空
//  * @param config 需要被处理的config对象 
//  */
// function transFormHeaders({ headers = {}, data }: AxiosRequestConfig) {
//     return processHeaders(headers, data);
// }
/**
 * 对响应的response进行处理
 * @param res 响应的response对象
 */
function transformResponseData(_a) {
    var data = _a.data, headers = _a.headers, transformResponse = _a.config.transformResponse;
    return transform_1.default(data, headers, transformResponse);
}
/**
 * 判断是不是Cancel使用过，使用过直接抛出异常
 */
function throwIfCancellationRequest(config) {
    // 判断有没有使用过 
    if (config.cancelToken)
        config.cancelToken.throwIfRequested();
}
//# sourceMappingURL=dispatchRequest.js.map