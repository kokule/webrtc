// 服务配置
const serverConfig = {
    http: {
        port: 80,
        disabled: false,
        timeout: 0
    },
    https: {
        port: 443,
        disabled: true,
        timeout: 0,
        key: '',
        cert: ''
    }
};

// 代理配置
const proxy = [
    {
        context: ['/common-frontend'],
        target: 'http://172.25.21.34:30922',
        ws: false,
        changeOrigin: false,
        pathRewrite: {
            '^/common-frontend': ''
        }
    }
];

// 需要注入的变量
const IMPORT_CONFIGS = {
    CAS_HOST: 'http://172.25.21.174:30999'
};

module.exports = {
    serverConfig,
    proxy,
    IMPORT_CONFIGS
};
