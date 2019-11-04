import { AxiosRequestConfig, AxiosResponse } from "../types";
/**
 * 继承错误对象，实现更佳详细的对象，有config,code,request，response属性，除了config非必选
 */
class AxiosError extends Error {
    isAxiosError: boolean;
    // 添加一个注释,让测试忽略构造函数
    /* istanbul ignore next */
    constructor(
        message: string,
        public config: AxiosRequestConfig,
        public code?: string | null,
        public request?: any,
        public response?: AxiosResponse
    ) {
        super(message);
        this.isAxiosError = true;
        // 解决typescript的坑，继承内置对象出现问题，所以要清除坑
        Object.setPrototypeOf(this, AxiosError.prototype);
    }
}
/**
 * 工厂模式，然后返回这个对象
 * @param message 错误信息
 * @param config 错误的那个传入request的配置对象
 * @param code 错误状态字符串(可选)
 * @param request 请求对象(可选)
 * @param response 响应对象(可选)
 */
export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse,
): AxiosError {
    return new AxiosError(message, config, code, request, response);
}