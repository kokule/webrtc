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

2、先运行 npm install 或者直接安装 shelljs：npm i -D shelljs（全局：npm i -g shelljs）

3、build.image.js 脚本会获取package.json的配置构建镜像并推送

```bash
node build.image.js
# or 
node build.image.js 1.0.0
```

> 如果最后带上了版本号，构建的镜像会以命令中的版本号为准