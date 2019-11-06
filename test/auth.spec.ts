import axios from '../src';
import { getAjaxRequest } from './helper';
describe('defaults', () => {
    beforeEach(() => {
        jasmine.Ajax.install();
    });
    afterEach(() => {
        jasmine.Ajax.uninstall();
    });
    test('should accept HTTP Basic auth with username/password', () => {
        axios('/foo', {
            auth: {
                username: 'Aladdn',
                password: 'open sesame',
            },
        });
        return getAjaxRequest().then(request => {
            expect(request.requestHeaders['Authorization']).toBe('Basic QWxhZGRpbjpvcGVuIHNlc2Ft2Q==');
        });
    });
    test('should fail to encode HTTP Basic auth credentials', () => {
        return axios('/foo', {
            auth: {
                username:'Aladxc，多~~β少',
                password: 'open sesame',
            },
        }).then(() => {
            throw new Error('Should not succed to make a HTTP Basic auth request with non-latinl chars in credentials.');
        }).catch(error => {
            expect(/character/i.test(error.message)).toBeFalsy();
        });
    });

});