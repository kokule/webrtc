<template>
    <div class="left-list">
        <div class="left-list-top">
            <div class="title-img">
                <img src="../../../../../assets/deco_title.png"/>
            </div>
            <div class="title">融合通讯</div>
            <div class="title-bg"></div>
            <div class="graphical"></div>
        </div>
        <div class="left-list-box-bg"></div>
        <div class="left-list-box">
            <div class="top-menu">
                <div class="title">已配置通话组</div>
                <div class="add-button">
                    <ecp-button type="primary" text="新建临时会话组"></ecp-button>
                </div>
            </div>
            <div class="content">
                <div class="group">
                    <div class="group-item" v-for="(item, index) in 5" :class="{'choose': isActiveIndex === index}"
                         @click="isActiveIndex = index">
                        <div class="item-img" v-show="isActiveIndex === index">
                            <img src="../../../../../assets/choose.png">
                        </div>
                        <div style="width: 98%">
                            <p>智慧城市事业部 <span :class="{'active' : isActiveIndex === index}">30</span></p></div>
                    </div>
                </div>
                <div class="right-table">
                    <div class="table-input">
                        <el-input placeholder="搜索成员" v-model="memberName">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div class="table-data">
                        <template>
                            <el-table
                                height="100%"
                                class="ecp-table"
                                :data="tableData"
                                @row-click="clickPerson"
                                highlight-current-row
                                :header-row-style="headerStyle"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    label=" "
                                    align="left"
                                    width="20">
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    width="80"
                                    align="center"
                                    label="姓名">
                                </el-table-column>
                                <el-table-column
                                    prop="phone"
                                    align="center"
                                    label="手机号/座机">
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>
                    <div class="group-button">
                        <img @click="callUserVideo" style="margin-right: 10px" src="@assets/video.png">
                        <img src="@assets/phone.png">
                        <img style="float: right" src="@assets/history.png">
                    </div>
                    <div class="input-message">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 5, maxRows: 5}"
                            placeholder="请输入推送消息"
                            v-model="sendMessage">
                        </el-input>
                    </div>
                    <ecp-button type="primary" @click="setUser" text="短信推送" style="float: right"></ecp-button>
                </div>
            </div>
        </div>
        <video-dialog ref="videoDialog" :otherUser="currentUser"></video-dialog>
    </div>
</template>

<script>
    import videoDialog from '../video-dialog/video-dialog';

    export default {
        name: 'left-list',
        components: {
            videoDialog
        },
        data() {
            return {
                memberName: '',
                isActiveIndex: 0,
                sendMessage: 'lingling',
                currentUser: null,
                headerStyle: {
                    background: '#06131F',
                    color: '#E1A51A',
                },
                tableData: [
                    {
                        name: 'qinkai',
                        phone: '15949388635'
                    },
                    {
                        name: 'kokule',
                        phone: '45346873546'
                    },
                    {
                        name: 'lingling',
                        phone: '17563245896'
                    }
                ]
            };
        },
        methods: {
            clickPerson(row, column, event) {
                console.log(row);
                this.currentUser = row
                this.$refs.videoDialog.dialogVisible = true;
            },
            callUserVideo() {
                this.$refs.videoDialog.targetUser.userId = this.currentUser.name
                this.$refs.videoDialog.callVideo()
            },
            setUser() {
                this.$refs.videoDialog.loginUser.userId = this.sendMessage
                this.$refs.videoDialog.userLogin()
            }
        }
    };
</script>

