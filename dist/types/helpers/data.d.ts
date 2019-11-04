/**
 * 请求的data进行转换，对普通对象data进行转换成json字符串
 * @param data 需要被转换的data
 */
export declare function transformRequest(data: any): any;
/**
 * 响应的data进行转换,对返回的json字符串转换成json对象，其它情况下不处理
 * @param data 要被转换的数据
 */
export declare function transformResponse(data: any): any;
