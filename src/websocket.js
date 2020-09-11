import Vue from 'vue'
import {Message, MessageBox} from 'ecp-ui'

const wsUrl = 'wss://webrtc.isass.vip/message-service/ws'
let connection;
let stream;
let yourVideo;
let otherVideo;
let yourConnection;
let loginUser;

// 初始化调用
isConnection();

/**
 * 判断用户时候登陆，已登陆就建立连接
 */

export const isConnectionExport = () => {
    isConnection()
};

function isConnection() {
    loginUser = JSON.parse(sessionStorage.getItem('authUser'));
    if (sessionStorage.getItem('authUser')) {
        initWebSocket();
    } else {
        console.log('用户未登陆');
    }
}


function initWebSocket() {
    connection = new WebSocket(wsUrl);
    connection.onopen = function () {
        console.log("WebSocket已连接");
    };
    setInterval(keepAlive, 15000) // 保持心跳
    connection.onmessage = (message) => {
        // console.log("Get Message", message.data);
        let data = JSON.parse(message.data);
        if (!data.body.success) {
            console.log(data.body.message);
        }
        switch (data.cmd) {
            case "/login":
                onLogin(data.body);
                break;
            case "/offer":
                confirm(data.body)
                // onOffer(data.body);
                console.log('/offer');
                console.log(data);
                break;
            case "/answer":
                onAnswer(data.body);
                console.log('/answer');
                console.log(data);
                break;
            case "/candidate":
                onCandidate(data.body);
                console.log('/candidate');
                console.log(data);
                break;
            case "/leave":
                onLeave();
                console.log('/leave');
                break;
            case "onlineUser":
                onOnlineUser(data.onlineUser);
                console.log('/onlineUser');
            default:
                break;
        }
    };
}

function confirm(data) {
    MessageBox.confirm('有用户向您发起视频通话', '提示', {
        confirmButtonText: '接听',
        cancelButtonText: '挂断',
        type: 'success'
    }).then(() => {
        onOffer(data);
    }).catch(() => {
       Message('已挂断')
    })
}

export const userLogin = () => {
    sendMessage({
        type: 7,
        content: {
            cmd: "/login",
            body: {
                userId: loginUser.account
            }
        }
    });
}
export const callVideo = () => {
    if (sessionStorage.getItem('loginUserId') === sessionStorage.getItem('targetUserId')) {
        alert("不能自己呼叫自己");
        return;
    }

    if (sessionStorage.getItem('targetUserId').length > 0) {
        startPeerConnection(sessionStorage.getItem('targetUserId'));
    }
}

function onLogin(body) {
    if (body.success) {
        startConnection();
    }
}

function onOffer(body) {
    sessionStorage.setItem('targetUserId', body.data.targetUserId)
    yourConnection.setRemoteDescription(new RTCSessionDescription(body.data.offer));

    yourConnection.createAnswer((answer) => {
        yourConnection.setLocalDescription(answer);
        sendMessage({
            type: "7",
            content: {
                cmd: "/answer",
                body: {
                    answer: answer,
                    targetUserId: sessionStorage.getItem('targetUserId')
                }
            }
        });
    }, function (error) {
        alert("An error has occurred");
    });
}

function onAnswer(body) {
    yourConnection.setRemoteDescription(new RTCSessionDescription(body.data.answer));
}

function onCandidate(body) {
    yourConnection.addIceCandidate(new RTCIceCandidate(body.data.candidate));
}

function onOnlineUser(onLineUsers) {
    let str = '';
    for (let user of onLineUsers) {
        str += user.userName + "(" + this.CommunicationStatus[user.communicationStatus] + "), ";
    }
}

export const onLeave = () => {
    sessionStorage.setItem('targetUserId', '');
    // document.querySelector('#other-video').srcObject = '';
    yourConnection.close();
    yourConnection.onicecandidate = null;
    yourConnection.onaddstream = null;
    setupPeerConnection(stream);
    sendCommunicationStatus();
}


function startConnection() {
    if (hasUserMedia()) {
        navigator.getUserMedia({video: true, audio: true}, (myStream) => {
            stream = myStream;
            yourVideo = document.querySelector('#yourVideo');
            yourVideo.srcObject = stream;

            if (hasRTCPeerConnection()) {
                setupPeerConnection(stream);
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

function setupPeerConnection(stream) {
    var configuration = {
        /*"iceServers": [{ "url": "stun:127.0.0.1:9876" }]*/
    };
    yourConnection = new RTCPeerConnection(configuration);

    // Setup stream listening
    yourConnection.addStream(stream);
    yourConnection.onaddstream = (e) => {
        document.querySelector('#other-video').srcObject = e.stream;
    };

    // Setup ice handling
    yourConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendMessage({
                type: "7",
                content: {
                    cmd: "/candidate",
                    body: {
                        candidate: event.candidate,
                        targetUserId: sessionStorage.getItem('targetUserId')
                    }
                }
            });
        }
    };
    yourConnection.onconnectionstatechange = (event) => {
        // console.log(event);
        sendCommunicationStatus();
    }
}

function sendCommunicationStatus() {
    if (!loginUser.account) {
        return;
    }
    if (yourConnection && yourConnection.connectionState === 'connected') {
        sendMessage({
            type: "7",
            content: {
                cmd: "/chatUserStatus",
                body: {
                    chatUserStatus: 5
                }
            }
        });
    } else {
        sendMessage({
            type: "7",
            content: {
                cmd: "/chatUserStatus",
                body: {
                    chatUserStatus: 2
                }
            }
        });
    }
}

function startPeerConnection(targetUserId) {
    sessionStorage.setItem('targetUserId', targetUserId)
    // Begin the offer
    yourConnection.createOffer((offer) => {
        sendMessage({
            type: "7",
            content: {
                cmd: "/offer",
                body: {
                    offer: offer,
                    targetUserId: targetUserId
                }
            }
        });
        yourConnection.setLocalDescription(offer);
    }, function (error) {
        alert("An error has occurred.");
    });
}

/**
 * 保持websocket心跳
 */
function keepAlive() {
    if (connection.readyState === connection.OPEN) {
        sendMessage({type: 1});
    }
}

/**
 * 发送websocket请求到后台
 * @param message
 */
export const sendMessage = (message) => {
    connection.send(JSON.stringify(message));
};

/**
 * 检查浏览器是否支持getUserMedia方法。
 * @returns {boolean}
 */
export const hasUserMedia = () => {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return !!navigator.getUserMedia;
};

export const hasRTCPeerConnection = () => {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
    window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
    return !!window.RTCPeerConnection;
};
