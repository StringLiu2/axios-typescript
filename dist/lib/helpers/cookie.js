"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie = {
    read: function (name) {
        // 获取cookie，并且通过match和正则匹配
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        // 然后读取第三个括号的内容，就是cookie的值
        return match ? decodeURIComponent(match[3]) : null;
    },
};
exports.default = cookie;
//# sourceMappingURL=cookie.js.map