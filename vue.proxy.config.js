module.exports = {
    '/tdtmap': {
        target: 'http://172.25.21.59:8088',
        changeOrigin: true,
        ws: false
    },
    '/test': {
        target: 'http://172.25.21.59:8032',
        changeOrigin: false,
        ws: false,
        pathRewrite: {
            '^/test': ''
        }
    }
};
