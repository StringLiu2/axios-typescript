import axios, { AxiosRequestConfig } from '../../src';
import mergeConfig from '../../src/core/mergeConfig';

describe('mergeConfig', () => {
    let defaults = axios.defaults;
    test('should accept undefind for second argument', () => {
        expect(mergeConfig(defaults, undefined)).toEqual(defaults);
    });
    test('should accept an object for second argument', () => {
        expect(mergeConfig(defaults, {})).toEqual(defaults);
    });

    test('should not leave references', () => {
        const merged = mergeConfig(defaults, {});
        // 对象地址不同
        expect(merged).not.toBe(defaults);
        expect(merged.headers).not.toBe(defaults.headers);
    });
    test('should allow setting request options', () => {
        const config: AxiosRequestConfig = {
            url: '__sample url__',
            params: '__sample params',
            dataL: { foo: true },
        }
        const merged = mergeConfig(defaults, config);
        expect(merged.url).toBe(config.url);
        expect(merged.params).toBe(config.params);
        expect(merged.data).toBe(config.data);
    });
    test('should not inherit request options', () => {
        const localDefaults: AxiosRequestConfig = {
            url: '__sample url__',
            params: '__sample params',
            dataL: { foo: true },
        }
        const merged = mergeConfig(localDefaults, {}); // 使用第二个参数带来的值，所以没有就undefined
        expect(merged.url).toBeUndefined();
        expect(merged.params).toBeUndefined();
        expect(merged.data).toBeUndefined();
    });
    test('should return defaults headers if pass config2 with undefined', () => {
        expect(mergeConfig({ headers: 'x-mock-header' }, undefined)).toEqual({ headers: 'x-mock-header' });
    });
    test('should merge auth, headers with defaults', () => {
        expect(mergeConfig({ auth: undefined }, { auth: { username: 'foo', password: 'test' } }))
            .toEqual({ auth: { username: 'foo', password: 'test' } });
        expect(mergeConfig({ auth: { username: 'baz', password: 'foobar' } }, { auth: { username: 'foo', password: 'test' } }))
            .toEqual({ auth: { username: 'foo', password: 'test' } });
    });
    test('should overwrite auth, headers with a non-object value', () => {
        const config1: AxiosRequestConfig = {
            headers: {
                common: {
                    Accept: 'application/json, text/plain, */*'
                }
            }
        }
        expect(mergeConfig(config1, { headers: undefined }))
            .toEqual(config1);
    });
    test('should allow setting other options', () => {
        const merged = mergeConfig(defaults, { timeout: 123 });
        expect(merged.timeout).toBe(123);
    })

});