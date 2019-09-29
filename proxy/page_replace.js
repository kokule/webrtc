/*
    替换html为ejs 并注入 IMPORT_CONFIGS 的简单脚本
*/

const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../dist/index.html'); // index.html
const viewsDirPath = path.resolve(__dirname, './views'); // views目录

let indexHtml = '';
try {
    indexHtml = fs.readFileSync(indexPath, 'utf-8');
} catch (err) {
    console.log('ERROR! dist/index.html不存在，请先执行build命令'); // eslint-disable-line
    process.exit(1);
}

let indexEjs = indexHtml;

let IM_CONF_REG = /<script>[^<>]*IMPORT_CONFIGS[^<>]*<\/script>/;
let insertTemp = '<script>window.IMPORT_CONFIGS = JSON.parse(\'<%- JSON.stringify(IMPORT_CONFIGS)%>\');</script>';

console.log('\n****** 替换脚本 开始执行 ******'); // eslint-disable-line

// 判断是否有 IMPORT_CONFIGS 变量，有则替换，否则插入
if (IM_CONF_REG.test(indexHtml)) {
    indexEjs = indexHtml.replace(IM_CONF_REG, insertTemp);
} else {
    // 插入到head末尾中
    indexEjs = indexHtml.replace('</head>', insertTemp + '</head>');
}

// 校验是否有views目录
let viewsExist = false;
try {
    viewsExist = fs.readdirSync(viewsDirPath);
} catch (error) {
    viewsExist = false;
}

// 没有views目录则生成
if (!viewsExist) {
    fs.mkdirSync(viewsDirPath);
}

// 生成index.ejs模板
fs.writeFileSync(path.resolve(__dirname, `${viewsDirPath}/index.ejs`), indexEjs);
console.log('生成proxy/views/index.ejs'); // eslint-disable-line

// 删除index.html
fs.unlinkSync(indexPath);
console.log('删除dist/index.html'); // eslint-disable-line

console.log('\n** 请将views/index.ejs复制到部署目录中，否则服务会报找不到入口文件的错误！！\n'); // eslint-disable-line
console.log('****** 替换脚本 完成执行 ******\n'); // eslint-disable-line
