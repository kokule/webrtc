<template>
    <el-dialog
        width="25%"
        title="视频通话"
        :modal="false"
        @close="closeDialog"
        custom-class="video-dialog"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false">
        <div class="background-top"></div>
        <div class="background-bottom"></div>
        <div class="background-box"></div>
        <video id="yourVideo" autoplay></video>
        <video id="other-video" autoplay></video>
    </el-dialog>
</template>

<script>
    import {onLeave} from '../../../../../websocket'

    export default {
        name: 'video-dialog',
        data() {
            return {
                dialogVisible: false,
            };
        },
        mounted() {

        },
        methods: {
            closeDialog() {
                onLeave()
            }
        }
    }
    ;
</script>

<style  lang="scss">
    .el-dialog__wrapper {
        z-index: 0 !important;
    }

    .video-dialog {
        position: relative;
        z-index: 15;
        background: transparent;
        .background-top, .background-bottom {
            width: 50%;
            height: 200px;
            position: absolute;
            z-index: 0;
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
            position: absolute;
            background: #01112a;
            opacity: 0.5;
        }

        #yourVideo {
            width: 150px;
            height: 120px;
            position: absolute;
            z-index: 21;
            left: 0;
            bottom: 25px;
            background: black;
        }

        #other-video {
            width: 100%;
            height: 220px;
            position: absolute;
            z-index: 20;
            left: 0;
            background: black;
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
