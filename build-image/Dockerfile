# 业务镜像的Dockerfile

# 镜像的构建脚本
# 此脚本放到服务器上执行

# 镜像名和版本号按实际情况调整
# node 基础镜像
FROM harbor.pcitech.com/prophet/node-base:1.3.0

COPY ./dist /app/public/
COPY ./proxy /app/

WORKDIR /app

RUN rm -rf public/index.html

EXPOSE 80

CMD node server.js