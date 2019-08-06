const proxy = [
    {
        context: ['/common-frontend'],
        target: 'http://common-frontend:80',
        ws: false,
        changeOrigin: false,
        pathRewrite: {
            '^/common-frontend': '',
        },
	    disableProxyRes: true,
        onProxyRes(proxyRes, req, res) {
            proxyRes.headers['Content-Type'] = '';
        },
    },
];

const IMPORT_CONFIGS = {
    CAS_HOST: 'http://172.25.21.34:30999'
};

module.exports = {
    proxy,
    IMPORT_CONFIGS
};
