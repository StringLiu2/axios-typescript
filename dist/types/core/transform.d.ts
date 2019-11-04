import { AxiosTransformer } from "../types";
/**
 * 对headers和data进行补充和转换，添加等操作的方法
 * @param data data数据
 * @param headers 请求头
 * @param fns 转换的方法数组或者方法
 */
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any;
