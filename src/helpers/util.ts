const toString = Object.prototype.toString; // 对象上面的toString方法
/**
 * 判断是不是应该date类型,返回类型保护
 * @param val 需要被判断的值
 */
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]';
}
/**
 * 判断是不是对象
 * @param val 需要被判断的值
 */
export function isObject(val: any): val is Object {
    return val !== null && typeof val === 'object';
}

/**
 * 判断是不是普通对象
 * @param val val就是需要判断的那个
 */
export function isPlainObject(val: any): val is Object {
    return toString.call(val) === '[object Object]';
}

/**
 * 把Axios对象的属性拷贝到extend中的函数
 * @param to 合并到的那个
 * @param from 需要被合并的
 */
export function extend<T, U>(to: T, from: U): T & U {
    // 循环拷贝属性，方法
    for (const key in from) {
        (to as T & U)[key] = from[key] as any;
    }
    return to as T & U;
}
/**
 * 对普通对象进行深拷贝
 */
export function deepMerge(...objs: any[]): any {
    const result = Object.create(null); // 创建一个空对象
    objs.forEach((obj: any) => { // 然后对传入的对象数组进行遍历
        if (obj) { // 获得每个对象不能为空，然后对每个对象的key进行获取处理判断是不是普通值
            Object.keys(obj).forEach((key: string) => {
                const val = obj[key];
                if (isPlainObject(val)) { // 如果还是对象，继续递归
                    if (isPlainObject(result[key])) { // 如果result里面存在的话，把result[key], val都拷贝到result[key]中
                        result[key] = deepMerge(result[key], val);
                    } else {
                        result[key] = deepMerge(val);
                    }
                } else { // 普通值就直接赋值
                    result[key] = val;
                }
            });
        }
    });
    return result; // 最后返回result
}
/**
 * 扩展方法，判断是不是formData
 */
export function isFormData(val: any): val is FormData {
    // 是不是为空并且，是不是FormData的实例
    return typeof val !== 'undefined' && val instanceof FormData;
}
/**
 * 判断是不是URLSearchParams类型的参数
 * @param val 接收一个params参数
 */
export function isURLSearchParams(val:any):val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams;
}