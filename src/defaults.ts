import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helpers/headers";
import { transformRequest, transformResponse } from "./helpers/data";
/**
 * 配置默认的一些请求参数等，比如给post请求添加什么，添加请求头等
 */
const defaults: AxiosRequestConfig = {
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
        function (data: any, headers: any): any {
            // 对请求的headers进行处理，设置属性
            processHeaders(headers, data);
            // 请求的data进行转换，对普通对象data进行转换成json字符串，然后返回新的data
            return transformRequest(data);
        }
    ],
    transformResponse: [
        // 响应的data进行转换,对返回的json字符串转换成json对象，其它情况下不处理
        function (data: any) {
            return transformResponse(data);
        }
    ],
    // 默认值
    xsrfCookieName: 'XSRF-TOKEN',
    xsrHeaderName: 'X-XSRF-TOKEN',
    // 默认合法状态码
    validateStatus(status: number): boolean {
         // 状态码等于这个得情况下，直接返回
         return status >= 200 && status < 300;
    }
}
// 当是这四种类型
const methodsNoData: string[] = ['delete', 'head', 'get', 'options'];
methodsNoData.forEach((method: string) => {
    defaults.headers[method] = {}; // headers添加这么多空对象
});
// 当是如下三种类型
const methodsWithData: string[] = ['post', 'put', 'patch'];
methodsWithData.forEach((method: string) => {
    defaults.headers[method] = { // headers添加这么多空对象
        // 默认带了content-type
        'Content-Type': 'application/x-www-form-urlencoded'
    };
});

export default defaults;