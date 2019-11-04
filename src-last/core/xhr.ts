import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { parseHeaders } from '../helpers/headers';
import { createError } from "../helpers/error";
import { isURLSameOrigin } from '../helpers/url';
import cookie from '../helpers/cookie';
import { isFormData } from '../helpers/util';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { 
      url,
      method, 
      data = null, 
      headers = {},
      responseType, 
      timeout, 
      cancelToken, 
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadprogress,
      onUploadProgress,
      auth,
      validateStatus
    } = config;

    // 创建对象
    const request = new XMLHttpRequest();

    // 初始化
    request.open(method!.toLocaleUpperCase(), url!, true);

    configureRequest()// 添加配置

    addEvents()// 添加事件

    processHeaders()// 处理头部

    processCancel()// 请求取消

    // 发送请求
    request.send(data);
    // 添加配置
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType;
      }
  
      if (timeout) {
        request.timeout = timeout;
      }

      if (withCredentials) {
        request.withCredentials = withCredentials;
      }
    }
    // 添加事件
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
  
        if (request.status === 0) {
          return
        }
  
        const responseHeaders = parseHeaders(request.getAllResponseHeaders());
        const responseData = responseType !== 'text' ? request.response : request.responseText;
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response);
      }
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request));
      }

      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request));
      }

      if (onDownloadprogress) {
        request.onprogress = onDownloadprogress;
      }
  
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress;
      }
    }
    // 处理头部
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type'];
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName ) {
        const xsrfValue = cookie.read(xsrfCookieName);
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue;
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic '+ btoa(auth.username + ':' + auth.password);
      } 

      Object.keys(headers).forEach((name) => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name];
        } else {
          request.setRequestHeader(name, headers[name]);
        }
      })
    }
    // 请求取消
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort();
          reject(reason)
        }).catch(
          /* istanbul ignore next */ 
          () => {
          // doNoting
        })
      }
    }

    // 处理返回结果
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
      }
    }
  })
}
