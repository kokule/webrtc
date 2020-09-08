<template>
    <div class="main">
        <div class="header">
            <div class="header-title">AR三维实景融合技术平台</div>
            <div class="header-menu">
                <div class="header-menu-item" v-for="(item,index) in topMenuList" :key="item.title"
                     :class="{active: currentMenuIndex === index}" @click="clickMenu(index)">{{item.title}}
                </div>
            </div>
            <div class="header-user">
                <div class="header-user-name">系统管理员</div>
                <i class="el-icon-switch-button sign-out"></i>
            </div>
        </div>
        <div id="map"></div>
        <div class="left-menu">
            <div class="left-menu-top" @click="isShowListType ='floorNodeList'">
                楼层节点列表
            </div>
            <div class="left-menu-bottom" @click="isShowListType= 'tiltDataList'">
                倾斜数据列表
            </div>
        </div>
        <transition name="slide-fade">
            <div class="floor-node-list common-bg" v-show="isShowListType ==='floorNodeList'">
                <div class="content">
                    <el-checkbox v-model="fineModel">精细模型77</el-checkbox>
                    <p>分层模型4</p>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox v-for="item in checkModelList" :label="item.value" :key="item.value">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <p>分层模型40</p>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox v-for="item in layeredModelList" :label="item.value" :key="item.value">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="close-bottom">
                    <i class="el-icon-d-arrow-left" @click="isShowListType =''"></i>
                </div>
            </div>
        </transition>
        <transition name="slide-fade">
            <div class="tilt-data-list common-bg" v-show="isShowListType ==='tiltDataList'">
                <div class="content">
                    <p>佳都智慧大厦</p>
                </div>
                <div class="close-bottom">
                    <i class="el-icon-d-arrow-left" @click="isShowListType =''"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { topMenuList, checkModelList, layeredModelList } from '../../../app/test-data/main';

    export default {
        name: 'header.vue',
        data () {
            return {
                topMenuList,
                checkModelList,
                layeredModelList,
                fineModel: '',
                checkList: [],
                isShowListType: '',
                currentMenuIndex: 0,
            };
        },
        mounted () {
            this.initMap();
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
                        // url: 'http://172.28.50.186/dem',
                        // url: 'http://172.25.21.59:8032/mappic/dem',
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
                // map.addImageryLayer({
                //     type: 'arcgis',
                //     url: 'http://172.25.21.59:8088/tdtmap'
                // });
                // window.map = map;
                // map.camera.flyTo({
                //     destination: PCIMap.Cartesian3.fromDegrees(113.4000, 23.1605, 700), //相机飞到的位置，必须是Cartesian3对象
                //     orientation: { //相机姿态角，弧度单位
                //         heading: PCIMap.Math.toRadians(0),
                //         pitch: PCIMap.Math.toRadians(-45),
                //         roll: PCIMap.Math.toRadians(0),
                //     },
                //     // duration: 2, //飞行时间，单位秒，可不填
                // });
            },
            clickMenu (index) {
                this.currentMenuIndex = index;
            }
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

    .main {
        width: 100%;
        height: 100%;

        #map {
            width: 100%;
            height: 93%;
        }

        .header {
            width: 100%;
            height: 70px;
            display: flex;
            background: #283043;

            &-title {
                width: 18%;
                font-weight: bold;
                @include textStyle(25px);
            }

            &-menu {
                display: flex;
                width: 75%;

                &-item {
                    padding: 0 10px;
                    cursor: pointer;
                    @include textStyle(15px);
                }

                &-item:hover, &-item.active {
                    border-bottom: 3px solid aqua;
                }
            }

            &-user {
                display: flex;

                &-name {
                    @include textStyle(15px);
                    cursor: pointer;
                }

                .sign-out {
                    @include textStyle(20px);
                    margin-left: 15px;
                }
            }
        }

        .left-menu {
            position: absolute;
            width: 30px;
            height: 200px;
            left: 0;
            top: 70px;

            &-top, &-bottom {
                width: 100%;
                height: 50%;
                border: 1px white solid;
                padding: 5px 7px;
                font-size: 11px;
                line-height: 14px;
                background: #283043;
                color: white;
                cursor: pointer;
            }
        }

        .floor-node-list, .tilt-data-list {
            position: absolute;
            width: 200px;
            left: 1px;
            display: flex;
            border: 1px solid white;

            .close-bottom {
                width: 15%;

                .el-icon-d-arrow-left {
                    color: #77eeff;
                    font-size: 30px;
                    cursor: pointer;
                }
            }
        }

        .floor-node-list {
            height: 400px;
            top: 70px;

            .content {
                width: 85%;
                padding: 10px 30px;

                p {
                    color: white;
                    font-size: 13px;
                    margin-left: -15px;
                }

                ::v-deep .el-checkbox {
                    line-height: 5px;
                    margin-top: -3px;
                }

                ::v-deep .el-checkbox__label {
                    color: white;
                    font-size: 12px;
                }

                ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
                    background-color: #409EFF;
                    border-color: #409EFF;
                }

                ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
                    margin-top: -2px;
                    margin-left: -1px;
                }

                ::v-deep .el-checkbox__inner {
                    width: 13px;
                    height: 13px;
                }
            }

            .close-bottom {
                .el-icon-d-arrow-left {
                    margin-top: 180px;
                }
            }
        }

        .tilt-data-list {
            height: 100px;
            padding: 5px;
            top: 170px;

            .content {
                width: 85%;
            }

            .close-bottom {
                .el-icon-d-arrow-left {
                    margin-top: 30px;
                }
            }

            p {
                color: white;
            }
        }

        /* 可以设置不同的进入和离开动画 */
        /* 设置持续时间和动画函数 */
        .slide-fade-enter-active {
            transition: all .5s ease;
        }

        .slide-fade-leave-active {
            transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }

        .slide-fade-enter, .slide-fade-leave-to
            /* .slide-fade-leave-active for below version 2.1.8 */
        {
            transform: translateX(-100px);
            opacity: 0;
        }
    }
</style>
