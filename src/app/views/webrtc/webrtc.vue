<template>
    <div class="webrtc">
        <header>
            <div class="title">WebRTC</div>
            <div class="header-user">
                <div class="header-user-name">{{userInfo.nickName}}，你好</div>
                <i class="el-icon-switch-button sign-out" @click="logout"></i>
            </div>
        </header>
        <div id="map"></div>
        <left-list></left-list>
    </div>
</template>

<script>
    import leftList from './compoments/left-list/left-list';

    export default {
        name: 'webrtc',
        components: {
            leftList
        },
        data () {
            return {
                userInfo: {}
            };
        },
        mounted () {
            this.initMap();
            this.userInfo = JSON.parse(sessionStorage.getItem('authUser'));
        },
        methods: {
            initMap () {
                let map = PCIMap.createMap('map', {
                    leftClick: true,
                    pickPosition: true,
                    pickPOI: true, // 开启鼠标点击获取POI对象
                    shouldAnimate: true, // 必须打开，否则粒子动画不生效
                    enableCollisionDetection: true,
                    imageryProvider: PCIMap.createImageryProvider({
                        type: 'arcgis',
                        url: 'http://172.25.21.59:8088/tdtmap',
                    }), //创建地图影像
                    // terrainProvider: PCIMap.createWorldTerrain(),
                    terrainProvider: new PCIMap.CesiumTerrainProvider({
                        url: 'http://172.25.21.59:8032/%E5%9C%B0%E5%9B%BE%E7%9B%B8%E5%85%B3/mapdem/%E5%B9%BF%E4%B8%9CDEM/aaa.pak/',
                        requestVertexNormals: true,
                        requestWaterMask: true,
                    }), //创建世界地形，默认为null
                    defaultView: {
                        geographic: [113.39936343816667, 23.164269285471008, 232.98075296416883], //相机飞到的经纬度位置
                        attitude: {
                            heading: 0,
                            pitch: -30,
                            roll: 0
                        } //相机姿态角，角度单位
                    }
                });
            },
            logout () {
                this.$confirm('是否要退出登录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '退出登录成功!'
                    });
                    this.$utils.clearCache();
                    this.$router.push({ name: 'login' });
                }).catch(() => {
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    @mixin textStyle($size) {
        color: white;
        line-height: 75px;
        font-size: $size;
        text-align: center;
    }

    .webrtc {
        width: 100%;
        height: 100%;
        background: black;

        header {
            width: 100%;
            height: 10%;
            position: absolute;
            top: 0;
            text-align: center;
            z-index: 1;
            font-size: 18px;
            background-image: linear-gradient(to top, transparent, #143e68);

            .title {
                color: #B0E1FE;
                width: 25%;
                height: 80%;
                line-height: 50px;
                margin: 0 auto;
                background-size: 100% 100%;
                background-image: url("../../../assets/webrtc/header.png");
            }

            .header-user {
                display: flex;
                width: 17%;
                position: absolute;
                right: 0;
                top: 0;

                &-name {
                    @include textStyle(15px);
                    text-align: right;
                    width: 68%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .sign-out {
                    @include textStyle(20px);
                    margin-left: 15px;
                    width: 22%;
                }

                .el-icon-switch-button {
                    cursor: pointer;
                }
            }
        }

        #map {
            height: 100%;
            width: 100%;
        }

    }
</style>
