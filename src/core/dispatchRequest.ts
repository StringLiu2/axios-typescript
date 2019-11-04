import { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from "../types";
import xhr from "./xhr";
import { buildURL, isAbsoluteURL, combineURL } from "../helpers/url";
// import { transformRequest, transformResponse } from "../helpers/data";
import { flattenHeaders } from "../helpers/headers";
import transform from "./transform";
/**
 * 请求处理并返回一个promise对象
 * @param config 请求参数配置
 */
export default function dispatchRequest<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    throwIfCancellationRequest(config); // 先判断使用过没Cancel
    processConfig(config); // 先处理config
    // 返回ajax返回的数据
    return xhr(config).then((res) => {
        // 对res的data进行处理，然后返回结果
        res.data = transformResponseData(res);
        return res;
    }, (err: AxiosError) => {
        if (err && err.response) {
            err.response.data = transformResponseData(err.response);
        }
        return Promise.reject(err);
    });
}
/**
 * 对config进行处理
 * @param config 需要被处理的config
 */
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config); // 对url进行处理
    // config.headers = transFormHeaders(config); // 对headers的content-type进行处理,要先在data转换成普通对象前处理
    config.data = transform(config.data, config.headers, config.transformRequest); // 对data进行处理，普通对象等
    config.headers = flattenHeaders(config.headers, config.method!); // 对headers的content-type进行处理,要先在data转换成普通对象前处理,最后对headers里面默认传入的defaults进行合并
}
/**
 * 对url做转换
 * @param config 需要被处理的config对象
 */
export function transformURL({ url, params, paramsSerializer, baseURL }: AxiosRequestConfig): string {
    // 判断baseURL有没有 并且url不是绝对地址url
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url!, params, paramsSerializer);
}
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
function transformResponseData({ data, headers, config: { transformResponse } }: AxiosResponse): any {
    return transform(data, headers, transformResponse);
}
/**
 * 判断是不是Cancel使用过，使用过直接抛出异常
 */
function throwIfCancellationRequest(config: AxiosRequestConfig): void {
    // 判断有没有使用过 
    if (config.cancelToken) config.cancelToken.throwIfRequested();
}