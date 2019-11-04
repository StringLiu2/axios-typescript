import { isPlainObject } from './util';
/**
 * 请求的data进行转换，对普通对象data进行转换成json字符串
 * @param data 需要被转换的data
 */
export function transformRequest(data: any): any {
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
export function transformResponse(data: any): any {
    // 当data是字符串的时候，转换成json对象
    if (typeof data === 'string') {
        // 防止不是json字符串，抛出异常的时候处理
        try {
            data = JSON.parse(data);
        } catch (err) {
            // 非json字符串,报错了，不管
        }
    }
    return data;
}