import { Message } from '@pci/common-ui/types';

// 设置默认请求头信息
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8';
Axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

// // cas 校验用
// Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Axios.defaults.withCredentials = true; // 让ajax携带cookie

// 新建请求拦截器
Axios.interceptors.request.use(
    // 正常请求拦截
    (requestConfig) => {
        return requestConfig;
    },
    // 错误请求拦截
    (error) => {
        return Promise.reject(error);
    }
);

// 新建响应拦截器
Axios.interceptors.response.use(
    // 正常响应拦截
    (response) => {
        return response;
    },
    // 错误响应拦截
    (error) => {
        return Promise.reject(error);
    }
);
