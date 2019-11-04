import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/util";
// 创建一个对象存储策略函数
const strats = Object.create(null);
/**
 * 默认合并策略函数
 * @param val1 参数1
 * @param val2 参数2
 */
function defaultStrat(val1: any, val2: any): any {
    // 默认val2不为空就返回
    return typeof val2 !== 'undefined' ? val2 : val1;
}
/**
 * 只取val2的合并策略
 * @param val1 
 * @param val2 
 */
function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') return val2;
}
/**
 * deep深度拷贝策略，进行val1，val2判断
 * @param val1 
 * @param val2 
 */
function deepMergestrat(val1: any, val2: any): any {
    // 判断val2是不是普通对象
    if (isPlainObject(val2)) return deepMerge(val1, val2); // 深拷贝
    else if (typeof val2 !== 'undefined') return val2;// 代表val2有值
    else if (isPlainObject(val1)) return deepMerge(val1); // 当没有val2，只有val1，并且是普通对象的情况下，拷贝返回
    else return val1; // val1也不是空，也不是object，直接返回
}


// 拷贝的时候当val2有则直接拷贝val2的方式
const stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat;
});

const stratKeysDeepMerge = ['headers', 'auth'];
stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergestrat;
});
/**
 * 对默认配置和用户配置进行合并
 * @param config1 配置1 默认配置
 * @param config2 配置2 用户设置配置
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
    if (!config2) {
        config2 = {};
    }
    const config = Object.create(null); // 创建一个空对象
    // 遍历存入config，相同的处理，不相同的直接放入,这是对config2做遍历
    for (let key in config2) {
        mergeField(key);
    }
    // 对config1进行判断
    for (let key in config1) {
        // 当这个key没在config2中则调用
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key: string) {
        const strat = strats[key] || defaultStrat; // 拿到策略函数，没有则使用默认策略函数
        // 调用合并策略函数
        config[key] = strat(config1[key], config2![key]);
    }
    return config;
}
