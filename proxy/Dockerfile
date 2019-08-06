# node的基础镜像，将用到的依赖打包进去
FROM node:10.15.0-alpine

RUN mkdir /app

WORKDIR /app

# install 会打进镜像里面
COPY ./package.json /app
RUN npm install --registry=https://registry.npm.taobao.org

CMD ["/bin/sh"]