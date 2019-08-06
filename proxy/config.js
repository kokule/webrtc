const proxy = [
    {
        context: ['/common-frontend'],
        target: 'http://172.25.21.34:30922',
        ws: false,
        changeOrigin: false,
        pathRewrite: {
            '^/common-frontend': '',
        },
        disableProxyRes: true, // 不启用代理
        onProxyRes(proxyRes, req, res) {
            // let contentType = 'text/html;charset=UTF-8';
            if (proxyRes.headers['Content-Type']) {
                proxyRes.headers['Content-Type'] = ''; // 置为空
            }
        },
    },
];

// 需要注入的变量
const IMPORT_CONFIGS = {
    CAS_HOST: 'http://172.25.21.174:30999'
};

module.exports = {
    proxy,
    IMPORT_CONFIGS
};
