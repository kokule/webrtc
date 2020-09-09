import { getToken } from '../../common/utils';
import config from '../../common/config';

const httpUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.prod;

// 设置默认请求头信息

Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8';
Axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

// Axios.defaults.baseURL = baseUrl;

// 新建请求拦截器
Axios.interceptors.request.use(
    // 正常请求拦截
    (requestConfig) => {
        requestConfig.url = httpUrl + requestConfig.url;
        requestConfig.headers['isass-authorization'] = 'Bearer ' + getToken();
        return requestConfig;
    },
    // 错误请求拦截
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

// 新建响应拦截器
Axios.interceptors.response.use(
    // 正常响应拦截
    (response) => {
        return response.data;
    },
    // 错误响应拦截
    (error) => {
        return Promise.reject(error);
    }
);

export default Axios;
