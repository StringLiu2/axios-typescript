var toString = Object.prototype.toString; // 对象上面的toString方法
/**
 * 判断是不是应该date类型,返回类型保护
 * @param val 需要被判断的值
 */
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
/**
 * 判断是不是对象
 * @param val 需要被判断的值
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}
/**
 * 判断是不是普通对象
 * @param val val就是需要判断的那个
 */
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
/**
 * 把Axios对象的属性拷贝到extend中的函数
 * @param to 合并到的那个
 * @param from 需要被合并的
 */
function extend(to, from) {
    // 循环拷贝属性，方法
    for (var key in from) {
        to[key] = from[key];
    }
    return to;
}
/**
 * 对普通对象进行深拷贝
 */
function deepMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var result = Object.create(null); // 创建一个空对象
    objs.forEach(function (obj) {
        if (obj) { // 获得每个对象不能为空，然后对每个对象的key进行获取处理判断是不是普通值
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                if (isPlainObject(val)) { // 如果还是对象，继续递归
                    if (isPlainObject(result[key])) { // 如果result里面存在的话，把result[key], val都拷贝到result[key]中
                        result[key] = deepMerge(result[key], val);
                    }
                    else {
                        result[key] = deepMerge(val);
                    }
                }
                else { // 普通值就直接赋值
                    result[key] = val;
                }
            });
        }
    });
    return result; // 最后返回result
}
/**
 * 扩展方法，判断是不是formData
 */
function isFormData(val) {
    // 是不是为空并且，是不是FormData的实例
    return typeof val !== 'undefined' && val instanceof FormData;
}
/**
 * 判断是不是URLSearchParams类型的参数
 * @param val 接收一个params参数
 */
