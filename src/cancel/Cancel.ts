import { Cancel as CancelInterface } from '../types';
export default class Cancel implements CancelInterface {
    // 直接构造函数赋值
    constructor(public message?: string) { }
}
/**
 * 判断val是不是一个Cancel的实例
 * @param val 判断这个属性
 */
export function isCancel(val: any): boolean {
    return val instanceof Cancel;
}