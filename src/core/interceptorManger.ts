import { AxiosInterceptorManager, ResolvedFn, RejectedFn } from "../types";
/**
 * 存储拦截器的类型
 */
interface Interceptor<T> {
    resolved: ResolvedFn<T>;
    rejected?: RejectedFn;
}
/**
 * 拦截器管理类
 */
export default class InterceptorManger<T> implements AxiosInterceptorManager<T>{
    // 存储拦截器的私有属性
    private interceptors: Array<Interceptor<T> | null>;
    constructor() {
        this.interceptors = [];
    }
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        // 添加拦截器
        this.interceptors.push({
            resolved,
            rejected
        });
        return this.interceptors.length - 1; // 长度就是id
    }
    eject(id: number): void {
        if (this.interceptors[id]) { // 当这个拦截器存在，则把对应的位置的拦截器制为空
            this.interceptors[id] = null;
        }
    }
    // 循环执行拦截器
    forEach(fn: (interceptor: Interceptor<T>) => void):void {
        this.interceptors.forEach((interceptor) => {
            // 当拦截器不为null就直接运行
            if(interceptor !== null){
                fn(interceptor);
            }
        });
    }
}