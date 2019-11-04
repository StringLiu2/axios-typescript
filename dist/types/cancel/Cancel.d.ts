import { Cancel as CancelInterface } from '../types';
export default class Cancel implements CancelInterface {
    message?: string | undefined;
    constructor(message?: string | undefined);
}
/**
 * 判断val是不是一个Cancel的实例
 * @param val 判断这个属性
 */
export declare function isCancel(val: any): boolean;
