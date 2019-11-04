/**
 * 对url进行处理，空指针忽略，空格转换成+，丢弃#这个哈希标记以及后面部分的字符串
 * @param url 需要处理的url
 * @param params 弄到url上面的参数对象
 * @param paramsSerializer 序列化params的方法
 */
export declare function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string;
/**
 * 同源的url，
 * 利用dom对象的a标签，设置url的属性，解析出端口和协议，然后请求url和当前页面url比较
 */
export declare function isURLSameOrigin(requestURL: string): boolean;
/**
 * 判断是不是请求xxx.xxx.xx开头的，返回true就是绝对地址
 */
export declare function isAbsoluteURL(url: string): boolean;
/**
 * 拼接baseURL + url 成一个新的url
 * @param baseURL 默认的baseURL
 * @param relativeURL 拼接的url
 */
export declare function combineURL(baseURL: string, relativeURL?: string): string;
