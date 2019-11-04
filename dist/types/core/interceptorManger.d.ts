import { AxiosInterceptorManager, ResolvedFn, RejectedFn } from "../types";
/**
 * 存储拦截器的类型
 */
interface Interceptor<T> {
    resolved: ResolvedFn<T>;
    rejected: RejectedFn;
}
/**
 * 拦截器管理类
 */
export default class InterceptorManger<T> implements AxiosInterceptorManager<T> {
    private interceptors;
    constructor();
    use(resolved: ResolvedFn<T>, rejected: RejectedFn): number;
    eject(id: number): void;
    forEach(fn: (interceptor: Interceptor<T>) => void): void;
}
export {};
