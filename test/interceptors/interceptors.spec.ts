import axios, { AxiosRequestConfig, AxiosResponse } from '../../src';
import { getAjaxRequest } from '../helper';

describe('interceptors', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });
    afterEach(() => {
        jasmine.Ajax.uninstall();
    });
    test('should add a request interceptor', () => {
        const instance = axios.create();
        instance.interceptors.request.use(config => {
            config.params = { foo: "bar" };
            return config;
        });
    });
});