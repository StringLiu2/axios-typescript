import axios, { } from '../../src';
import { getAjaxRequest } from '../helper';

function testHeaderValue(headers: any, key: string, val?: string) {
    let found = false;
    for (let k in headers) {
        if (k.toLowerCase() === key.toLowerCase()) {
            found = true;
            expect(headers[key]).toBe(val);
            break;
        }
    }
    if (!found) {
        if (typeof val === 'undefined') {
            expect(headers.hasOwnProperty(key)).toBeFalsy();
        } else {
            throw new Error(key + ' was not found in headers');
        }
    }
}

describe('headers', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });
    afterEach(() => {
        jasmine.Ajax.uninstall();
    });
    test('should use default common headers', () => {
        const headers = axios.defaults.headers.common;
        axios('/foo');
        return getAjaxRequest().then(request => {
            for (let key in headers) {
                // 当headers上面有这个属性的情况下
                if (headers.hasOwnProperty(key)) {
                    expect(request.requestHeaders[key]).toBe(headers[key]);
                }
            }
        })
    });
    test('should add extra headers for post', () => {
        axios.post('/foo', 'fizz=buzz');
        return getAjaxRequest().then(request => {
            testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded');
        });
    });
    test('should use application/json when posting an object', () => {
        axios.post('/foo', {
            firstName: 'foo',
            lastName: 'bar',
        });
        return getAjaxRequest().then(request => {
            testHeaderValue(request.requestHeaders, 'Content-Type', 'application/json;charset=utf-8');
        });
    });
    test('should remove content-type if data is empty', () => {
        axios.post('/foo');
        return getAjaxRequest().then(request => {
            testHeaderValue(request.requestHeaders, 'Content-Type', undefined);
        });
    });
    test('should remove content-type if data is false', () => {
        axios.post('/foo', false);
        return getAjaxRequest().then(request => {
            testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded');
        });
    });
    test('should remove content-type if data is FormData', () => {
        const data = new FormData();
        data.append('foo', 'bar');
        axios.post('/foo', data);
        return getAjaxRequest().then(request => {
            testHeaderValue(request.requestHeaders, 'Content-Type', undefined);
        });
    });
});