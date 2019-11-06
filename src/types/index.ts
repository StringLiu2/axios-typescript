import InterceptorManger from "../core/interceptorManger";
import { CancelToken, CancelTokenStatic, CancelStatic } from "..";
export * from './cancel';
/**
 * method请求类型的类型
 */
export type Method = 'get' | 'GET' | 'POST' | 'post' | 'delete' | 'DELETE' | 'PUT' | 'put' | 'HEAD' | 'head' | 'options' | 'OPTIONS' | 'patch' | 'PATCH';
/**
 * axios发送的的数据格式
 */
export interface AxiosRequestConfig {
    url?: string;
    method?: Method;
    data?: any;
    params?: any;
    headers?: any;
    responseType?: XMLHttpRequestResponseType; // 设置响应的数据类型
    timeout?: number;// 超时时间
    /**
     * baseURL 设置后在请求前面会自动拼接上这个url
     */
    baseURL?: string;
    /**
     * 添加两个能在axios请求发送前的时候修改data的函数|函数数组
     */
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    /**
     * 添加两个能在axios响应数据获取的时候修改data的函数|函数数组
     */
    transformResponse?: AxiosTransformer | AxiosTransformer[];

    /**
     * canceltoken 取消token可选属性
     */
    cancelToken?: CancelToken;

    /**
     * withCredentials 用于请求携带后端那边的cookies
     */
    withCredentials?: boolean;

    /**
     * xsrf防止跨域伪造的cookie名
     */
    xsrfCookieName?: string;
    /**
     * xsrf防止跨域伪造的header名
     */
    xsrfHeaderName?: string;
    /**
     * 下载进度监控
     */
    onDownloadProgress?: (e: ProgressEvent) => void;
    /**
     * 上传进度监控
     */
    onUploadProgress?: (e: ProgressEvent) => void;
    /**
     * 安全配置auth属性，接收一个AxiosBasicCredentials类型的对象
     */
    auth?: AxiosBasicCredentials;
    /**
     * 配置合法的请求状态码区域，默认是[200-300)之间合法，可以自行配置，
     * 接收一个参数status
     */
    validateStatus?: (status: number) => boolean;
    /**
     * params序列化的函数
     */
    paramsSerializer?: (params: any) => string;
    // 添加索引签名,可以传入什么key和什么value都行
    [propName: string]: any;
}
/**
 * transformRequest类型和transformResponse类型
 */
export interface AxiosTransformer {
    (data: any, headers?: any): any;
}
/**
 * axios响应的数据格式
 */
export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request: any;
}
/**
 * 响应的promise类型
 */
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> { }

/**
 * 响应的错误信息接口
 */
export interface AxiosError extends Error {
    isAxiosError: boolean;
    config: AxiosRequestConfig;
    code?: string | null;
    request?: any;
    response?: AxiosResponse;
}
/**
 * 一个整个axios类的接口
 */
export interface Axios {
    defaults: AxiosRequestConfig;
    interceptors: AxiosInterceptors;
    /** 和axios本身调用一样 */
    request<T = any>(url: AxiosRequestConfig | string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** get请求 */
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** delete请求 */
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** head请求 */
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** options请求 */
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** post请求 */
    post<T = any>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** put请求 */
    put<T = any>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<T>;
    /** patch请求 */
    patch<T = any>(url: string, data?: T, config?: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * 获取config中的url的方法，
     * @param config config配置对象
     */
    getUri(config?: AxiosRequestConfig): string;
}
/**
 * axios的实例接口类型
 */
export interface AxiosInstance extends Axios {
    // 继承Axios接口，并实现一个默认调用方法，同时对默认调用方法进行方法重载
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}
/**
 * axios的类静态类型
 */
export interface AxiosClassStatic {
    new(config: AxiosRequestConfig): Axios;
}
/**
 * axios的扩展接口类型
 */
export interface AxiosStatic extends AxiosInstance {
    /**
     * 该扩展方法执行后创建一个AxiosInstance
     * @param config 这个默认配置可以传可以不传
     */
    create(config?: AxiosRequestConfig): AxiosInstance;
    // 扩展取消的方法和属性
    /**
     * CancelToken属性，CancelToken的类类型，用来实例化CancelToken类的
     */
    CancelToken: CancelTokenStatic;
    /**
     * Cancel属性，Cancel的类类型，用来实例化Cancel类
     */
    Cancel: CancelStatic;
    /**
     * 判断取消是否成功的方法
     */
    isCancel: (val: any) => boolean;
    /**
     * all方法，对多个axios请求进行合并，和promise.all一致功能，
     * 接收一个到多个axios请求的promise
     */
    all<T>(promises: Array<T | Promise<T>>): Promise<T[]>;
    /**
     * 接收多个promise的then结果，返回一个callback，里面有多个promise执行的结果，
     * 返回一个函数,函数参数是数组
     */
    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R;
    /**
     * 一个Axios,是Axios的实例对象类型
     */
    Axios: AxiosClassStatic;

}
/**
 * 拦截器的类型
 */
export interface AxiosInterceptors {
    request: InterceptorManger<AxiosRequestConfig>;
    response: InterceptorManger<AxiosResponse>;
}
/**
 * axios的拦截器管理类型
 */
export interface AxiosInterceptorManager<T> {
    /**
     * 绑定拦截器，返回一个拦截器id
     * @param resolved resolve方法，必传参数
     * @param rejected reject错误方法，可选参数
     */
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;
    /**
     * 通过拦截器删除一个接口
     * @param id 需要删除的拦截器的id
     */
    eject(id: number): void;
}
/**
 * 请求拦截器和响应拦截器类型不一致，所以这时候的resolve回调函数类型
 */
export interface ResolvedFn<T> {
    (val: T): T | Promise<T>; // 这个方法返回可以promise也可以是正常类型
}
/**
 * reject回调函数类型,请求拦截器和响应拦截器类型不一致
 */
export interface RejectedFn {
    (val: any): any; // 这个方法返回可以promise也可以是正常类型
}
/**
 * 
 */
export interface AxiosBasicCredentials {
    username: string;
    password: string;
}