function isURLSearchParams(val) {
    return typeof val !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * 对普通函数的大小写不敏感规范，变成大写
 * @param headers 需要被转换成首字母大写key的对象
 * @param normalizaName 首字母大写的key
 */
function normalizeHeaderName(headers, normalizaName) {
    if (!headers) { // 当headers不存在的时候，直接不处理
        return;
    }
    // 存在的话 遍历headers对象
    Object.keys(headers).forEach(function (key) {
        // key和normalizaName不相等，并且key全部大写的时候值是相等的话
        if (key !== normalizaName && key.toUpperCase() === normalizaName.toUpperCase()) {
            // 然后把全小写的key对应的值赋值给首字母大写的key为normalizaName的值
            headers[normalizaName] = headers[key];
            // 然后删除掉小写的，变成首字母大写
            delete headers[key];
        }
    });
}
/**
 * 对请求的headers进行处理，设置属性
 * @param headers 需要被处理的headers
 * @param data 判断这个是不是普通对象来设置headers的Content-Type参数
 */
function processHeaders(headers, data) {
    // 先处理一下，转换一下headers的属性的key变成首字母大写
    normalizeHeaderName(headers, 'Content-Type');
    // 判断data是不是普通对象
    if (isPlainObject(data)) {
        // 并且headers存在，没设置Content-Type
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
/**
 * 对返回的headers进行处理变成一个对象
 * @param headers 转换成对象的headers
 */
function parseHeaders(headers) {
    // 创建一个空对象
    var parsed = Object.create(null);
    // 当headers不存在的时候，返回空对象
    if (!headers) {
        return parsed;
    }
    // 对headers这个字符串进行换行分割
    headers.split('\r\n').forEach(function (line) {
        // 然后对冒号进行分割
        var _a = line.split(':'), key = _a[0], vals = _a.slice(1); // 例如 Content-Type: application/json
        // 然后把后面所有包含:被切割的值合并一起
        var val = vals.join(':');
        // 然后对key进行去除空格,然后转成小谢
        key = key.trim().toLowerCase();
        // 当key为空的话，跳出本次循环
        if (!key)
            return;
        if (val) { // 判断val有没有，有则就直接去掉空格
            val = val.trim();
        }
        parsed[key] = val; // 然后存入到parsed
    });
    return parsed; // 最后返回这个parsed对象
}
/**
 * 提取headers里面的一些common、post什么的提取出来，按照method来提取
 * @param headers
 * @param method
 */
function flattenHeaders(headers, method) {
    if (!headers)
        return headers;
    // 拷贝common、method对应的请求方式，还有自身
    headers = deepMerge(headers.common, headers[method], headers);
    // 删除headers里面这些字段
    var methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(function (key) {
        delete headers[key];
    });
    return headers;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * 继承错误对象，实现更佳详细的对象，有config,code,request，response属性，除了config非必选
 */
var AxiosError = /** @class */ (function (_super) {
    __extends(AxiosError, _super);
    // 添加一个注释,让测试忽略构造函数
    /* istanbul ignore next */
    function AxiosError(message, config, code, request, response) {
        var _this = _super.call(this, message) || this;
        _this.config = config;
        _this.code = code;
        _this.request = request;
        _this.response = response;
        _this.isAxiosError = true;
        // 解决typescript的坑，继承内置对象出现问题，所以要清除坑
        Object.setPrototypeOf(_this, AxiosError.prototype);
        return _this;
    }
    return AxiosError;
}(Error));
/**
 * 工厂模式，然后返回这个对象
 * @param message 错误信息
 * @param config 错误的那个传入request的配置对象
 * @param code 错误状态字符串(可选)
 * @param request 请求对象(可选)
 * @param response 响应对象(可选)
 */
function createError(message, config, code, request, response) {
    return new AxiosError(message, config, code, request, response);
}

/**
 * 把字符串转换成encode，然后把@:$,+[]转换回去
 * @param val 转换成encode编码的字符串
 */
function encode(val) {
    return encodeURIComponent(val)
        // 把特殊字符转换回去
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/ig, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/ig, '[')
        .replace(/%5D/ig, ']'); // i就是标识大小写区分，g就是全局查找
}
/**
 * 对url进行处理，空指针忽略，空格转换成+，丢弃#这个哈希标记以及后面部分的字符串
 * @param url 需要处理的url
 * @param params 弄到url上面的参数对象
 * @param paramsSerializer 序列化params的方法
 */
function buildURL(url, params, paramsSerializer) {
    if (!params)
        return url;
    var serializedParams; // 存储序列化后的params字符串
    // 判断用户有没有定义这个函数序列化规则，没有则我们处理，有他们来处理
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    }
    else if (isURLSearchParams(params)) { // 判断params是不是URLSearchParans
        serializedParams = params.toString();
    }
    else {
        var parts_1 = []; // 用来保存params
        // 对params进行获取key，然后循环获取到值
        Object.keys(params).forEach(function (key) {
            var val = params[key];
            // 判断值是什么类型的，做下一步操作
            if (val === null || typeof val === 'undefined') {
                return; // 跳出本次循环
            }
            // 临时数组，判断是不是数组
            var values = [];
            // 是数组的情况下，key改变
            if (Array.isArray(val)) {
                values = val;
                key += '[]';
                // 不是数组的情况下，变成数组
            }
            else {
                values = [val];
            }
            // 遍历values
            values.forEach(function (val) {
                // 当value时Date的情况下
                if (isDate(val)) {
                    val = val.toISOString();
                }
                else if (isObject(val)) {
                    val = JSON.stringify(val); // 对象的话转换成字符串
                }
                parts_1.push(encode(key) + "=" + encode(val));
            });
        });
        // 拼接query参数
        serializedParams = parts_1.join('&');
    }
    // 判断parts有没有
    if (serializedParams) {
        // 然后判断url里面有没有哈希的#，有就去掉
        var markIndex = url.indexOf('#');
        // 去掉#
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        // 最后判断一下有没有?,如果没有?则表示url已经有参数了，有?则表示还没拼接
        url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
    }
    // 最后把拼接完毕的url返回出去
    return url;
}
/**
 * 同源的url，
 * 利用dom对象的a标签，设置url的属性，解析出端口和协议，然后请求url和当前页面url比较
 */
function isURLSameOrigin(requestURL) {
    // 获取请求的url和接口
    var parsedOrgin = resolveURL(requestURL);
    // 判断本地的和发送请求的协议和端口
    return (parsedOrgin.protocol === currentOrigin.protocol) && (parsedOrgin.host === currentOrigin.host);
}
// 创建一个a标签dom节点
var urlParsingNode = document.createElement('a');
// 解析当前页面的href，防止跨域攻击
var currentOrigin = resolveURL(window.location.href);
/**
 * 辅助函数，用来发送请求的时候获取协议和端口
 */
function resolveURL(url) {
    // 设置一下href
    urlParsingNode.setAttribute('href', url);
    var protocol = urlParsingNode.protocol, host = urlParsingNode.host; // 解构赋值获取protocol(协议)，host(端口)
    return {
        protocol: protocol,
        host: host
    };
}
/**
 * 判断是不是请求xxx.xxx.xx开头的，返回true就是绝对地址
 */
function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url); // 忽略大小写
}
/**
 * 拼接baseURL + url 成一个新的url
 * @param baseURL 默认的baseURL
 * @param relativeURL 拼接的url
 */
