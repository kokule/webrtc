const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const log4js = require('log4js');
const compression = require('compression');
const https = require('https');
const fs = require('fs');

const config = require(path.resolve(__dirname, './config.js'));

!config.serverConfig && (config.serverConfig = {});
!config.serverConfig.http && (config.serverConfig.http = {});
!config.serverConfig.https && (config.serverConfig.https = {});

let httpConfig = {
    port: config.serverConfig.http.port || 80,
    disabled: config.serverConfig.http.disabled === true,
    timeout: config.serverConfig.http.timeout || 0 // 超时时间 秒 0 不启用
};
let httpsConfig = {
    port: config.serverConfig.https.port || 443,
    disabled: config.serverConfig.https.disabled !== false,
    timeout: config.serverConfig.https.timeout || 0, // 超时时间 秒 0 不启用
    key: config.serverConfig.https.key || './ssl/private.pem',
    cert: config.serverConfig.https.cert || './ssl/file.crt'
};

// https 密钥、证书
let credentials = null;
if (!httpsConfig.disabled) {
    const privateKey = fs.readFileSync(path.resolve(__dirname, httpsConfig.key), 'utf8');
    const certificate = fs.readFileSync(path.resolve(__dirname, httpsConfig.cert), 'utf8');
    credentials = { key: privateKey, cert: certificate };
}

const app = express();
let port = httpConfig.port;

// 获取真实ip
app.set('trust proxy', true);

// 设置模板引擎为ejs
app.set('view engine', 'ejs');

// 日志配置
log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'dateFile',
            filename: './logs/app.log',
            keepFileExt: true,
            daysToKeep: 10 // 日志保留天数
        }
    },
    categories: {
        default: { appenders: [ 'console', 'file' ], level: 'info' }
    }
});
const logger = log4js.getLogger();
logger.level = 'info';
app.use(log4js.connectLogger(logger));

function logProvider (provider) {
    var myCustomProvider = {
        log: (msg) => logger.log(msg),
        debug: (msg) => logger.debug(msg),
        info: (msg) => logger.info(msg),
        warn: (msg) => logger.warn(msg),
        error: (msg) => logger.error(msg)
    };
    return myCustomProvider;
}

// 获取启动参数
const args = process.argv.splice(2);
for (let i = 0, len = args.length; i < len; i++) {
    // 接收端口
    if (args[i] === '-p') {
        i++;
        const tmp = parseInt(args[i]);
        !isNaN(tmp) && tmp >= 80 && tmp < 65535 && (port = tmp);
        continue;
    }
}

app.use(compression()); // gzip

app.use(express.static(path.resolve(__dirname, './public'))); // 静态资源

// 代理配置
let proxyConfig = config.proxy || [];
const IMPORT_CONFIGS = config.IMPORT_CONFIGS || '';

app.get('/', function (req, res) {
    // 向页面模板传递参数，可以传递字符串和对象，注意格式
    res.render('index', {
        IMPORT_CONFIGS: IMPORT_CONFIGS
    });
});

async function onProxyRes (proxyRes, req, res, cb) {
    if (!proxyRes.headers['Content-Type']) {
        proxyRes.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }

    typeof cb === 'function' && cb(proxyRes, req, res);
}

// 通过配置文件设置代理
proxyConfig.map(configItem => {
    if (!configItem.target) return;
    // 解决jsessionid的问题
    let pathRewrite = typeof configItem.pathRewrite === 'object' ? Object.assign(configItem.pathRewrite, { ';jsessionid=.*$': '' }) : configItem.pathRewrite;

    const proxyResFunc = configItem.disableProxyRes ? undefined : (proxyRes, req, res) => onProxyRes(proxyRes, req, res, configItem.onProxyRes);

    app.use(configItem.context, proxy({
        ...configItem,
        pathRewrite,
        onProxyReq: (proxyReq, req, res) => {
            const clientIp = req.ip.split(':').pop();
            proxyReq.setHeader('X-Real-IP', clientIp);
            proxyReq.setHeader('X-Forwarded-For', clientIp);

            typeof configItem.onProxyReq === 'function' && configItem.onProxyReq(proxyReq, req, res);
        },
        onProxyRes: proxyResFunc,
        logProvider: logProvider,
        logLevel: 'info'
    }));
});

// http
if (!httpConfig.disabled) {
    const httpServer = app.listen(port, () => {
        logger.info(`http server app listening on port ${port}!`);
    });
    httpConfig.timeout && httpServer.setTimeout(httpConfig.timeout);
}

// https
if (!httpsConfig.disabled) {
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(httpsConfig.port, () => {
        logger.info(`https server app listening on port ${httpsConfig.port}!`);
    });

    httpsConfig.timeout && (httpsServer.timeout = httpsConfig.timeout);
}
