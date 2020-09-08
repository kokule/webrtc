const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');
const proxy = require('./vue.proxy.config');
const mockProxy = require('./mock.proxy.config');
const EcpVersionWebpackPlugin = require('@ecp/version-webpack-plugin');

const isMock = !!process.argv.find(d => d === '--mock');

let proxyConfig = isMock ? mockProxy : proxy;

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    productionSourceMap: false,
    runtimeCompiler: true,

    chainWebpack: config => {
        config.plugins.delete('prefetch');
        if (process.env.NODE_ENV === 'production') {
            config.plugin('compression').use(CompressionWebpackPlugin, [{
                test: /\.js$|\.css$/,
                algorithm: 'gzip',
                threshold: 1024 * 512
            }]);
        }
    },
    devServer: {
        port: 8080,
        host: '0.0.0.0',
        https: false,
        open: true,
        proxy: proxyConfig
    },
    css: {
        loaderOptions: {
            sass: {
                data: '@import "./src/theme/default/import.scss";'
                // data: '@import "./src/theme/darken/import.scss";'
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@views': path.resolve(__dirname, 'src/app/views'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@common': path.resolve(__dirname, 'src/common'),
                '@constants': path.resolve(__dirname, 'src/constants'),
                '@utils': path.resolve(__dirname, 'src/common/utils')
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                _: 'lodash',
                Axios: 'axios'
            }),
            new EcpVersionWebpackPlugin()
        ]
    },

    transpileDependencies: [
        'vue-echarts',
        'resize-detector',
        'ecp-ui'
    ]
};
