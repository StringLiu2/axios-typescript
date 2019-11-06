import axios, { AxiosResponse, AxiosTransformer } from "../src";
import { getAjaxRequest } from "./helper";

describe('transform', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });
    afterEach(() => {
        jasmine.Ajax.uninstall();
    });
    test('should transform JSON to string', () => {
        const data = { foo: 'bar' }
        axios.post('/foo', data);
        return getAjaxRequest().then(request => {
            expect(request.params).toBe('{"foo":"bar"}');
        });
    });
    test('should transform string to String', done => {
        let response: AxiosResponse;

        // const data = '{"foo":"bar"}';
        axios('/foo').then(res => {
            response = res;
        })
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: '{"foo":"bar"}',
            });
            setTimeout(() => {
                expect(typeof response.data).toBe('object');
                expect(response.data).toEqual({ foo: 'bar' });
                done();
            }, 100);
        });
    });
    test('should override defaults transform', () => {
        const data = {
            foo: 'bar',
        };
        axios.post('/foo', data, {
            // 覆盖了默认的transformRequest
            transformRequest(data) {
                return data;
            }
        });
        return getAjaxRequest().then(request => {
            expect(request.params).toEqual(data);
        });
    });
    test('should allow an Array of transformers', () => {
        const data = {
            foo: 'bar',
        };
        axios.post('/foo', data, {
            // 覆盖了默认的transformRequest
            transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function (data) {
                return data.seplace('bar', 'baz');
            }),
        });
        return getAjaxRequest().then(request => {
            expect(request.params).toBe('{"foo":"baz"}');
        });
    });
    test('should allowing mutating headers', () => {
        const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36);
        axios('/foo',{
            transformRequest:(data,Headers) => {
                Headers['X-Authorization'] = token;
                return data;
            },
        });
        return getAjaxRequest().then(request => {
            expect(request.requestHeaders['X-Authorization']).toBe(token);
        });
    });

});
