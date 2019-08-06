const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const log4js = require('log4js');
const compression = require('compression');

const app = express();
let port = 80;

// 获取真实ip
app.set('trust proxy', true);

//设置模板引擎为ejs
app.set('view engine','ejs');

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
app.use( log4js.connectLogger(logger));

function logProvider (provider) {
    var myCustomProvider = {
        log: (msg) => logger.log(msg),
        debug: (msg) => logger.debug(msg),
        info: (msg) => logger.info(msg),
        warn: (msg) => logger.warn(msg),
        error: (msg) => logger.error(msg)
    }
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

const config = require(path.resolve(__dirname, './config.js'));

// 代理配置
let proxyConfig = config.proxy || [];
const IMPORT_CONFIGS = config.IMPORT_CONFIGS || '';

app.get('/', function(req, res) {
    //向页面模板传递参数，可以传递字符串和对象，注意格式
    res.render('index', {
        IMPORT_CONFIGS: IMPORT_CONFIGS
    });
});

async function onProxyRes(proxyRes, req, res, cb) {
    if (!proxyRes.headers['Content-Type']) {
        proxyRes.headers['Content-Type'] = 'application/json;charset=UTF-8';

        // 异步，所以设置响应头无效
        let body = '';
        proxyRes.on('data', function(chunk) {
            body += chunk;
        });

        proxyRes.on('end', function() {
            let contentType = 'text/html;charset=UTF-8';
            try {
                const content = body.toString();
                console.log(content);
                JSON.parse(content);
                contentType = 'application/json;charset=UTF-8';
            } catch (err) {
                // 
            }
            console.log(contentType);
            
            proxyRes.headers['Content-Type'] = contentType;
        });
    }

    typeof cb === 'function' && cb(proxyRes, req, res);
}

// 通过配置文件设置代理
proxyConfig.map(configItem => {
    if (!configItem.target) return;
    // 解决jsessionid的问题
    let pathRewrite = typeof configItem.pathRewrite === 'object' ? Object.assign(configItem.pathRewrite, {';jsessionid=.*$': ''}) : configItem.pathRewrite;

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
        logLevel: 'info',
    }));
});

app.listen(port, () => {
    logger.info(`server app listening on port ${port}!`);
});