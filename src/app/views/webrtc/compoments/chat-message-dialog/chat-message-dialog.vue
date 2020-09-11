<template>
    <el-dialog
        width="25%"
        title="历史消息记录"
        :modal="false"
        @close="closeDialog"
        custom-class="chat-message-dialog"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false">
        <div class="background-top"></div>
        <div class="background-bottom"></div>
        <div class="background-box"></div>
        <div class="chat-message-box" id="chat-box">
            <div class="message-item" v-for="item in chatMessage" :key="item.id">
                <p>{{item.fromUserNickName}}：</p>
                <div class="content">{{item.content}}</div>
            </div>
        </div>
    </el-dialog>
</template>

<script>

    export default {
        name: 'chat-message-dialog',
        props: {
            chatMessageVisible: {
                type: Boolean
            },
            currentSessionId: {
                type: String
            }
        },
        watch: {
            chatMessageVisible(newValue) {
                this.dialogVisible = newValue;
                if (newValue) {
                    this.getChatMessage()
                }
            },
            currentSessionId(newValue) {
                this.getChatMessage()
            }
        },
        data() {
            return {
                dialogVisible: false,
                chatMessage: []
            };
        },
        mounted() {

        },
        methods: {
            getChatMessage() {
                this.$api.chatApi.getChatMessage({chatSessionId: this.currentSessionId}).then(res => {
                    this.chatMessage = res.data;
                    if (this.dialogVisible) {
                        this.$nextTick(() => {
                            document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
                        });
                    }
                })
            },
            closeDialog() {
                this.$emit('closeDialog')
            }
        }
    }
    ;
</script>

<style lang="scss">
    .el-dialog__wrapper {
        z-index: 0 !important;
    }

    .chat-message-dialog {
        position: relative;
        z-index: 15;
        background: transparent;
        .chat-message-box {
            width: 100%;
            height: 100%;
            padding: 2% 3%;
            overflow-y: auto;
            .message-item {
                width: 100%;
                color: white;
                padding: 1%;
                margin-bottom: 10px;
                border: 0.00926rem solid rgba(255, 255, 255, 0.2);
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
            top: 262px;
            right: -3px;
            background-image: url("../../../../../assets/webrtc/videoPanelBorderR.png");
        }
        .background-box {
            width: 100%;
            height: 92%;
            left: 0;
            top: 34px;
            z-index: -1;
            position: absolute;
            background: #01112a;
            opacity: 0.5;
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
        }
    }
</style>
