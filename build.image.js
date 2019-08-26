#!/usr/bin/env node

// node >= 10.15.0
const shell = require('shelljs');

const LOCK_VERSION_MAP = {
    DEFAULT: 'default', //  默认
    ENABLE: 'enable', // 启用锁定
    DISABLE: 'disable', // 不启用锁定
    DATE: 'date', // 只添加日期
    RANDOM: 'random' // 只添加随机数
};

// 帮助信息
const HELP_MESSAGES = [
    '',
    'Usage: node build.image.js [version] [options]',
    '',
    'Version: use it as image version',
    '',
    'Options:',
    '    -v specified version, default use config file version',
    '    -c specified config file, default ./package.json',
    '    -l, --lock lock version don\'t add extra string in image version which consist of date and random number',
    '\t1. enable, lock and don\'t add extra string',
    '\t2. disable, don\'t lock and add extra string',
    '\t3. date, only add date string',
    '\t4. random, only add random string',
    ''
];

const matchLockMap = (value) => {
    for (let key in LOCK_VERSION_MAP) {
        if (key === 'DEFAULT') {
            continue;
        }
        if (value === LOCK_VERSION_MAP[key]) {
            return true;
        }
    }
    return false;
};

let configPath = ''; // 配置文件的路径
let argTag = null; // 版本号
let lockVersion = LOCK_VERSION_MAP.DEFAULT; // 锁定版本

// 处理参数
// 通过命令行指定版本号，默认启用锁定版本号
const args = process.argv.splice(2);
// 第一个参数如果非参数形式默认作为版本号
if (!/^-+[a-zA-Z]*$/.test(args[0])) {
    argTag = args[0];
    lockVersion = LOCK_VERSION_MAP[argTag ? 'ENABLE' : 'DEFAULT'];
}
for (let i = 0, len = args.length; i < len; i++) {
    if (args[i] === '-h') {
        HELP_MESSAGES.forEach(d => shell.echo(d));
        shell.exit(1);
    }
    if (args[i] === '-v') {
        i++;
        argTag = args[i];
        lockVersion = LOCK_VERSION_MAP[argTag ? 'ENABLE' : 'DEFAULT'];
    }
    if (args[i] === '-c') {
        i++;
        configPath = args[i];
    }
    if (args[i] === '-l' || args[i] === '--lock') {
        const hasMatch = matchLockMap(args[i + 1]);
        // 没有匹配值，默认锁定
        if (hasMatch) {
            i++;
            lockVersion = args[i];
        } else {
            lockVersion = LOCK_VERSION_MAP.ENABLE;
        }
    }
}

if (!configPath) {
    configPath = './package.json'; // 默认使用package.json
}

// 使用package.json中的配置
let packageJson = null;
try {
    packageJson = require(configPath);
} catch (error) {
    shell.echo(`ERROR! please check file: "${configPath}"`);
    shell.echo(`ERROR MESSAGE: ${error.message}`);
    shell.exit(1);
}
const harborConfig = packageJson.harbor;
let tag = packageJson.version;
let imageName = packageJson.imageName;
let imageHubName = packageJson.imageHubName;
if (lockVersion === LOCK_VERSION_MAP.DEFAULT) {
    if (packageJson.lockVersion && matchLockMap(packageJson.lockVersion)) {
        lockVersion = packageJson.lockVersion;
    } else {
        // 使用配置文件中的版本号，默认添加随机版本号
        lockVersion = LOCK_VERSION_MAP.DISABLE;
    }
}

if (argTag) {
    shell.echo('==============================================================');
    shell.echo();
    shell.echo(`WARNING! arg1 VERSION is present, use this TAG instead of version in ${configPath}`);
    shell.echo();
    shell.echo('==============================================================');
    tag = argTag;
}

if (!tag) {
    shell.echo('ERROE! VERSION tag is Null. ');
    shell.exit(1);
}

const addZero = (d, len = 2) => {
    let max = Math.pow(10, len);
    if (d >= max) return String(d);
    return String(max + Number(d)).slice(1);
};

// 版本号增加6位随机数: 日期+两位随机数
if (lockVersion !== LOCK_VERSION_MAP.ENABLE) {
    // 添加日期、随机数
    const RANDOM_MAX = 3;
    let date = new Date();
    let random = '' + parseInt(Math.random() * Math.pow(10, RANDOM_MAX));
    let m = date.getMonth() + 1;
    let d = date.getDate();
    switch (lockVersion) {
    case LOCK_VERSION_MAP.DATE: tag += `-${addZero(m)}${addZero(d)}`; break;
    case LOCK_VERSION_MAP.RANDOM: tag += `-${addZero(random, RANDOM_MAX)}`; break;
    default:
        tag += `-${addZero(m)}${addZero(d)}${addZero(random, RANDOM_MAX)}`;
    }
}

shell.echo();
shell.echo(`CONFIG FILE PATH: ${configPath}`);
shell.echo(`IMAGE NAME: ${imageName}`);
shell.echo(`HARBOR IMAGE NAME: ${imageHubName}`);
shell.echo(`VERSION: ${tag}`);
shell.echo();
shell.echo('========== build start ==========');

shell.rm('./build.tar.gz');
shell.exec('tar -zcvf build.tar.gz dist/* proxy/*');
shell.rm('-rf', './build-image/dist/', './build-image/proxy/', './build-image/build.tar.gz');
shell.mv('./build.tar.gz', './build-image/');

shell.cd('./build-image/');
shell.exec('tar -zvxf build.tar.gz');

if (harborConfig && harborConfig.host && harborConfig.user && harborConfig.password) {
    shell.exec(`docker login -u ${harborConfig.user} --password ${harborConfig.password} ${harborConfig.host}`);
} else {
    shell.echo('harbor config not set, please ensure docker login.');
}
shell.exec(`docker rmi ${imageName}:${tag}`);
shell.exec(`docker rmi ${imageHubName}:${tag}`);
shell.exec(`docker build -t ${imageName}:${tag} .`);
shell.exec(`docker tag ${imageName}:${tag} ${imageHubName}:${tag}`);
shell.exec(`docker push ${imageHubName}:${tag}`);

shell.echo('========== build end ==========');
