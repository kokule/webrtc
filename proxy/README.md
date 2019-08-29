## 代理服务（基于node）

## server启动说明

启动支持参数

- -p 8080

修改http启动的端口，默认80

> https只能通过配置文件设置端口，此参数只支持调整http的端口

### https

- 如果没有证书需要先自己生成密钥、证书（private.pem，file.crt）

- **!!! 请注意：自签名的证书浏览器会报安全提示，无法解决，请知悉**

```bash
＃生成私钥key文件
openssl genrsa 1024 > /path/to/private.pem
//
＃通过私钥文件生成CSR证书签名
openssl req -new -key /path/to/private.pem -out csr.pem
//
＃通过私钥文件和CSR证书签名生成证书文件 有效期：3650天
openssl x509 -req -days 3650 -in csr.pem -signkey /path/to/private.pem -out /path/to/file.crt
```

> 需要支持openssl的地方生成

- 配置文件

config.js配置文件中，可以指定serverConfig，自定义服务配置

> 如果module.exports没有暴露此变量，请手动添加

```js
const serverConfig = {
    // 可选
    http: {
        port: 80, // 端口，默认80
        disabled: false, // 是否禁用http服务，默认为false
        timeout: 0 // 请求超时时间，默认0
    },
    // 可选
    https: {
        port: 443, // 端口，默认443
        disabled: true, // 是否禁用https服务，默认为true，不启用https
        timeout: 0, // 请求超时时间，默认0
        key: '', // https的密钥路径，默认 ./ssl/private.pem
        cert: '' // https的证书路径 more ./ssl/file.crt
    }
};
```

- k8s

如果使用k8s建议将证书、密钥放到configmap中使用

- configmap的yaml文件示例

```yaml
containers:
  volumeMounts:
  - name: config-ssl
    mountPath: /app/ssl
  volumes:
    - name: config-ssl
    # 挂载整个目录
    configMap:
      name: config-ssl
```

```bash
# -n test 添加到指定的命名空间中
# 删除configmap
kubectl delete configmap config-ssl -n test

# 生成configmap
kubectl create configmap config-ssl --from-file=../ssl -n test
```

### 镜像使用说明

> **构建镜像不改版本号时，请删除原有镜像，否则会有不可预见的问题出现！！**

#### 镜像分为基础镜像和前端资源

1. 构建基础镜像

执行proxy下的Dockerfile构建基础镜像

> 基础镜像的依赖是按 proxy/package.json 进行加载的，所以修改package.json的依赖需要重新构建基础镜像

```
# 基础镜像的Dockerfile

# node的基础镜像，将用到的依赖打包进去
FROM node:10.15.0-alpine

RUN mkdir /app

WORKDIR /app

# install 会打进镜像里面
COPY ./package.json /app
RUN npm install --registry=https://registry.npm.taobao.org

CMD ["/bin/sh"]
```

> 验证镜像是否构建成功

```
# 构建镜像
# 镜像名和版本号按实际情况调整
# 注意后面的点( . )
docker build -t node-base:1.0.0 . 

# 生成容器
docker run -itd --name node-base node-base:1.0.0

# 进入容器
docker exec -it node-base /bin/sh

# 查看是否有 node_modules，node版本
```

2. 前端打包

```
# jenkins 打包脚本

cnpm install
npm run build
rm -rf pciopen2.0.tar.gz
# 注意按要求打包指定目录
tar -zcvf pciopen2.0.tar.gz dist/* proxy/*
```

3. 构建业务镜像

将前端的tar.gz包解压，放到业务镜像的Dockerfile（注意，不是基础镜像的Dockerfile）的同级目录下

主要包含这三个资源：/dist/*、 /proxy/*、 Dockerfile

```
# 业务镜像的Dockerfile

# 镜像的构建脚本
# 此脚本放到服务器上执行

# 镜像名和版本号按实际情况调整
FROM harbor.pcitech.com/prophet/node-base:1.3.0

COPY ./dist /app/public/
COPY ./proxy /app/

WORKDIR /app

RUN rm -rf public/index.html

# 仅声明
EXPOSE 80 443

CMD node server.js
```

> 验证镜像是否构建成功

```
# 构建镜像
# 镜像名和版本号按实际情况调整
# 注意后面的点( . )
docker build -t pciopen2.0:1.0.0 .

# 生成容器
docker run -itd -p 8088:80 --name pciopen2.0 pciopen2.0:1.0.0 
docker run -itd -p 8088:80 -p 8443:443 --name pciopen2.0 pciopen2.0:1.0.0 # 多个端口

# http访问8088端口验证
# https访问8443端口验证
# 访问不了可以进入容器排序
docker exec -it pciopen2.0 /bin/sh
```

> 日志路径: /app/logs
