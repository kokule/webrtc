var connection = null;

class WebRtcSocket {
    constructor() {
        this.connection = null;
        this.stream = null;
        this.yourConnection = null;
        this.yourVideo = null;
        this.otherConnection = null;
        this.otherVideo = null;
    }

    init(wsUrl) {
        this.connection = new WebSocket(wsUrl);
        this.connection.onopen = function () {
            console.log("连接成功");
        };

        this.connection.onmessage = function (message) {
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
                    onAnswer(data.body);
                    break;
                case "/candidate":
                    onCandidate(data.body);
                    break;
                case "/leave":
                    onLeave();
                    break;
                case "onlineUser":
                    onOnlineUser(data.onlineUser);
                default:
                    break;
            }
        }
    }

    onLogin(body) {
        if (body.success) {
            this.startConnection();
        }
    }

    startConnection() {
        if (this.hasUserMedia()) {
            navigator.getUserMedia({video: true, audio: false}, function (myStream) {
                this.stream = myStream;
                this.yourVideo.srcObject = this.stream;

                if (this.hasRTCPeerConnection()) {
                    this.setupPeerConnection(stream);
                } else {
                    alert("Sorry, 你的浏览器不支持WebRTC");
                }
            }, function (error) {
                console.error(error);
            });
        } else {
            alert("Sorry, 你的浏览器不支持WebRTC");
        }
    }

    setupPeerConnection(stream) {
        var configuration = {
            /*"iceServers": [{ "url": "stun:127.0.0.1:9876" }]*/
        };
        this.yourConnection = new RTCPeerConnection(configuration);

        // Setup stream listening
        this.yourConnection.addStream(stream);
        this.yourConnection.onaddstream = function (e) {
            this.otherConnection.srcObject = e.stream;
        };

        // Setup ice handling
        this.yourConnection.onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: "7",
                    content: {
                        cmd: "/candidate",
                        body: {
                            candidate: event.candidate,
                            targetUserId: targetUser.userId
                        }
                    }
                });
            }
        };

        yourConnection.onconnectionstatechange = function (event) {
            console.log(event);
            sendCommunicationStatus();
        }
    }


    hasUserMedia() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        return !!navigator.getUserMedia;
    }

    hasRTCPeerConnection() {
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
        window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
        return !!window.RTCPeerConnection;
    }
}

export const webRtcSocket = new WebRtcSocket();
