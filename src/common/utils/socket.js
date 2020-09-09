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

export const send = (connection, params) => {
    connection.send(JSON.stringify(params));
};

/**
 * websocket保持心跳
 * @param connection
 */
export const keepAlive = (connection) => {
    if (connection.readyState === connection.OPEN) {
        send(
            {
                type: 1
            }
        );
    }
};
