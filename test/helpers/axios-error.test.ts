import { createError } from '../../src/helpers/error';
import { AxiosRequestConfig, AxiosResponse } from '../../src';

describe('createError', () => {
    test('should create an Error with message , config, code ,request, response and isAxiosError', () => {
        const request = new XMLHttpRequest();
        const config: AxiosRequestConfig = { method: 'post' }
        const response: AxiosResponse = {
            status: 200,
            statusText: 'OK',
            headers: null,
            request,
            config,
            data: { foo: 'bar' },
        }
        const message = 'Boom!';
        const code = 'SOMETHING';
        const error = createError(message, config, code, request, response);
        expect(error instanceof Error).toBeTruthy();
        expect(error.message).toBe(message);
        expect(error.config).toBe(config);
        expect(error.code).toBe(code);
        expect(error.request).toBe(request);
        expect(error.response).toBe(response);
        expect(error.isAxiosError).toBeTruthy();
    });
})