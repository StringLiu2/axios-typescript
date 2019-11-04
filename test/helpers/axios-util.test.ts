import { isDate, isFormData, isObject, isPlainObject, isURLSearchParams, extend, deepMerge } from '../../src/helpers/util';
/**
 * 对辅助工具模块编写测试
 */
describe('helpers:util', () => {
    // 测试工具的isxxx方法
    describe('isXXX', () => {
        // 判断时间isDate工具类
        test('should validate Date', () => {
            expect(isDate(new Date())).toBeTruthy(); // 是否为真的时间
            expect(isDate(Date.now())).toBeFalsy(); // 是否为假的时间
        });
        // 判断是否是普通对象工具类
        test('should validate PlainObject', () => {
            expect(isPlainObject({})).toBeTruthy();
            expect(isPlainObject(new Date())).toBeFalsy();
            expect(isPlainObject('string')).toBeFalsy();
        });
        // 判断是不是对象工具类
        test('should validate Object', () => {
            expect(isObject({})).toBeTruthy();
            expect(isObject(new Date())).toBeTruthy();
            expect(isObject('111')).toBeFalsy();
        });

        // 判断是不是FormData
        test('should validate formData', () => {
            const formData = new FormData();
            expect(isFormData(formData)).toBeTruthy();
            expect(isFormData({ a: 1, b: 2 })).toBeFalsy();
        });
        // 判断是不是URLSearchParams类型的数值
        test('should validate URLSearchParams', () => {
            const urlSearchParams = new URLSearchParams();
            expect(isURLSearchParams(urlSearchParams)).toBeTruthy();
            expect(isURLSearchParams('a=1&b=1')).toBeFalsy();
        });
    });
    // 测试合并工具方法
    describe('extend', () => {
        test('should extend immutable', () => {
            const obj1: any = Object.create(null);
            const obj2 = {
                b: 1,
            }
            extend<typeof obj1, typeof obj2>(obj1, obj2);
            expect(obj1.b).toBe(1);
        });
        test('should extend properties', () => {
            const obj1 = {
                a: 1,
                b: 3,
            }
            const obj2 = {
                b: 1,
            }
            const obj3 = extend<typeof obj1, typeof obj2>(obj1, obj2);
            expect(obj3.a).toBe(1);
            expect(obj3.b).not.toBe(3);
        });
    });
    // 测试深拷贝方法
    describe('deepMerge', () => {
        test('should be immutable', () => {
            const a = Object.create(null);
            const b: any = { foo: 123 };
            const c: any = { bar: 456 };
            deepMerge(a, b, c);
            expect(typeof a.foo).toBe('undefined');
            expect(typeof a.bar).toBe('undefined');
            expect(typeof b.bar).toBe('undefined');
            expect(typeof c.foo).toBe('undefined');
        });
        test('should deepMerge properties', () => {
            const obj1 = {
                a: 1,
                b: 2,
                c: 3,
            }
            const obj2 = {
                a: 1,
                b: 3,
                c: 6,
                d: 4,
            }
            const obj = deepMerge(obj1, obj2);
            expect(obj).not.toEqual({ a: 1, b: 2, c: 3, d: 4 });
            expect(obj).toEqual({ a: 1, b: 3, c: 6, d: 4 });
        });
        // 递归地进行深度合并
        test('should deepMerge recursively', () => {
            const obj1 = {
                a: {
                    a1: 1,
                    a2: 3,
                },
                b: 2,
                c: 3,
            }
            const obj2 = {
                a: {
                    a2: 1,
                },
                b: 3,
                c: {
                    e: 1,
                    f: 2
                },
                d: 4,
            }
            const obj = deepMerge(obj1, obj2);
            expect(obj).toEqual(
                {
                    a: {
                        a1: 1,
                        a2: 1,
                    },
                    b: 3,
                    c: {
                        e: 1,
                        f: 2,
                    },
                    d: 4,
                }
            );
            expect(obj).not.toEqual({ a: { a1: 1, a2: 3 }, b: 2, c: 3, d: 4 });
        });
        // 应该从嵌套中删除所有引用
        test('should remove all references from nested', () => {
            const a = { foo: { bar: 123 } };
            const b = {}
            const c = deepMerge(a, b);
            expect(c).toEqual({
                foo: {
                    bar: 123,
                }
            });
        });
        test('should handle null and undefined arguments', () => {
            const c = deepMerge(undefined,undefined);
            expect(c).toEqual({});
        })
    });
});