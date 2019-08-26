/*
    替换html为ejs 并注入 IMPORT_CONFIGS 的简单脚本
*/

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');

let indexEjs = indexHtml;

let IM_CONF_REG = /<script>[^<>]*IMPORT_CONFIGS[^<>]*<\/script>/;
let insertTemp = '<script>window.IMPORT_CONFIGS = JSON.parse(\'<%- JSON.stringify(IMPORT_CONFIGS)%>\');</script>';

// 判断是否有 IMPORT_CONFIGS 变量，有则替换，否则插入
if (IM_CONF_REG.test(indexHtml)) {
    indexEjs = indexHtml.replace(IM_CONF_REG, insertTemp);
} else {
    // 插入到head末尾中
    indexEjs = indexHtml.replace('</head>', insertTemp + '</head>');
}

const viewsPath = path.resolve(__dirname, './views');
let viewsExist = false;
try {
    viewsExist = fs.readdirSync(viewsPath);
} catch (error) {
    viewsExist = false;
}
if (!viewsExist) {
    fs.mkdirSync(viewsPath);
}

fs.writeFileSync(path.resolve(__dirname, './views/index.ejs'), indexEjs);
