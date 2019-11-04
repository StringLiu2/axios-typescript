import { Axios as AxiosInterface, AxiosRequestConfig, AxiosPromise, AxiosInterceptors } from '../types';
/**
 * axios类的配置，配置拦截器、defaults、request、get、post、delete等等等。
 * 同时还执行了拦截器
 */
export default class Axios implements AxiosInterface {
    defaults: AxiosRequestConfig;
    interceptors: AxiosInterceptors;
    constructor(defaults: AxiosRequestConfig);
    request<T = any>(url: AxiosRequestConfig | string, config?: AxiosRequestConfig): AxiosPromise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    private _requestMethodWithoutData;
    post<T = any>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<T>;
    put<T = any>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<T>;
    patch<T = any>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<T>;
    private _requestMethodWithData;
    getUri(config: AxiosRequestConfig): string;
}
