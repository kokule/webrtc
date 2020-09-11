<template>
    <div class="left-list">
        <div class="left-list-top">
            <div class="title-img">
                <img src="../../../../../assets/webrtc/deco_title.png" alt="标题图标"/>
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
                    <ecp-button type="primary" @click="showSessionDialog" text="新建临时会话组"></ecp-button>
                </div>
            </div>
            <div class="content">
                <div class="group">
                    <div class="group-item" v-for="(item, index) in sessionGroup"
                         :class="{'choose': isActiveIndex === index}"
                         @dblclick="deleteGroup(item)"
                         @click="chooseGroup(item,index)">
                        <div class="item-img" v-show="isActiveIndex === index">
                            <img src="../../../../../assets/webrtc/choose.png" alt="选中图标"/>
                        </div>
                        <div style="width: 98%">
                            <p>{{item.chatSession.title}} <span :class="{'active' : isActiveIndex === index}">({{item.chatUserVos.length}})</span>
                            </p></div>
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
                                @row-dblclick="clickPerson"
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
                                    align="center"
                                    label="姓名">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ getUserById(scope.row.userId) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="在线状态">
                                    <template slot-scope="scope">
                                        <span style="margin-left: 10px">{{ getStatus(scope.row.chatUserStatus) }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>
                    <div class="group-button">
                        <img @click="callUserVideo" alt="video" style="margin-right: 10px"
                             src="@assets/webrtc/video.png">
                        <img alt="phone" src="@assets/webrtc/phone.png">
                        <img alt="chat" @click="chatMessageVisible = !chatMessageVisible" style="float: right"
                             src="@assets/webrtc/history.png">
                    </div>
                    <div class="input-message">
                        <el-input
                            type="textarea"
                            placeholder="请输入推送消息"
                            v-model="messageData.content">
                        </el-input>
                    </div>
                    <ecp-button type="primary" @click="sendMessage" text="消息推送" style="float: right"></ecp-button>
                </div>
            </div>
        </div>
        <video-dialog ref="videoDialog"></video-dialog>
        <add-session-dialog ref="sessionDialog"
                            @init="init"
                            @showSessionDialog="showSessionDialog"
                            :sessionDialogVisible="sessionDialogVisible">
        </add-session-dialog>
        <chat-message-dialog
            ref="chatMessageDialog"
            @closeDialog="closeDialog"
            :chatMessageVisible="chatMessageVisible"
            :currentSessionId="currentSessionId"
        ></chat-message-dialog>

    </div>
</template>

<script>
    import videoDialog from '../video-dialog/video-dialog';
    import addSessionDialog from '../add-session-dialog/add-session-dialog';
    import chatMessageDialog from '../chat-message-dialog/chat-message-dialog';
    import {userLogin, callVideo} from '../../../../../websocket'

    export default {
        name: 'left-list',
        components: {
            videoDialog,
            addSessionDialog,
            chatMessageDialog
        },
        data() {
            return {
                memberName: '',
                isActiveIndex: 0,
                currentUser: null,
                currentSessionId: '',
                chatMessageVisible: false,
                sessionDialogVisible: false,
                sessionGroup: [],
                tableData: [],
                allUserList: [],
                headerStyle: {
                    background: '#06131F',
                    color: '#E1A51A',
                },
                messageData: {
                    content: '',
                    chatSessionId: '',
                    messageType: 1,
                }
            };
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.$api.chatApi.getChatSession().then(res => {
                    this.sessionGroup = res.data
                    this.chooseGroup(res.data[0], 0)
                })
            },
            chooseGroup(item, index) {
                this.isActiveIndex = index
                this.tableData = []
                if (item) {
                    this.currentSessionId = item.chatSession.id;
                    this.tableData = item.chatUserVos
                }

            },
            deleteGroup(item) {
                this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$api.chatApi.deleteSessionGroup(item.chatSession.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.init();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            getUserById(id) {
                let name = '';
                this.$store.state.user.userList.forEach(e => {
                    if (e.id === id) {
                        name = e.nickName;
                    }
                })
                return name;
            },
            getStatus(status) {
                return this.$config.communicationStatus[status];
            },
            showSessionDialog() {
                this.sessionDialogVisible = !this.sessionDialogVisible;
            },
            closeDialog() {
                this.chatMessageVisible = !this.chatMessageVisible;
            },
            clickPerson(row, column, event) {
                let otherUser = this.$store.state.user.userList.filter(e => e.id === row.userId)[0].account;
                sessionStorage.setItem('targetUserId', otherUser);
                callVideo();
            },
            callUserVideo() {
                this.$refs.videoDialog.dialogVisible = true;
                userLogin();
            },
            sendMessage() {
                this.messageData.chatSessionId = this.currentSessionId;
                this.$api.chatApi.sendMessage(this.messageData).then(res => {
                    this.messageData.content = '';
                    this.$refs.chatMessageDialog.getChatMessage();
                })
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
                font-size: 17px;
                font-weight: bold;
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
                    height: 15%;
                    margin-bottom: 6%;
                    overflow-y: auto;
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
            background-image: url("../../../../../assets/webrtc/rightBorder.png");
        }

    }
</style>
<style lang="scss">


    .input-message {
        .el-textarea__inner {
            background: #162131;
            opacity: 0.5;
            color: white;
            border-radius: 0;
            min-height: 0 !important;
            height: 100% !important;
            border: 0.00926rem solid rgba(255, 255, 255, 0.2);

            &::placeholder {
                color: white;
            }
        }
        .el-textarea {
            height: 100%;
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