<style lang="scss" scoped>
    @mixin bg-style {
        background: #01112a;
        opacity: 0.7;
        position: absolute;
        z-index: 0;
    }

    @mixin border-style {
        border: 0.00926rem solid rgba(255, 255, 255, 0.2);
    }

    @mixin button-style {
        height: 26px;
        padding: 0 9px;
        border-radius: 0;
        background-image: linear-gradient(#00A2FF, #1CCCFF);
    }

    .left-list {
        width: 18%;
        height: 80%;
        left: 0;
        top: 10%;
        position: absolute;

        &-top {
            color: white;
            height: 5%;
            width: 100%;
            cursor: pointer;
            z-index: 10;
            display: flex;

            .title-img {
                width: 2%;
                z-index: 2;
                padding: 3% 0 0 3%;
            }

            .title {
                width: 40%;
                z-index: 2;
                padding-top: 2%;
                text-align: center;
            }

            .title-bg {
                height: 5%;
                width: 43%;
                top: 0;
                @include bg-style
            }

            .graphical {
                width: 0;
                height: 0;
                z-index: 0;
                border: 1.85vw solid;
                border-bottom: 0;
                opacity: 0.6;
                border-color: transparent transparent transparent #01112a;
            }
        }

        &-box-bg {
            height: 95%;
            width: 100%;
            top: 5%;
            @include bg-style;
        }

        &-box {
            z-index: 11;
            height: 95%;
            width: 100%;
            padding: 5% 6%;
            position: absolute;
            box-shadow: 0px 5px 30px 0px rgba(0, 0, 0, 0.4);

            .top-menu {
                display: flex;

                .title {
                    color: white;
                    font-size: 15px;
                    width: 60%;
                }

                .title:after {
                    content: "";
                    float: left;
                    width: 6px;
                    height: 20px;
                    margin: 2px 10px 0 0;
                    background: #77eeff;
                }

                .add-button {
                    .el-button {
                        @include button-style;
                    }
                }
            }

            .content {
                height: 93%;
                margin-top: 5%;
                display: flex;
                @include border-style;

                .group {
                    width: 25%;
                    color: white;
                    overflow-y: auto;
                    font-size: 11px;
                    background: rgba(0, 0, 0, 0.3);

                    &-item {
                        display: flex;
                        cursor: pointer;
                        margin-bottom: 15%;

                        .item-img {
                            height: 100%;
                            width: 2%;
                            margin-top: -38%
                        }

                        p {
                            padding: 5%;

                        }

                        .active {
                            color: #E1A51A;
                        }
                    }

                    &-item.choose {
                        margin-bottom: -35%;
                    }
                }

                .right-table {
                    width: 72%;
                    padding: 2%;

                    .el-button {
                        @include button-style;
                    }

                    .table-input {
                        .el-input__icon {
                            color: white;
                            opacity: 0.5;
                        }
                    }

                    .table-data {
                        height: 65%;
                        margin-top: 3%;
                        @include border-style;

                        .ecp-table {
                            color: white;
                            font-size: 12px;
                            background: rgba(0, 0, 0, 0.39);
                        }

                        .el-table th.is-leaf, .el-table td {
                            border-bottom: none;
                        }
                    }
                }

                .group-button {
                    height: 4%;
                    margin: 8px 0 0 0;

                    img {
                        cursor: pointer;
                    }
                }

                .input-message {
                    height: 17%;
                    margin-bottom: 8%;
                }
            }
        }

        &-box:after {
            content: "";
            width: 35px;
            height: 100%;
            position: absolute;
            right: -17px;
            top: 0;
            z-index: 10;
            background: no-repeat;
            background-image: url("../../../../../assets/rightBorder.png");
        }

    }
</style>
<style lang="scss">
    .table-input, .input-message {
        .el-input__inner {
            color: white;
            height: 28px;
            opacity: 0.5;
            border-radius: 0;
            background: #01112a;

            &::placeholder {
                color: white;
            }
        }
    }

    .input-message {
        .el-textarea__inner {
            background: #162131;
            opacity: 0.5;
            color: white;
            border-radius: 0;
            border: 0.00926rem solid rgba(255, 255, 255, 0.2);

            &::placeholder {
                color: white;
            }
        }
    }

    .table-data {
        .el-table tr {
            background: transparent;
            /*background: #01112a;*/
        }

        .el-table th, .el-table td {
            padding: 8px 0;
        }

        .current-row {
            background: #1CCCFF !important;
        }
    }

</style>