function combineURL(baseURL, relativeURL) {
    // 清理斜线
    return relativeURL ? baseURL.replace(/\/+$/, '') + "/" + relativeURL.replace(/^\/+/, '') : baseURL;
}

var cookie = {
    read: function (name) {
        // 获取cookie，并且通过match和正则匹配
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        // 然后读取第三个括号的内容，就是cookie的值
        return match ? decodeURIComponent(match[3]) : null;
    },
};

/**
 * ajax处理发送请求然后返回promise对象
 * @param config 配置的选项参数，用于发送请求
 */
function xhr(config) {
    return new Promise(function (resolve, reject) {
        // 利用原生ajax发送
        var url = config.url, _a = config.data, data = _a === void 0 ? null : _a, method = config.method, headers = config.headers, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrHeaderName = config.xsrHeaderName, xsrfCookieName = config.xsrfCookieName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress, auth = config.auth, validateStatus = config.validateStatus;
        var request = new XMLHttpRequest();
        // 设置请求头 url 是否是异步
        request.open(method.toUpperCase(), url, true);
        comfigureRequest();
        addEvents();
        processHeaders$$1();
        processCancel();
        // 最后发送请求
        request.send(data);
        /**
         * 配置请求
         */
        function comfigureRequest() {
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
        function addEvents() {
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
                var responseHeaders = parseHeaders(request.getAllResponseHeaders());
                // 获取响应数据,当responseType不是text的情况下，直接获取request.response的数值，否则就是request.responseText的值
                var responseData = (responseType && responseType !== 'text') ? request.response : request.responseText;
                // 设置返回的数据类型
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                // 然后返回这个axios的响应,同时处理了一下response
                handleResponse(response);
            };
            // 处理超时
            request.ontimeout = function handleTimeout() {
                // ECONNABORTED网络被终止
                reject(createError("Timeout of " + timeout + " ms", config, 'ECONNABORTED', request));
            };
            // 请求错误的事件
            request.onerror = function handleError() {
                reject(createError('Network Error', config, null, request)); // 网络错误处理，信息网络错误处理
            };
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
        function processHeaders$$1() {
            // 判断是不是form表单数据
            if (isFormData(data)) {
                delete headers['Content-Type'];
            }
            // 设置cookie header 当是同源请求或者设置了withCredentials的情况下，并且xsrfCookieName有值
            if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
                // 然后再读取cookie
                var xsrfValue = cookie.read(xsrfCookieName);
                // 判断这个值有没有，xsrHeaderName有没有设置，有的话设置到headers上面
                if (xsrfValue && xsrHeaderName) {
                    headers[xsrHeaderName] = xsrfValue;
                }
            }
            // 设置Authorization安全认证
            if (auth) {
                // 当设置了auth之后，给Authorization属性设置 Basic+base64的内容
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ":" + auth.password);
            }
            // 循环遍历放入ajax请求的header
            Object.keys(headers).forEach(function (key) {
                // 当data为空，并且设置了content-type的header这个请求头的情况下，删掉
                if (data === null && key.toLowerCase() === 'content-type') {
                    delete headers[key];
                }
                else {
                    // 如果不是 则设置请求头
                    request.setRequestHeader(key, headers[key]);
                }
            });
        }
        /**
         * 对取消请求的处理
         */
        function processCancel() {
            // 判断cancelToken存在不
            if (cancelToken) {
                // 执行promise,等到外部调用CancelToken类的时候，this.promise也就会有值，这时候就执行了下面的then
                // tslint:disable-next-line: no-floating-promises
                cancelToken
                    // promise实现异步分离
                    .promise
                    .then(function (reason) {
                    request.abort(); // 取消请求
                    reject(reason); // 然后把传入的reason这个Cancel实例返回出去
                });
            }
        }
        /**
         * 处理响应的函数
         * @param response 处理response
         */
        function handleResponse(response) {
            // 没有 或者返回为true的情况下，就是合法状态值
            if (!validateStatus || validateStatus(response.status)) {
                // 状态码等于这个得情况下，直接返回
                resolve(response);
            }
            else {
                // 否则就是300-500之间的错误
                reject(createError("Request failed with status code " + response.status, config, null, request));
            }
        }
    });
}

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

