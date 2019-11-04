import { AxiosRequestConfig, AxiosPromise } from "../types";
/**
 * 请求处理并返回一个promise对象
 * @param config 请求参数配置
 */
export default function dispatchRequest<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
/**
 * 对url做转换
 * @param config 需要被处理的config对象
 */
export declare function transformURL({ url, params, paramsSerializer, baseURL }: AxiosRequestConfig): string;
