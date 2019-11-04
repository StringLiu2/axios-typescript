import { transformRequest, transformResponse } from '../../src/helpers/data';
describe('helpers:data', () => {
    describe('transformRequest', () => {
        test('should transform request data to String if data is a PlainObject', () => {
            const a = { a: 1 };
            expect(transformRequest(a)).toBe('{"a":1}');
        });
        test('should do nothing if data is not a PlainObject', () => {
            const a = new URLSearchParams('a=b');
            expect(transformRequest(a)).toBe(a);
        });
    });
    describe('transformResponse', () => {
        test('should transform response data to Object if data is a JSON String', () => {
            const a = '{"a":1}';
            expect(transformResponse(a)).toEqual({ a: 1 });
        });
        test('should transform response data to String if data is a String but not a JSON String', () => {
            const a = 'a=1';
            expect(transformResponse(a)).toBe('a=1');
        });
        test('should do nothing if data is not a string', () => {
            const a = { a: 2 };
            expect(transformResponse(a)).toBe(a);
        });
    });
});