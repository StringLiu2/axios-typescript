"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var querystring_1 = require("querystring");
// qs模块可以对请求的数据进行封装，然后就是以from-data的形式发送到后台
_1.default({
    url: '/xxx',
    method: 'post',
    data: querystring_1.default.stringify({ a: '1' })
});
// 方式1使用
var source = _1.default.CancelToken.source();
_1.default.get('/url/12321', {
    cancelToken: source.token // 把token传入
}).catch(function (e) {
    if (_1.default.isCancel(e)) {
        console.log('请求取消', e.message);
    }
    else {
        // 处理错误
    }
});
// 方式2 使用取消请求
// 获取CancelToken对象，然后到内部实例化
var CancelToken = _1.default.CancelToken;
// 定义一个cancel，存储，到时候可以取消请求
var cancel;
_1.default.get('/user/12345', {
    cancelToken: new CancelToken(function executor(c) {
        cancel = c;
    }),
});
// 取消请求
cancel();
//# sourceMappingURL=测试.js.map