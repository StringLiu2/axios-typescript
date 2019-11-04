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
/**
 * 继承错误对象，实现更佳详细的对象，有config,code,request，response属性，除了config非必选
 */
var AxiosError = /** @class */ (function (_super) {
    __extends(AxiosError, _super);
    // 添加一个注释,让测试忽略构造函数
    /* istanbul ignore next */
    function AxiosError(message, config, code, request, response) {
        var _this = _super.call(this, message) || this;
        _this.config = config;
        _this.code = code;
        _this.request = request;
        _this.response = response;
        _this.isAxiosError = true;
        // 解决typescript的坑，继承内置对象出现问题，所以要清除坑
        Object.setPrototypeOf(_this, AxiosError.prototype);
        return _this;
    }
    return AxiosError;
}(Error));
/**
 * 工厂模式，然后返回这个对象
 * @param message 错误信息
 * @param config 错误的那个传入request的配置对象
 * @param code 错误状态字符串(可选)
 * @param request 请求对象(可选)
 * @param response 响应对象(可选)
 */
function createError(message, config, code, request, response) {
    return new AxiosError(message, config, code, request, response);
}
exports.createError = createError;
//# sourceMappingURL=error.js.map