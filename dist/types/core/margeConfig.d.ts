import { AxiosRequestConfig } from "../types";
/**
 * 对默认配置和用户配置进行合并
 * @param config1 配置1 默认配置
 * @param config2 配置2 用户设置配置
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig;
