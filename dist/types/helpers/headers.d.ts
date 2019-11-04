import { Method } from "../types";
/**
 * 对请求的headers进行处理，设置属性
 * @param headers 需要被处理的headers
 * @param data 判断这个是不是普通对象来设置headers的Content-Type参数
 */
export declare function processHeaders(headers: any, data: any): any;
/**
 * 对返回的headers进行处理变成一个对象
 * @param headers 转换成对象的headers
 */
export declare function parseHeaders(headers: string): any;
/**
 * 提取headers里面的一些common、post什么的提取出来，按照method来提取
 * @param headers
 * @param method
 */
export declare function flattenHeaders(headers: any, method: Method): any;
