import axios, { AxiosResponse, AxiosError } from '../../src';
import { getAjaxRequest } from '../helper';

describe('requests', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });
    afterEach(() => {
        jasmine.Ajax.uninstall();
    });
    test('should treat single string arg as url', () => {
        axios('/foo'); // 发送请求
        // BDD异步测试 , 接收请求, 然后一个promise对象，也是测试完毕 ，或者 done回调函数执行完毕
        return getAjaxRequest().then(request => {
            // console.log(request);
            expect(request.url).toBe('/foo');
            expect(request.method).toBe('GET');
        });
    });

    test('should treat method value as lowercase string', () => {
        axios({
            url: '/foo',
            method: 'POST'
        })
            .then(response => {
                // console.log(response);
                expect(response.config.method).toBe('post');
            });
        return getAjaxRequest().then(request => {
            request.respondWith({
                status: 200, // 响应200
            });
        });
    });
    test('should reject on network errors', () => {
        const resolveSpy = jest.fn((res: AxiosResponse) => res);
        const rejectSpy = jest.fn((e: AxiosError) => e);
        // 关闭
        jasmine.Ajax.uninstall();
        return axios('/foo').then(resolveSpy).catch(rejectSpy).then(next);

        function next(reason: AxiosResponse | AxiosError) {
            expect(resolveSpy).not.toHaveBeenCalled(); // 表示没调用then
            expect(rejectSpy).toHaveBeenCalled();
            expect(reason instanceof Error).toBeTruthy();
            expect((reason as AxiosError).message).toBe('Network Error');
            // 表示reason.request是XMLHttpRequest的实例对象
            expect(reason.request).toEqual(expect.any(XMLHttpRequest)); // expect.any(xxx) xxx的实例
            // 最后打开
            jasmine.Ajax.install();
        }
    });
    test('should reject when request timeout', done => {
        let err: AxiosError;
        axios('/foo', {
            timeout: 2000,
            method: 'post',
        }).catch(error => {
            err = error;
        });
        getAjaxRequest().then(request => {
            // @ts-ignore
            request.eventBus.trigger('timeout'); // 触发timeout事件

            setTimeout(() => {
                expect(err instanceof Error).toBeTruthy();
                expect(err.message).toBe('Timeout of 2000 ms exceeded');
                done(); // 调用回调函数，然后表示test测试用例结束
            }, 100);
        })
    });
    test('should reject when validateStatus returns false', () => {
        const resolveSpy = jest.fn((res: AxiosResponse) => res);
        const rejectSpy = jest.fn((e: AxiosError) => e);
        axios('/foo', {
            validateStatus(status) {
                return status !== 500;
            },
        }).then(resolveSpy).catch(rejectSpy).then(next);

        return getAjaxRequest().then(request => {
            // 模拟响应,500
            request.respondWith({
                status: 500,
            });
        })

        function next(reason: AxiosResponse | AxiosError) {
            expect(resolveSpy).not.toHaveBeenCalled(); // 表示没调用then
            expect(rejectSpy).toHaveBeenCalled();
            expect(reason instanceof Error).toBeTruthy();
            expect((reason as AxiosError).message).toBe('Request failed with status code 500');
            expect(reason.request!.status).toBe(500);
        }
    });
    test('should resolve when validateStatus returns true', () => {
        const resolveSpy = jest.fn((res: AxiosResponse) => res);
        const rejectSpy = jest.fn((e: AxiosError) => e);
        axios('/foo', {
            validateStatus(status) {
                return status === 500;
            },
        }).then(resolveSpy).catch(rejectSpy).then(next);

        return getAjaxRequest().then(request => {
            // 模拟响应,500
            request.respondWith({
                status: 500,
            });
        })

        function next(res: AxiosResponse | AxiosError) {
            expect(resolveSpy).toHaveBeenCalled(); // 表示没调用then
            expect(rejectSpy).not.toHaveBeenCalled();
            expect(res.config.url).toBe('/foo');
        }
    });
    test('should return JSON when resolve', done => {
        let response: AxiosResponse;
        axios('/api/account/signup', {
            auth: {
                username: '',
                password: ''
            },
            method: 'post',
            headers: {
                Accept: 'application/json',
            },
        }).then(res => response = res);
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                statusText: 'OK',
                responseText: '{"errno": 0}'
            });
            setTimeout(() => {
                expect(response.data).toEqual({ errno: 0 });
                done();
            }, 100);
        });
    });
    test('should return JSON when rejecting', done => {
        let response: AxiosResponse;
        axios('/api/account/signup', {
            auth: {
                username: '',
                password: ''
            },
            method: 'post',
            headers: {
                Accept: 'application/json',
            },
        }).catch(error => {
            response = error.response;
        });
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 400,
                statusText: 'Bad Request',
                responseText: '{"error": "BAD USERNAME", "code": 1}'
            });
            setTimeout(() => {
                expect(typeof response.data).toBe('object');
                expect(response.data.error).toBe('BAD USERNAME');
                expect(response.data.code).toBe(1);
                done();
            }, 100);
        });
    });
    test('should supply correct response', done => {
        let response: AxiosResponse;

        axios.post('/foo').then(res => {
            response = res;
        });
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                statusText: 'OK',
                responseText: '{"foo":"bar"}',
                responseHeaders: {
                    'Content-Type': 'application/json',
                },
            });
            setTimeout(() => {
                expect(response.data.foo).toBe('bar');
                expect(response.status).toBe(200);
                expect(response.statusText).toBe('OK');
                expect(response.headers['content-type']).toBe('application/json');
                done();
            }, 100);
        });
    });

    test('should allow overriding Content-Type header case-insenstive', () => {
        let response: AxiosResponse;

        axios.post('/foo', { prop: 'value' }, {
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            response = res;
        });

        return getAjaxRequest().then(request => {
            expect(request.requestHeaders['Content-Type']).toBe('application/json');
        });
    });
    test('should should support array buffer response', done => {
        let response: AxiosResponse;
        function str2ab(str: string) {
            const length = str.length;
            const buff = new ArrayBuffer(length * 2);
            const view = new Uint16Array(buff);
            for (let index = 0; index < length; index++) {
                view[index] = str.charCodeAt(index);
            }
            return buff;
        }
        axios('/foo', {
            responseType: 'arraybuffer',
        }).then(data => {
            response = data;
        });
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                // @ts-ignore
                response: str2ab('Hello world'),
            });
            setTimeout(() => {
                expect(response.data.byteLength).toBe(22);
                done();
            },100);
        });
    });

});