/**
 * 请求处理并返回一个promise对象
 * @param config 请求参数配置
 */
function dispatchRequest(config) {
    throwIfCancellationRequest(config); // 先判断使用过没Cancel
    processConfig(config); // 先处理config
    // 返回ajax返回的数据
    return xhr(config).then(function (res) {
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
/**
 * 对config进行处理
 * @param config 需要被处理的config
 */
function processConfig(config) {
    config.url = transformURL(config); // 对url进行处理
    // config.headers = transFormHeaders(config); // 对headers的content-type进行处理,要先在data转换成普通对象前处理
    config.data = transform(config.data, config.headers, config.transformRequest); // 对data进行处理，普通对象等
    config.headers = flattenHeaders(config.headers, config.method); // 对headers的content-type进行处理,要先在data转换成普通对象前处理,最后对headers里面默认传入的defaults进行合并
}
/**
 * 对url做转换
 * @param config 需要被处理的config对象
 */
function transformURL(_a) {
    var url = _a.url, params = _a.params, paramsSerializer = _a.paramsSerializer, baseURL = _a.baseURL;
    // 判断baseURL有没有 并且url不是绝对地址url
    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url, params, paramsSerializer);
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
function transformResponseData(_a) {
    var data = _a.data, headers = _a.headers, transformResponse = _a.config.transformResponse;
    return transform(data, headers, transformResponse);
}
/**
 * 判断是不是Cancel使用过，使用过直接抛出异常
 */
function throwIfCancellationRequest(config) {
    // 判断有没有使用过 
    if (config.cancelToken)
        config.cancelToken.throwIfRequested();
}

/**
 * 拦截器管理类
 */
var InterceptorManger = /** @class */ (function () {
    function InterceptorManger() {
        this.interceptors = [];
    }
    InterceptorManger.prototype.use = function (resolved, rejected) {
        // 添加拦截器
        this.interceptors.push({
            resolved: resolved,
            rejected: rejected
        });
        return this.interceptors.length - 1; // 长度就是id
    };
    InterceptorManger.prototype.eject = function (id) {
        if (this.interceptors[id]) { // 当这个拦截器存在，则把对应的位置的拦截器制为空
            this.interceptors[id] = null;
        }
    };
    // 循环执行拦截器
    InterceptorManger.prototype.forEach = function (fn) {
        this.interceptors.forEach(function (interceptor) {
            // 当拦截器不为null就直接运行
            if (interceptor !== null) {
                fn(interceptor);
            }
        });
    };
    return InterceptorManger;
}());

// 创建一个对象存储策略函数
var strats = Object.create(null);
/**
 * 默认合并策略函数
 * @param val1 参数1
 * @param val2 参数2
 */
function defaultStrat(val1, val2) {
    // 默认val2不为空就返回
    return typeof val2 !== 'undefined' ? val2 : val1;
}
/**
 * 只取val2的合并策略
 * @param val1
 * @param val2
 */
function fromVal2Strat(val1, val2) {
    if (typeof val2 !== 'undefined')
        return val2;
}
/**
 * deep深度拷贝策略，进行val1，val2判断
 * @param val1
 * @param val2
 */
function deepMergestrat(val1, val2) {
    // 判断val2是不是普通对象
    if (isPlainObject(val2))
        return deepMerge(val1, val2); // 深拷贝
    else if (typeof val2 !== 'undefined')
        return val2; // 代表val2有值
    else if (isPlainObject(val1))
        return deepMerge(val1); // 当没有val2，只有val1，并且是普通对象的情况下，拷贝返回
    else if (typeof val1 !== 'undefined')
        return val1; // val1也不是空，也不是object，直接返回
}
var stratKeysDeepMerge = ['headers', 'auth'];
stratKeysDeepMerge.forEach(function (key) {
    strats[key] = deepMergestrat;
});
// 拷贝的时候当val2有则直接拷贝val2的方式
var stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(function (key) {
    strats[key] = fromVal2Strat;
});
/**
 * 对默认配置和用户配置进行合并
 * @param config1 配置1 默认配置
 * @param config2 配置2 用户设置配置
 */
function mergeConfig(config1, config2) {
    if (!config2) {
        config2 = {};
    }
    var config = Object.create(null); // 创建一个空对象
    // 遍历存入config，相同的处理，不相同的直接放入,这是对config2做遍历
    for (var key in config2) {
        mergeField(key);
    }
    // 对config1进行判断
    for (var key in config1) {
        // 当这个key没在config2中则调用
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        var strat = strats[key] || defaultStrat; // 拿到策略函数，没有则使用默认策略函数
        // 调用合并策略函数
        config[key] = strat(config1[key], config2[key]);
    }
    return config;
}

/**
 * axios类的配置，配置拦截器、defaults、request、get、post、delete等等等。
 * 同时还执行了拦截器
 */
var Axios = /** @class */ (function () {
    function Axios(defaults) {
        this.defaults = defaults;
        // 初始化拦截器
        this.interceptors = {
            request: new InterceptorManger(),
            response: new InterceptorManger(),
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
        config = mergeConfig(this.defaults, config); // 合并配置，以用户的配置config有限
        // 转换成小写
        config.method = config.method.toLowerCase();
        // 初始化拦截器链,里面一堆拦截器，初始值
        var chain = [{
                resolved: dispatchRequest,
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
        config = mergeConfig(this.defaults, config);
        // 最后转换一个url，然后返回出去
        return transformURL(config);
    };
    return Axios;
}());

/**
 * 请求的data进行转换，对普通对象data进行转换成json字符串
 * @param data 需要被转换的data
 */
function transformRequest(data) {
    // 判断是不是对象,而不是其它什么formData对象什么的
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
/**
 * 响应的data进行转换,对返回的json字符串转换成json对象，其它情况下不处理
 * @param data 要被转换的数据
 */
function transformResponse(data) {
    // 当data是字符串的时候，转换成json对象
    if (typeof data === 'string') {
        // 防止不是json字符串，抛出异常的时候处理
        try {
            data = JSON.parse(data);
        }
        catch (err) {
            // 非json字符串,报错了，不管
        }
    }
    return data;
}

/**
 * 配置默认的一些请求参数等，比如给post请求添加什么，添加请求头等
 */
var defaults = {
    method: 'get',
    timeout: 0,
    headers: {
        // 默认给所有请求添加的请求头内容
        common: {
            Accept: 'application/json,text/plain,/*/*',
        }
    },
    // 默认的transformRequest、transformResponse
    transformRequest: [
        function (data, headers) {
            // 对请求的headers进行处理，设置属性
            processHeaders(headers, data);
            // 请求的data进行转换，对普通对象data进行转换成json字符串，然后返回新的data
            return transformRequest(data);
        }
    ],
    transformResponse: [
        // 响应的data进行转换,对返回的json字符串转换成json对象，其它情况下不处理
        function (data) {
            return transformResponse(data);
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

var Cancel = /** @class */ (function () {
    // 直接构造函数赋值
    function Cancel(message) {
        this.message = message;
    }
    return Cancel;
}());
/**
 * 判断val是不是一个Cancel的实例
 * @param val 判断这个属性
 */
function isCancel(val) {
    return val instanceof Cancel;
}

/**
 * 取消token的类
 */
var CancelToken = /** @class */ (function () {
    // 当外部实例化这个CancelToken的时候并传入executor，然后就会调用方法,executor，这个方法获取到一个为参数，然后执行这个方法即可
    function CancelToken(executor) {
        var _this = this;
        // 临时变量
        var resolvePromise;
        // 实例化promise 这时候就执行了Promise，自动给resolvePromise赋值resolve方法
        // 同时把结果返回给了this.promise
        this.promise = new Promise(function (resolve) {
            // 指向，然后调用resolvePromise的时候就是调用promise的resolve
            resolvePromise = resolve;
        });
        // 调用执行者方法，传入一个回调函数，获取这个返回的方法，执行后，this.promise就会拥有this.reason这个Cancel对象
        executor(function (message) {
            // 防止多次调用,当这个有值得时候别重复调用
            if (_this.reason) {
                return;
            }
            _this.reason = new Cancel(message); // 先赋值一个reasonCancel对象的实例
            // 然后执行promise的resolve
            resolvePromise(_this.reason);
        });
    }
    /**
     * source静态方法，返回结果是CancelTokenSource类型,
     * 一个工厂方法
     */
    CancelToken.source = function () {
        // 定义一个cancel变量,cancel不为空
        var cancel;
        // 实例化一个cancelToken,传入的回调函数的c方法就是cancel方法
        var token = new CancelToken(function (c) {
            cancel = c; // 然后把这个c函数赋值给cancel
        });
        return {
            token: token,
            cancel: cancel
        };
    };
    /**
     * 如果再次使用Cancel（就是已经取消过）抛出异常的方法
     */
    CancelToken.prototype.throwIfRequested = function () {
        // 当this.reason方法不为空的情况下就是执行了executor方法，这时候就不能执行了
        if (this.reason) {
            throw this.reason;
        }
    };
    return CancelToken;
}());

/**
 * 工厂函数，创建实例
 * @param config axios默认的配置
 */
function createInstance(config) {
    var context = new Axios(config); // 默认的defaults配置的config
    // instance指向了request方法，为了保证this指向，绑定context
    var instance = Axios.prototype.request.bind(context);
    // 然后拷贝context上面的所有方法属性到instance，并且返回结果导出
    extend(instance, context);
    return instance;
}
/**
 * axios对象，内置各种请求方法等
 */
var axios = createInstance(defaults);
// 扩展方法,创建新的axios实例
axios.create = function create(config) {
    config = mergeConfig(defaults, config); // 合并config然后传递给createInstance
    return createInstance(config);
};
// 扩展取消请求的方法
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;
axios.all = function all(promises) {
    return Promise.all(promises);
};
// 一个高阶函数,把数组展开成多个参数
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
};
axios.Axios = Axios;

export default axios;
