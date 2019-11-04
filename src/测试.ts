import axios from './';
import qs from 'querystring';
import { Canceler, CancelTokenSource, AxiosError } from './types';
// qs模块可以对请求的数据进行封装，然后就是以from-data的形式发送到后台
axios({
    url: '/xxx',
    method: 'post',
    data: qs.stringify({ a: '1' })
});
// 方式1使用
const source: CancelTokenSource = axios.CancelToken.source();
axios.get('/url/12321', {
    cancelToken: source.token // 把token传入
}).catch((e: AxiosError) => {
    if (axios.isCancel(e)) {
        console.log('请求取消', e.message)
    } else {
        // 处理错误
    }
});


// 方式2 使用取消请求
// 获取CancelToken对象，然后到内部实例化
const CancelToken = axios.CancelToken;
// 定义一个cancel，存储，到时候可以取消请求
let cancel!: Canceler;
axios.get('/user/12345', {
    cancelToken: new CancelToken(function executor(c: Canceler) {
        cancel = c;
    }),
})
// 取消请求
cancel();