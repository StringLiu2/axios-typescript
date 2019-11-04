import { AxiosRequestConfig, AxiosResponse } from "../types";
/**
 * 继承错误对象，实现更佳详细的对象，有config,code,request，response属性，除了config非必选
 */
declare class AxiosError extends Error {
    config: AxiosRequestConfig;
    code?: string | null | undefined;
    request?: any;
    response?: AxiosResponse<any> | undefined;
    isAxiosError: boolean;
    constructor(message: string, config: AxiosRequestConfig, code?: string | null | undefined, request?: any, response?: AxiosResponse<any> | undefined);
}
/**
 * 工厂模式，然后返回这个对象
 * @param message 错误信息
 * @param config 错误的那个传入request的配置对象
 * @param code 错误状态字符串(可选)
 * @param request 请求对象(可选)
 * @param response 响应对象(可选)
 */
export declare function createError(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse): AxiosError;
export {};
