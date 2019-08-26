# template-vue

### 技术栈

- vue全家桶：vue + vuex + vue-router + element-ui
- @pci/common-ui：基于element-ui封装的 [公共组件库](http://172.25.20.65:4873/-/web/detail/@pci/common-ui)

    > 需要配置npm register：npm set registry http://172.25.20.65:4873

- loadsh：部分常用方法（如类型判断等）推荐使用 [lodash](https://www.lodashjs.com/docs/latest)

### 使用命令

- Project setup
```bash
npm install
```

- Compiles and hot-reloads for development
```bash
npm run serve
```

- Compiles and minifies for production
```bash
npm run build
```

- build for proxy
```bash
npm run build:proxy
```

- Run your tests
```bash
npm run test
```

- Lints and fixes files
```bash
npm run lint
```

> Customize configuration: See [Configuration Reference](https://cli.vuejs.org/config/).

### 代理说明

> 生产环境中，本项目推荐使用node进行接口代理

proxy目录为node代理的相关内容，proxy/config.js 为代理配置文件

- 在proxy数组中，添加接口代理配置项

```js
// 具体配置参考 http-proxy-middleware
{
    context: ['/api'],
    target: 'http://172.0.0.1:8081',
    ws: false,
    changeOrigin: false,
    pathRewrite: {
        '^/api': '/api',
    },
    disableProxyRes: true, // 自定义的配置项：不启用响应代理，默认会给所有添加json响应头
    onProxyRes(proxyRes, req, res) {
        // ...
    },
},
```

- IMPORT_CONFIGS为注入到页面中的变量

### 镜像构建说明

如果生产环境支持docker/k8s可以使用容器进行部署

0、proxy中的dockerfile是基础镜像的，需要在proxy目录中先行构建，具体内容请查看proxy/README.md

1、在package.json 中调整 version、imageName、imageHubName、harbor等配置

2、需要先构建打包前端资源

```bash
npm config set registry http://registry.npm.taobao.org/
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm install
npm run build:proxy
```

3、build.image.js 脚本会获取package.json的配置构建镜像并推送

> ### 请确保已经成功执行过 npm install，否则脚本不能正常执行

- 执行以下命令构建镜像

```bash
node build.image.js
# or 
node build.image.js 1.0.0
```

- 更多参数

```bash
node build.image.js -v 1.1.0 -c ./config.json -l
```

-h 查看使用说明

-c 指定配置文件，不指定时默认读取package.json，必须为json文件

-v 指定参数，不指定时默认读取配置文件中的version作为版本号，并且会默认添加随机版本号

-l, --lock 锁定版本号，请作为最后的参数使用，强制不在版本号后面添加日期+随机数（日期只有月、日），有四种取值

    - enable 启用
    - disable 不启用锁定
    - date 只添加日期
    - random 只添加随机数

补充说明：

1) 第一个参数：如果第一个参数不是命令的形式，会将此参数作为版本号，构建的镜像会以命令中的版本号为准

2) 随机数使用说明：增加随机数是为了在持续集成中区分每次构建的镜像，因此：

- 使用配置文件的版本号时，默认会添加随机数，不启用lock
- 使用命令行指定版本号时，默认启用lock，不会添加随机数，如果确实需要，将lock设为false： -l disable 

3) 注意在命令行中指定的版本号（包括-v和第一个参数指定），会默认启用 --lock，如果需要随机数请使用lock参数

config.json
```json
{
    "version": "0.1.0",
    "lockVersion": "disable",
    "imageName": "template-vue",
    "imageHubName": "harbor.pcitech.com/prophet/template-vue",
    "harbor": {
        "user": "admin",
        "password": "suntek",
        "host": "harbor.pcitech.com"
    }
}
```

> 注意：harbor配置是用于docker登录，如不提供，请确保在执行build.image.js前，已经登录

```bash
# 登录命令参考
docker login -u ${harborConfig.user} --password ${harborConfig.password} ${harborConfig.host}
```