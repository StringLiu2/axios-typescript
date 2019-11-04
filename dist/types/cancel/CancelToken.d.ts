import { CancelToken as CancelTokenInterface, CancelExecutor, CancelTokenSource } from '../types';
import Cancel from './Cancel';
/**
 * 取消token的类
 */
export default class CancelToken implements CancelTokenInterface {
    promise: Promise<Cancel>;
    reason?: Cancel;
    constructor(executor: CancelExecutor);
    /**
     * source静态方法，返回结果是CancelTokenSource类型,
     * 一个工厂方法
     */
    static source(): CancelTokenSource;
    /**
     * 如果再次使用Cancel（就是已经取消过）抛出异常的方法
     */
    throwIfRequested(): void;
}
