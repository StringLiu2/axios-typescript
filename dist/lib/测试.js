"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Rectangle = /** @class */ (function () {
    function Rectangle(long, wide) {
        this.long = long;
        this.wide = wide;
    }
    Rectangle.prototype.area = function () {
        return this.long * this.wide;
    };
    Rectangle.prototype.girth = function () {
        return 2 * (this.long + this.wide);
    };
    return Rectangle;
}());
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(long, wide) {
        var _this = this;
        if (long === wide) {
            _this = _super.call(this, long, wide) || this;
        }
        else {
            throw new Error('这个不是正方形');
        }
        return _this;
    }
    return Square;
}(Rectangle));
var rectangle = new Rectangle(1, 2);
var square = new Square(1, 2);
//# sourceMappingURL=测试.js.map