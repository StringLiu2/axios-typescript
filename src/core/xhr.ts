import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Cancel } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createError } from "../helpers/error";
import { isURLSameOrigin } from "../helpers/url";
import cookie from "../helpers/cookie";
import { isFormData } from "../helpers/util";
/**
 * ajax处理发送请求然后返回promise对象
 * @param config 配置的选项参数，用于发送请求
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        // 利用原生ajax发送
        const {
            url,
            data,
            method,
            headers = {},
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfHeaderName,
            xsrfCookieName,
            onDownloadProgress,
            onUploadProgress,
            auth,
            validateStatus,
        } = config;

        const request = new XMLHttpRequest();

        // 设置请求头 url 是否是异步
        request.open(method!.toLocaleUpperCase(), url!, true);

        comfigureRequest(); // 添加配置

        addEvents(); // 添加事件

        processHeaders(); // 处理头部

        processCancel(); // 请求取消
        // 最后发送请求
        request.send(data);

        /**
         * 配置请求
         */
        function comfigureRequest(): void {
            if (responseType) { // 看看设置了responseType没有，设置了就赋值
                request.responseType = responseType;
            }
            // 请求超时配置，默认为0,永不超时
            if (timeout) {
                request.timeout = timeout;
            }

            // 判断withCredentials是否设置了没，所以要不要带cookies
            if (withCredentials) {
                request.withCredentials = withCredentials; // 然后设置ajax的请求,这时候跨域请求就会携带cookies
            }
        }
        /**
         * request事件处理函数
         */
        function addEvents(): void {
            // 请求完成处理
            request.onreadystatechange = function handleLoad() {
                // 状态不是4的情况下，处理
                if (request.readyState !== 4) {
                    return;
                }
                // 网络错误，超时错误
                if (request.status === 0) {
                    return;
                }

                // 获取响应的头信息，然后对这个头信息字符串进行处理分割成对象
                const responseHeaders = parseHeaders(request.getAllResponseHeaders());
                // 获取响应数据,当responseType不是text的情况下，直接获取request.response的数值，否则就是request.responseText的值
                const responseData = (responseType && responseType !== 'text') ? request.response : request.responseText;
                // 设置返回的数据类型
                const response: AxiosResponse = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                }
                // 然后返回这个axios的响应,同时处理了一下response
                handleResponse(response);
            }
            // 请求错误的事件
            request.onerror = function handleError() {
                reject(createError('Network Error', config, null, request)); // 网络错误处理，信息网络错误处理
            }
            // 处理超时
            request.ontimeout = function handleTimeout() {
                // ECONNABORTED网络被终止
                reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request));
            }
            // 配置如果文件情况下的下载和上传进度
            if (onDownloadProgress) {
                // 执行事件函数
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        /**
         * 对请求headers进行处理的函数
         */
        function processHeaders(): void {

            // 判断是不是form表单数据
            if (isFormData(data)) {
                delete headers['Content-Type'];
            }

            // 设置cookie header 当是同源请求或者设置了withCredentials的情况下，并且xsrfCookieName有值
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                // 然后再读取cookie
                const xsrfValue = cookie.read(xsrfCookieName);
                // 判断这个值有没有，xsrfHeaderName有没有设置，有的话设置到headers上面
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            // 设置Authorization安全认证
            if (auth) {
                // 当设置了auth之后，给Authorization属性设置 Basic+base64的内容
                headers['Authorization'] = 'Basic ' + btoa(`${auth.username}:${auth.password}`);
            }
            // 循环遍历放入ajax请求的header
            Object.keys(headers).forEach((key: string) => {
                // 当data为空，并且设置了content-type的header这个请求头的情况下，删掉
                if (data === null && key.toLowerCase() === 'content-type') {
                    delete headers[key];
                } else {
                    // 如果不是 则设置请求头
                    request.setRequestHeader(key, headers[key]);
                }
            });
        }
        /**
         * 对取消请求的处理
         */
        function processCancel(): void {
            // 判断cancelToken存在不
            if (cancelToken) {
                // 执行promise,等到外部调用CancelToken类的时候，this.promise也就会有值，这时候就执行了下面的then
                cancelToken
                    // promise实现异步分离
                    .promise
                    .then((reason: Cancel) => {
                        request.abort(); // 取消请求
                        reject(reason); // 然后把传入的reason这个Cancel实例返回出去
                    }).catch(
                        /* istanbul ignore next */
                        () => {
                            // doNoting
                        });
            }
        }
        /**
         * 处理响应的函数
         * @param response 处理response
         */
        function handleResponse(response: AxiosResponse): void {
            // 没有 或者返回为true的情况下，就是合法状态值
            if (!validateStatus || validateStatus(response.status)) {
                // 状态码等于这个得情况下，直接返回
                resolve(response);
            } else {
                // 否则就是300-500之间的错误
                reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }
    });

}
