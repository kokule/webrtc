## 代理服务（基于node）

> **构建镜像不改版本号时，请删除原有镜像，否则会有不可预见的问题出现！！**

### 使用说明

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
FROM node-base:1.3.0 

COPY ./dist /app/public/
COPY ./proxy /app/

WORKDIR /app

RUN rm -rf public/index.html

EXPOSE 80

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

# 访问8088端口验证
# 访问不了可以进入容器排序
docker exec -it pciopen2.0 /bin/sh
```

> 日志路径: /app/logs

## server启动说明

启动支持参数

- -p 8080

修改启动的端口，默认80
