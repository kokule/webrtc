<template>
    <el-dialog
        width="25%"
        title="新增临时会话组"
        :modal="false"
        @close="closeDialog"
        custom-class="add-session-dialog"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false">
        <span slot="footer" class="dialog-footer">
           <el-button class="cancel" @click="dialogVisible = false">取 消</el-button>
           <el-button class="make-sure" type="primary" @click="makeSure">确 定</el-button>
        </span>
        <div class="background-top"></div>
        <div class="background-bottom"></div>
        <div class="background-box"></div>
        <div class="new-group-name">会话组名称：
            <el-input v-model="sessionData.title" style="width: 70%"></el-input>
        </div>
        <div class="group-list">
            <div class="list-title">
                <div class="list-title-all">
                    <span class="spot"></span>
                    <span>所有成员列表</span>
                </div>
                <div class="list-title-new">
                    <span class="spot"></span>
                    <span>新增组员列表</span>
                </div>
            </div>
            <div class="list-content">
                <div class="all-list" @mouseleave="allUserOneIndex = ''">
                    <div class="list-item" v-for="(item,index) in allUserList" @mouseover="allUserOneIndex = index">
                        <div class="list-item-name">{{item.nickName}}</div>
                        <i v-show="allUserOneIndex === index" @click="addNewUser(item,index)"
                           class="el-icon-right list-item-right"></i>
                    </div>
                </div>
                <div class="new-list" @mouseleave="newUserOneIndex = ''">
                    <div class="list-item" v-for="(item,index) in newUserList" @mouseover="newUserOneIndex = index">
                        <div class="list-item-name">{{item.nickName}}</div>
                        <i v-show="newUserOneIndex === index" @click="deleteNewUser(item,index)"
                           class="el-icon-delete list-item-right"></i>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'add-session',
        props: {
            sessionDialogVisible: {
                type: Boolean
            }
        },
        watch: {
            sessionDialogVisible(newValue) {
                if (!this.allUserList.length) {
                    this.filterUserList()
                }
                this.dialogVisible = newValue;
            }
        },
        data() {
            return {
                dialogVisible: false,
                groupName: '',
                allUserOneIndex: '',
                newUserOneIndex: '',
                allUserList: [],
                newUserList: [],
                sessionData: {
                    bizId: '',
                    bizType: 0,
                    chatType: 2,
                    chatUsers: [],
                    subTitle: '',
                    title: ''
                }
            };
        },
        mounted() {
        },
        methods: {
            /**
             * 过滤掉当前登录的用户
             */
            filterUserList() {
                this.allUserList = JSON.parse(JSON.stringify(this.$store.state.user.userList))
                    .filter(e => e.id !== JSON.parse(sessionStorage.getItem('authUser')).id)
            },
            closeDialog() {
                this.$emit('showSessionDialog')
            },
            addNewUser(item, index) {
                this.allUserList.splice(index, 1)
                item.historyIndex = index;
                this.newUserList.push(item)
            },
            deleteNewUser(item, index) {
                this.newUserList.splice(index, 1)
                this.allUserList.splice(item.historyIndex, 0, item)
            },
            makeSure() {
                this.sessionData.chatUsers = []
                if (!this.newUserList.length) {
                    this.$message('新增组员不能为空')
                    return
                }
                if (!this.sessionData.title) {
                    this.$message('组名不能为空')
                    return
                }
                let currentUser = {
                    bizType: 0,
                    userId: JSON.parse(sessionStorage.getItem('authUser')).id,
                    userRole: 1
                }
                this.sessionData.chatUsers.push(currentUser);
                this.newUserList.forEach(e => {
                    let data = {
                        bizType: 0,
                        userId: e.id,
                        userRole: 3
                    }
                    this.sessionData.chatUsers.push(data)
                })
                this.$api.chatApi.addSessionGroup(this.sessionData).then(res => {
                    this.$message({message: res.message});
                    this.newUserList = [];
                    this.dialogVisible = false;
                    this.$emit('init')
                    this.filterUserList()
                })
            }
        }
    }
    ;
</script>

<style lang="scss">
    @mixin button-style {
        height: 26px;
        padding: 0 9px;
        border-radius: 0;
        margin-top: 15px;
    }

    .el-dialog__wrapper {
        z-index: 0 !important;
    }

    .add-session-dialog {
        position: relative;
        z-index: 15;
        background: transparent;
        .dialog-footer {
            padding: 0 20px;
            .cancel {
                @include button-style();
                background-image: linear-gradient(transparent, transparent);
            }
            .make-sure {
                @include button-style();
                background-image: linear-gradient(#00A2FF, #1CCCFF);
            }
        }
        .background-top, .background-bottom {
            width: 50%;
            height: 200px;
            position: absolute;
            z-index: -1;
            background: no-repeat;
        }
        .background-top {
            top: -5px;
            left: -5px;
            background-image: url("../../../../../assets/webrtc/videoPanelBorderL.png");
        }
        .background-bottom {
            top: 322px;
            right: -3px;
            background-image: url("../../../../../assets/webrtc/videoPanelBorderR.png");
        }
        .background-box {
            width: 100%;
            height: 92%;
            left: 0;
            top: 34px;
            position: absolute;
            background: #01112a;
            opacity: 0.5;
            z-index: -1;
        }
        .new-group-name {
            color: white;
            z-index: 30;
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

        .group-list {
            width: 100%;
            height: 100%;
            .list-title {
                display: flex;
                .list-title-all, .list-title-new {
                    width: 48%;
                    color: white;
                    margin-left: 2%;
                    .spot {
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        background: #49a9ec;
                        border-radius: 3px;
                        margin-right: 5px;
                    }
                }
            }
            .list-content {
                display: flex;
                height: 94%;
                .all-list, .new-list {
                    width: 48%;
                    height: 100%;
                    margin-left: 2%;
                    color: white;
                    padding: 1% 5%;
                    overflow-y: auto;
                    border: 1px solid wheat;
                    z-index: 10;
                    .list-item {
                        display: flex;
                        margin-top: 2.5%;
                        &-name {
                            width: 90%;
                        }
                        &-right {
                            float: right;
                            font-size: 20px;
                            font-weight: bold;
                            cursor: pointer;
                            color: #49A9EC;
                        }
                    }

                }
            }
        }

        .el-dialog__header {
            color: white;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.3);
            .el-dialog__title {
                color: white;
            }
        }

        .el-dialog__headerbtn {
            top: 8px;
            right: 12px;
            .el-dialog__close {
                color: white;
            }
        }
        .el-dialog__body {
            height: 400px;
            padding: 10px 20px;
        }
    }
</style>
