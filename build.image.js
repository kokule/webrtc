#!/usr/bin/env node
// node > 8.4
const shell = require('shelljs');
// 更新业务代码

// 使用package.json中的配置
const packageJson = require('./package.json');
const harborConfig = packageJson.harbor;
let tag = packageJson.version;
let imageName = packageJson.imageName;
let imageHubName = packageJson.imageHubName;

let argTag = process.argv[2];
if (argTag) {
    shell.echo('==============================================================');
    shell.echo();
    shell.echo('WARNING! arg1 VERSION is present, use this TAG instead of version in package.json.');
    shell.echo();
    shell.echo('==============================================================');
}

if (!tag) {
    shell.echo('ERROE! VERSION tag is Null. ');
    shell.exit(1);
}

shell.echo();
shell.echo(`IMAGE NAME: ${imageName}`);
shell.echo(`HARBOR IMAGE NAME: ${imageHubName}`);
shell.echo(`VERSION: ${tag}`);
shell.echo();
shell.echo('========== build start ==========');

shell.cd('./');
shell.exec('cnpm install');
shell.exec('npm run build:proxy');

shell.rm('./build.tar.gz');
shell.exec('tar -zcvf build.tar.gz dist/* proxy/*');
shell.rm('-rf', './build-image/dist/', './build-image/proxy/', './build-image/build.tar.gz');
shell.mv('./build.tar.gz', './build-image/');

shell.cd('./build-image/');
shell.exec('tar -xf build.tar.gz');

shell.exec(`docker login -u ${harborConfig.user} --password ${harborConfig.password} ${harborConfig.host}`);
shell.exec(`docker rmi ${imageName}:${tag}`);
shell.exec(`docker rmi ${imageHubName}:${tag}`);
shell.exec(`docker build -t ${imageName}:${tag} .`);
shell.exec(`docker tag ${imageName}:${tag} ${imageHubName}:${tag}`);
shell.exec(`docker push ${imageHubName}:${tag}`);
