/**
 * 判断是不是应该date类型,返回类型保护
 * @param val 需要被判断的值
 */
export declare function isDate(val: any): val is Date;
/**
 * 判断是不是对象
 * @param val 需要被判断的值
 */
export declare function isObject(val: any): val is Object;
/**
 * 判断是不是普通对象
 * @param val val就是需要判断的那个
 */
export declare function isPlainObject(val: any): val is Object;
/**
 * 把Axios对象的属性拷贝到extend中的函数
 * @param to 合并到的那个
 * @param from 需要被合并的
 */
export declare function extend<T, U>(to: T, from: U): T & U;
/**
 * 对普通对象进行深拷贝
 */
export declare function deepMerge(...objs: any[]): any;
/**
 * 扩展方法，判断是不是formData
 */
export declare function isFormData(val: any): val is FormData;
/**
 * 判断是不是URLSearchParams类型的参数
 * @param val 接收一个params参数
 */
export declare function isURLSearchParams(val: any): val is URLSearchParams;
