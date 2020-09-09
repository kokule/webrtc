<template>
    <el-dialog
        title="视频通话"
        :modal="false"
        custom-class="video-dialog"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="25%"
    >
        <div class="background-top"></div>
        <div class="background-bottom"></div>
        <div class="background-box"></div>
        <video id="yourVideo" autoplay></video>
        <video id="other-video" autoplay></video>
    </el-dialog>
</template>

<script>
    export default {
        name: 'video-dialog',
        props: {
            otherUser: {
                type: Object
            }
        },
        data() {
            return {
                dialogVisible: true,
                stream: null,
                connection: null,
                yourVideo: null,
                otherVideo: null,
                yourConnection: null,
                otherConnection: null,
                CommunicationStatus: {
                    1: "空闲",
                    2: "通信中"
                },
                loginUser: {
                    userId: '',
                    nickName: '',
                    status: ''
                },
                targetUser: {
                    userId: null,
                    nickName: '',
                    status: ''
                }
            };
        },
        mounted() {
            this.initWebSocket();
        },
        methods: {
            userLogin() {
                this.send({
                    type: 7,
                    content: {
                        cmd: "/login",
                        body: {
                            userId: this.loginUser.userId
                        }
                    }
                });
            },
            callVideo() {
                if (this.loginUser.userId === this.targetUser.userId) {
                    alert("不能自己呼叫自己");
                    return;
                }

                if (this.targetUser.userId.length > 0) {
                    this.startPeerConnection(this.targetUser.userId);
                }
            },
            keepAlive() {
                if (this.connection.readyState == this.connection.OPEN) {
                    this.send({
                        type: 1
                    });
                }
            },
            initWebSocket() {
                this.connection = new WebSocket('wss://webrtc.isass.vip/message-service/ws');
                this.connection.onopen = function () {
                    console.log("Connected");
                };

                this.connection.onmessage = (message) => {
                    console.log("Get Message", message.data);
                    let data = JSON.parse(message.data);
                    if (!data.body.success) {
                        console.log(data.body.message);
                    }
                    switch (data.cmd) {
                        case "/login":
                            this.onLogin(data.body);
                            break;
                        case "/offer":
                            this.onOffer(data.body);
                            break;
                        case "/answer":
                            this.onAnswer(data.body);
                            break;
                        case "/candidate":
                            this.onCandidate(data.body);
                            break;
                        case "/leave":
                            this.onLeave();
                            break;
                        case "onlineUser":
                            this.onOnlineUser(data.onlineUser);
                        default:
                            break;
                    }
                }

                setInterval(this.keepAlive, 15000)
            },
            send(message) {
                this.connection.send(JSON.stringify(message));
            },
            onLogin(body) {
                if (body.success) {
                    this.startConnection();
                }
            },
            startConnection() {
                if (this.hasUserMedia()) {
                    navigator.getUserMedia({video: true, audio: false}, (myStream) => {
                        this.stream = myStream;
                        this.yourVideo = document.querySelector('#yourVideo');
                        console.log(this.yourVideo)
                        this.yourVideo.srcObject = this.stream;

                        if (this.hasRTCPeerConnection()) {
                            this.setupPeerConnection(this.stream);
                        } else {
                            alert("Sorry, 你的浏览器不支持WebRTC");
                        }
                    }, function (error) {
                        console.error(error);
                    });
                } else {
                    alert("Sorry, 你的浏览器不支持WebRTC");
                }
            },
            setupPeerConnection(stream) {
                var configuration = {
                    /*"iceServers": [{ "url": "stun:127.0.0.1:9876" }]*/
                };
                this.yourConnection = new RTCPeerConnection(configuration);

                // Setup stream listening
                this.yourConnection.addStream(stream);
                this.yourConnection.onaddstream = (e) => {
                    this.otherVideo = document.querySelector('#other-video')
                    this.otherVideo.srcObject = e.stream;
                };

                // Setup ice handling
                this.yourConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.send({
                            type: "7",
                            content: {
                                cmd: "/candidate",
                                body: {
                                    candidate: event.candidate,
                                    targetUserId: this.targetUser.userId
                                }
                            }
                        });
                    }
                };

                this.yourConnection.onconnectionstatechange = (event) => {
                    console.log(event);
                    this.sendCommunicationStatus();
                }
            },
            sendCommunicationStatus() {
                if (!this.loginUser.userId) {
                    return;
                }

                if (this.yourConnection && this.yourConnection.connectionState === 'connected') {
                    this.send({
                        type: "7",
                        content: {
                            cmd: "/chatUserStatus",
                            body: {
                                chatUserStatus: 5
                            }
                        }
                    });
                } else {
                    this.send({
                        type: "7",
                        content: {
                            cmd: "/chatUserStatus",
                            body: {
                                chatUserStatus: 2
                            }
                        }
                    });
                }
            },

            startPeerConnection(targetUserId) {
                this.targetUser.userId = targetUserId;

                // Begin the offer
                this.yourConnection.createOffer((offer) => {
                    this.send({
                        type: "7",
                        content: {
                            cmd: "/offer",
                            body: {
                                offer: offer,
                                targetUserId: targetUserId
                            }
                        }
                    });
                    this.yourConnection.setLocalDescription(offer);
                }, function (error) {
                    alert("An error has occurred.");
                });
            },

            onOffer(body) {
                console.log(body);
                this.targetUser.userId = body.data.targetUserId;
                this.yourConnection.setRemoteDescription(new RTCSessionDescription(body.data.offer));

                this.yourConnection.createAnswer((answer) => {
                    this.yourConnection.setLocalDescription(answer);
                    this.send({
                        type: "7",
                        content: {
                            cmd: "/answer",
                            body: {
                                answer: answer,
                                targetUserId: this.targetUser.userId
                            }
                        }
                    });
                }, function (error) {
                    alert("An error has occurred");
                });
            },
            onAnswer(body) {
                this.yourConnection.setRemoteDescription(new RTCSessionDescription(body.data.answer));
            },

            onCandidate(body) {
                this.yourConnection.addIceCandidate(new RTCIceCandidate(body.data.candidate));
            },
            onOnlineUser(onLineUsers) {
                let str = '';
                for (let user of onLineUsers) {
                    str += user.userName + "(" + this.CommunicationStatus[user.communicationStatus] + "), ";
                }
            },
            onLeave() {
                this.targetUser.userId = null;
                this.targetUser.nickName = "";
                this.otherVideo.src = null;
                this.yourConnection.close();
                this.yourConnection.onicecandidate = null;
                this.yourConnection.onaddstream = null;
                this.setupPeerConnection(stream);
                this.sendCommunicationStatus();
            }
            ,

            hasUserMedia() {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                return !!navigator.getUserMedia;
            }
            ,
            hasRTCPeerConnection() {
                window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
                window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
                window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
                return !!window.RTCPeerConnection;
            }
        }
    }
    ;
</script>

<style lang="scss">
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
            right: 0;
            top: 70px;
            background: #1CCCFF;
        }

        #other-video {
            width: 100%;
            height: 300px;
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
