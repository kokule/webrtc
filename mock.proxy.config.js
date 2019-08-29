module.exports = {
    '/test': {
        target: 'http://172.25.20.65:7300',
        ws: false,
        changeOrigin: false,
        pathRewrite: {
            '^/test': '/mock/5d65f3f6fe62f50020020dbc/template-vue/test'
        }
    }
};
