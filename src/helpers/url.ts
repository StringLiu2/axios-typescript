import { isDate, isObject, isURLSearchParams } from "./util";

/**
 * 把字符串转换成encode，然后把@:$,+[]转换回去
 * @param val 转换成encode编码的字符串
 */
function encode(val: string): string {
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
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if (!params) return url;
    let serializedParams; // 存储序列化后的params字符串
    // 判断用户有没有定义这个函数序列化规则，没有则我们处理，有他们来处理
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) { // 判断params是不是URLSearchParans
        serializedParams = params.toString();
    } else {
        const parts: string[] = []; // 用来保存params
        // 对params进行获取key，然后循环获取到值
        Object.keys(params).forEach((key: string) => {
            const val = params[key];
            // 判断值是什么类型的，做下一步操作
            if (val === null || typeof val === 'undefined') {
                return; // 跳出本次循环
            }
            // 临时数组，判断是不是数组
            let values = [];
            // 是数组的情况下，key改变
            if (Array.isArray(val)) {
                values = val;
                key += '[]';
                // 不是数组的情况下，变成数组
            } else {
                values = [val];
            }

            // 遍历values
            values.forEach((val: any) => {
                // 当value时Date的情况下
                if (isDate(val)) {
                    val = val.toISOString();
                } else if (isObject(val)) {
                    val = JSON.stringify(val); // 对象的话转换成字符串
                }
                parts.push(`${encode(key)}=${encode(val)}`);
            });
        });
        // 拼接query参数
        serializedParams = parts.join('&');
    }
    // 判断parts有没有
    if (serializedParams) {
        // 然后判断url里面有没有哈希的#，有就去掉
        const markIndex = url.indexOf('#');
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
interface URLOrigin {
    protocol: string;
    host: string;
}
/**
 * 同源的url，
 * 利用dom对象的a标签，设置url的属性，解析出端口和协议，然后请求url和当前页面url比较
 */
export function isURLSameOrigin(requestURL: string): boolean {
    // 获取请求的url和接口
    const parsedOrgin = resolveURL(requestURL);
    // 判断本地的和发送请求的协议和端口
    return (parsedOrgin.protocol === currentOrigin.protocol) && (parsedOrgin.host === currentOrigin.host)
}

// 创建一个a标签dom节点
const urlParsingNode: HTMLAnchorElement = document.createElement('a');
// 解析当前页面的href，防止跨域攻击
const currentOrigin = resolveURL(window.location.href);
/**
 * 辅助函数，用来发送请求的时候获取协议和端口
 */
function resolveURL(url: string): URLOrigin {
    // 设置一下href
    urlParsingNode.setAttribute('href', url);
    const { protocol, host } = urlParsingNode; // 解构赋值获取protocol(协议)，host(端口)
    return {
        protocol,
        host
    }
}
/**
 * 判断是不是请求xxx.xxx.xx开头的，返回true就是绝对地址
 */
export function isAbsoluteURL(url: string): boolean {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url); // 忽略大小写
}
/**
 * 拼接baseURL + url 成一个新的url
 * @param baseURL 默认的baseURL
 * @param relativeURL 拼接的url
 */
export function combineURL(baseURL: string, relativeURL?: string): string {
    // 清理斜线
    return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL;
}