
/**
 * 取消请求的token类型
 */
export interface CancelToken {
    promise: Promise<Cancel>;
    /**
     * reason的类型改变成一个Cancel的类型
     */
    reason?: Cancel;
    /**
     * 如果Cancel（就是已经取消过）再次使用直接抛出异常
     */
    throwIfRequested():void;
}
/**
 * 取消方法的类型
 */
export interface Canceler {
    (message?: string): void;
}
/**
 * 取消的执行者方法类型
 */
export interface CancelExecutor {
    (cancel: Canceler): void
}
/**
 * CancelToken通过Source方法返回的类型
 */
export interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
}
/**
 * CancelToken的一个类类型
 */
export interface CancelTokenStatic {
    /**
     * 这个类类型传入一个executor取消执行者方法，并返回一个CancelToken的实例
     */
    new(executor: CancelExecutor): CancelToken;
    /**
     * source方法就是返回一个CancelTokenSource的类型
     */
    source(): CancelTokenSource;
}
/**
 * 取消的类型
 */
export interface Cancel {
    message?: string;
}
/**
 * cancel的类类型
 */
export interface CancelStatic {
    // 构造函数
    new(message?: string): Cancel;
}