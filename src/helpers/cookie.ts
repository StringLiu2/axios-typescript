const cookie = {
    read(name: string): string | null {
        // 获取cookie，并且通过match和正则匹配
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        // 然后读取第三个括号的内容，就是cookie的值
        return match ? decodeURIComponent(match[3]) : null;
    },
}
export default cookie;