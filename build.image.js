#!/usr/bin/env node
// node > 8.4
require('shelljs/global');
// 更新业务代码

// 使用package.json中的配置
const packageJson = require('./package.json');
const harborConfig = packageJson.harbor;
let tag = packageJson.version;
let imageName = packageJson.imageName;
let imageHubName = packageJson.imageHubName;


let argTag = process.argv[2];
if (argTag) {
    echo('==============================================================');
    echo();
    echo('WARNING! arg1 VERSION is present, use this TAG instead of version in package.json.');
    echo();
    echo('==============================================================');
}

if (!tag) {
    echo('ERROE! VERSION tag is Null. ');
    exit(1);
}

echo();
echo(`IMAGE NAME: ${imageName}`);
echo(`HARBOR IMAGE NAME: ${imageHubName}`);
echo(`VERSION: ${tag}`);
echo();
echo('========== build start ==========');

cd('./');
exec('cnpm install');
exec('npm run build');

rm('./build.tar.gz');
exec('tar -zcvf build.tar.gz dist/* proxy/*');
rm('-rf', './build-image/dist/', './build-image/proxy/', './build-image/build.tar.gz');
mv('./build.tar.gz', './build-image/');

cd('./build-image/');
exec('tar -xf build.tar.gz');

exec(`docker login -u ${harborConfig.user} --password ${harborConfig.password} ${harborConfig.host}`);
exec(`docker rmi ${imageName}:${tag}`);
exec(`docker rmi ${imageHubName}:${tag}`);
exec(`docker build -t ${imageName}:${tag} .`);
exec(`docker tag ${imageName}:${tag} ${imageHubName}:${tag}`);
exec(`docker push ${imageHubName}:${tag}`);
